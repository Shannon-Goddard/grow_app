import { IndexedDBService } from '../../../common/js/indexedDBService.js';
import { getPlantGrow } from '../../../common/js/storage.js';

const extendGrowSchedule = async (scheduleData, vegWeeks, floweringWeeks, startDate, isAuto = false, seedToHarvestDays = null, growId, nutrientData = []) => {
    const extendedSchedule = [];
    let currentDay = 0;

    const formatDate = (baseDate, offsetDays) => {
        const date = new Date(baseDate);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + offsetDays);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const normalizeWeek = (weekStr) => {
        if (weekStr && weekStr.includes('pre-flowering')) {
            const match = weekStr.match(/week (\d+)/);
            return `week ${parseInt(match[1])}`;
        }
        return weekStr || '';
    };

    const processStage = async (stage, weeks) => {
        console.log(`Processing ${stage} for ${weeks} weeks`);
        const selectedNutrients = await getSelectedNutrients(growId);
        const customNutrients = await getCustomNutrients();
        console.log('Selected nutrients for stage:', selectedNutrients);
        console.log('Custom nutrients found:', customNutrients.map(n => n.nutrientName));

        for (let week = 1; week <= weeks; week++) {
            let targetWeek = week;
            if (stage === 'vegetative' && week > 4) targetWeek = 4;
            if (stage === 'flowering' && week > 8) targetWeek = 8;
            const weekStr = stage === 'seedling' ? `${week}` :
                           stage === 'flowering' && week <= 2 ? `week ${week} pre-flowering` :
                           `week ${targetWeek}`;
            const weekItems = scheduleData.filter(item => {
                const itemStage = item.stage ? item.stage.toLowerCase().trim() : '';
                const itemWeek = item.week ? normalizeWeek(item.week) : '';
                const compareWeek = stage === 'seedling' ? `${week}` : normalizeWeek(weekStr);
                return itemStage === stage.toLowerCase() && itemWeek === compareWeek;
            });
            console.log(`Found ${weekItems.length} items for ${stage} ${weekStr}`);
            if (weekItems.length) {
                for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
                    const dayItem = weekItems.find(item => item.day === dayOfWeek) || weekItems[0];
                    const nutrients = {};
                    selectedNutrients.forEach(nutrientName => {
                        if (customNutrients.some(n => n.nutrientName === nutrientName)) {
                            const nutrient = customNutrients.find(n => n.nutrientName === nutrientName);
                            let targetStage = stage === 'seedling' ? 'seedling' :
                                              stage === 'vegetative' ? (week <= 2 ? 'vegetative' : 'late-vegetative') :
                                              stage === 'flowering' ? (week <= 1 ? 'pre-flower' : week <= 6 ? 'flowering' : 'late-flowering') : '';
                            const stageData = nutrient.stages.find(s => s.stage === targetStage);
                            nutrients[nutrientName] = stageData ? `${stageData.amount} ${stageData.unit}/${stageData.per}` : '0 mL/L';
                        } else {
                            const matchingEntries = nutrientData.filter(entry => 
                                entry['nutrient-name'] === nutrientName && 
                                entry.stage.toLowerCase() === stage.toLowerCase() && 
                                entry.week === `${targetWeek}`
                            );
                            console.log(`Searching for ${nutrientName}, stage: ${stage}, targetWeek: ${targetWeek}`);
                            console.log('Available weeks for this nutrient/stage:', nutrientData.filter(entry => entry['nutrient-name'] === nutrientName && entry.stage.toLowerCase() === stage.toLowerCase()).map(e => e.week));
                            if (matchingEntries.length === 0) {
                                console.log(`No nutrient data found for ${nutrientName}, stage: ${stage}, targetWeek: ${targetWeek}`);
                            } else {
                                console.log('Found match:', matchingEntries[0]);
                                const finalValue = `${matchingEntries[0].amount} ${matchingEntries[0].unit}/${matchingEntries[0].per}`;
                                console.log(`Assigning ${nutrientName} = ${finalValue}`);
                            }
                            nutrients[nutrientName] = matchingEntries.length ? `${matchingEntries[0].amount} ${matchingEntries[0].unit}/${matchingEntries[0].per}` : '0 mL/L';
                        }
                    });
                    extendedSchedule.push({
                        ...dayItem,
                        stage,
                        week: `week ${week}`,
                        day: dayOfWeek,
                        date: formatDate(startDate, currentDay),
                        visual_inspection: dayItem.visual_inspection || '',
                        nutrients
                    });
                    currentDay++;
                }
            } else if (stage === 'seedling') {
                console.warn(`No items found for ${stage} ${weekStr}, using fallback`);
                for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
                    const nutrients = {};
                    selectedNutrients.forEach(nutrientName => {
                        if (customNutrients.some(n => n.nutrientName === nutrientName)) {
                            const nutrient = customNutrients.find(n => n.nutrientName === nutrientName);
                            const stageData = nutrient.stages.find(s => s.stage === 'seedling');
                            nutrients[nutrientName] = stageData ? `${stageData.amount} ${stageData.unit}/${stageData.per}` : '0 mL/L';
                        } else {
                            nutrients[nutrientName] = '0 mL/L';
                        }
                    });
                    extendedSchedule.push({
                        stage: 'seedling',
                        week: `week ${week}`,
                        day: dayOfWeek,
                        date: formatDate(startDate, currentDay),
                        visual_inspection: 'Monitor seedling growth',
                        amount_of_water: 'MOIST',
                        ph_goal: 6.2,
                        hours_of_light: 18,
                        light_intensity: '50%',
                        light_distance: '40 Inches',
                        dt_temp: '73°F',
                        nt_temp: '65°F',
                        humidity: '70%',
                        air_fan_position: 'INDIRECT',
                        nutrients
                    });
                    currentDay++;
                }
            } else {
                console.warn(`No items found for ${stage} ${weekStr}`);
            }
        }
    };

    await processStage('seedling', 2);
    await processStage('vegetative', vegWeeks);
    if (!isAuto || !seedToHarvestDays) {
        await processStage('flowering', floweringWeeks);
    }

    if (isAuto && seedToHarvestDays) {
        const minDays = 42;
        if (seedToHarvestDays < minDays) {
            console.warn(`Seed-to-harvest days (${seedToHarvestDays}) too short; using minimum ${minDays}`);
            seedToHarvestDays = minDays;
        }
        if (extendedSchedule.length > seedToHarvestDays) {
            extendedSchedule.length = seedToHarvestDays;
        }
    }

    console.log('Extended schedule sample:', JSON.stringify(extendedSchedule.slice(0, 10), null, 2));
    console.log('Total extended schedule entries:', extendedSchedule.length);
    return extendedSchedule;
};

const prepareSchedule = async (growId, startDate, isAuto, seedToHarvestDays, vegWeeks) => {
    try {
        const scheduleResponse = await fetch('/mygrow/build-your-guide/schedule-data.json');
        if (!scheduleResponse.ok) throw new Error('Failed to load schedule-data.json');
        const scheduleData = await scheduleResponse.json();
        console.log('schedule-data.json seedling entries:', scheduleData.filter(item => item.stage.toLowerCase() === 'seedling').slice(0, 5));

        const nutrientResponse = await fetch('/mygrow/build-your-guide/nutrient-data.json');
        const nutrientData = nutrientResponse.ok ? await nutrientResponse.json() : [];

        const plantGrow = await getPlantGrow(growId);
        const floweringWeeks = plantGrow?.floweringWeeks || 8;
        // vegWeeks is now passed as a parameter from build-your-guide

        const extendedSchedule = await extendGrowSchedule(scheduleData, vegWeeks, floweringWeeks, startDate, isAuto, seedToHarvestDays, growId, nutrientData);
        if (!extendedSchedule.some(item => item.stage.toLowerCase() === 'seedling')) {
            console.error('No seedling stage in extended schedule');
        }

        console.log('Merged schedule sample:', JSON.stringify(extendedSchedule.slice(0, 5), null, 2));
        return extendedSchedule;
    } catch (error) {
        console.error('Error preparing schedule:', error);
        window.showToast('Failed to prepare schedule.', 'error');
        return null;
    }
};

async function saveScheduleToIndexedDB(growId, startDate, isAuto, seedToHarvestDays, vegWeeks) {
    try {
        const schedule = await prepareSchedule(growId, startDate, isAuto, seedToHarvestDays, vegWeeks);
        if (!schedule) {
            console.error('No schedule generated');
            return false;
        }
        console.log('Saving schedule for growId:', growId, 'Sample:', JSON.stringify(schedule.slice(0, 5), null, 2));
        console.log('First item nutrients before save:', schedule[0]?.nutrients);
        const result = await IndexedDBService.saveSchedule(growId, schedule);
        if (result) {
            localStorage.setItem(`scheduleSaved_${growId}`, 'true');
        }
        return result;
    } catch (error) {
        console.error('Error in saveScheduleToIndexedDB:', error);
        window.showToast('Failed to save schedule.', 'error');
        return false;
    }
}

async function getSelectedNutrients(growId) {
    try {
        const db = await IndexedDBService.initDB();
        console.log('getSelectedNutrients db:', db);
        const transaction = db.transaction(['selectedNutrients'], 'readonly');
        const store = transaction.objectStore('selectedNutrients');
        const request = store.get(growId);
        return await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result ? request.result.nutrients : []);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error fetching selected nutrients:', error);
        window.showToast('Failed to fetch nutrients.', 'error');
        return [];
    }
}

async function getCustomNutrients() {
    try {
        const db = await IndexedDBService.initDB();
        console.log('getCustomNutrients db:', db);
        const transaction = db.transaction(['nutrients'], 'readonly');
        const store = transaction.objectStore('nutrients');
        const request = store.getAll();
        return await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error fetching custom nutrients:', error);
        window.showToast('Failed to fetch nutrients.', 'error');
        return [];
    }
};

export { extendGrowSchedule, prepareSchedule, saveScheduleToIndexedDB, getSelectedNutrients, getCustomNutrients };
// nutrient-display.js
import { IndexedDBService } from '../../../common/js/indexedDBService.js';

// Load predefined nutrients
let defaultNutrientsData = { default: [] };
try {
    const response = await fetch('/mygrow/schedule-builder/nutrient-data.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    defaultNutrientsData = await response.json();
} catch (error) {
    // Failed to load nutrient-data.json
}
const defaultNutrients = {};
(defaultNutrientsData.default || []).forEach(nutrient => {
    defaultNutrients[nutrient.nutrientName] = nutrient.stages.reduce((acc, stage) => {
        acc[stage.stage] = stage.weeks.reduce((weekAcc, week) => {
            weekAcc[week.week] = `${week.amount}${week.unit.toLowerCase()}/${week.unit === 'ml' ? 'L' : week.unit.toUpperCase()}`;
            return weekAcc;
        }, {});
        return acc;
    }, {});
});

document.addEventListener('DOMContentLoaded', async () => {
    // Disabled - schedule generation now handles nutrients correctly
    return;
    const growId = localStorage.getItem('currentGrowId');
    if (!growId) {
        return;
    }

    try {
        const db = await IndexedDBService.initDB();
        
        // Get selected and custom nutrients
        const selectedTransaction = db.transaction(['selectedNutrients'], 'readonly');
        const selectedStore = selectedTransaction.objectStore('selectedNutrients');
        const selectedRequest = selectedStore.get(growId);
        
        const nutrientTransaction = db.transaction(['nutrients'], 'readonly');
        const nutrientStore = nutrientTransaction.objectStore('nutrients');
        const nutrientRequest = nutrientStore.getAll();
        
        // Get schedule
        const scheduleTransaction = db.transaction(['tables'], 'readwrite');
        const scheduleStore = scheduleTransaction.objectStore('tables');
        const scheduleRequest = scheduleStore.get(`${growId}_schedule`);

        await Promise.all([
            new Promise(resolve => selectedRequest.onsuccess = resolve),
            new Promise(resolve => nutrientRequest.onsuccess = resolve),
            new Promise(resolve => scheduleRequest.onsuccess = resolve)
        ]);

        const selectedNutrients = selectedRequest.result?.nutrients || [];
        const nutrients = nutrientRequest.result || [];
        const customNutrients = {};
        nutrients.forEach(nutrient => {
            if (nutrient.custom && nutrient.stages) {
                customNutrients[nutrient.nutrientName] = nutrient.stages.reduce((acc, stage) => {
                    acc[stage.stage] = `${stage.amount}${stage.unit.toLowerCase()}/${stage.per.toUpperCase()}`;
                    return acc;
                }, {});
            }
        });

        if (scheduleRequest.result && Array.isArray(scheduleRequest.result.schedule)) {
            const schedule = scheduleRequest.result.schedule;
            let modified = false;
            
            schedule.forEach(day => {
                if (!day.nutrients || !selectedNutrients.every(name => day.nutrients[name] !== undefined)) {
                    const stageNutrients = { ...day.nutrients };
                    const weekNum = parseInt(day.week?.match(/\d+/)?.[0] || 1, 10);
                    const cappedWeek = day.stage === 'vegetative' ? Math.min(weekNum, 4) :
                                       day.stage === 'flowering' ? Math.min(weekNum, 8) : weekNum;

                    selectedNutrients.forEach(name => {
                        if (stageNutrients[name] === undefined) {
                            if (defaultNutrients[name] && defaultNutrients[name][day.stage]) {
                                stageNutrients[name] = defaultNutrients[name][day.stage][cappedWeek] || '0ml/L';
                            } else if (customNutrients[name] && customNutrients[name][day.stage]) {
                                stageNutrients[name] = customNutrients[name][day.stage] || '0ml/L';
                            } else {
                                stageNutrients[name] = '0ml/L';
                            }
                        }
                    });

                    day.nutrients = stageNutrients;
                    modified = true;
                }
            });
            
            if (modified) {
                scheduleStore.put(scheduleRequest.result, `${growId}_schedule`);
            }
        }
    } catch (error) {
        // Error handling nutrients
    }
});
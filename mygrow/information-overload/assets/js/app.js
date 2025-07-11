// information-overload-1.html app.js
import { IndexedDBService } from '../../../common/js/indexedDBService.js';
import { initGrowDropdown } from './grow-selector.js';

// Make IndexedDBService available globally
window.IndexedDBService = IndexedDBService;

function showToast(message) {
    const existingContainer = document.querySelector('.toast-container');
    if (existingContainer) existingContainer.remove();

    const container = document.createElement('div');
    container.className = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '80px';
    container.style.right = '20px';
    container.style.zIndex = '10000';
    container.style.maxWidth = '300px';
    document.body.appendChild(container);

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = 'white';
    toast.style.padding = '12px 15px';
    toast.style.borderRadius = '4px';
    toast.style.marginBottom = '10px';
    toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => container.remove(), 3000);
}

// Make showToast available globally
window.showToast = showToast;

async function loadAndRenderTable(growId) {
    console.log('Starting loadAndRenderTable for growId:', growId);
    try {
        const schedule = await IndexedDBService.loadSchedule(growId);
        console.log('Schedule loaded:', schedule);
        console.log('Schedule type:', typeof schedule, 'Is array:', Array.isArray(schedule));

        if (!Array.isArray(schedule) || schedule.length === 0) {
            console.error('Invalid or empty schedule');
            showToast('No schedule data found for this grow.');
            return;
        }

        const table = document.getElementById('table1');
        if (!table) {
            console.error('Table not found.');
            showToast('Table not found on page.');
            return;
        }
        table.innerHTML = '';

        const strainName = localStorage.getItem(`plantStrain_${growId}`) || localStorage.getItem('plantStrain') || '';

        // Get nutrients specific to this grow
        const db = await IndexedDBService.initDB();
        const transaction = db.transaction(['selectedNutrients'], 'readonly');
        const store = transaction.objectStore('selectedNutrients');
        
        // Try to get grow-specific nutrients
        const request = store.get(growId);
        const selectedNutrients = await new Promise((resolve, reject) => {
            request.onsuccess = () => {
                if (request.result && request.result.nutrients) {
                    console.log(`Found nutrients for growId ${growId}:`, request.result.nutrients);
                    resolve(request.result.nutrients);
                } else {
                    // Fallback to 'selected' if no grow-specific nutrients
                    console.log(`No nutrients found for growId ${growId}, checking localStorage`);
                    const localStorageNutrients = localStorage.getItem(`nutrients_${growId}`);
                    if (localStorageNutrients) {
                        try {
                            const parsedNutrients = JSON.parse(localStorageNutrients);
                            console.log(`Found nutrients in localStorage for growId ${growId}:`, parsedNutrients);
                            resolve(parsedNutrients);
                        } catch (e) {
                            console.error('Error parsing localStorage nutrients:', e);
                            resolve([]);
                        }
                    } else {
                        console.log('No nutrients found in localStorage, using fallback');
                        resolve([]);
                    }
                }
            };
            request.onerror = () => reject(request.error);
        });
        
        console.log('Selected nutrients for this grow:', selectedNutrients);

        const nutrientTransaction = db.transaction(['nutrients'], 'readonly');
        const nutrientStore = nutrientTransaction.objectStore('nutrients');
        const nutrientRequest = nutrientStore.getAll();
        const customNutrients = await new Promise((resolve, reject) => {
            nutrientRequest.onsuccess = () => resolve(nutrientRequest.result);
            nutrientRequest.onerror = () => reject(nutrientRequest.error);
        });

        const nutrientMap = {
            'voodoo-juice': 'Voodoo Juice®',
            'tarantula': 'Tarantula®',
            'piranha': 'Piranha®',
            'rhino-skin': 'Rhino Skin®',
            'b-52': 'B-52®',
            'sensizym': 'Sensizym',
            'bud-candy': 'Bud Candy®',
            'bud-factor-x': 'Bud Factor X®',
            'nirvana': 'Nirvana',
            'bud-ignitor': 'Bud Ignitor®',
            'big-bud': 'Big Bud®',
            'overdrive': 'Overdrive®',
            'flawless-finish': 'Flawless Finish®',
            'ph-perfect-grow': 'pH Perfect® Grow',
            'ph-perfect-micro': 'pH Perfect® Micro',
            'ph-perfect-bloom': 'pH Perfect® Bloom',
            'floramicro': 'FloraMicro®',
            'floragro': 'FloraGro®',
            'florabloom': 'FloraBloom®',
            'substra-vega': 'Substra Vega',
            'substra-flores': 'Substra Flores',
            'rhizotonic': 'Rhizotonic',
            'vita-race': 'Vita Race'
        };

        const nutrientDisplayNames = selectedNutrients.map(nutrient => {
            const customNutrient = customNutrients.find(n => n.nutrientName === nutrient);
            return customNutrient ? customNutrient.displayName : nutrientMap[nutrient] || nutrient.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        });

        const coreHeaders = [
            'MyGrow', 'Date', 'Stage', 'Week', 'Day', 'Visual Inspection', 'Amount Of Water', 'pH Goal',
            'Light Intensity', 'Light Distance', 'Daytime Temp', 'Nighttime Temp',
            'Hours Of Light', 'Humidity', 'Air Fan Position'
        ];

        const allHeaders = [...coreHeaders, ...nutrientDisplayNames];

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        allHeaders.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        schedule.forEach((dayData, index) => {
            console.log(`Rendering row ${index + 1}: stage=${dayData.stage}, week=${dayData.week}, day=${dayData.day}`);
            const row = document.createElement('tr');
            const lightDistance = dayData.stage === 'seedling' ? '40 Inches' :
                                 dayData.stage === 'vegetative' ? (parseInt(dayData.week) >= 2 ? '24 Inches' : '36 Inches') :
                                 dayData.stage === 'flowering' ? '18 Inches' : '';

            const values = [
                strainName,
                dayData.date || '',
                dayData.stage || '',
                dayData.week || '',
                dayData.day || (index + 1),
                dayData.visual_inspection || '',
                dayData.amount_of_water || '',
                dayData.ph_goal || '',
                dayData.light_intensity || '',
                lightDistance || dayData.light_distance || '',
                dayData.dt_temp || '',
                dayData.nt_temp || '',
                dayData.hours_of_light || '',
                dayData.humidity || '',
                dayData.air_fan_position || ''
            ];

            selectedNutrients.forEach(nutrient => {
                const value = dayData.nutrients && dayData.nutrients[nutrient] ? dayData.nutrients[nutrient] : '';
                values.push(value);
            });

            values.forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        console.log('Table rendered with', schedule.length, 'rows');
        document.dispatchEvent(new CustomEvent('tableRendered'));
    } catch (error) {
        console.error('Error in loadAndRenderTable:', error);
        showToast('Failed to load schedule.');
    }
}

// Export loadAndRenderTable for use in other modules
window.loadAndRenderTable = loadAndRenderTable;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded event fired for information-overload-1.html');
    
    // Initialize the grow dropdown
    await initGrowDropdown();
    
    // Load table for current grow if available
    const growId = localStorage.getItem('currentGrowId');
    console.log('Current grow ID:', growId);

    if (growId) {
        const plantHeight = localStorage.getItem('plantHeight') || '3-4 feet';
        console.log('Plant height:', plantHeight);
        await loadAndRenderTable(growId);
    } else {
        console.log('No growId found in localStorage');
    }
});
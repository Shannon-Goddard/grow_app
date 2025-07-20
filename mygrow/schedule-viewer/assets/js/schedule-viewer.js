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
    try {
        const schedule = await IndexedDBService.loadSchedule(growId);

        if (!Array.isArray(schedule) || schedule.length === 0) {
            showToast('No schedule data found for this grow.');
            return;
        }

        const table = document.getElementById('table1');
        if (!table) {
            showToast('Table not found on page.');
            return;
        }
        table.innerHTML = '';
        
        // Create table structure immediately to prevent layout shifts
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const coreHeaders = [
            'MyGrow', 'Date', 'Stage', 'Week', 'Day', 'Visual Inspection', 'Amount Of Water', 'pH Goal',
            'Light Intensity', 'Light Distance', 'Daytime Temp', 'Nighttime Temp',
            'Hours Of Light', 'Humidity', 'Air Fan Position'
        ];
        
        coreHeaders.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.width = '120px'; // Fixed width to prevent shifts
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

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
                    resolve(request.result.nutrients);
                } else {
                    // Fallback to 'selected' if no grow-specific nutrients
                    const localStorageNutrients = localStorage.getItem(`nutrients_${growId}`);
                    if (localStorageNutrients) {
                        try {
                            const parsedNutrients = JSON.parse(localStorageNutrients);
                            resolve(parsedNutrients);
                        } catch (e) {
                            resolve([]);
                        }
                    } else {
                        resolve([]);
                    }
                }
            };
            request.onerror = () => reject(request.error);
        });


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

        // Add nutrient headers to existing structure
        nutrientDisplayNames.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.width = '120px';
            headerRow.appendChild(th);
        });
        // Render in chunks to prevent blocking
        const chunkSize = 50;
        for (let i = 0; i < schedule.length; i += chunkSize) {
            const chunk = schedule.slice(i, i + chunkSize);
            chunk.forEach((dayData, index) => {
                const actualIndex = i + index;
            const row = document.createElement('tr');
            const lightDistance = dayData.stage === 'seedling' ? '40 Inches' :
                                 dayData.stage === 'vegetative' ? (parseInt(dayData.week) >= 2 ? '24 Inches' : '36 Inches') :
                                 dayData.stage === 'flowering' ? '18 Inches' : '';

            const values = [
                strainName,
                dayData.date || '',
                dayData.stage || '',
                dayData.week || '',
                dayData.day || (actualIndex + 1),
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
            
            // Yield control back to browser between chunks
            if (i + chunkSize < schedule.length) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }

        document.dispatchEvent(new CustomEvent('tableRendered'));
    } catch (error) {
        showToast('Failed to load schedule.');
    }
}

// Export loadAndRenderTable for use in other modules
window.loadAndRenderTable = loadAndRenderTable;

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the grow dropdown
    await initGrowDropdown();
    
    // Load table for current grow if available
    const growId = localStorage.getItem('currentGrowId');

    if (growId) {
        const plantHeight = localStorage.getItem('plantHeight') || '3-4 feet';
        await loadAndRenderTable(growId);
    }
});
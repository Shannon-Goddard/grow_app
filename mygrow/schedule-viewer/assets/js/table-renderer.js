// table-renderer.js
import { showToast } from '../../../common/js/toast.js';
import { makeTableEditable } from './table-editor.js';

export async function loadAndRenderTable(growId) {
    try {
        const schedule = await window.IndexedDBService.loadSchedule(growId);

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

        const strainName = localStorage.getItem(`plantStrain_${growId}`) || localStorage.getItem('plantStrain') || '';
        const db = await window.IndexedDBService.initDB();
        const transaction = db.transaction(['selectedNutrients'], 'readonly');
        const store = transaction.objectStore('selectedNutrients');
        const request = store.get(growId);
        const selectedNutrients = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result ? request.result.nutrients : []);
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
            // ... other mappings from original app.js ...
        };

        const nutrientDisplayNames = selectedNutrients.map(nutrient => {
            const customNutrient = customNutrients.find(n => n.nutrientName === nutrient);
            return customNutrient ? customNutrient.displayName : nutrientMap[nutrient] || nutrient.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        });

        const coreHeaders = [
            { name: 'MyGrow', field: 'strain' },
            { name: 'Date', field: 'date' },
            { name: 'Stage', field: 'stage' },
            { name: 'Week', field: 'week' },
            { name: 'Day', field: 'day' },
            { name: 'Visual Inspection', field: 'visual_inspection' },
            { name: 'Amount Of Water', field: 'amount_of_water' },
            { name: 'pH Goal', field: 'ph_goal' },
            { name: 'Light Intensity', field: 'light_intensity' },
            { name: 'Light Distance', field: 'light_distance' },
            { name: 'Daytime Temp', field: 'dt_temp' },
            { name: 'Nighttime Temp', field: 'nt_temp' },
            { name: 'Hours Of Light', field: 'hours_of_light' },
            { name: 'Humidity', field: 'humidity' },
            { name: 'Air Fan Position', field: 'air_fan_position' }
        ];

        const nutrientHeaders = nutrientDisplayNames.map(name => ({ name, field: name.toLowerCase().replace(/\s+/g, '-') }));
        const allHeaders = [...coreHeaders, ...nutrientHeaders];

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        allHeaders.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.name;
            th.dataset.field = header.field;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        schedule.forEach((dayData, index) => {
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
            


            values.forEach((value, i) => {
                const td = document.createElement('td');
                td.textContent = value;
                td.dataset.field = allHeaders[i].field;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        await makeTableEditable();
        document.dispatchEvent(new CustomEvent('tableRendered'));
    } catch (error) {
        showToast('Failed to load schedule.');
    }
}
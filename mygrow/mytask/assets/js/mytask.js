// mytask.js - Show today's task using information-overload table logic
import { IndexedDBService } from '../../../common/js/indexedDBService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const currentGrowId = localStorage.getItem('currentGrowId');
    console.log('Current grow ID:', currentGrowId);
    
    // Populate grow dropdown (same as before)
    async function initGrowDropdown() {
        try {
            const grows = await IndexedDBService.loadAllGrows();
            const growSelect = document.getElementById('growSelect');
            
            if (growSelect) {
                growSelect.innerHTML = '';
                if (grows && grows.length > 0) {
                    grows.forEach(grow => {
                        const option = document.createElement('option');
                        option.value = grow.growId;
                        option.textContent = grow.growName;
                        growSelect.appendChild(option);
                    });
                    
                    if (currentGrowId) {
                        growSelect.value = currentGrowId;
                    }
                }
            }
        } catch (error) {
            console.error('Error loading grows:', error);
        }
    }
    
    // Load table and filter for today (reusing information-overload logic)
    async function loadTodayTask() {
        try {
            const growId = localStorage.getItem('currentGrowId');
            if (!growId) {
                console.error('No current grow ID');
                return;
            }
            
            const schedule = await IndexedDBService.loadSchedule(growId);
            if (!schedule || !Array.isArray(schedule)) {
                console.error('Invalid schedule data');
                return;
            }
            
            // Get today's date with leading zeros to match schedule format
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const year = today.getFullYear();
            const todayStr = `${month}/${day}/${year}`; // Format: MM/DD/YYYY
            
            console.log('Looking for today\'s date:', todayStr);
            console.log('First few schedule dates:', schedule.slice(0, 5).map(d => d.date));
            console.log('Current actual date:', new Date().toLocaleDateString());
            console.log('Schedule start date:', schedule[0]?.date);
            console.log('Schedule end date:', schedule[schedule.length - 1]?.date);
            
            // Filter schedule for today's entry
            const todayEntry = schedule.find(row => row.date === todayStr);
            
            if (!todayEntry) {
                // Use first entry as fallback
                console.log('Today\'s date not found, using first entry as fallback');
                renderTable([schedule[0]], growId);
                return;
            }
            
            renderTable([todayEntry], growId);
            
        } catch (error) {
            console.error('Error loading today\'s task:', error);
        }
    }
    
    // Render table (copied from information-overload app.js)
    async function renderTable(scheduleData, growId) {
        const table = document.getElementById('taskTable');
        if (!table) return;
        
        table.innerHTML = '';
        
        const strainName = localStorage.getItem(`plantStrain_${growId}`) || 'Unknown Grow';
        
        // Get selected nutrients
        const selectedNutrients = JSON.parse(localStorage.getItem(`nutrients_${growId}`) || '[]');
        
        // Nutrient display names
        const nutrientMap = {
            'floramicro': 'FloraMicro®',
            'floragro': 'FloraGro®',
            'florabloom': 'FloraBloom®',
            'voodoo-juice': 'Voodoo Juice®',
            'tarantula': 'Tarantula®',
            'piranha': 'Piranha®'
        };
        
        const nutrientDisplayNames = selectedNutrients.map(nutrient => 
            nutrientMap[nutrient] || nutrient.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        );
        
        // Headers
        const coreHeaders = [
            'MyGrow', 'Date', 'Stage', 'Week', 'Day', 'Visual Inspection', 'Amount Of Water', 'pH Goal',
            'Light Intensity', 'Light Distance', 'Daytime Temp', 'Nighttime Temp',
            'Hours Of Light', 'Humidity', 'Air Fan Position'
        ];
        
        const allHeaders = [...coreHeaders, ...nutrientDisplayNames];
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        allHeaders.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        scheduleData.forEach(dayData => {
            const row = document.createElement('tr');
            
            const lightDistance = dayData.stage === 'seedling' ? '40 Inches' :
                                 dayData.stage === 'vegetative' ? '36 Inches' :
                                 dayData.stage === 'flowering' ? '18 Inches' : '';
            
            const values = [
                strainName,
                dayData.date || '',
                dayData.stage || '',
                dayData.week || '',
                dayData.day || '',
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
            
            // Add nutrient values
            selectedNutrients.forEach(nutrient => {
                const value = dayData.nutrients && dayData.nutrients[nutrient] ? dayData.nutrients[nutrient] : '';
                values.push(value);
            });
            
            // Create cells
            values.forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        console.log('Table rendered successfully');
    }
    
    // Add dropdown change listener
    const growSelect = document.getElementById('growSelect');
    if (growSelect) {
        growSelect.addEventListener('change', async (e) => {
            const selectedGrowId = e.target.value;
            localStorage.setItem('currentGrowId', selectedGrowId);
            console.log('Grow changed to:', selectedGrowId);
            await loadTodayTask();
        });
    }
    
    // Initialize
    await initGrowDropdown();
    await loadTodayTask();
});
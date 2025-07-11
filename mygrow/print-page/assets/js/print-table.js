// print-table.js - Renders the filtered table for printing/exporting
document.addEventListener('DOMContentLoaded', async () => {
    const table = document.getElementById('printTable');
    const exportBtn = document.getElementById('exportBtn');
    
    if (!table) {
        console.error('Table element not found');
        return;
    }
    
    // Function to export table to Excel/CSV
    function exportTable() {
        const rows = Array.from(table.querySelectorAll('tr'));
        let csvContent = "data:text/csv;charset=utf-8,";
        
        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            const rowData = cells.map(cell => {
                // Escape quotes and wrap content in quotes
                let content = cell.textContent.trim();
                content = content.replace(/"/g, '""');
                return `"${content}"`;
            });
            csvContent += rowData.join(',') + '\r\n';
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        const growName = localStorage.getItem('currentGrowName') || 'grow';
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${growName}_schedule.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Add export button click handler
    if (exportBtn) {
        exportBtn.addEventListener('click', exportTable);
    }
    
    // Share function for mobile
    window.shareTable = function() {
        const tableHtml = table.outerHTML;
        const blob = new Blob([tableHtml], { type: 'text/html' });
        const file = new File([blob], 'grow_schedule.html', { type: 'text/html' });
        
        if (navigator.share) {
            navigator.share({
                title: 'My Grow Schedule',
                text: 'Here is my grow schedule',
                files: [file]
            }).catch(console.error);
        } else {
            alert('Sharing not supported on this browser');
        }
    };
    
    // Render the table
    async function renderTable() {
        try {
            const currentGrowId = localStorage.getItem('currentGrowId');
            if (!currentGrowId) {
                console.error('No current grow ID found');
                return;
            }
            
            // Load schedule for current grow
            const schedule = await window.IndexedDBService.loadSchedule(currentGrowId);
            if (!schedule) {
                console.error('No schedule found for grow:', currentGrowId);
                return;
            }
            
            // Get strain name for this grow
            const strainName = localStorage.getItem(`plantStrain_${currentGrowId}`) || 
                              localStorage.getItem('plantStrain') || '';
            
            // Get selected nutrients
            const { selected: selectedNutrients, displayNames: nutrientDisplayNames } = 
                await window.getSelectedNutrients(currentGrowId);
            
            // Core headers including all desired fields
            const coreHeaders = [
                'MyGrow', 'Date', 'Stage', 'Week', 'Day', 'Visual Inspection', 'Amount Of Water', 'Ph Goal',
                'Light Intensity', 'Light Distance', 'Daytime Temp', 'Nighttime Temp',
                'Hours Of Light', 'Humidity', 'Air Fan Position'
            ];
            
            // Combine core headers with nutrient headers
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
            table.innerHTML = '';
            table.appendChild(thead);
            
            // Create table body
            const tbody = document.createElement('tbody');
            
            // Sort dates
            const sortedDates = Object.keys(schedule).sort((a, b) => {
                const dateA = new Date(a);
                const dateB = new Date(b);
                return dateA - dateB;
            });
            
            // Get nutrient data for this grow if available
            let nutrientData = null;
            if (window.USE_NEW_NUTRIENT_HANDLER && window.getNutrientData) {
                nutrientData = window.getNutrientData(currentGrowId);
            }
            
            // Create rows for each date
            const rows = [];
            sortedDates.forEach(date => {
                const dayData = schedule[date];
                if (!dayData) return;
                
                const row = document.createElement('tr');
                
                // MyGrow cell
                const tdMyGrow = document.createElement('td');
                tdMyGrow.textContent = strainName;
                row.appendChild(tdMyGrow);
                
                // Date cell
                const tdDate = document.createElement('td');
                tdDate.textContent = date;
                row.appendChild(tdDate);
                
                // Stage cell
                const tdStage = document.createElement('td');
                tdStage.textContent = dayData.stage || '';
                row.appendChild(tdStage);
                
                // Week cell
                const tdWeek = document.createElement('td');
                tdWeek.textContent = dayData.week || '';
                row.appendChild(tdWeek);
                
                // Day cell
                const tdDay = document.createElement('td');
                tdDay.textContent = dayData.day || '';
                row.appendChild(tdDay);
                
                // Visual Inspection cell
                const tdVisual = document.createElement('td');
                tdVisual.textContent = dayData.visual_inspection || '';
                row.appendChild(tdVisual);
                
                // Amount Of Water cell
                const tdWater = document.createElement('td');
                tdWater.textContent = dayData.amount_of_water || '';
                row.appendChild(tdWater);
                
                // Ph Goal cell
                const tdPh = document.createElement('td');
                tdPh.textContent = dayData.ph_goal || '';
                row.appendChild(tdPh);
                
                // Light Intensity cell
                const tdLightIntensity = document.createElement('td');
                tdLightIntensity.textContent = dayData.light_intensity || '';
                row.appendChild(tdLightIntensity);
                
                // Light Distance cell
                const tdLightDistance = document.createElement('td');
                let lightDistance = '';
                if (dayData.stage === 'seedling') {
                    lightDistance = '40 Inches';
                } else if (dayData.stage === 'vegetative') {
                    if (parseInt(dayData.week) >= 2) {
                        lightDistance = '24 Inches';
                    } else {
                        lightDistance = '36 Inches';
                    }
                } else if (dayData.stage === 'flowering') {
                    lightDistance = '18 Inches';
                }
                tdLightDistance.textContent = lightDistance || dayData.light_distance || '';
                row.appendChild(tdLightDistance);
                
                // Daytime Temp cell
                const tdDaytimeTemp = document.createElement('td');
                tdDaytimeTemp.textContent = dayData.dt_temp || '';
                row.appendChild(tdDaytimeTemp);
                
                // Nighttime Temp cell
                const tdNighttimeTemp = document.createElement('td');
                tdNighttimeTemp.textContent = dayData.nt_temp || '';
                row.appendChild(tdNighttimeTemp);
                
                // Hours Of Light cell
                const tdHoursOfLight = document.createElement('td');
                tdHoursOfLight.textContent = dayData.hours_of_light || '';
                row.appendChild(tdHoursOfLight);
                
                // Humidity cell
                const tdHumidity = document.createElement('td');
                tdHumidity.textContent = dayData.humidity || '';
                row.appendChild(tdHumidity);
                
                // Air Fan Position cell
                const tdAirFanPosition = document.createElement('td');
                tdAirFanPosition.textContent = dayData.air_fan_position || '';
                row.appendChild(tdAirFanPosition);
                
                // Add nutrient cells
                const nutrients = dayData.nutrients || {};
                
                selectedNutrients.forEach(nutrient => {
                    const tdNutrient = document.createElement('td');
                    
                    let nutrientValue = '';
                    if (nutrientData && nutrientData[nutrient]) {
                        nutrientValue = nutrientData[nutrient];
                    } else {
                        nutrientValue = nutrients[nutrient] || '';
                    }
                    
                    tdNutrient.textContent = (nutrientValue && nutrientValue !== '0 mL/L' && nutrientValue !== '0 mL/gal') ? nutrientValue : '';
                    row.appendChild(tdNutrient);
                });
                
                tbody.appendChild(row);
                rows.push(row);
            });
            
            table.appendChild(tbody);
            
            // Apply filtering based on plant size
            const plantSize = localStorage.getItem('plantSize') || 'medium';
            const seedToHarvestDays = parseInt(localStorage.getItem('seedToHarvest'));
            
            // Apply filtering
            filterRows(rows, plantSize);
            
            // Apply seed to harvest limit if needed
            if (plantSize === 'auto' && !isNaN(seedToHarvestDays)) {
                limitRowsBySeedToHarvest(rows, seedToHarvestDays);
            }
            
            // Update title with grow name
            const growName = localStorage.getItem('currentGrowName') || 'Grow';
            document.getElementById('growTitle').textContent = growName;
            
        } catch (error) {
            console.error('Error rendering table:', error);
            table.innerHTML = '<tr><td colspan="15">Error loading table data</td></tr>';
        }
    }
    
    // Function to filter rows based on plant size
    function filterRows(rows, size) {
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return;
            
            const stageCell = cells[2]; // Stage is the 3rd column (index 2)
            const weekCell = cells[3];  // Week is the 4th column (index 3)
            
            if (!stageCell || !weekCell) return;
            
            const stage = stageCell.textContent.trim().toLowerCase();
            const weekText = weekCell.textContent.trim();
            
            // Extract numeric part from week text
            const weekMatch = weekText.match(/(\d+)/);
            const week = weekMatch ? parseInt(weekMatch[1]) : 0;
            
            // Show/hide based on plant size and vegetative week
            if (stage === 'vegetative') {
                if (size === 'small' && week >= 4) {
                    row.style.display = 'none';
                } else if (size === 'medium' && week >= 6) {
                    row.style.display = 'none';
                } else {
                    row.style.display = '';
                }
            } else {
                row.style.display = '';
            }
        });
    }
    
    // Function to limit rows based on seed to harvest days
    function limitRowsBySeedToHarvest(rows, days) {
        // Get all visible rows
        const visibleRows = rows.filter(row => row.style.display !== 'none');
        
        if (visibleRows.length <= days) return;
        
        // Hide rows beyond the specified days
        for (let i = days; i < visibleRows.length; i++) {
            visibleRows[i].style.display = 'none';
        }
    }
    
    // Helper function to get selected nutrients
    window.getSelectedNutrients = async function(growId) {
        try {
            // Try to get grow-specific nutrients first
            let selected = [];
            const growSpecificNutrients = localStorage.getItem(`nutrients_${growId}`);
            if (growSpecificNutrients) {
                selected = JSON.parse(growSpecificNutrients);
            } else {
                // Fall back to general nutrients
                const dbRequest = indexedDB.open('MyGrowDB', 5);
                const db = await new Promise((resolve, reject) => {
                    dbRequest.onsuccess = () => resolve(dbRequest.result);
                    dbRequest.onerror = () => reject(dbRequest.error);
                });
                
                let transaction = db.transaction(['selectedNutrients'], 'readonly');
                let store = transaction.objectStore('selectedNutrients');
                let request = store.get('selected');
                
                const result = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
                
                selected = result ? result.nutrients : [];
            }
            
            // Map nutrient IDs to display names
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
                'florabloom': 'FloraBloom®'
            };
            
            const displayNames = selected.map(nutrient => 
                nutrientMap[nutrient] || nutrient.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
            );
            
            return { selected, displayNames };
        } catch (error) {
            console.error('Error fetching selected nutrients:', error);
            return { selected: [], displayNames: [] };
        }
    };
    
    // Initialize
    await renderTable();
});
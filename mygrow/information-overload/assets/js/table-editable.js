// Table Editor - Makes table cells editable and saves changes
(function() {
    function makeTableEditable(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        // Make cells editable (skip header and first two columns)
        table.addEventListener('click', function(e) {
            const cell = e.target.closest('td');
            if (!cell || cell.cellIndex < 2) return; // Skip MyGrow and Date columns
            
            if (cell.contentEditable === 'true') return; // Already editing
            
            const originalValue = cell.textContent;
            cell.contentEditable = 'true';
            cell.style.backgroundColor = '#fff3cd';
            cell.focus();
            
            // Save on Enter or blur
            async function saveEdit() {
                cell.contentEditable = 'false';
                cell.style.backgroundColor = '';
                
                const newValue = cell.textContent.trim();
                if (newValue !== originalValue) {
                    await saveTableData(table);
                    showSaveIndicator();
                }
            }
            
            cell.addEventListener('blur', saveEdit, { once: true });
            cell.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    saveEdit();
                }
                if (e.key === 'Escape') {
                    cell.textContent = originalValue;
                    cell.contentEditable = 'false';
                    cell.style.backgroundColor = '';
                }
            }, { once: true });
        });
    }
    
    async function saveTableData(table) {
        const currentGrowId = localStorage.getItem('currentGrowId');
        if (!currentGrowId) return;
        
        // Get original schedule to preserve nutrient data
        const originalSchedule = await window.IndexedDBService.loadSchedule(currentGrowId);
        
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const updatedSchedule = rows.map((row, index) => {
            const cells = Array.from(row.querySelectorAll('td'));
            const originalEntry = originalSchedule[index] || {};
            
            return {
                date: cells[1]?.textContent || '',
                stage: cells[2]?.textContent || '',
                week: cells[3]?.textContent || '',
                day: cells[4]?.textContent || '',
                visual_inspection: cells[5]?.textContent || '',
                amount_of_water: cells[6]?.textContent || '',
                ph_goal: cells[7]?.textContent || '',
                light_intensity: cells[8]?.textContent || '',
                light_distance: cells[9]?.textContent || '',
                dt_temp: cells[10]?.textContent || '',
                nt_temp: cells[11]?.textContent || '',
                hours_of_light: cells[12]?.textContent || '',
                humidity: cells[13]?.textContent || '',
                air_fan_position: cells[14]?.textContent || '',
                nutrients: originalEntry.nutrients || {} // Preserve original nutrients
            };
        });
        
        // Save to IndexedDB
        if (window.IndexedDBService) {
            await window.IndexedDBService.saveSchedule(currentGrowId, updatedSchedule);
        }
    }
    
    function showSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.textContent = '✓ Saved';
        indicator.style.cssText = `
            position: fixed; top: 20px; right: 20px; 
            background: #28a745; color: white; padding: 8px 12px;
            border-radius: 4px; z-index: 1000;
        `;
        document.body.appendChild(indicator);
        setTimeout(() => indicator.remove(), 2000);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            makeTableEditable('table1'); // information-overload
            makeTableEditable('taskTable'); // mytask
        });
    } else {
        makeTableEditable('table1');
        makeTableEditable('taskTable');
    }
})();
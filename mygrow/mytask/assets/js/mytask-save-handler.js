// mytask-save-handler.js

(function() {
    "use strict";

    // Handle saving complete table data
    const saveCompleteTableData = async (tableId) => {
        const table = document.getElementById(tableId);
        if (!table) return;

        // Create a clone for saving complete data
        const tableClone = table.cloneNode(true);
        const hiddenRows = tableClone.querySelectorAll('tr[style*="display: none"]');
        hiddenRows.forEach(row => {
            row.style.display = '';
        });

        // Save using existing tableStorage
        if (window.tableStorage) {
            await window.tableStorage.saveTableData(tableId, tableClone.innerHTML);
        }
    };

    // Auto-save handler with debouncing
    let autoSaveTimeout;
    const handleAutoSave = (tableId) => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            saveCompleteTableData(tableId);
        }, 5000); // 5 second delay
    };

    // Set up event listeners when document is ready
    document.addEventListener('DOMContentLoaded', () => {
        const tables = ['table1', 'table2', 'table3', 'table4'];
        
        // Set up input listeners for auto-save
        tables.forEach(tableId => {
            const table = document.getElementById(tableId);
            if (table) {
                table.addEventListener('input', () => handleAutoSave(tableId));
            }
        });

        // Save on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                tables.forEach(tableId => saveCompleteTableData(tableId));
            }
        });

        // Save before unload
        window.addEventListener('beforeunload', () => {
            tables.forEach(tableId => saveCompleteTableData(tableId));
        });
    });
})();

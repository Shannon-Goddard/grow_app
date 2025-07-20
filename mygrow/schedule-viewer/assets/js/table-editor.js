// table-editable.js
export const makeTableEditable = async () => {
    const table = document.getElementById('table1');
    if (!table) {
        console.error('Table not found');
        return;
    }
    const editableFields = ['amount_of_water', 'visual_inspection', 'ph_goal'];
    table.querySelectorAll('tbody tr').forEach((row, rowIndex) => {
        row.querySelectorAll('td').forEach((cell, cellIndex) => {
            const header = table.querySelector(`thead th:nth-child(${cellIndex + 1})`).textContent.toLowerCase().replace(/\s+/g, '_');
            if (editableFields.includes(header)) {
                cell.contentEditable = true;
                cell.dataset.field = header;
                cell.addEventListener('blur', async () => {
                    const growId = localStorage.getItem('currentGrowId');
                    const value = cell.textContent.trim();
                    try {
                        await window.IndexedDBService.updateSchedule(growId, rowIndex, header, value);
                        console.log(`Updated ${header} to ${value} for row ${rowIndex}`);
                    } catch (error) {
                        console.error('Error saving edit:', error);
                        showToast('Failed to save edit.');
                    }
                });
            }
        });
    });
};
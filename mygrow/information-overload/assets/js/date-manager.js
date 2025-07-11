// date-manager.js
export const formatDate = (baseDate, offsetDays) => {
    const date = new Date(baseDate);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offsetDays);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

export const adjustDates = (size) => {
    const table = document.getElementById('table1');
    if (!table) return;
    
    // First, restore all original dates for ALL rows, not just visible ones
    const allRows = Array.from(table.querySelectorAll('tbody tr'));
    allRows.forEach(row => {
        if (row.cells[1] && row.cells[1].dataset.originalDate) {
            row.cells[1].textContent = row.cells[1].dataset.originalDate;
        }
    });
    
    // Store original dates if not already stored
    allRows.forEach(row => {
        if (row.cells[1] && !row.cells[1].dataset.originalDate) {
            row.cells[1].dataset.originalDate = row.cells[1].textContent;
        }
    });
    
    // Now only work with visible rows for sequential dates
    const visibleRows = allRows.filter(row => row.style.display !== 'none');
    if (visibleRows.length < 2) return;

    visibleRows.sort((a, b) => {
        const dateA = new Date(a.cells[1].textContent);
        const dateB = new Date(b.cells[1].textContent);
        return dateA - dateB;
    });

    // Make dates sequential
    const startDate = new Date(visibleRows[0].cells[1].textContent);
    for (let i = 1; i < visibleRows.length; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const day = String(newDate.getDate()).padStart(2, '0');
        const year = newDate.getFullYear();
        visibleRows[i].cells[1].textContent = `${month}/${day}/${year}`;
    }
};
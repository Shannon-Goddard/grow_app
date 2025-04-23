document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async function() {
        if (!window.tableStorage) {
            console.error('tableStorage not initialized');
            return;
        }

        const table = $('#table3');
        const tableSection = $('#table3-section');

        // Pre-calculate today's date once
        const today = new Date();
        const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

        function filterTableByToday() {
            table.find('tr:not(:first)').each(function() {
                const row = $(this);
                const dateCell = row.find('td:nth-child(2)').text().trim();
                const isToday = (dateCell === formattedToday);
                const isNoteRow = row.hasClass('notes');
                
                if (isNoteRow) {
                    row.hide(); // Always hide notes row
                } else {
                    row.toggle(isToday); // Show only rows for today
                }
            });

            // Check if there are any visible rows (excluding header)
            const visibleRows = table.find('tr:not(:first)').filter(':visible').length;
            if (visibleRows === 0) {
                tableSection.hide(); // Hide the entire section if no rows are visible
            } else {
                tableSection.show(); // Show the section if there are visible rows
            }
        }

        try {
            // Initial load
            const savedContent = await window.tableStorage.loadTableData('table3');
            if (savedContent) {
                table.html(savedContent);
                filterTableByToday();
            } else {
                tableSection.hide(); // Hide section if no data is loaded
            }

            // Style application
            table.css({
                'width': '100%',
                'border-collapse': 'collapse',
                'margin': '20px 0'
            });

            table.find('th, td').css({
                'border': '1px solid #ddd',
                'padding': '8px',
                'text-align': 'left'
            });

        } catch (error) {
            console.error('Error initializing table3:', error);
            tableSection.hide(); // Hide section on error
        }
    }, 100);
});
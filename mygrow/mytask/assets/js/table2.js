document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async function() {
        if (!window.tableStorage) {
            console.error('tableStorage not initialized');
            return;
        }

        const table = $('#table2');
        const saveButton = document.getElementById('SaveButton');
        table.attr('contenteditable', 'true');

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
                    const prevRow = row.prev();
                    const prevRowVisible = prevRow.is(':visible');
                    row.toggle(prevRowVisible);
                } else {
                    row.toggle(isToday);
                }
            });
        }

        try {
            // Initial load
            const savedContent = await window.tableStorage.loadTableData('table2');
            if (savedContent) {
                table.html(savedContent);
                filterTableByToday();
                table.find(":input").hide();
            }

            // Register table
            window.tableStorage.registerTable('table2', filterTableByToday);

            // Save handler
            let saveTimeout;
            table.on('input', 'td', function() {
                if (saveButton) {
                    saveButton.classList.add('save-button-pending');
                }
                
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(async () => {
                    const tableClone = table[0].cloneNode(true);
                    const $clone = $(tableClone);
                    
                    $clone.find('tr').each(function() {
                        $(this).css('display', '');
                    });
                    
                    await window.tableStorage.saveTableData('table2', $clone.html());
                    $clone.remove();
                }, 2000);
            });

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
            console.error('Error initializing table2:', error);
        }
    }, 100);
});

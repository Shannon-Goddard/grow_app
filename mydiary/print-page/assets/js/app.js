// Message System Styles
const styles = `
    .message {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-size: 16px;
        z-index: 1000;
        animation: fadeInOut 3s ease-in-out;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .message-success { background-color: #4CAF50; }
    .message-error { background-color: #f44336; }
    .message-info { background-color: #2196F3; }

    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Message display function
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Table initialization
$(function(){
    $("#table1").attr("contenteditable", "true");
    $('table tr:not(:first)').hide();
    $('.notes').show();
    $(":input").hide();
    $("tr:hidden,td:hidden").remove();
    $("th:hidden,td:hidden").remove();
});

// Enhanced shareTable function
async function shareTable() {
    if (navigator.share) {
        try {
            const table = document.getElementById('table1');
            
            // Clone the table and keep only header and visible notes
            const tableClone = table.cloneNode(true);
            const headerRow = tableClone.querySelector('tr:first-child');
            const notesRows = tableClone.querySelectorAll('tr.notes');
            
            // Clear table and add back only the rows we want
            $(tableClone).empty();
            headerRow && tableClone.appendChild(headerRow.cloneNode(true));
            notesRows.forEach(row => tableClone.appendChild(row.cloneNode(true)));
            
            // Add necessary styles inline
            const styles = `
                <style>
                    table { 
                        border-collapse: collapse;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    }
                    th, td { 
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                        color: #000000;
                    }
                    th {
                        background-color: #f8f9fa;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f8f9fa;
                    }
                    body {
                        margin: 0;
                        padding: 16px;
                        background-color: #ffffff;
                    }
                </style>
            `;

            // Create HTML content
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>MyDiary</title>
                    ${styles}
                </head>
                <body>
                    ${tableClone.outerHTML}
                </body>
                </html>
            `;

            // Create file objects
            const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
            const htmlFile = new File([htmlBlob], 'mydiary.html', { type: 'text/html' });

            // Prepare share data
            const shareData = {
                title: 'MyDiary',
                files: [htmlFile]
            };

            // Check if file sharing is supported
            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                showMessage('Content shared successfully!', 'success');
            } else {
                // Fallback to basic share with formatted text
                const formattedContent = formatTableContent(tableClone);
                await navigator.share({
                    title: 'MyDiary',
                    text: formattedContent
                });
                showMessage('Content shared as text', 'success');
            }

        } catch (error) {
            handleShareError(error);
        }
    } else {
        // Clipboard fallback
        try {
            const table = document.getElementById('table1');
            const tableClone = table.cloneNode(true);
            
            // Format content for clipboard
            const formattedContent = formatTableContent(tableClone);
            
            await navigator.clipboard.writeText(formattedContent);
            showMessage('Content copied to clipboard', 'success');
        } catch (clipboardError) {
            console.error('Clipboard fallback failed:', clipboardError);
            showMessage('Failed to copy content', 'error');
        }
    }
}

// Helper function to format table content
function formatTableContent(table) {
    const headerRow = table.querySelector('tr:first-child');
    const notesRows = table.querySelectorAll('tr.notes');
    
    // Format header
    const headerCells = headerRow ? headerRow.querySelectorAll('th') : [];
    let formattedContent = Array.from(headerCells)
        .map(cell => cell.textContent.trim())
        .join('\t') + '\n\n';
    
    // Format notes rows
    notesRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowContent = Array.from(cells)
            .map(cell => cell.textContent.trim())
            .join('\t');
        if (rowContent.trim()) {
            formattedContent += rowContent + '\n';
        }
    });
    
    return formattedContent;
}

// Helper function to handle sharing errors
function handleShareError(error) {
    console.error('Share error:', error);
    if (error.name === 'NotAllowedError') {
        showMessage('Share canceled or permission denied', 'info');
    } else if (error.name === 'AbortError') {
        return;
    } else {
        showMessage('Unable to share content', 'error');
    }
}

// Excel export function
function toExcel() {
    try {
        const originalTable = document.getElementById('table1');
        const tableClone = originalTable.cloneNode(true);
        
        // First, keep only the header row and .notes rows
        const headerRow = $(tableClone).find('tr:first');
        const notesRows = $(tableClone).find('tr.notes');
        
        // Clear the table and add back only the rows we want
        $(tableClone).empty();
        headerRow.appendTo(tableClone);
        notesRows.appendTo(tableClone);
        
        tableClone.style.display = 'none';
        document.body.appendChild(tableClone);

        $(tableClone).table2excel({
            exclude: ".noExl",
            name: "MyDiary.xls",
            filename: "MyDiary.xls",
            fileext: ".xls",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true,
            preserveColors: false
        });

        tableClone.remove();
        showMessage('Table exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showMessage('Failed to export to Excel. Please try again.', 'error');
    }
}

// Initialize export/share functionality
$(document).ready(function() {
    $('#exportBtn').on('click', function() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            shareTable().catch(error => {
                console.error('Share handler error:', error);
                showMessage('Unable to complete the share operation', 'error');
            });
        } else {
            toExcel();
        }
    });
});

// Error handling for script loading
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    showMessage('An error occurred. Please try again.', 'error');
    return false;
};

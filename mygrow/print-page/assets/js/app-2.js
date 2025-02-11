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

// Display table from IndexedDB
async function displayTableFromIndexedDB() {
    const table = document.getElementById('table2');
    
    // Clear existing table content
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    try {
        const data = await indexedDBService.getAllData();
        if (data && data.length > 0) {
            // Create table header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            Object.keys(data[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Create table body
            const tbody = document.createElement('tbody');
            data.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
        }
    } catch (error) {
        console.error('Error loading data from IndexedDB:', error);
        showMessage('Error loading table data', 'error');
    }
}

// Share table function
async function shareTable() {
    if (navigator.share) {
        try {
            const table = document.getElementById('table2');
            
            // Create a temporary container
            const container = document.createElement('div');
            
            // Clone the table and remove notes
            const tableClone = table.cloneNode(true);
            tableClone.querySelectorAll('tr.notes').forEach(row => row.remove());
            
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
                    }
                    th {
                        background-color: #f8f9fa;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f8f9fa;
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
                    ${styles}
                </head>
                <body>
                    ${tableClone.outerHTML}
                </body>
                </html>
            `;

            // Create file objects
            const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
            const htmlFile = new File([htmlBlob], 'grow-table.html', { type: 'text/html' });

            // Prepare share data
            const shareData = {
                title: 'MyGrow Table',
                files: [htmlFile]
            };

            // Check if file sharing is supported
            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                showMessage('Table shared successfully!', 'success');
            } else {
                // Fallback to basic share
                const plainText = Array.from(tableClone.rows).map(row => 
                    Array.from(row.cells)
                        .map(cell => cell.textContent.trim())
                        .join('\t')
                ).join('\n');

                await navigator.share({
                    title: 'MyGrow Table',
                    text: plainText
                });
                showMessage('Table shared as text', 'info');
            }
        } catch (error) {
            handleShareError(error);
        }
    } else {
        await handleNonShareFallback(document.getElementById('table2'));
    }
}

// Excel export function
function toExcel() {
    try {
        const originalTable = document.getElementById('table2');
        const tableClone = originalTable.cloneNode(true);
        
        tableClone.querySelectorAll('tr.notes').forEach(row => row.remove());
        
        tableClone.style.display = 'none';
        document.body.appendChild(tableClone);

        $(tableClone).table2excel({
            exclude: ".noExl",
            name: "MyGrow.xls",
            filename: "MyGrow.xls",
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

// Helper function for non-share capable browsers
async function handleNonShareFallback(table) {
    try {
        const tableClone = table.cloneNode(true);
        tableClone.querySelectorAll('tr.notes').forEach(row => row.remove());

        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.left = '0';
        textarea.style.top = '0';
        textarea.style.opacity = '0';

        const csvContent = Array.from(tableClone.rows).map(row => 
            Array.from(row.cells)
                .map(cell => `"${cell.textContent.trim().replace(/"/g, '""')}"`)
                .join(',')
        ).join('\n');

        textarea.value = csvContent;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        await navigator.clipboard.writeText(textarea.value);
        document.body.removeChild(textarea);
        showMessage('Table copied to clipboard as CSV', 'success');
    } catch (error) {
        console.error('Clipboard fallback failed:', error);
        showMessage('Unable to copy to clipboard', 'error');
    }
}

// Loader functions
function showLoader() {
    document.getElementById('loader-wrapper').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader-wrapper').style.display = 'none';
}

// Initialize when document is ready
$(document).ready(function() {
    hideLoader();
    
    // Load table data from IndexedDB
    displayTableFromIndexedDB()
        .then(() => {
            hideLoader();
        })
        .catch(error => {
            console.error('Error initializing table:', error);
            showMessage('Error loading table data', 'error');
            hideLoader();
        });

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

    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    $('.back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });

    AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false
    });
});

// Error handling for script loading
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    showMessage('An error occurred. Please try again.', 'error');
    return false;
};

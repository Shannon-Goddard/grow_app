// Cache DOM elements
const tableElement = document.getElementById('table3');

// Define hideShowTable function
function hideShowTable(colName) {
    if (!colName) return;

    const checkbox = document.getElementById(colName);
    if (!checkbox) return;

    const isShowing = checkbox.value === "show";
    const elements = document.getElementsByClassName(colName);
    const headerElement = document.getElementById(`${colName}_head`);
    
    if (isShowing) {
        // Hide elements instead of removing them
        Array.from(elements).forEach(el => {
            el.style.display = "none";
        });
        if (headerElement) {
            headerElement.style.display = "none";
        }
        checkbox.value = "";
    } else {
        // Show elements
        Array.from(elements).forEach(el => {
            el.style.display = "table-cell";
        });
        if (headerElement) {
            headerElement.style.display = "table-cell";
        }
        checkbox.value = "show";
        $("#taskButton").show();
    }
}

// Initialize checkboxes
function initializeCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', checkboxChangeHandler);
        checkbox.addEventListener('change', checkboxChangeHandler);
    });
}

// Checkbox change handler
function checkboxChangeHandler() {
    hideShowTable(this.id);
}

// Save table state function
function saveTableState() {
    if (!tableElement) return;
    
    try {
        // Create a temporary clone of the table
        let tempTable = tableElement.cloneNode(true);
        
        // Get all checkboxes to identify hidden columns
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            if (checkbox.value !== "show") {  // If checkbox value is empty, column is hidden
                // Remove cells with this column's class
                const columnClass = checkbox.id;
                const hiddenElements = tempTable.getElementsByClassName(columnClass);
                
                // Convert to array since removing elements will modify the live HTMLCollection
                Array.from(hiddenElements).forEach(element => {
                    element.remove();
                });
                
                // Remove header if it exists
                const headerElement = tempTable.querySelector(`#${columnClass}_head`);
                if (headerElement) {
                    headerElement.remove();
                }
            }
        });

        // Save the cleaned table HTML
        localStorage.setItem('page_html3', JSON.stringify(tempTable.innerHTML));
    } catch (error) {
        console.error('Error saving content:', error);
    }
}

// Document ready function
$(function() {
    initializeCheckboxes();
    
    const initializeTable = () => {
        if (!tableElement) return;
        
        tableElement.setAttribute("contenteditable", "true");
        
        try {
            const savedContent = localStorage.getItem('page_html3');
            if (savedContent) {
                tableElement.innerHTML = JSON.parse(savedContent);
                initializeCheckboxes();
            }
        } catch (error) {
            console.error('Error loading saved content:', error);
        }
    };

    initializeTable();

    // Add click handler for save button
    $(".get-started-btn").on('click', saveTableState);
    
    // Add beforeunload handler to save state when leaving page
    window.addEventListener('beforeunload', saveTableState);
});

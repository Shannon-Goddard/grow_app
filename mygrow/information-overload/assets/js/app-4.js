document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('table4');
    
    // Load table using StorageService
    const savedTable = StorageService.loadTable();
    
    if (savedTable) {
        // Remove the outer table tags from saved content if they exist
        let content = savedTable;
        content = content.replace(/<table[^>]*>|<\/table>/g, '');
        
        // Insert the content into our table
        table.innerHTML = content;

        // Immediately hide all .notes rows///////////////////////////
        const notesRows = table.querySelectorAll('.notes');
        notesRows.forEach(row => {
            row.style.visibility = 'collapse';
            row.style.lineHeight = '0';
             //Remove any padding and borders to avoid gaps///////////////
            const cells = row.getElementsByTagName('*');
            Array.from(cells).forEach(cell => {
                cell.style.padding = '0';
                cell.style.border = 'none';
            });
        });

        // Update strain information
        const strainElements = document.getElementsByClassName('strain');
        const plant4Strain = StorageService.getPlant4Strain();
        Array.from(strainElements).forEach(element => {
            element.textContent = plant4Strain;
        });

        // Update height information if needed
        const plant4Height = StorageService.getPlant4Height();
        if (plant4Height) {
            const heightElements = document.getElementsByClassName('height');
            Array.from(heightElements).forEach(element => {
                element.textContent = plant4Height;
            });
        }

        // Update grow information if needed
        const plant4Grow = StorageService.getPlant4Grow();
        if (plant4Grow) {
            const growElements = document.getElementsByClassName('grow');
            Array.from(growElements).forEach(element => {
                element.textContent = plant4Grow;
            });
        }

        // Update logo if it exists
        const plant4Logo = StorageService.getPlant4Logo();
        if (plant4Logo) {
            const logoElements = document.getElementsByClassName('logo');
            Array.from(logoElements).forEach(element => {
                element.src = plant4Logo;
            });
        }

        // Update watts if needed
        const plant4Watts = StorageService.getPlant4Watts();
        if (plant4Watts) {
            const wattsElements = document.getElementsByClassName('watts');
            Array.from(wattsElements).forEach(element => {
                element.textContent = plant4Watts;
            });
        }
    } else {
        table.innerHTML = '<tr><td>No saved table found</td></tr>';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('table2');
    
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
        const plant2Strain = StorageService.getPlant2Strain();
        Array.from(strainElements).forEach(element => {
            element.textContent = plant2Strain;
        });

        // Update height information if needed
        const plant2Height = StorageService.getPlant2Height();
        if (plant2Height) {
            const heightElements = document.getElementsByClassName('height');
            Array.from(heightElements).forEach(element => {
                element.textContent = plant2Height;
            });
        }

        // Update grow information if needed
        const plant2Grow = StorageService.getPlant2Grow();
        if (plant2Grow) {
            const growElements = document.getElementsByClassName('grow');
            Array.from(growElements).forEach(element => {
                element.textContent = plant2Grow;
            });
        }

        // Update logo if it exists
        const plant2Logo = StorageService.getPlant2Logo();
        if (plant2Logo) {
            const logoElements = document.getElementsByClassName('logo');
            Array.from(logoElements).forEach(element => {
                element.src = plant2Logo;
            });
        }

        // Update watts if needed
        const plant2Watts = StorageService.getPlant2Watts();
        if (plant2Watts) {
            const wattsElements = document.getElementsByClassName('watts');
            Array.from(wattsElements).forEach(element => {
                element.textContent = plant2Watts;
            });
        }
    } else {
        table.innerHTML = '<tr><td>No saved table found</td></tr>';
    }
});

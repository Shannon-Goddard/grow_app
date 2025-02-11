document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('table3');
    
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
        const plant3Strain = StorageService.getPlant3Strain();
        Array.from(strainElements).forEach(element => {
            element.textContent = plant3Strain;
        });

        // Update height information if needed
        const plant3Height = StorageService.getPlant3Height();
        if (plant3Height) {
            const heightElements = document.getElementsByClassName('height');
            Array.from(heightElements).forEach(element => {
                element.textContent = plant3Height;
            });
        }

        // Update grow information if needed
        const plant3Grow = StorageService.getPlant3Grow();
        if (plant3Grow) {
            const growElements = document.getElementsByClassName('grow');
            Array.from(growElements).forEach(element => {
                element.textContent = plant3Grow;
            });
        }

        // Update logo if it exists
        const plant3Logo = StorageService.getPlant3Logo();
        if (plant3Logo) {
            const logoElements = document.getElementsByClassName('logo');
            Array.from(logoElements).forEach(element => {
                element.src = plant3Logo;
            });
        }

        // Update watts if needed
        const plant3Watts = StorageService.getPlant3Watts();
        if (plant3Watts) {
            const wattsElements = document.getElementsByClassName('watts');
            Array.from(wattsElements).forEach(element => {
                element.textContent = plant3Watts;
            });
        }
    } else {
        table.innerHTML = '<tr><td>No saved table found</td></tr>';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('table1');
    
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
        const plantStrain = StorageService.getPlantStrain();
        Array.from(strainElements).forEach(element => {
            element.textContent = plantStrain;
        });

        // Update height information if needed
        const plantHeight = StorageService.getPlantHeight();
        if (plantHeight) {
            const heightElements = document.getElementsByClassName('height');
            Array.from(heightElements).forEach(element => {
                element.textContent = plantHeight;
            });
        }

        // Update grow information if needed
        const plantGrow = StorageService.getPlantGrow();
        if (plantGrow) {
            const growElements = document.getElementsByClassName('grow');
            Array.from(growElements).forEach(element => {
                element.textContent = plantGrow;
            });
        }

        // Update logo if it exists
        const plantLogo = StorageService.getPlantLogo();
        if (plantLogo) {
            const logoElements = document.getElementsByClassName('logo');
            Array.from(logoElements).forEach(element => {
                element.src = plantLogo;
            });
        }

        // Update watts if needed
        const plantWatts = StorageService.getPlantWatts();
        if (plantWatts) {
            const wattsElements = document.getElementsByClassName('watts');
            Array.from(wattsElements).forEach(element => {
                element.textContent = plantWatts;
            });
        }
    } else {
        table.innerHTML = '<tr><td>No saved table found</td></tr>';
    }
});

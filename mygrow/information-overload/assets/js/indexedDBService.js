const IndexedDBService = {
    dbName: 'myDatabase',
    dbVersion: 1,
    storeName: 'tables',
    
    // Initialize the database
    initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            
            request.onsuccess = () => resolve(request.result);
        });
    },

    // Save table to IndexedDB
    async saveTable(tableContent) {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                
                // Parse the content if it's a string
                let content = typeof tableContent === 'string' ? 
                    JSON.parse(tableContent) : tableContent;

                const request = store.put(content, 'mainTable');
                
                request.onsuccess = () => {
                    // After successful save to IndexedDB, remove from localStorage
                    localStorage.removeItem('page_html');
                    resolve(true);
                };
                
                request.onerror = () => reject(request.error);
                
                // Ensure the transaction completes
                transaction.oncomplete = () => {
                    db.close();
                };
            });
        } catch (error) {
            console.error('Error saving to IndexedDB:', error);
            return false;
        }
    },

    // Load table from IndexedDB
    async loadTable() {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                
                const request = store.get('mainTable');
                
                request.onsuccess = () => {
                    const result = request.result;
                    db.close();
                    resolve(result);
                };
                
                request.onerror = () => {
                    db.close();
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Error loading from IndexedDB:', error);
            return null;
        }
    }
};

// Main initialization code
document.addEventListener('DOMContentLoaded', async () => {
    const table = document.getElementById('table1');
    
    try {
        // First check IndexedDB
        let tableContent = await IndexedDBService.loadTable();
        
        // If no data in IndexedDB, check localStorage and migrate
        if (!tableContent) {
            const localStorageContent = localStorage.getItem('page_html');
            if (localStorageContent) {
                // Save to IndexedDB
                await IndexedDBService.saveTable(localStorageContent);
                // Get the content back from IndexedDB
                tableContent = await IndexedDBService.loadTable();
            }
        }
        
        if (tableContent) {
            // Handle the content properly
            let content = tableContent;
            if (typeof content === 'string') {
                // Remove any escaped characters and normalize newlines
                content = content.replace(/\\n/g, '')
                               .replace(/\\"/g, '"')
                               .replace(/\\/g, '');
            }

            // Remove the outer table tags if they exist
            content = content.replace(/<table[^>]*>|<\/table>/g, '');
            
            // Insert the content into our table
            table.innerHTML = content;

            // Hide .notes rows
            const notesRows = table.querySelectorAll('.notes');
            notesRows.forEach(row => {
                row.style.display = 'none';
            });


            // Update strain information
            const strainElements = document.getElementsByClassName('strain');
            const plantStrain = StorageService.getPlantStrain();
            Array.from(strainElements).forEach(element => {
                element.textContent = plantStrain;
            });

            // Update other elements
            const plantHeight = StorageService.getPlantHeight();
            if (plantHeight) {
                const heightElements = document.getElementsByClassName('height');
                Array.from(heightElements).forEach(element => {
                    element.textContent = plantHeight;
                });
            }

            const plantGrow = StorageService.getPlantGrow();
            if (plantGrow) {
                const growElements = document.getElementsByClassName('grow');
                Array.from(growElements).forEach(element => {
                    element.textContent = plantGrow;
                });
            }

            const plantLogo = StorageService.getPlantLogo();
            if (plantLogo) {
                const logoElements = document.getElementsByClassName('logo');
                Array.from(logoElements).forEach(element => {
                    element.src = plantLogo;
                });
            }

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
    } catch (error) {
        console.error('Error initializing table:', error);
        table.innerHTML = '<tr><td>Error loading table data</td></tr>';
    }
});

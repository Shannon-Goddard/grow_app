const IndexedDBService = {
    dbName: 'myDatabase3',
    dbVersion: 3,
    storeName: 'tables3',
    
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

    async saveTable(tableContent) {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(tableContent, 'mainTable');
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
                transaction.oncomplete = () => db.close();
            });
        } catch (error) {
            console.error('Error saving to IndexedDB:', error);
            return false;
        }
    },

    async loadTable() {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get('mainTable');
                request.onsuccess = () => {
                    db.close();
                    resolve(request.result);
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

$(async function() {
    const table = $('#table3');
    let fullTableContent = '';
    let hiddenTable = null;
    let saveTimeout = null;
    let isUpdating = false;
    
    function createHiddenTable() {
        hiddenTable = table.clone();
        hiddenTable.attr('id', 'hiddenTable3');
        hiddenTable.css({
            'position': 'absolute',
            'left': '-9999px',
            'visibility': 'hidden'
        });
        hiddenTable.find('tr').show();
        hiddenTable.find(':input').show();
        $('body').append(hiddenTable);
    }

    function updateVisibleTable() {
        const activeElement = document.activeElement;
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const cursorPosition = range.startOffset;
        
        // Store the specific cell being edited
        const activeCell = activeElement.closest('td, th');
        const cellIndex = activeCell ? Array.from(activeCell.parentElement.children).indexOf(activeCell) : -1;
        const rowIndex = activeCell ? activeCell.parentElement.rowIndex : -1;
        
        table.html(hiddenTable.html());
        table.find('tr:not(:first)').hide();
        table.find('.notes').show();
        table.find(":input").hide();
        
        if (activeCell) {
            // Find the same cell in the updated table
            const newCell = table[0].rows[rowIndex]?.cells[cellIndex];
            if (newCell) {
                const range = document.createRange();
                const selection = window.getSelection();
                
                // Set cursor position
                const textNode = newCell.firstChild || newCell;
                range.setStart(textNode, Math.min(cursorPosition, textNode.length));
                range.setEnd(textNode, Math.min(cursorPosition, textNode.length));
                
                selection.removeAllRanges();
                selection.addRange(range);
                newCell.focus();
            }
        }
    }
    
    try {
        const savedContent = await IndexedDBService.loadTable();
        if (savedContent) {
            fullTableContent = savedContent;
            table.html(savedContent);
            createHiddenTable();
            table.find('tr:not(:first)').hide();
            table.find('.notes').show();
            table.find(":input").hide();
        } else {
            createHiddenTable();
        }
    } catch (error) {
        console.error('Error loading table:', error);
        createHiddenTable();
    }

    table.attr('contenteditable', 'true');

    function debouncedSave() {
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        saveTimeout = setTimeout(async () => {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const cursorPosition = range.startOffset;
            const activeCell = document.activeElement.closest('td, th');
            
            const currentContent = table.html();
            hiddenTable.html(currentContent);
            hiddenTable.find('tr').show();
            hiddenTable.find(':input').show();
            fullTableContent = hiddenTable.html();
            await IndexedDBService.saveTable(fullTableContent);
            
            // Only update visibility states
            table.find('tr:not(:first)').hide();
            table.find('.notes').show();
            table.find(':input').hide();
            
            // Restore cursor position
            if (activeCell) {
                const range = document.createRange();
                const textNode = activeCell.firstChild || activeCell;
                range.setStart(textNode, Math.min(cursorPosition, textNode.length));
                range.setEnd(textNode, Math.min(cursorPosition, textNode.length));
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }, 250);
    }

    table.on('input', function() {
        if (!isUpdating) {
            isUpdating = true;
            debouncedSave();
            isUpdating = false;
        }
    });

    $(window).on('beforeunload', function() {
        clearTimeout(saveTimeout);
        
        table.find('tr').show();
        table.find(':input').show();
        
        hiddenTable.html(table.html());
        hiddenTable.find('tr').show();
        hiddenTable.find(':input').show();
        
        fullTableContent = hiddenTable.html();
        
        const db = indexedDB.open(IndexedDBService.dbName, IndexedDBService.dbVersion);
        db.onsuccess = function(event) {
            const database = event.target.result;
            const transaction = database.transaction([IndexedDBService.storeName], 'readwrite');
            const store = transaction.objectStore(IndexedDBService.storeName);
            store.put(fullTableContent, 'mainTable');
        };
        
        table.find('tr:not(:first)').hide();
        table.find('.notes').show();
        table.find(':input').hide();
    });

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearTimeout(saveTimeout);
            
            table.find('tr').show();
            table.find(':input').show();
            
            hiddenTable.html(table.html());
            hiddenTable.find('tr').show();
            hiddenTable.find(':input').show();
            
            fullTableContent = hiddenTable.html();
            IndexedDBService.saveTable(fullTableContent);
            
            table.find('tr:not(:first)').hide();
            table.find('.notes').show();
            table.find(':input').hide();
        }
    });
});

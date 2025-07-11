// indexedDBService.js
let instance = null;

class IndexedDBService {
    constructor(dbName = 'MyGrowDB', dbVersion = 8) {
        if (instance) {
            console.log('Returning existing IndexedDBService instance');
            return instance;
        }
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        console.log('IndexedDBService instance created with dbName:', dbName, 'version:', dbVersion);
        instance = this;
    }

    static getInstance(dbName = 'MyGrowDB', dbVersion = 8) {
        if (!instance) {
            instance = new IndexedDBService(dbName, dbVersion);
        }
        return instance;
    }

    initDB() {
        return new Promise((resolve, reject) => {
            console.log('Opening database:', this.dbName, 'version:', this.dbVersion);
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log('onupgradeneeded triggered for version:', this.dbVersion);
                const existingStores = Array.from(db.objectStoreNames);
                console.log('Existing stores:', existingStores);

                if (!existingStores.includes('tables')) {
                    db.createObjectStore('tables');
                    console.log('Created tables store');
                }
                if (!existingStores.includes('selectedNutrients')) {
                    db.createObjectStore('selectedNutrients', { keyPath: 'id' });
                    console.log('Created selectedNutrients store');
                }
                if (!existingStores.includes('nutrients')) {
                    db.createObjectStore('nutrients', { keyPath: 'nutrientName' });
                    console.log('Created nutrients store');
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                console.log('initDB successful, db stores:', Array.from(db.objectStoreNames));
                resolve(db);
            };

            request.onerror = (event) => {
                console.error('initDB error:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async saveSchedule(growId, schedule) {
        console.log('Starting saveSchedule for growId:', growId);
        try {
            const db = await this.initDB();
            const transaction = db.transaction(['tables'], 'readwrite');
            const store = transaction.objectStore('tables');
            const request = store.put(schedule, `${growId}_schedule`);
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    console.log('Schedule saved successfully for growId:', growId);
                    resolve(true);
                };
                request.onerror = (event) => {
                    console.error('Error saving schedule:', event.target.error);
                    reject(event.target.error);
                };
                transaction.oncomplete = () => {
                    console.log('saveSchedule transaction completed');
                    db.close();
                };
                transaction.onerror = (event) => {
                    console.error('Transaction error in saveSchedule:', event.target.error);
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error('Error saving to IndexedDB:', error);
            return false;
        }
    }

async loadAllGrows() {
    console.log('Starting loadAllGrows');
    try {
        const db = await this.initDB();
        const transaction = db.transaction(['tables'], 'readonly');
        const store = transaction.objectStore('tables');
        const request = store.getAllKeys();
        const keys = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        console.log('loadAllGrows keys:', keys);

        const validKeys = keys.filter(key => typeof key === 'string' && key.includes('schedule'));
        console.log('Filtered grow keys:', validKeys);
        console.log('All keys found:', keys);

        const grows = validKeys.map(key => {
            const growId = key.replace('_schedule', '');
            const growName = localStorage.getItem(`growName_${growId}`) || 'Unknown Grow';
            console.log(`Loading grow: ${growId}, name: ${growName}`);
            return {
                growId: growId,
                growName: growName
            };
        });

        console.log('loadAllGrows processed:', grows);
        console.log('First grow structure:', grows[0]);
        return grows;
    } catch (error) {
        console.error('Error loading grows:', error);
        return [];
    } finally {
        console.log('loadAllGrows transaction completed');
    }
}

async loadSchedule(growId) {
    console.log(`Starting loadSchedule for growId: ${growId}`);
    try {
        const db = await this.initDB();
        const tx = db.transaction(['tables'], 'readonly');
        const store = tx.objectStore('tables');
        const request = store.get(`${growId}_schedule`);
        
        const schedule = await new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log(`loadSchedule raw result for growId ${growId}:`, request.result);
                resolve(request.result || []);
            };
            request.onerror = () => reject(request.error);
        });

        console.log(`loadSchedule processed for growId ${growId}:`, schedule);
        tx.oncomplete = () => console.log('loadSchedule transaction completed');
        tx.onerror = () => console.error('loadSchedule transaction error:', tx.error);
        return schedule;
    } catch (error) {
        console.error('Error loading schedule:', error);
        return [];
    }
}

async deleteGrow(growId) {
    try {
        const db = await this.initDB();
        const tx = db.transaction(['tables', 'nutrients', 'selectedNutrients'], 'readwrite');
        const tablesStore = tx.objectStore('tables');
        const nutrientsStore = tx.objectStore('nutrients');
        const selectedNutrientsStore = tx.objectStore('selectedNutrients');

        const deleteRequest = (store, key) => new Promise((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => {
                console.log(`Deleted from ${store.name}: ${key}`);
                resolve();
            };
            request.onerror = () => reject(request.error);
        });

        await Promise.all([
            deleteRequest(tablesStore, growId),
            deleteRequest(nutrientsStore, growId),
            deleteRequest(selectedNutrientsStore, growId)
        ]);

        console.log(`Grow deleted successfully for growId: ${growId}`);
        return true;
    } catch (error) {
        console.error('Error deleting grow:', error);
        return false;
    }
}

    async updateSchedule(growId, rowIndex, field, value) {
        try {
            const db = await this.initDB();
            const transaction = db.transaction(['tables'], 'readwrite');
            const store = transaction.objectStore('tables');
            const request = store.get(growId);
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const schedule = request.result || [];
                    if (schedule[rowIndex]) {
                        schedule[rowIndex][field] = value;
                        store.put(schedule, growId);
                        resolve(true);
                    } else {
                        reject(new Error('Invalid row index'));
                    }
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error updating schedule:', error);
            return false;
        }
    }
}

const indexedDBService = new IndexedDBService();
export { indexedDBService as IndexedDBService };
export default IndexedDBService;
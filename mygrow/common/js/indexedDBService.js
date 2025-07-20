// indexedDBService.js
let instance = null;

class IndexedDBService {
    constructor(dbName = 'MyGrowDB', dbVersion = 8) {
        if (instance) {
            return instance;
        }
        this.dbName = dbName;
        this.dbVersion = dbVersion;

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

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const existingStores = Array.from(db.objectStoreNames);

                if (!existingStores.includes('tables')) {
                    db.createObjectStore('tables');
                }
                if (!existingStores.includes('selectedNutrients')) {
                    db.createObjectStore('selectedNutrients', { keyPath: 'id' });
                }
                if (!existingStores.includes('nutrients')) {
                    db.createObjectStore('nutrients', { keyPath: 'nutrientName' });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                resolve(db);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async saveSchedule(growId, schedule) {
        try {
            const db = await this.initDB();
            const transaction = db.transaction(['tables'], 'readwrite');
            const store = transaction.objectStore('tables');
            const request = store.put(schedule, `${growId}_schedule`);
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    resolve(true);
                };
                request.onerror = (event) => {
                    reject(event.target.error);
                };
                transaction.oncomplete = () => {
                    db.close();
                };
                transaction.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        } catch (error) {

            return false;
        }
    }

async loadAllGrows() {
    try {
        const db = await this.initDB();
        const transaction = db.transaction(['tables'], 'readonly');
        const store = transaction.objectStore('tables');
        const request = store.getAllKeys();
        const keys = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        const validKeys = keys.filter(key => typeof key === 'string' && key.includes('schedule'));

        const grows = validKeys.map(key => {
            const growId = key.replace('_schedule', '');
            const growName = localStorage.getItem(`growName_${growId}`) || 'Unknown Grow';

            return {
                growId: growId,
                growName: growName
            };
        });

        return grows;
    } catch (error) {
        return [];
    }
}

async loadSchedule(growId) {
    try {
        const db = await this.initDB();
        const tx = db.transaction(['tables'], 'readonly');
        const store = tx.objectStore('tables');
        const request = store.get(`${growId}_schedule`);
        
        const schedule = await new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result || []);
            };
            request.onerror = () => reject(request.error);
        });

        tx.oncomplete = () => {};
        tx.onerror = () => {};
        return schedule;
    } catch (error) {

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
                resolve();
            };
            request.onerror = () => reject(request.error);
        });

        await Promise.all([
            deleteRequest(tablesStore, growId),
            deleteRequest(nutrientsStore, growId),
            deleteRequest(selectedNutrientsStore, growId)
        ]);

        return true;
    } catch (error) {

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

            return false;
        }
    }
}

const indexedDBService = new IndexedDBService();
export { indexedDBService as IndexedDBService };
export default IndexedDBService;
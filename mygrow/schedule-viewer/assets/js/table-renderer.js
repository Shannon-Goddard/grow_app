// In your table-renderer.js
import { showToast } from '../../../common/js/toast.js';
import { makeTableEditable } from './table-editor.js';

export async function loadAndRenderTable(growId) {
    console.log('[WebViewDebug] loadAndRenderTable called with growId:', growId); // ADD THIS

    try {
        // 1. Check if IndexedDBService itself is available
        if (!window.IndexedDBService || typeof window.IndexedDBService.loadSchedule !== 'function') {
            console.error('[WebViewDebug] IndexedDBService is not available or loadSchedule is not a function.');
            showToast('Critical error: Database service not available.'); // Make sure this toast is visible
            return;
        }
        console.log('[WebViewDebug] IndexedDBService appears to be available.'); // ADD THIS

        const schedule = await window.IndexedDBService.loadSchedule(growId);
        console.log('[WebViewDebug] schedule data loaded:', schedule); // ADD THIS (VERY IMPORTANT)

        if (!Array.isArray(schedule) || schedule.length === 0) {
            console.warn('[WebViewDebug] No schedule data found or schedule is not an array. Exiting.'); // ADD THIS
            showToast('No schedule data found for this grow.');
            return;
        }

        const table = document.getElementById('table1');
        console.log('[WebViewDebug] table element:', table); // ADD THIS
        if (!table) {
            console.warn('[WebViewDebug] Table element with ID "table1" not found. Exiting.'); // ADD THIS
            showToast('Table not found on page.');
            return;
        }
        table.innerHTML = ''; // Clear existing content

        const strainName = localStorage.getItem(`plantStrain_${growId}`) || localStorage.getItem('plantStrain') || '';
        console.log('[WebViewDebug] strainName from localStorage:', strainName); // ADD THIS

        // 2. Further IndexedDB Checks
        if (typeof window.IndexedDBService.initDB !== 'function') {
            console.error('[WebViewDebug] IndexedDBService.initDB is not a function.');
            showToast('Critical error: Database init service not available.');
            return;
        }
        console.log('[WebViewDebug] Attempting to initDB...'); // ADD THIS
        const db = await window.IndexedDBService.initDB();
        console.log('[WebViewDebug] DB initialized:', db ? 'OK' : 'Failed or null'); // ADD THIS

        if (!db) {
            console.error('[WebViewDebug] Failed to initialize database. Exiting.');
            showToast('Failed to initialize database.');
            return;
        }

        const transaction = db.transaction(['selectedNutrients'], 'readonly');
        const store = transaction.objectStore('selectedNutrients');
        const request = store.get(growId);
        const selectedNutrients = await new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log('[WebViewDebug] selectedNutrients request successful:', request.result); // ADD THIS
                resolve(request.result ? request.result.nutrients : []);
            };
            request.onerror = (event) => {
                console.error('[WebViewDebug] selectedNutrients request error:', event.target.error); // ADD THIS
                reject(request.error);
            };
        });
        console.log('[WebViewDebug] selectedNutrients data:', selectedNutrients); // ADD THIS

        const nutrientTransaction = db.transaction(['nutrients'], 'readonly');
        const nutrientStore = nutrientTransaction.objectStore('nutrients');
        const nutrientRequest = nutrientStore.getAll();
        const customNutrients = await new Promise((resolve, reject) => {
            nutrientRequest.onsuccess = () => {
                console.log('[WebViewDebug] customNutrients request successful:', nutrientRequest.result); // ADD THIS
                resolve(nutrientRequest.result);
            };
            nutrientRequest.onerror = (event) => {
                console.error('[WebViewDebug] customNutrients request error:', event.target.error); // ADD THIS
                reject(nutrientRequest.error);
            };
        });
        console.log('[WebViewDebug] customNutrients data:', customNutrients); // ADD THIS


        // ... (rest of your rendering logic) ...
        console.log('[WebViewDebug] Proceeding to render table headers and body...'); // ADD THIS


        // (Your existing header and body rendering code)


        console.log('[WebViewDebug] Table rendering complete. Calling makeTableEditable.'); // ADD THIS
        await makeTableEditable();
        console.log('[WebViewDebug] makeTableEditable finished. Dispatching tableRendered event.'); // ADD THIS
        document.dispatchEvent(new CustomEvent('tableRendered'));

    } catch (error) {
        console.error('[WebViewDebug] Error in loadAndRenderTable:', error); // MODIFIED THIS
        showToast('Failed to load schedule. Check console for details.'); // MODIFIED THIS
    }
}

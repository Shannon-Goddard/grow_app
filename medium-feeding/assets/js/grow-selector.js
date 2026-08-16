import { IndexedDBService } from './indexedDBService.js';
import { loadAndRenderTable } from './table-renderer.js';
        const grows = await IndexedDBService.loadAllGrows();
        console.log('Grows loaded for dropdown:', grows);
        
        growSelect.innerHTML = '<option value="">Select Grow</option>';
        
        grows.forEach((grow) => {
            const growId = grow.growId || grow.id || (grow.schedule ? grow.schedule[0]?.growId : '');
            const growName = localStorage.getItem(`growName_${growId}`) || 'Unnamed Grow';
            if (growId) {
                console.log('Adding grow to dropdown:', { growId, growName });
                const option = document.createElement('option');
                option.value = growId;
                option.textContent = growName;
                growSelect.appendChild(option);
            }
        });
        
        growSelect.addEventListener('change', async () => {
            const growId = growSelect.value;
            if (growId) {
                console.log('Grow selected:', growId);
                localStorage.setItem('currentGrowId', growId);
                await loadAndRenderTable(growId);
            }
        });
        
        const currentGrowId = localStorage.getItem('currentGrowId');
        if (currentGrowId) {
            growSelect.value = currentGrowId;
            await loadAndRenderTable(currentGrowId);
        }
    } catch (error) {
        console.error('Error initializing grow dropdown:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to load grows.');
        }
    }
};
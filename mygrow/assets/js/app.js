// mygrow/assets/js/app.js
import { IndexedDBService } from '../../common/js/indexedDBService.js';

// Debug function to help troubleshoot issues
function debugGrowData() {
    console.group('Debug Grow Data');
    
    // Check localStorage
    const growKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('grow_') || 
        key.includes('growName_') || 
        key.includes('plantLogo_') ||
        key.includes('plantStrain_') ||
        key === 'currentGrowId'
    );
    
    console.log('LocalStorage grow keys:', growKeys);
    growKeys.forEach(key => {
        console.log(`${key}: ${localStorage.getItem(key)}`);
    });
    
    // Check IndexedDB
    IndexedDBService.loadAllGrows().then(grows => {
        console.log('IndexedDB grows:', grows);
    }).catch(err => {
        console.error('Error loading grows from IndexedDB:', err);
    });
    
    console.groupEnd();
}

// Adjust logo path for server context
function adjustLogoPath(logoPath) {
    if (!logoPath) {
        return '/mygrow/assets/img/default.jpg';
    }
    // Handle paths with /mygrow/../assets/img/ - normalize to /mygrow/assets/img/
    if (logoPath.includes('/mygrow/../assets/img/')) {
        return logoPath.replace('/mygrow/../assets/img/', '/mygrow/assets/img/');
    }
    // Handle paths with ../assets/img/ by extracting just the filename
    if (logoPath.includes('../assets/img/')) {
        return '/mygrow/assets/img/' + logoPath.split('../assets/img/').pop();
    }
    if (logoPath.includes('assets/img/')) {
        return '/mygrow/assets/img/' + logoPath.split('assets/img/').pop();
    }
    // Make sure we have a valid path that starts with /
    return logoPath.startsWith('/') ? logoPath : `/mygrow/assets/img/${logoPath}`;
}

function createGrowCard(growId, growName, logoPath) {
    const adjustedLogoPath = adjustLogoPath(logoPath);
    console.log('Creating grow card:', { growId, growName, adjustedLogoPath });
    const cardDiv = document.createElement('div');
    cardDiv.className = 'col-xl-2 col-md-4';
    cardDiv.setAttribute('data-grow-id', growId);
    cardDiv.innerHTML = `
        <div class="icon-box">
            <a href="/mygrow/information-overload/information-overload-1.html" class="grow-link">
                <img src="${adjustedLogoPath}" class="img-fluid" alt="${growName || 'Grow'}">
                <h3>${growName}</h3>
            </a>
            <button class="DeleteButton btn btn-secondary btn-sm" type="button">
                <i class="fa fa-trash-can"></i>
            </button>
        </div>
    `;

    const img = cardDiv.querySelector('img');
    img.onerror = function() {
        this.onerror = null;
        this.src = '/mygrow/assets/img/default.jpg';
        console.log('Image failed to load, using default:', this.src);
        
        // Update the stored logo path to prevent future errors
        if (growId) {
            localStorage.setItem(`plantLogo_${growId}`, '/mygrow/assets/img/default.jpg');
            console.log(`Updated logo path in localStorage for ${growId}`);
            
            // Also try to update in IndexedDB if possible
            IndexedDBService.initDB().then(db => {
                const tx = db.transaction(['tables'], 'readwrite');
                const store = tx.objectStore('tables');
                store.get(growId).then(result => {
                    if (result) {
                        result.logo = '/mygrow/assets/img/default.jpg';
                        store.put(result, growId);
                        console.log(`Updated logo path in IndexedDB for ${growId}`);
                    }
                }).catch(err => console.error('Error updating logo in IndexedDB:', err));
            }).catch(err => console.error('Error accessing IndexedDB:', err));
        }
    };

    const link = cardDiv.querySelector('.grow-link');
    link.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.setItem('currentGrowId', growId);
        console.log('Navigating to information-overload-1.html with growId:', growId);
        window.location.href = this.href;
    });

    const deleteButton = cardDiv.querySelector('.DeleteButton');
    deleteButton.addEventListener('click', async function(event) {
        event.stopPropagation();

        const existingContainer = document.querySelector('.toast-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast-container {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 300px;
                }
                .toast-notification {
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 12px 15px;
                    border-radius: 4px;
                    margin-bottom: 10px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    position: relative;
                    pointer-events: auto;
                }
                .btn {
                    cursor: pointer !important;
                    pointer-events: auto !important;
                    position: relative;
                    z-index: 10001;
                }
            `;
            document.head.appendChild(style);
        }

        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);

        const toast = document.createElement('div');
        toast.className = 'toast-notification';

        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${growName || 'Grow'} will be deleted. Are you sure?`;
        messageDiv.style.marginBottom = '10px';
        toast.appendChild(messageDiv);

        const buttonDiv = document.createElement('div');
        buttonDiv.style.display = 'flex';
        buttonDiv.style.justifyContent = 'flex-end';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'btn btn-sm btn-light';
        cancelBtn.style.marginRight = '10px';
        buttonDiv.appendChild(cancelBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn btn-sm btn-danger';
        buttonDiv.appendChild(deleteBtn);

        toast.appendChild(buttonDiv);
        container.appendChild(toast);

        cancelBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            container.remove();
        });

deleteBtn.addEventListener('click', async function(event) {
    event.stopPropagation();
    container.remove(); // Remove confirmation toast
    console.log(`Initiating deletion for growId: ${growId}`);
    try {
        // Use IndexedDBService.deleteGrow
        const success = await IndexedDBService.deleteGrow(growId);
        if (!success) {
            throw new Error(`Failed to delete grow ${growId} from IndexedDB`);
        }
        console.log(`Deleted grow ${growId} via IndexedDBService.deleteGrow`);

        // Explicitly delete schedule
        const db = await IndexedDBService.initDB();
        const tx = db.transaction(['tables'], 'readwrite');
        const tablesStore = tx.objectStore('tables');
        const scheduleKey = `${growId}_schedule`;
        const scheduleDeleteRequest = tablesStore.delete(scheduleKey);
        await new Promise((resolve, reject) => {
            scheduleDeleteRequest.onsuccess = () => {
                console.log(`Deleted schedule: ${scheduleKey}`);
                resolve();
            };
            scheduleDeleteRequest.onerror = () => {
                console.warn(`No schedule found for ${scheduleKey}, continuing`);
                resolve(); // Non-critical, so continue
            };
        });
        await tx.done;

        // Clear localStorage keys
        const keysToRemove = Object.keys(localStorage).filter(key => 
            key.startsWith(`growName_${growId}`) ||
            key.startsWith(`plantLogo_${growId}`) ||
            key.startsWith(`plantStrain_${growId}`) ||
            key.startsWith(`plantSize_${growId}`) ||
            key.startsWith(`seedToHarvest_${growId}`) ||
            key.startsWith(`nutrients_${growId}`) ||
            key.startsWith(`scheduleSaved_${growId}`) ||
            key.startsWith(`id_${growId}`) ||
            key === 'currentGrowId' ||
            key === 'currentGrowName' ||
            key === 'startDate' ||
            key === 'floweringWeeks' ||
            key === 'vegWeeks' ||
            key === 'plantSize' ||
            key === 'plantStrain' ||
            key === 'plantGrow'
        );
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            console.log(`Removed localStorage key: ${key}`);
        });

        // Remove card from UI
        cardDiv.remove();
        console.log(`Removed grow card for growId: ${growId}`);

        // Update UI
        const remainingGrows = document.querySelectorAll('[data-grow-id]');
        if (remainingGrows.length === 0) {
            document.getElementById('MyGrowAdd').style.display = 'block';
            document.getElementById('taskButton').style.display = 'none';
        }

        // Show success toast
        window.showToast('Grow deleted successfully.', 'success');
    } catch (error) {
        console.error(`Error deleting grow ${growId}:`, error);
        window.showToast('Failed to delete grow. Please try again.', 'error');
    }
});
    });

    return cardDiv;
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOMContentLoaded event fired for mygrow.html');
    // Run debug function to help troubleshoot
    debugGrowData();
    const growContainer = document.getElementById('growContainer');
    if (!growContainer) {
        console.error('growContainer not found');
        return;
    }
    try {
        const grows = await IndexedDBService.loadAllGrows();
        console.log('Loaded grows:', grows);
        console.log('Grows detailed:', JSON.stringify(grows, null, 2));
        growContainer.innerHTML = '';
        const growMetadata = grows.filter(g => g.type !== 'schedule');
        console.log('Filtered grow metadata:', growMetadata);
        console.log('Filtered detailed:', JSON.stringify(growMetadata, null, 2));
        console.log('All grows types:', grows.map(g => ({ id: g.id, type: g.type })));
        if (growMetadata.length === 0) {
            // Find all grows from localStorage
            const growIds = Object.keys(localStorage)
                .filter(key => key.startsWith('growName_'))
                .map(key => key.replace('growName_', ''));
            
            if (growIds.length > 0) {
                console.log('Creating cards from localStorage data for:', growIds);
                growIds.forEach(growId => {
                    const growName = localStorage.getItem(`growName_${growId}`);
                    const logoPath = localStorage.getItem(`plantLogo_${growId}`);
                    if (growName) {
                        const card = createGrowCard(growId, growName, logoPath);
                        growContainer.appendChild(card);
                    }
                });
                document.getElementById('MyGrowAdd').style.display = 'block';
                document.getElementById('taskButton').style.display = 'block';
            } else {
                console.log('No grows found, showing Add Grow button');
                document.getElementById('MyGrowAdd').style.display = 'block';
                document.getElementById('taskButton').style.display = 'none';
            }
        } else {
            console.log(`Processing ${growMetadata.length} grows`);
            document.getElementById('MyGrowAdd').style.display = 'block';
            document.getElementById('taskButton').style.display = 'block';
            growMetadata.forEach((grow, index) => {
                console.log(`Processing grow ${index}:`, grow);
                const growId = grow.growId;
                
                // Use grow object data first, then localStorage as fallback
                const storedName = localStorage.getItem(`growName_${growId}`);
                const storedLogo = localStorage.getItem(`plantLogo_${growId}`);
                
                const growName = grow.growName || storedName || '';
                let logoPath = storedLogo || grow.logo || '/mygrow/assets/img/default.jpg';
                
                // Log the data sources for debugging
                console.log('Grow data sources:', { 
                    growId, 
                    storedName, 
                    growObjectName: grow.growName,
                    storedLogo,
                    growObjectLogo: grow.logo,
                    finalName: growName,
                    finalLogo: logoPath
                });
                console.log('About to create card with:', { growId, growName, logoPath });
                
                // Create and append the card
                const card = createGrowCard(growId, growName, logoPath);
                growContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading grows:', error);
        document.getElementById('MyGrowAdd').style.display = 'block';
        document.getElementById('taskButton').style.display = 'none';
    }
});
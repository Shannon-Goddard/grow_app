// nutrient-manager.js
import { IndexedDBService } from '../../../common/js/indexedDBService.js';

console.log('Imported IndexedDBService:', IndexedDBService);

async function addCustomNutrient(nutrient) {
    try {
        const db = await IndexedDBService.initDB();
        console.log('addCustomNutrient db:', db);
        const transaction = db.transaction(['nutrients'], 'readwrite');
        const store = transaction.objectStore('nutrients');
        const request = store.put(nutrient);
        await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
        console.log(`Nutrient ${nutrient.nutrientName} added to nutrients store`);
    } catch (error) {
        console.error('Error adding custom nutrient:', error);
        window.showToast('Failed to add nutrient.', 'error');
    }
}

async function updateSelectedNutrients() {
    try {
        const checkboxes = document.querySelectorAll('.listPrint input[type="checkbox"]:checked');
        console.log('Checked checkboxes:', Array.from(checkboxes).map(cb => ({ id: cb.id, value: cb.value, checked: cb.checked })));
        const selectedNames = Array.from(checkboxes).map(cb => cb.value || cb.id.replace('custom-', ''));
        console.log('Updating selected nutrients:', selectedNames);
        const db = await IndexedDBService.initDB();
        console.log('updateSelectedNutrients db:', db);
        
        // Get current grow ID
        const growId = localStorage.getItem('currentGrowId');
        if (!growId) {
            console.error('No current grow ID found');
            return 0;
        }
        
        // Store nutrients specifically for this grow
        const transaction = db.transaction(['selectedNutrients'], 'readwrite');
        const store = transaction.objectStore('selectedNutrients');
        
        // Save to grow-specific record
        await new Promise((resolve, reject) => {
            const request = store.put({ id: growId, nutrients: selectedNames });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
        console.log(`Nutrients saved for specific grow ${growId}:`, selectedNames);
        
        // Also save to 'selected' for backward compatibility
        await new Promise((resolve, reject) => {
            const request = store.put({ id: 'selected', nutrients: selectedNames });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
        
        // Save to localStorage as well
        localStorage.setItem(`nutrients_${growId}`, JSON.stringify(selectedNames));
        
        return selectedNames.length;
    } catch (error) {
        console.error('Error updating selected nutrients:', error);
        window.showToast('Failed to save selected nutrients.', 'error');
        return 0;
    }
}

function updateTaskButtonVisibility() {
    const taskButton = document.getElementById('taskButton');
    const selectedCount = document.querySelectorAll('.listPrint input[type="checkbox"]:checked').length;
    console.log('Selected checkboxes count:', selectedCount);
    if (taskButton) {
        taskButton.style.display = selectedCount > 0 ? 'block' : 'none';
    }
}

function generateSchedule(nutrients, growId) {
    console.log('Generating schedule with nutrients:', nutrients, 'for growId:', growId);
    const grow = JSON.parse(localStorage.getItem(`plantGrow_${growId}`) || '{}');
    const floweringWeeks = grow.floweringWeeks || 16; // Fallback to 16 if not set
    console.log(`Using flowering weeks: ${floweringWeeks}`);
    const schedule = [];
    for (let week = 1; week <= floweringWeeks; week++) {
        for (let day = 1; day <= 7; day++) {
            schedule.push({
                stage: week <= 2 ? 'seedling' : week <= 6 ? 'vegetative' : 'flowering',
                week: `week ${week}`,
                day: day,
                nutrients,
                size: 'medium'
            });
        }
    }
    return schedule;
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing nutrients-mix-and-match-1.html');
    const taskButton = document.getElementById('taskButton');
    if (taskButton) taskButton.style.display = 'none';

    try {
        const db = await IndexedDBService.initDB();
        const currentGrowId = localStorage.getItem('currentGrowId');
        const existingGrowNutrients = localStorage.getItem(`nutrients_${currentGrowId}`);

        // Clear legacy 'selected' record for new grows
        if (!existingGrowNutrients) {
            const transaction = db.transaction(['selectedNutrients'], 'readwrite');
            const store = transaction.objectStore('selectedNutrients');
            await new Promise((resolve, reject) => {
                const request = store.delete('selected');
                request.onsuccess = () => {
                    console.log('Cleared legacy selectedNutrients record');
                    resolve();
                };
                request.onerror = () => {
                    console.warn('No legacy selectedNutrients record found');
                    resolve(); // Non-critical, continue
                };
            });
        }

        console.log('Checking IndexedDBService methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(IndexedDBService)));
        console.log('Database initialized with stores:', Array.from(db.objectStoreNames));

        const transaction = db.transaction(['nutrients'], 'readonly');
        const store = transaction.objectStore('nutrients');
        const request = store.getAll();

        request.onsuccess = () => {
            const nutrients = request.result;
            console.log('Loaded nutrients:', nutrients);
            const nutrientList = document.getElementById('nutrientList');
            if (nutrientList) {
                nutrients.forEach(nutrient => {
                    const div = document.createElement('div');
                    div.className = 'col-xl-2 col-md-4';
                    const innerDiv = document.createElement('div');
                    innerDiv.className = 'icon-box';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = nutrient.nutrientName;
                    checkbox.value = nutrient.nutrientName;
                    checkbox.className = 'form-check-input listPrint';
                    const label = document.createElement('label');
                    label.htmlFor = nutrient.nutrientName;
                    label.textContent = nutrient.displayName;
                    label.className = 'form-check-label';
                    const ul = document.createElement('ul');
                    const li = document.createElement('li');
                    li.className = 'listPrint';
                    li.appendChild(checkbox);
                    li.appendChild(label);
                    ul.appendChild(li);
                    innerDiv.appendChild(ul);
                    div.appendChild(innerDiv);
                    nutrientList.appendChild(div);

                    checkbox.addEventListener('change', async () => {
                        console.log(`Dynamic checkbox ${nutrient.nutrientName} changed to ${checkbox.checked}`);
                        await updateSelectedNutrients();
                        updateTaskButtonVisibility();
                    });
                });
            }

            // Ensure all predefined nutrient sections are visible with timeout for mobile
            setTimeout(() => {
                const predefinedSections = document.querySelectorAll('.row .col-xl-2 .icon-box');
                console.log('Predefined sections found:', predefinedSections.length);
                predefinedSections.forEach(section => {
                    section.classList.add('force-visible');
                    if (section.parentElement) {
                        section.parentElement.classList.add('force-visible');
                    }
                });
            }, 100);
            
            const staticCheckboxes = document.querySelectorAll('.listPrint input[type="checkbox"]');
            console.log('Found static checkboxes:', staticCheckboxes.length);
            staticCheckboxes.forEach(checkbox => {
                if (!checkbox.value) {
                    checkbox.value = checkbox.id;
                    console.log(`Set value for checkbox ${checkbox.id} to ${checkbox.value}`);
                }
                checkbox.addEventListener('change', async () => {
                    console.log(`Static checkbox ${checkbox.id} changed to ${checkbox.checked}`);
                    await updateSelectedNutrients();
                    updateTaskButtonVisibility();
                });
            });

            // Only restore nutrients for existing grows, not new ones
            const currentGrowId = localStorage.getItem('currentGrowId');
            const existingGrowNutrients = localStorage.getItem(`nutrients_${currentGrowId}`);
            
            if (existingGrowNutrients) {
                // This is an existing grow, restore its specific nutrients
                const selectedNutrients = JSON.parse(existingGrowNutrients);
                console.log('Restoring nutrients for existing grow:', selectedNutrients);
                selectedNutrients.forEach(nutrient => {
                    const checkbox = document.getElementById(nutrient) || document.getElementById(`custom-${nutrient}`);
                    if (checkbox) {
                        checkbox.checked = true;
                        console.log(`Restored checkbox ${nutrient} to checked`);
                    } else {
                        console.warn(`Checkbox for nutrient ${nutrient} not found`);
                    }
                });
                updateTaskButtonVisibility();
            } else {
                // New grow - all predefined nutrients are visible by default
                console.log('New grow detected, all predefined nutrients available');
            }
        };

        request.onerror = () => {
            console.error('Error loading nutrients:', request.error);
            window.showToast('Failed to load nutrients.', 'error');
        };

        const addNutrientBtn = document.getElementById('add-nutrient-btn');
        if (addNutrientBtn) {
            addNutrientBtn.addEventListener('click', async () => {
                console.log('Adding nutrient to list');
                const nutrientName = document.getElementById('nutrient-name')?.value.trim();
                const unit = document.getElementById('unit')?.value || 'mL';
                const seedlingAmount = parseFloat(document.getElementById('seedling-amount')?.value) || 0;
                const vegetativeAmount = parseFloat(document.getElementById('veg-amount')?.value) || 0;
                const lateVegetativeAmount = parseFloat(document.getElementById('late-veg-amount')?.value) || 0;
                const preFlowerAmount = parseFloat(document.getElementById('pre-flower-amount')?.value) || 0;
                const floweringAmount = parseFloat(document.getElementById('flower-amount')?.value) || 0;
                const lateFloweringAmount = parseFloat(document.getElementById('late-flower-amount')?.value) || 0;

                if (!nutrientName) {
                    window.showToast('Please enter a nutrient name.', 'error');
                    return;
                }

                const nutrient = {
                    nutrientName: nutrientName.toLowerCase().replace(/\s+/g, '-'),
                    displayName: nutrientName,
                    custom: true,
                    stages: [
                        { stage: 'seedling', amount: seedlingAmount, unit, per: 'L' },
                        { stage: 'vegetative', amount: vegetativeAmount, unit, per: 'L' },
                        { stage: 'late-vegetative', amount: lateVegetativeAmount, unit, per: 'L' },
                        { stage: 'pre-flower', amount: preFlowerAmount, unit, per: 'L' },
                        { stage: 'flowering', amount: floweringAmount, unit, per: 'L' },
                        { stage: 'late-flowering', amount: lateFloweringAmount, unit, per: 'L' }
                    ]
                };

                await addCustomNutrient(nutrient);
                const nutrientCheckboxes = document.getElementById('nutrient-checkboxes');
                if (nutrientCheckboxes) {
                    const li = document.createElement('li');
                    li.className = 'listPrint';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `custom-${nutrient.nutrientName}`;
                    checkbox.value = nutrient.nutrientName;
                    checkbox.checked = true;
                    checkbox.className = 'listPrint';
                    const label = document.createElement('label');
                    label.htmlFor = `custom-${nutrient.nutrientName}`;
                    label.textContent = nutrient.displayName;
                    label.className = 'form-check-label';
                    li.appendChild(checkbox);
                    li.appendChild(label);
                    nutrientCheckboxes.appendChild(li);
                    console.log('Added nutrient to DOM:', { id: checkbox.id, label: label.textContent });

                    checkbox.addEventListener('change', async () => {
                        console.log(`Custom checkbox ${nutrient.nutrientName} changed to ${checkbox.checked}`);
                        await updateSelectedNutrients();
                        updateTaskButtonVisibility();
                    });

                    await updateSelectedNutrients();
                    updateTaskButtonVisibility();
                }
            });
        }

        const form = document.getElementById('customNutrientForm');
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                try {
                    const growId = localStorage.getItem('currentGrowId');
                    if (!growId) throw new Error('No growId found');
                    const checkboxes = document.querySelectorAll('.listPrint input[type="checkbox"]:checked');
                    const selectedNutrients = Array.from(checkboxes).map(cb => cb.value || cb.id.replace('custom-', ''));
                    const schedule = generateSchedule(selectedNutrients, growId);
                    
                    const db = await IndexedDBService.initDB();
                    const tx = db.transaction(['tables'], 'readwrite');
                    const store = tx.objectStore('tables');
                    await store.put({ type: 'schedule', id: `${growId}_schedule`, growId, schedule });
                    console.log(`Saved schedule for growId: ${growId}`);
                    await tx.done;

                    await updateSelectedNutrients();
                    window.location.href = '../build-your-guide/build-your-guide-1.html';
                } catch (error) {
                    console.error('Error saving schedule:', error);
                    window.showToast('Failed to save schedule.', 'error');
                }
            });
        }
    } catch (error) {
        console.error('Error initializing nutrient list:', error);
        window.showToast('Failed to initialize nutrient list.', 'error');
    }
});
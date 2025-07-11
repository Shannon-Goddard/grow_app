async function addCustomNutrient(nutrient) {
    try {
        const db = await window.IndexedDBService.initDB();
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
        showToast('Failed to add nutrient.');
    }
}

async function updateSelectedNutrients() {
    try {
        const checkboxes = document.querySelectorAll('#nutrientList input[type="checkbox"]:checked, #nutrient-checkboxes input[type="checkbox"]:checked');
        const selectedNames = Array.from(checkboxes).map(cb => cb.value);
        const db = await window.IndexedDBService.initDB();
        const transaction = db.transaction(['selectedNutrients'], 'readwrite');
        const store = transaction.objectStore('selectedNutrients');
        const request = store.put({ id: 'selected', nutrients: selectedNames });
        await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
        console.log('Selected nutrients updated:', selectedNames);
        const growId = localStorage.getItem('currentGrowId');
        if (growId) {
            localStorage.setItem(`nutrients_${growId}`, JSON.stringify(selectedNames));
        }
    } catch (error) {
        console.error('Error updating selected nutrients:', error);
        showToast('Failed to save selected nutrients.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing nutrients-mix-and-match-1.html');
    
    const taskButton = document.getElementById('taskButton');
    if (taskButton) {
        taskButton.style.display = 'none';
    }

    try {
        const db = await window.IndexedDBService.initDB();
        console.log('Database initialized with stores:', Array.from(db.objectStoreNames));

        // Load existing nutrients
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
                    checkbox.className = 'form-check-input';
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
                        const selectedCount = document.querySelectorAll('#nutrientList input[type="checkbox"]:checked, #nutrient-checkboxes input[type="checkbox"]:checked').length;
                        taskButton.style.display = selectedCount > 0 ? 'block' : 'none';
                    });
                });
            }

// Inside request.onsuccess
// Handle static predefined checkboxes
const staticCheckboxes = document.querySelectorAll('.listPrint input[type="checkbox"]');
console.log('Found static checkboxes:', staticCheckboxes.length, Array.from(staticCheckboxes).map(cb => ({ id: cb.id, value: cb.value, checked: cb.checked })));
staticCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', async () => {
        console.log(`Static checkbox ${checkbox.id} (value: ${checkbox.value}) changed to ${checkbox.checked}`);
        await updateSelectedNutrients();
        const selectedCount = document.querySelectorAll('#nutrientList input[type="checkbox"]:checked, #nutrient-checkboxes input[type="checkbox"]:checked').length;
        console.log('Selected checkboxes count:', selectedCount, 'Selected values:', Array.from(document.querySelectorAll('#nutrientList input[type="checkbox"]:checked, #nutrient-checkboxes input[type="checkbox"]:checked')).map(cb => cb.value));
        taskButton.style.display = selectedCount > 0 ? 'block' : 'none';
    });
});

// Log selected nutrients after initialization
const selectedTransaction = db.transaction(['selectedNutrients'], 'readonly');
const selectedStore = selectedTransaction.objectStore('selectedNutrients');
const selectedRequest = selectedStore.get('selected');
selectedRequest.onsuccess = () => {
    if (selectedRequest.result && selectedRequest.result.nutrients) {
        const selectedNutrients = selectedRequest.result.nutrients;
        console.log('Restoring selected nutrients:', selectedNutrients);
        selectedNutrients.forEach(nutrient => {
            const checkbox = document.getElementById(nutrient) || document.getElementById(`custom-${nutrient}`);
            if (checkbox) {
                checkbox.checked = true;
                console.log(`Restored checkbox ${nutrient} to checked`);
            } else {
                console.warn(`Checkbox for nutrient ${nutrient} not found`);
            }
        });
        const selectedCount = document.querySelectorAll('#nutrientList input[type="checkbox"]:checked, #nutrient-checkboxes input[type="checkbox"]:checked').length;
        console.log('Initial selected checkboxes count:', selectedCount, 'Values:', Array.from(document.querySelectorAll('#nutrientList input[type="checkbox"]:checked, #nutrient-checkboxes input[type="checkbox"]:checked')).map(cb => cb.value));
        taskButton.style.display = selectedCount > 0 ? 'block' : 'none';
    }
};
        };

        request.onerror = () => {
            console.error('Error loading nutrients:', request.error);
            showToast('Failed to load nutrients.');
        };

        const addNutrientBtn = document.getElementById('add-nutrient-btn');
        if (addNutrientBtn) {
            addNutrientBtn.addEventListener('click', async () => {
                console.log('Adding nutrient to list');
                const nutrientName = document.getElementById('nutrient-name')?.value.trim();
                const displayName = nutrientName;
                const unit = document.getElementById('unit')?.value || 'mL';
                const seedlingAmount = parseFloat(document.getElementById('seedling-amount')?.value) || 0;
                const vegetativeAmount = parseFloat(document.getElementById('veg-amount')?.value) || 0;
                const lateVegetativeAmount = parseFloat(document.getElementById('late-veg-amount')?.value) || 0;
                const preFlowerAmount = parseFloat(document.getElementById('pre-flower-amount')?.value) || 0;
                const floweringAmount = parseFloat(document.getElementById('flower-amount')?.value) || 0;
                const lateFloweringAmount = parseFloat(document.getElementById('late-flower-amount')?.value) || 0;

                if (!nutrientName) {
                    showToast('Please enter a nutrient name.');
                    return;
                }

                const nutrient = {
                    nutrientName: nutrientName.toLowerCase().replace(/\s+/g, '-'),
                    displayName: displayName,
                    custom: true,
                    stages: [
                        { stage: 'seedling', amount: seedlingAmount, unit: unit, per: 'L' },
                        { stage: 'vegetative', amount: vegetativeAmount, unit: unit, per: 'L' },
                        { stage: 'late-vegetative', amount: lateVegetativeAmount, unit: unit, per: 'L' },
                        { stage: 'pre-flower', amount: preFlowerAmount, unit: unit, per: 'L' },
                        { stage: 'flowering', amount: floweringAmount, unit: unit, per: 'L' },
                        { stage: 'late-flowering', amount: lateFloweringAmount, unit: unit, per: 'L' }
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
                    checkbox.dataset.nutrient = JSON.stringify(nutrient);
                    const label = document.createElement('label');
                    label.htmlFor = `custom-${nutrient.nutrientName}`;
                    label.textContent = nutrient.displayName;
                    li.appendChild(checkbox);
                    li.appendChild(label);
                    nutrientCheckboxes.appendChild(li);

                    checkbox.addEventListener('change', async () => {
                        console.log(`Custom checkbox ${nutrient.nutrientName} changed to ${checkbox.checked}`);
                        await updateSelectedNutrients();
                        const selectedCount = document.querySelectorAll('#nutrientList input[type="checkbox"]:checked, #nutrient-checkboxes input[type="checkbox"]:checked').length;
                        taskButton.style.display = selectedCount > 0 ? 'block' : 'none';
                    });

                    await updateSelectedNutrients();
                    taskButton.style.display = 'block';
                }
            });
        }

        const form = document.getElementById('customNutrientForm');
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await updateSelectedNutrients();
                window.location.href = '../build-your-guide/build-your-guide-1.html';
            });
        }
    } catch (error) {
        console.error('Error initializing nutrient list:', error);
        showToast('Failed to initialize nutrient list.');
    }
});
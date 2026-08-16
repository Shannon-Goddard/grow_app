import { IndexedDBService } from '../../medium-feeding/assets/js/indexedDBService.js';

document.addEventListener('DOMContentLoaded', async () => {
    // DOM elements
    const dataTable = document.getElementById('data-table');
    const columnOptions = document.getElementById('column-options');
    const growSelect = document.getElementById('growSelect');
    const saveBtn = document.getElementById('save-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const captureBtn = document.getElementById('capture-btn');
    const cameraView = document.getElementById('camera-view');
    const capturedPhoto = document.getElementById('captured-photo');
    const cameraControls = document.querySelector('.camera-controls');
    const photoControls = document.querySelector('.photo-controls');
    
    // Available columns
    const availableColumns = [
        { id: 'strain', name: 'Strain Name', checked: true },
        { id: 'date', name: 'Date', checked: true },
        { id: 'stage', name: 'Stage', checked: true },
        { id: 'week', name: 'Week', checked: true },
        { id: 'day', name: 'Day', checked: false },
        { id: 'visual', name: 'Visual Inspection', checked: false },
        { id: 'water', name: 'Amount Of Water', checked: false },
        { id: 'ph', name: 'Ph Goal', checked: false },
        { id: 'light_intensity', name: 'Light Intensity', checked: false },
        { id: 'light_distance', name: 'Light Distance', checked: false },
        { id: 'dt_temp', name: 'Daytime Temp', checked: false },
        { id: 'nt_temp', name: 'Nighttime Temp', checked: false },
        { id: 'hours_light', name: 'Hours Of Light', checked: false },
        { id: 'humidity', name: 'Humidity', checked: false },
        { id: 'fan', name: 'Air Fan Position', checked: false }
    ];
    
    // Function to get selected nutrients
    async function getSelectedNutrients(growId) {
        try {
            // Try to get grow-specific nutrients first
            const nutrientsKey = `nutrients_${growId}`;
            const storedNutrients = localStorage.getItem(nutrientsKey);
            
            if (storedNutrients) {
                return JSON.parse(storedNutrients);
            }
            
            // If not in localStorage, try IndexedDB
            const db = await IndexedDBService.initDB();
            const transaction = db.transaction(['selectedNutrients'], 'readonly');
            const store = transaction.objectStore('selectedNutrients');
            const request = store.get('selected');
            
            return new Promise((resolve) => {
                request.onsuccess = () => {
                    if (request.result && request.result.nutrients) {
                        resolve(request.result.nutrients);
                    } else {
                        resolve([]);
                    }
                };
                request.onerror = () => resolve([]);
            });
        } catch (error) {
            return [];
        }
    }
    
    // Create column checkboxes
    function createColumnCheckboxes(selectedNutrients = []) {
        // Clear existing options
        columnOptions.innerHTML = '';
        
        // Add standard columns
        availableColumns.forEach(column => {
            const div = document.createElement('div');
            div.className = 'column-option form-check form-check-inline';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'form-check-input';
            input.id = `col-${column.id}`;
            input.checked = column.checked;
            input.addEventListener('change', updateDataTable);
            
            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = `col-${column.id}`;
            label.textContent = column.name;
            
            div.appendChild(input);
            div.appendChild(label);
            columnOptions.appendChild(div);
        });
        
        // Add nutrient columns
        selectedNutrients.forEach(nutrient => {
            const div = document.createElement('div');
            div.className = 'column-option nutrient-option form-check form-check-inline';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'form-check-input';
            input.id = `col-${nutrient}`;
            input.checked = false;
            input.addEventListener('change', updateDataTable);
            
            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = `col-${nutrient}`;
            label.textContent = nutrient.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            
            div.appendChild(input);
            div.appendChild(label);
            columnOptions.appendChild(div);
        });
    }
    
    // Initialize mobile camera
    async function initMobileCamera() {
        try {
            // Check if this is a mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // Use appropriate constraints for mobile
            const constraints = {
                video: {
                    facingMode: isMobile ? 'environment' : 'user', // Use back camera on mobile
                    width: { ideal: isMobile ? 1280 : 640 },
                    height: { ideal: isMobile ? 720 : 480 }
                }
            };
            
            // Get camera stream
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Set up video element
            cameraView.srcObject = stream;
            cameraView.style.display = 'block';
            
            // Play video when metadata is loaded
            cameraView.onloadedmetadata = () => {
                cameraView.play()
                    .then(() => {})
                    .catch(err => {});
            };
            
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // Populate grow dropdown
    async function populateGrowDropdown() {
        try {
            const grows = await IndexedDBService.loadAllGrows();
            
            growSelect.innerHTML = '';
            // Add this after checking if grows exist
            if (!grows || grows.length === 0) {
                growSelect.innerHTML = '<option value="">No grows available</option>';

                // Show message in the data container
                dataTable.innerHTML = '<tr><td colspan="15" class="text-center py-3">' +
                    '<div class="alert alert-warning">' +
                    '<strong>No grows found!</strong><br>' +
                    'Please create a grow in MyGrow first, then return to this page.' +
                    '<br><a href="../mygrow/mygrow.html" class="btn btn-sm btn-primary mt-2">Go to MyGrow</a>' +
                    '</div></td></tr>';
                return;
            } else {
                grows.forEach(grow => {
                    const option = document.createElement('option');
                    option.value = grow.growId;
                    option.textContent = grow.growName;
                    growSelect.appendChild(option);
                });
            }
            
            const currentGrowId = localStorage.getItem('currentGrowId');
            if (currentGrowId) {
                growSelect.value = currentGrowId;
            }
            
            // Load selected nutrients and create checkboxes
            const currentId = growSelect.value;
            if (currentId) {
                const selectedNutrients = await getSelectedNutrients(currentId);
                createColumnCheckboxes(selectedNutrients);
            } else {
                createColumnCheckboxes([]);
            }
        } catch (error) {
            // Error populating grow dropdown
        }
    }
    
    // Handle grow selection change
    growSelect.addEventListener('change', async function() {
        const selectedGrowId = this.value;
        localStorage.setItem('currentGrowId', selectedGrowId);
        
        // Update column options with selected nutrients
        const selectedNutrients = await getSelectedNutrients(selectedGrowId);
        createColumnCheckboxes(selectedNutrients);
        
        updateDataTable();
    });
    
    // Update data table based on selected columns
    async function updateDataTable() {
        try {
            const currentGrowId = localStorage.getItem('currentGrowId');
            if (!currentGrowId) {
                // No grow selected, show message
                dataTable.innerHTML = '<tr><td colspan="15" class="text-center py-3">' +
                    '<div class="alert alert-warning">' +
                    '<strong>No grow selected!</strong><br>' +
                    'Please create a grow in MyGrow first, then return to this page.' +
                    '<br><a href="../mygrow/mygrow.html" class="get-started-btn" style="color:#343a40;">Go to MyGrow</a>' +
                    '</div></td></tr>';
                return;
            }
            
            // Load schedule for current grow
            const schedule = await IndexedDBService.loadSchedule(currentGrowId);
            if (!schedule) return;
            
            // Get today's date with leading zeros to match schedule format
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const year = today.getFullYear();
            const todayStr = `${month}/${day}/${year}`; // Format: MM/DD/YYYY
            
            // Filter schedule for today's entry
            let todayData = schedule.find(row => row.date === todayStr);
            if (!todayData) {
                // Use first entry as fallback
                todayData = schedule[0];
                if (!todayData) {
                    dataTable.innerHTML = '<tr><td colspan="5">No schedule data available</td></tr>';
                    return;
                }
            }
            
            // Get selected nutrients
            const selectedNutrients = await getSelectedNutrients(currentGrowId);
            
            // Create table header and body
            let tableHTML = '<tr>';
            let dataHTML = '<tr>';
            
            // Check which columns are selected
            if (document.getElementById('col-strain').checked) {
                const strainName = localStorage.getItem(`plantStrain_${currentGrowId}`) || 
                  localStorage.getItem('plantStrain') || 'Unknown Strain';
                tableHTML += '<th>Strain</th>';
                dataHTML += `<td>${strainName}</td>`;
            }

            if (document.getElementById('col-date').checked) {
                tableHTML += '<th>Date</th>';
                dataHTML += `<td>${todayData.date || ''}</td>`;
            }
            
            if (document.getElementById('col-stage').checked) {
                tableHTML += '<th>Stage</th>';
                dataHTML += `<td>${todayData.stage || ''}</td>`;
            }
            
            if (document.getElementById('col-week').checked) {
                tableHTML += '<th>Week</th>';
                dataHTML += `<td>${todayData.week || ''}</td>`;
            }
            
            if (document.getElementById('col-day').checked) {
                tableHTML += '<th>Day</th>';
                dataHTML += `<td>${todayData.day || ''}</td>`;
            }
            
            if (document.getElementById('col-visual').checked) {
                tableHTML += '<th>Visual</th>';
                dataHTML += `<td>${todayData.visual_inspection || ''}</td>`;
            }
            
            if (document.getElementById('col-water').checked) {
                tableHTML += '<th>Water</th>';
                dataHTML += `<td>${todayData.amount_of_water || ''}</td>`;
            }
            
            if (document.getElementById('col-ph').checked) {
                tableHTML += '<th>pH</th>';
                dataHTML += `<td>${todayData.ph_goal || ''}</td>`;
            }
            
            if (document.getElementById('col-light_intensity').checked) {
                tableHTML += '<th>Light Int.</th>';
                dataHTML += `<td>${todayData.light_intensity || ''}</td>`;
            }
            
            if (document.getElementById('col-light_distance').checked) {
                tableHTML += '<th>Light Dist.</th>';
                let lightDistance = '';
                if (todayData.stage === 'seedling') {
                    lightDistance = '40 Inches';
                } else if (todayData.stage === 'vegetative') {
                    if (parseInt(todayData.week) >= 2) {
                        lightDistance = '24 Inches';
                    } else {
                        lightDistance = '36 Inches';
                    }
                } else if (todayData.stage === 'flowering') {
                    lightDistance = '18 Inches';
                }
                dataHTML += `<td>${lightDistance || todayData.light_distance || ''}</td>`;
            }
            
            if (document.getElementById('col-dt_temp').checked) {
                tableHTML += '<th>Day Temp</th>';
                dataHTML += `<td>${todayData.dt_temp || ''}</td>`;
            }
            
            if (document.getElementById('col-nt_temp').checked) {
                tableHTML += '<th>Night Temp</th>';
                dataHTML += `<td>${todayData.nt_temp || ''}</td>`;
            }
            
            if (document.getElementById('col-hours_light').checked) {
                tableHTML += '<th>Light Hours</th>';
                dataHTML += `<td>${todayData.hours_of_light || ''}</td>`;
            }
            
            if (document.getElementById('col-humidity').checked) {
                tableHTML += '<th>Humidity</th>';
                dataHTML += `<td>${todayData.humidity || ''}</td>`;
            }
            
            if (document.getElementById('col-fan').checked) {
                tableHTML += '<th>Fan</th>';
                dataHTML += `<td>${todayData.air_fan_position || ''}</td>`;
            }

            // Check for nutrient columns
            selectedNutrients.forEach(nutrient => {
                if (document.getElementById(`col-${nutrient}`) && document.getElementById(`col-${nutrient}`).checked) {
                    const nutrientName = nutrient.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    tableHTML += `<th>${nutrientName}</th>`;
                    dataHTML += `<td>${todayData.nutrients?.[nutrient] || ''}</td>`;
                }
            });
            
            tableHTML += '</tr>';
            dataHTML += '</tr>';
            
            // Update table
            dataTable.innerHTML = tableHTML + dataHTML;
            
        } catch (error) {
            dataTable.innerHTML = '<tr><td colspan="5">Error loading data</td></tr>';
        }
    }
    
    // Capture photo
    captureBtn.addEventListener('click', () => {
        try {
            // Snapshot the video frame onto the captured-photo element first
            const canvas = document.createElement('canvas');
            canvas.width = cameraView.videoWidth || 640;
            canvas.height = cameraView.videoHeight || 480;
            canvas.getContext('2d').drawImage(cameraView, 0, 0, canvas.width, canvas.height);

            capturedPhoto.src = canvas.toDataURL('image/jpeg');
            capturedPhoto.style.display = 'block';
            cameraView.style.display = 'none';
            cameraControls.style.display = 'none';
            photoControls.style.display = 'block';
        } catch (error) {
            alert('Failed to capture photo. Please try again.');
        }
    });
    
    // Save photo — use html2canvas to composite the overlay into the image
    saveBtn.addEventListener('click', () => {
        const growName = localStorage.getItem(`growName_${localStorage.getItem('currentGrowId')}`) || 'grow';
        const filename = `${growName}-diary-${new Date().toISOString().slice(0, 10)}.png`;
        html2canvas(document.getElementById('data-container'), { useCORS: true, allowTaint: true })
            .then(canvas => {
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL('image/png');
                link.click();
            })
            .catch(() => {
                // Fallback: save without overlay
                const link = document.createElement('a');
                link.download = filename;
                link.href = capturedPhoto.src;
                link.click();
            });
    });
    
    // Retake photo
    retakeBtn.addEventListener('click', () => {
        // Show video preview again
        cameraView.style.display = 'block';
        capturedPhoto.style.display = 'none';
        
        // Show camera controls
        cameraControls.style.display = 'block';
        photoControls.style.display = 'none';
    });
    
    // Initialize
    await populateGrowDropdown();
    await updateDataTable();
    
    // Try to initialize camera, if it fails, still show the data
    const cameraInitialized = await initMobileCamera();
    if (!cameraInitialized) {
        // If camera fails, just show the data container with a message
        document.getElementById('data-container').innerHTML += `
            <div style="position:absolute; top:0; left:0; right:0; bottom:0; 
                 background-color:#333; display:flex; align-items:center; 
                 justify-content:center; z-index:1;">
                <div class="text-center">
                    <p>Camera not available</p>
                    <p>Data is still visible below</p>
                </div>
            </div>
        `;
    }
});

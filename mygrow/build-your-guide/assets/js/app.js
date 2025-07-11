import { saveScheduleToIndexedDB } from './schedule-generator.js';

document.addEventListener('DOMContentLoaded', async () => {
    let growId = localStorage.getItem('currentGrowId');
    if (!growId) {
        growId = `grow_${Date.now()}`;
        localStorage.setItem('currentGrowId', growId);
        localStorage.setItem(`id_${growId}`, growId);
        console.log('Generated new growId:', growId);
    }
    console.log('Current grow ID:', growId);
    // Ensure growId is stored for reference
    localStorage.setItem(`id_${growId}`, growId);

    const startDateInput = document.getElementById('start');
    const taskButton = document.getElementById('taskButton');
    const imageElement = document.getElementById('image');

    if (!startDateInput || !taskButton) {
        console.error('Start date input or task button not found', { startDateInput, taskButton });
        window.showToast('Page elements missing.', 'error');
        return;
    }

    console.log('Task button initial style:', taskButton.style.display);

    // Fix logo path handling
    const logoPath = localStorage.getItem(`plantLogo_${growId}`) || localStorage.getItem('plantLogo');
    if (imageElement && logoPath) {
        // Extract just the filename from the path
        const filename = logoPath.split('/').pop();
        const resolvedPath = `/mygrow/assets/img/${filename}`;
        
        imageElement.src = resolvedPath;
        imageElement.alt = localStorage.getItem(`growName_${growId}`) || 'Grow Image';
        console.log('Logo set to:', resolvedPath);
        imageElement.style.display = 'block';
        
        // Handle image load errors
        imageElement.onerror = () => {
            console.error('Failed to load logo:', resolvedPath);
            imageElement.src = '/mygrow/assets/img/default.jpg';
        };
    } else {
        console.warn('No logo path found for growId:', growId);
        if (imageElement) {
            imageElement.src = '/mygrow/assets/img/default.jpg';
            imageElement.style.display = 'block';
        }
    }

    console.log('Attaching change listener to startDateInput');
    startDateInput.addEventListener('change', (e) => {
        console.log('Start date changed:', e.target.value);
        taskButton.style.display = 'block';
        taskButton.textContent = 'Save and Continue';
        console.log('Task button style after change:', taskButton.style.display);
    });

    taskButton.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('taskButton clicked, growId:', growId);
        if (!startDateInput.value) {
            window.showToast('Please select a start date.', 'error');
            return;
        }
        // Parse date in local timezone to avoid offset issues
        const [year, month, day] = startDateInput.value.split('-');
        let startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        startDate.setHours(0, 0, 0, 0);
        if (isNaN(startDate.getTime())) {
            window.showToast('Invalid start date.', 'error');
            return;
        }
        const plantHeight = localStorage.getItem('plantHeight') || '3-4 feet';
        const plantGrow = JSON.parse(localStorage.getItem(`plantGrow_${growId}`)) || { floweringWeeks: 8 };
        const floweringWeeks = plantGrow.floweringWeeks || 8;
        const isAuto = localStorage.getItem(`isAuto_${growId}`) === 'true';
        const seedToHarvestDays = isAuto ? parseInt(localStorage.getItem(`seedToHarvest_${growId}`)) || null : null;
        const plantSize = localStorage.getItem(`plantSize_${growId}`) || 'medium';
        console.log('Plant size for vegWeeks calculation:', plantSize);
        const vegWeeks = isAuto ? 4 : 
                        plantSize === 'small' ? 4 : 
                        plantSize === 'medium' ? 6 : 
                        plantSize === 'large' ? 8 : 6; // default to 6 for medium
        console.log('Saving schedule with:', { plantHeight, floweringWeeks, vegWeeks, isAuto, seedToHarvestDays, growId });
        localStorage.setItem('startDate', startDate.toISOString());
        localStorage.setItem(`floweringWeeks_${growId}`, floweringWeeks);
        localStorage.setItem(`vegWeeks_${growId}`, vegWeeks);
        localStorage.setItem(`id_${growId}`, growId);
        const saveResult = await saveScheduleToIndexedDB(growId, startDate, isAuto, seedToHarvestDays, vegWeeks);
        if (saveResult) {
            console.log('Navigating to information-overload-1.html with growId:', growId);
            window.location.href = '../information-overload/information-overload-1.html';
        } else {
            window.showToast('Failed to save schedule.', 'error');
        }
    });
});
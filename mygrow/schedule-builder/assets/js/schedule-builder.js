import { saveScheduleToIndexedDB } from './schedule-generator.js';

document.addEventListener('DOMContentLoaded', async () => {
    let growId = localStorage.getItem('currentGrowId');
    if (!growId) {
        growId = `grow_${Date.now()}`;
        localStorage.setItem('currentGrowId', growId);
        localStorage.setItem(`id_${growId}`, growId);
    }
    // Ensure growId is stored for reference
    localStorage.setItem(`id_${growId}`, growId);

    const startDateInput = document.getElementById('start');
    const taskButton = document.getElementById('taskButton');
    const imageElement = document.getElementById('image');

    if (!startDateInput || !taskButton) {
        window.showToast('Page elements missing.', 'error');
        return;
    }

    // Fix logo path handling
    const logoPath = localStorage.getItem(`plantLogo_${growId}`) || localStorage.getItem('plantLogo');
    if (imageElement && logoPath) {
        // Extract just the filename from the path
        const filename = logoPath.split('/').pop();
        const resolvedPath = `../assets/img/${filename}`;
        
        imageElement.src = resolvedPath;
        imageElement.alt = localStorage.getItem(`growName_${growId}`) || 'Grow Image';
        imageElement.style.display = 'block';
        
        // Handle image load errors
        imageElement.onerror = () => {
            imageElement.src = '../assets/img/pot-image.png';
        };
    } else {
        if (imageElement) {
            imageElement.src = '../assets/img/pot-image.png';
            imageElement.style.display = 'block';
        }
    }

    startDateInput.addEventListener('change', (e) => {
        taskButton.style.display = 'block';
        taskButton.textContent = 'Save and Continue';
    });

    taskButton.addEventListener('click', async (e) => {
        e.preventDefault();
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
        const vegWeeks = isAuto ? 4 : 
                        plantSize === 'small' ? 4 : 
                        plantSize === 'medium' ? 6 : 
                        plantSize === 'large' ? 8 : 6; // default to 6 for medium
        localStorage.setItem('startDate', startDate.toISOString());
        localStorage.setItem(`floweringWeeks_${growId}`, floweringWeeks);
        localStorage.setItem(`vegWeeks_${growId}`, vegWeeks);
        localStorage.setItem(`id_${growId}`, growId);
        const saveResult = await saveScheduleToIndexedDB(growId, startDate, isAuto, seedToHarvestDays, vegWeeks);
        if (saveResult) {
            window.location.href = '../schedule-viewer/schedule-viewer.html';
        } else {
            window.showToast('Failed to save schedule.', 'error');
        }
    });
});
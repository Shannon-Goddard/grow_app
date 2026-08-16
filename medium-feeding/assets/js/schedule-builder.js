import { saveScheduleToIndexedDB } from './schedule-generator.js';

document.addEventListener('DOMContentLoaded', async () => {
    const growId = localStorage.getItem('currentGrowId');
    if (!growId) {
        window.showToast('No grow found. Please start from step 1.');
        return;
    }

    const startDateInput = document.getElementById('start');
    const taskButton = document.getElementById('taskButton');
    const imageElement = document.getElementById('image');

    if (!startDateInput || !taskButton) {
        window.showToast('Page elements missing.', 'error');
        return;
    }

    const logoPath = localStorage.getItem(`plantLogo_${growId}`) || localStorage.getItem('plantLogo');
    if (imageElement && logoPath) {
        const filename = logoPath.split('/').pop();
        imageElement.src = `assets/strain-img/${filename}`;
        imageElement.alt = localStorage.getItem(`growName_${growId}`) || 'Grow Image';
        imageElement.style.display = 'block';
        imageElement.onerror = () => { imageElement.src = 'assets/strain-img/default.jpg'; };
    } else if (imageElement) {
        imageElement.src = 'assets/strain-img/default.jpg';
        imageElement.style.display = 'block';
    }

    startDateInput.addEventListener('change', () => {
        taskButton.style.display = 'block';
        taskButton.textContent = 'Save and Continue';
    });

    taskButton.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!startDateInput.value) {
            window.showToast('Please select a start date.', 'error');
            return;
        }
        const [year, month, day] = startDateInput.value.split('-');
        let startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        startDate.setHours(0, 0, 0, 0);
        if (isNaN(startDate.getTime())) {
            window.showToast('Invalid start date.', 'error');
            return;
        }
        const plantGrow = JSON.parse(localStorage.getItem(`plantGrow_${growId}`)) || { floweringWeeks: 8 };
        const floweringWeeks = plantGrow.floweringWeeks || 8;
        const isAuto = localStorage.getItem(`isAuto_${growId}`) === 'true';
        const seedToHarvestDays = isAuto ? parseInt(localStorage.getItem(`seedToHarvest_${growId}`)) || null : null;
        const plantSize = localStorage.getItem(`plantSize_${growId}`) || 'medium';
        const vegWeeks = isAuto ? 4 : plantSize === 'small' ? 4 : plantSize === 'large' ? 8 : 6;
        localStorage.setItem('startDate', startDate.toISOString());
        localStorage.setItem(`floweringWeeks_${growId}`, floweringWeeks);
        localStorage.setItem(`vegWeeks_${growId}`, vegWeeks);
        localStorage.setItem(`id_${growId}`, growId);
        const saveResult = await saveScheduleToIndexedDB(growId, startDate, isAuto, seedToHarvestDays, vegWeeks);
        if (saveResult) {
            window.dispatchEvent(new CustomEvent('scheduleReady'));
        } else {
            window.showToast('Failed to save schedule. Check console for details.');
            console.error('saveScheduleToIndexedDB returned false', { growId, startDate, isAuto, seedToHarvestDays, vegWeeks });
        }
    });
});

// plant-size-filter.js
import { adjustDates } from './date-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    const currentGrowId = localStorage.getItem('currentGrowId');
    console.log('Current grow ID:', currentGrowId);

    if (currentGrowId) {
        const growPlantSize = localStorage.getItem(`plantSize_${currentGrowId}`);
        if (growPlantSize) {
            localStorage.setItem('plantSize', growPlantSize);
            console.log(`Using grow-specific plant size: ${growPlantSize}`);
        }
        const growSeedToHarvest = localStorage.getItem(`seedToHarvest_${currentGrowId}`);
        if (growSeedToHarvest) {
            localStorage.setItem('seedToHarvest', growSeedToHarvest);
            console.log(`Using grow-specific seed-to-harvest days: ${growSeedToHarvest}`);
        } else {
            localStorage.removeItem('seedToHarvest');
        }
    }

    console.log('plantSize:', localStorage.getItem('plantSize'));
    console.log('plantGrow:', localStorage.getItem('plantGrow'));
    console.log('seedToHarvest:', localStorage.getItem('seedToHarvest'));

    const plantHeight = localStorage.getItem('plantHeight') || '3-4 feet';
    const smallPlantBtn = document.getElementById('smallPlantBtn');
    const mediumPlantBtn = document.getElementById('mediumPlantBtn');
    const largePlantBtn = document.getElementById('largePlantBtn');
    const autoPlantBtn = document.getElementById('autoPlantBtn');
    const autoOptions = document.getElementById('autoOptions');
    const seedToHarvest = document.getElementById('seedToHarvest');
    const filterInfo = document.getElementById('filterInfo');

    if (!smallPlantBtn || !mediumPlantBtn || !largePlantBtn) {
        console.error('Plant size buttons not found');
        return;
    }

    const storedSize = localStorage.getItem('plantSize') || 'medium';
    console.log('Stored plant size:', storedSize);

    function setActiveButton(size) {
        smallPlantBtn.classList.remove('active');
        mediumPlantBtn.classList.remove('active');
        largePlantBtn.classList.remove('active');
        autoPlantBtn.classList.remove('active');

        if (size === 'small') smallPlantBtn.classList.add('active');
        else if (size === 'medium') mediumPlantBtn.classList.add('active');
        else if (size === 'large') largePlantBtn.classList.add('active');
        else if (size === 'auto') autoPlantBtn.classList.add('active');

        if (size === 'auto' && autoOptions) autoOptions.style.display = 'inline-block';
        else if (autoOptions) autoOptions.style.display = 'none';

        console.log('Active button set to:', size);
    }

    function updateFilterInfo(size) {
        if (filterInfo) filterInfo.textContent = '';
    }

function filterTableRows(size) {
    console.log('Filtering table rows for size:', size);
    const table = document.getElementById('table1');
    if (!table) {
        console.error('Table not found');
        return;
    }
    const allRows = table.querySelectorAll('tbody tr');
    allRows.forEach(row => row.style.display = '');
    const rows = table.querySelectorAll('tbody tr');
    console.log('Found', rows.length, 'rows to filter');
    if (rows.length === 0) {
        console.warn('No rows to filter');
        return;
    }
    let hiddenCount = 0;
    const visibleWeeks = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 4) return;
        const stage = cells[2].textContent.trim().toLowerCase();
        const weekText = cells[3].textContent.trim();
        const weekMatch = weekText.match(/(\d+)/);
        const week = weekMatch ? parseInt(weekMatch[1]) : 0;
        if (stage === 'vegetative') {
            let shouldHide = false;
            if (size === 'small' && week > 4) {
                shouldHide = true;
            } else if (size === 'medium' && week > 6) {
                shouldHide = true;
            } else if (size === 'large' && week > 8) {
                shouldHide = true;
            }
            if (shouldHide) {
                row.style.display = 'none';
                hiddenCount++;
            } else {
                row.style.display = '';
                if (!visibleWeeks.includes(week)) visibleWeeks.push(week);
            }
        }
    });
    console.log(`Filtered table: ${hiddenCount} rows hidden, visible vegetative weeks:`, visibleWeeks.sort((a, b) => a - b));
    updateFilterInfo(size);
}

    function limitRowsBySeedToHarvest(days) {
        const table = document.getElementById('table1');
        if (!table) return;
        const rows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
        if (rows.length <= days) return;
        for (let i = days; i < rows.length; i++) {
            rows[i].style.display = 'none';
        }
        console.log(`Limited to ${days} days from seed to harvest`);
    }

    smallPlantBtn.addEventListener('click', () => {
        console.log('Small plant button clicked');
        localStorage.setItem('plantSize', 'small');
        if (currentGrowId) localStorage.setItem(`plantSize_${currentGrowId}`, 'small');
        setActiveButton('small');
        filterTableRows('small');
        adjustDates('small');
    });

    mediumPlantBtn.addEventListener('click', () => {
        console.log('Medium plant button clicked');
        localStorage.setItem('plantSize', 'medium');
        if (currentGrowId) localStorage.setItem(`plantSize_${currentGrowId}`, 'medium');
        setActiveButton('medium');
        filterTableRows('medium');
        adjustDates('medium');
    });

    largePlantBtn.addEventListener('click', () => {
        console.log('Large plant button clicked');
        localStorage.setItem('plantSize', 'large');
        if (currentGrowId) localStorage.setItem(`plantSize_${currentGrowId}`, 'large');
        setActiveButton('large');
        // For large plant, don't filter vegetative weeks
        const table = document.getElementById('table1');
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 4) {
                    const stage = cells[2].textContent.trim().toLowerCase();
                    if (stage === 'vegetative') {
                        row.style.display = '';
                    }
                }
            });
        }
        adjustDates('large');
    });

    if (autoPlantBtn) {
        autoPlantBtn.addEventListener('click', () => {
            console.log('Auto plant button clicked');
            localStorage.setItem('plantSize', 'auto');
            if (currentGrowId) localStorage.setItem(`plantSize_${currentGrowId}`, 'auto');
            setActiveButton('auto');
            filterTableRows('small');
            if (seedToHarvest) {
                const days = parseInt(seedToHarvest.value);
                if (!isNaN(days) && days > 0) limitRowsBySeedToHarvest(days);
            }
            adjustDates('auto');
        });
    }

    if (seedToHarvest) {
        seedToHarvest.addEventListener('input', () => {
            if (localStorage.getItem('plantSize') === 'auto') {
                filterTableRows('small');
                const days = parseInt(seedToHarvest.value);
                if (!isNaN(days) && days > 0) {
                    limitRowsBySeedToHarvest(days);
                    adjustDates('auto');
                }
            }
        });

        seedToHarvest.value = localStorage.getItem('seedToHarvest') || '';
        seedToHarvest.addEventListener('change', () => {
            const days = seedToHarvest.value;
            localStorage.setItem('seedToHarvest', days);
            if (currentGrowId) localStorage.setItem(`seedToHarvest_${currentGrowId}`, days);
        });
    }

    const seedToHarvestValue = localStorage.getItem('seedToHarvest');
    if (seedToHarvestValue && autoPlantBtn && seedToHarvest) {
        console.log('Auto plant detected with seed to harvest days:', seedToHarvestValue);
        seedToHarvest.value = seedToHarvestValue;
        localStorage.setItem('plantSize', 'auto');
        setActiveButton('auto');
        setTimeout(() => autoPlantBtn.click(), 500);
    } else {
        setActiveButton(storedSize);
        updateFilterInfo(storedSize);
        // Force a clean filter application
        setTimeout(() => {
            console.log('Applying stored size filter:', storedSize);
            filterTableRows(storedSize);
            adjustDates(storedSize);
        }, 1000);
    }

    document.dispatchEvent(new CustomEvent('tableRendered'));
});
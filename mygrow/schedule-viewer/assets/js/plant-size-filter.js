// plant-size-filter.js
import { adjustDates } from './date-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    const currentGrowId = localStorage.getItem('currentGrowId');

    if (currentGrowId) {
        const growPlantSize = localStorage.getItem(`plantSize_${currentGrowId}`);
        if (growPlantSize) {
            localStorage.setItem('plantSize', growPlantSize);
        }
        const growSeedToHarvest = localStorage.getItem(`seedToHarvest_${currentGrowId}`);
        if (growSeedToHarvest) {
            localStorage.setItem('seedToHarvest', growSeedToHarvest);
        } else {
            localStorage.removeItem('seedToHarvest');
        }
    }



    const plantHeight = localStorage.getItem('plantHeight') || '3-4 feet';
    const smallPlantBtn = document.getElementById('smallPlantBtn');
    const mediumPlantBtn = document.getElementById('mediumPlantBtn');
    const largePlantBtn = document.getElementById('largePlantBtn');
    const autoPlantBtn = document.getElementById('autoPlantBtn');
    const autoOptions = document.getElementById('autoOptions');
    const seedToHarvest = document.getElementById('seedToHarvest');
    const filterInfo = document.getElementById('filterInfo');

    if (!smallPlantBtn || !mediumPlantBtn || !largePlantBtn) {
        return;
    }

    const storedSize = localStorage.getItem('plantSize') || 'medium';

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


    }

    function updateFilterInfo(size) {
        if (filterInfo) filterInfo.textContent = '';
    }

function filterTableRows(size) {
    const table = document.getElementById('table1');
    if (!table) {
        return;
    }
    const allRows = table.querySelectorAll('tbody tr');
    allRows.forEach(row => row.style.display = '');
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length === 0) {
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

    }

    smallPlantBtn.addEventListener('click', () => {
        localStorage.setItem('plantSize', 'small');
        if (currentGrowId) localStorage.setItem(`plantSize_${currentGrowId}`, 'small');
        setActiveButton('small');
        filterTableRows('small');
        adjustDates('small');
    });

    mediumPlantBtn.addEventListener('click', () => {
        localStorage.setItem('plantSize', 'medium');
        if (currentGrowId) localStorage.setItem(`plantSize_${currentGrowId}`, 'medium');
        setActiveButton('medium');
        filterTableRows('medium');
        adjustDates('medium');
    });

    largePlantBtn.addEventListener('click', () => {
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
        seedToHarvest.value = seedToHarvestValue;
        localStorage.setItem('plantSize', 'auto');
        setActiveButton('auto');
        setTimeout(() => autoPlantBtn.click(), 500);
    } else {
        setActiveButton(storedSize);
        updateFilterInfo(storedSize);
        // Force a clean filter application
        setTimeout(() => {
            filterTableRows(storedSize);
            adjustDates(storedSize);
        }, 1000);
    }

    document.dispatchEvent(new CustomEvent('tableRendered'));
});
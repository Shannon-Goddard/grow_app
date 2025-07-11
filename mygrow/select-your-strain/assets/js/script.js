// script.js
import { IndexedDBService } from '../../../common/js/indexedDBService.js';

document.addEventListener('DOMContentLoaded', () => {
    const input = $('#myInput');
    const listContainer = $('#strainListContainer');
    const strainList = $('#strainList');
    const addStrainBtn = $('#addStrainBtn');

    const data = window.data; // Use global data from data.js
    if (!data) {
        console.error('Strain data not found. Ensure data.js is loaded and defines "data".');
        return;
    }

    // Create a lookup for faster filtering
    const strainLookup = data.map((strain, idx) => ({
        strain: strain.strain.toLowerCase(),
        originalIndex: idx
    }));

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function populateList(strains, originalIndices) {
        strainList.empty();
        const filter = input.val().toLowerCase();
        strains.forEach((strain, displayIndex) => {
            const originalIndex = originalIndices[displayIndex];
            const strainName = strain.strain;
            const lowerStrainName = strainName.toLowerCase();
            const matchIndex = lowerStrainName.indexOf(filter);
            let displayName = strainName;

            if (filter && matchIndex !== -1) {
                const before = strainName.substring(0, matchIndex);
                const match = strainName.substring(matchIndex, matchIndex + filter.length);
                const after = strainName.substring(matchIndex + filter.length);
                displayName = `${before}<span class="highlight">${match}</span>${after}`;
            }

            const li = $(`
                <li>
                    <img loading="lazy" class="lozad" data-src="${strain.logo.replace('../mygrow/', '')}" width="40" height="40" alt="${strain.strain}">
                    <span>${displayName}</span>
                </li>
            `);
            li.data('original-index', originalIndex);
            li.on('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click event fired on li:', strain.strain, 'at position:', e.clientY);
                const idx = li.data('original-index');
                displayStrainDetails(idx);
                input.val(strain.strain);
                listContainer.hide();
            });
            li.find('img').on('error', function () {
                $(this).attr('src', '/mygrow/assets/img/default.jpg');
            });
            strainList.append(li);
        });

        if (strains.length > 0) {
            listContainer.show();
            addStrainBtn.hide();
        } else {
            listContainer.hide();
            addStrainBtn.show();
        }

        if (window.lozad) {
            const observer = lozad();
            observer.observe();
        }
    }

    // Initial population (hidden by default)
    const initialIndices = data.map((_, idx) => idx).slice(0, 50);
    populateList(data.slice(0, 50), initialIndices);
    listContainer.hide();

    // Debounced filter
    input.on('input', debounce(() => {
        const filter = input.val().toLowerCase();
        const filteredIndices = strainLookup.reduce((acc, item, idx) => {
            if (item.strain.includes(filter)) acc.push(item.originalIndex);
            return acc;
        }, []).slice(0, 50);
        const filteredData = filteredIndices.map(idx => data[idx]);
        populateList(filteredData, filteredIndices);
        if (filter && filteredData.length > 0) {
            listContainer.show();
        } else {
            listContainer.hide();
        }
    }, 300));

    input.on('focus', () => {
        const infoElements = [
            '#image', '#strain', '#Grow', '#Sativa', '#Indica', '#Hybrid',
            '#THC', '#CBD', '#weeks', '#info', '#more', '#taskButton'
        ];
        infoElements.forEach(selector => {
            const $el = $(selector);
            if ($el.length) {
                if ($el.is('img')) {
                    $el.attr('src', '').hide();
                } else if ($el.is('a')) {
                    $el.attr('href', '').hide();
                } else {
                    $el.text('').hide();
                }
            }
        });

        const filter = input.val().toLowerCase();
        const filteredIndices = strainLookup.reduce((acc, item, idx) => {
            if (item.strain.includes(filter)) acc.push(item.originalIndex);
            return acc;
        }, []).slice(0, 50);
        const filteredData = filteredIndices.map(idx => data[idx]);
        populateList(filteredData, filteredIndices);
        if (filteredData.length > 0) {
            listContainer.show();
        } else {
            listContainer.hide();
        }
    });

    $(document).on('click', (e) => {
        console.log('Document click event fired at target:', e.target);
        if (!input.is(e.target) && !listContainer.is(e.target) && !listContainer.has(e.target).length) {
            listContainer.hide();
        }
    });

    let selectedIndex = -1;
    input.on('keydown', (e) => {
        const items = strainList.find('li');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelection(items);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            items.eq(selectedIndex).trigger('click');
        }
    });

    function updateSelection(items) {
        items.each((idx, item) => {
            $(item).toggleClass('selected', idx === selectedIndex);
        });
        if (selectedIndex >= 0) {
            const selectedItem = items.eq(selectedIndex)[0];
            selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    input.on('input', () => {
        selectedIndex = -1;
        const filter = input.val().toLowerCase();
        const filteredIndices = strainLookup.reduce((acc, item, idx) => {
            if (item.strain.includes(filter)) acc.push(item.originalIndex);
            return acc;
        }, []).slice(0, 50);
        const filteredData = filteredIndices.map(idx => data[idx]);
        populateList(filteredData, filteredIndices);
        if (filter && filteredData.length > 0) {
            listContainer.show();
        } else {
            listContainer.hide();
        }
    });

    // Add Strain Modal Functionality
    $('#addStrainBtn').on('click', function () {
        $('#addStrainModal').css('display', 'block');
    });

    $('.close').on('click', function () {
        $('#addStrainModal').css('display', 'none');
    });

    $(window).on('click', function (event) {
        if (event.target === document.getElementById('addStrainModal')) {
            $('#addStrainModal').css('display', 'none');
        }
    });

    $('input[name="strainType"]').on('change', function () {
        if ($(this).val() === 'pheno') {
            $('#phenoFields').show();
            $('#autoFields').hide();
            $('#customGrowWeeks').prop('required', true);
            $('#customSeedToHarvest').prop('required', false);
        } else {
            $('#phenoFields').hide();
            $('#autoFields').show();
            $('#customGrowWeeks').prop('required', false);
            $('#customSeedToHarvest').prop('required', true);
        }
    });

    $('#addStrainForm').on('submit', async function (e) {
        e.preventDefault();

        const growName = $('#growName').val().trim();
        if (!growName) {
            if (typeof showToast === 'function') {
                showToast('Please enter a grow name');
                $('#growName').addClass('is-invalid').focus();
            } else {
                console.error('Please enter a grow name');
            }
            return;
        }

        const strainName = $('#customStrainName').val().trim();
        const isAuto = $('input[name="strainType"]:checked').val() === 'auto';

        // Always generate a new unique ID for each grow
        const growId = `grow_${Date.now()}`;
        console.log('Creating new grow with ID:', growId);
        
        // Store all grow data in localStorage
        localStorage.setItem('currentGrowId', growId);
        localStorage.setItem(`id_${growId}`, growId);
        localStorage.setItem('currentGrowName', growName);
        localStorage.setItem(`growName_${growId}`, growName);
        localStorage.setItem(`plantStrain_${growId}`, strainName);
        // Randomly select from default-1.png to default-15.png
        const randomLogoNum = Math.floor(Math.random() * 15) + 1;
        const randomLogo = `/mygrow/assets/img/default-${randomLogoNum}.png`;
        localStorage.setItem(`plantLogo_${growId}`, randomLogo);
        localStorage.setItem('plantHeight', '3-4 feet');

if (isAuto) {
    localStorage.setItem(`plantGrow_${growId}`, JSON.stringify({ floweringWeeks: 8 }));
    const seedToHarvestDays = $('#customSeedToHarvest').val();
    localStorage.setItem(`seedToHarvest_${growId}`, seedToHarvestDays);
    localStorage.setItem(`plantSize_${growId}`, 'auto');
    localStorage.setItem('plantSize', 'auto');
} else {
    const growWeeks = parseInt($('#customGrowWeeks').val(), 10);
    localStorage.setItem(`plantGrow_${growId}`, JSON.stringify({ floweringWeeks: growWeeks }));
    localStorage.setItem(`plantSize_${growId}`, 'large');
    localStorage.setItem('plantSize', 'large');
}

try {
    const db = await IndexedDBService.initDB();
    const tx = db.transaction(['tables'], 'readwrite');
    const store = tx.objectStore('tables');
    await store.put({ 
        type: 'grow', 
        growName: growName, 
        strain: strainName, 
        logo: randomLogo 
    }, growId); // Key is growId
    console.log(`Saved grow to tables: ${growId}`);
    
    const growWeeks = isAuto ? 8 : parseInt($('#customGrowWeeks').val(), 10);
    const schedule = [];
    for (let week = 1; week <= growWeeks; week++) {
        for (let day = 1; day <= 7; day++) {
            schedule.push({
                stage: week <= 2 ? 'seedling' : week <= 6 ? 'vegetative' : 'flowering',
                week: `week ${week}`,
                day: day,
                nutrients: {}
            });
        }
    }
    await store.put({ 
        type: 'schedule', 
        id: `${growId}_schedule`, 
        growId, 
        schedule 
    }, `${growId}_schedule`); // Key is ${growId}_schedule
    console.log(`Created initial schedule for growId: ${growId} with ${growWeeks} weeks`);
    
    await tx.done;
} catch (error) {
    console.error('Error saving grow to IndexedDB:', error);
}

        console.log('Custom strain added:', { growId, growName, strainName, logoPath: '/mygrow/assets/img/default.jpg' });
        $('#addStrainModal').css('display', 'none');
        window.location.href = '../nutrients-mix-and-match/nutrients-mix-and-match-1.html';
    });

    function displayStrainDetails(index) {
        if (!data || index < 0 || index >= data.length) {
            console.error('Invalid strain index or data not loaded:', index, data);
            return;
        }

        try {
            const strain = data[index];
            console.log('Strain data:', strain);
            
            // Make sure we have a valid logo path
            let logoPath = strain.logo;
            if (logoPath && logoPath.includes('../mygrow/')) {
                logoPath = logoPath.replace('../mygrow/', '');
            }
            
            console.log('Using logo path:', logoPath);

            const updates = {
                '#image': { attr: { src: logoPath } },
                '#strain': { text: strain.strain || '' },
                '#Grow': { text: strain.Grow ? `Grow: ${strain.Grow}` : '' },
                '#Sativa': { text: strain.Sativa || '' },
                '#Indica': { text: strain.Indica || '' },
                '#Hybrid': { text: strain.Hybrid || '' },
                '#THC': { text: strain.THC ? `THC: ${strain.THC}%` : 'THC: 0%' },
                '#CBD': { text: strain.CBD ? `CBD: ${strain.CBD}%` : 'CBD: 0%' },
                '#weeks': { text: strain.Grow ? `${strain.Grow} weeks of flowering` : '' },
                '#info': { text: strain.info || '' },
                '#more': { text: strain.more || '' },
                '#taskButton': { attr: { href: `../nutrients-mix-and-match/nutrients-mix-and-match-1.html` } }
            };

            $.each(updates, (selector, update) => {
                const $el = $(selector);
                if (!$el.length) {
                    console.warn(`Element ${selector} not found in DOM`);
                } else {
                    if (update.text !== undefined) $el.text(update.text);
                    if (update.attr) $el.attr(update.attr);
                    $el.show();
                }
            });

            $('#myInput').val('');
            $('#strainListContainer').hide();

            if (window.lozad) {
                const observer = lozad();
                observer.observe();
            }
        } catch (error) {
            console.error('Error in displayStrainDetails:', error);
        }
    }

    $('#taskButton').on('click', async function (e) {
        e.preventDefault();
        const growName = $('#growName').val().trim();
        const strain = $('#strain').text().trim();
        // Get the actual image source from the displayed image
        const displayedImgSrc = $('#image').attr('src');
        // Use the displayed image if available, otherwise construct a path based on strain name
        const logoSrc = displayedImgSrc && displayedImgSrc !== '' ? 
            `/mygrow/${displayedImgSrc}` : 
            `/mygrow/assets/img/${strain.replace(/\s+/g, '_')}.jpg`;
        
        const growContent = $('#Grow').text().replace('Grow: ', '').trim();
        const strainData = data.find(s => s.strain === strain);
        const isAuto = strainData && !strainData.Grow;

        if (!growName) {
            showToast('Please enter a grow name');
            $('#growName').addClass('is-invalid').focus();
            return;
        }
        if (!strain) {
            showToast('Please select a strain');
            $('#myInput').addClass('is-invalid').focus();
            return;
        }

        const growId = `grow_${Date.now()}`;
        localStorage.setItem('currentGrowId', growId);
        localStorage.setItem(`id_${growId}`, growId);
        localStorage.setItem('currentGrowName', growName);
        localStorage.setItem(`growName_${growId}`, growName);
        localStorage.setItem('plantStrain', strain);
        localStorage.setItem(`plantStrain_${growId}`, strain);
        localStorage.setItem(`plantLogo_${growId}`, logoSrc);
        localStorage.setItem(`plantGrow_${growId}`, JSON.stringify({ floweringWeeks: parseInt(growContent || '8', 10) }));
        localStorage.setItem('plantHeight', '3-4 feet');
        localStorage.setItem(`plantSize_${growId}`, isAuto ? 'auto' : 'large');
        localStorage.setItem('plantSize', isAuto ? 'auto' : 'large');
        localStorage.setItem(`seedToHarvest_${growId}`, isAuto ? '60' : '');

try {
    const db = await IndexedDBService.initDB();
    const tx = db.transaction(['tables'], 'readwrite');
    const store = tx.objectStore('tables');
    await store.put({ 
        type: 'grow', 
        growName: growName, 
        strain: strain, 
        logo: logoSrc 
    }, growId); // Key is growId
    console.log(`Saved grow metadata to tables: ${growId}`);
    
    const growWeeks = parseInt(growContent || '8', 10);
    const schedule = [];
    for (let week = 1; week <= growWeeks; week++) {
        for (let day = 1; day <= 7; day++) {
            schedule.push({
                stage: week <= 2 ? 'seedling' : week <= 6 ? 'vegetative' : 'flowering',
                week: `week ${week}`,
                day: day,
                nutrients: {}
            });
        }
    }
    await store.put({ 
        type: 'schedule', 
        id: `${growId}_schedule`, 
        growId, 
        schedule 
    }, `${growId}_schedule`); // Key is ${growId}_schedule
    console.log(`Created initial schedule for growId: ${growId} with ${growWeeks} weeks`);
    
    await tx.done;
} catch (error) {
    console.error('Error saving grow to IndexedDB:', error);
}

        console.log('Predefined strain selected:', { growId, growName, strain, logoPath: logoSrc, isAuto });
        window.location.href = '../nutrients-mix-and-match/nutrients-mix-and-match-1.html';
    });
});
// search-strains.js
document.addEventListener('DOMContentLoaded', () => {
    // Function to display strain details when a strain is clicked
    function displayStrainDetails(index) {
        if (!data || index < 0 || index >= data.length) {
            return;
        }

        try {
            const strain = data[index];
            
            // Make sure we have a valid logo path
            let logoPath = strain.logo;
            if (logoPath && logoPath.includes('../../../mygrow/')) {
                logoPath = logoPath.replace('../../../mygrow/', '');
            }

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
                '#more': { attr: { href: strain.more || '#' } },
                '#taskButton': { attr: { href: `../nutrient-selector/nutrient-selector.html` } }
            };

            $.each(updates, (selector, update) => {
                const $el = $(selector);
                if ($el.length) {
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
            console.error('Error displaying strain details:', error);
        }
    }
    const input = $('#myInput');
    const listContainer = $('#strainListContainer');
    const strainList = $('#strainList');
    const addStrainBtn = $('#addStrainBtn');

    const data = window.data; // Use global data from data.js
    if (!data) {
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
                    <img loading="lazy" class="lozad" data-src="${strain.logo.replace('../../../mygrow/', '')}" width="40" height="40" alt="${strain.strain}">
                    <span>${displayName}</span>
                </li>
            `);
            li.data('original-index', originalIndex);
            li.on('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
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
        
        // Reset selection when filtering
        selectedIndex = -1;
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

    // This is redundant with the debounced input handler above, so we can remove it
    // The debounced handler already handles filtering and updating the list

});
const filterBtns = document.querySelectorAll('.filter-btn');
const shipBtns = document.querySelectorAll('.ship-btn');
const partnerRows = document.querySelectorAll('.partner-row');

function applyPartnerFilters() {
  const typeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  const shipFilter = document.querySelector('.ship-btn.active').dataset.ship;
  partnerRows.forEach(row => {
    const type = row.dataset.type;
    const shipping = row.dataset.shipping;
    const typeMatch = typeFilter === 'all' || type === typeFilter || type === 'app';
    const shipMatch = shipFilter === 'all' || type === 'app' || shipping === 'both' || shipping === shipFilter;
    row.style.display = (typeMatch && shipMatch) ? '' : 'none';
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyPartnerFilters();
  });
});

shipBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    shipBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyPartnerFilters();
  });
});
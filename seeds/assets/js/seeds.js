// Filter logic
const filterBtns = document.querySelectorAll('.filter-btn');
const shipBtns = document.querySelectorAll('.ship-btn');
const partnerRows = document.querySelectorAll('.partner-row');

function applyFilters() {
  const type = document.querySelector('.filter-btn.active').dataset.filter;
  const ship = document.querySelector('.ship-btn.active').dataset.ship;
  partnerRows.forEach(row => {
    const tm = type === 'all' || row.dataset.type === type;
    const sm = ship === 'all' || row.dataset.shipping === 'both' || row.dataset.shipping === ship;
    row.style.display = (tm && sm) ? '' : 'none';
  });
}

filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}));

shipBtns.forEach(btn => btn.addEventListener('click', () => {
  shipBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}));

// Typer
(function () {
  var slogans = [
    "",
    "",
    "America runs on growin'",
    "Betcha can't grow just one.",
    "Like a good neighbor, seeds are here.",
    "It keeps growing, and growing, and growing...",
    "Grow it your way.",
    "Just grow it.",
    "A seed is forever.",
    "Got seeds?",
    "Where's the grow?",
    "Not dishwasher safe.",
    "Do not eat.",
    "Keep out of reach of children.",
    "Do not microwave.",
    "15 minutes could save you 15% or more on seeds.",
    "When it absolutely, positively has to grow there overnight.",
    "There are some things money can't buy. For everything else, there's seeds."
  ];
  var el = document.getElementById('typer-text');
  if (!el) return;
  // shuffle
  for (var k = slogans.length - 1; k > 0; k--) {
    var r = Math.floor(Math.random() * (k + 1));
    var t = slogans[k]; slogans[k] = slogans[r]; slogans[r] = t;
  }
  var i = 0, j = 0, deleting = false;
  function type() {
    var s = slogans[i];
    if (!deleting) {
      el.textContent = s.substring(0, ++j);
      if (j === s.length) { deleting = true; setTimeout(type, 2200); return; }
      setTimeout(type, 55 + Math.random() * 35);
    } else {
      el.textContent = s.substring(0, --j);
      if (j === 0) { deleting = false; i = (i + 1) % slogans.length; setTimeout(type, 400); return; }
      setTimeout(type, 28);
    }
  }
  type();
})();

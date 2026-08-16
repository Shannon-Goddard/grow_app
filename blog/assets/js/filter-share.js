document.addEventListener('DOMContentLoaded', () => {

  // Breeder filter (replaces Isotope)
  const filterBtns = document.querySelectorAll('.filter-button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const filterClass = filter === '*' ? null : filter.replace('.', '');

      document.querySelectorAll('.breeder-row').forEach(row => {
        row.style.display = (!filterClass || row.classList.contains(filterClass)) ? '' : 'none';
      });

      document.querySelectorAll('.seed-bank-btn').forEach(btn => {
        const filters = (btn.dataset.filters || '').split(' ');
        btn.style.display = (!filterClass || filters.includes(filterClass)) ? 'inline-block' : 'none';
      });
    });
  });

  // Sup scroll to references
  document.querySelectorAll('sup').forEach(sup => {
    sup.addEventListener('click', () => {
      const num = (sup.textContent.match(/\d+/) || [])[0];
      if (!num) return;
      const ref = document.querySelector(`.reference-item:nth-child(${num})`);
      if (ref) ref.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Reading progress bar
  const bar = document.getElementById('reading-progress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (scrolled / height * 100) + '%';
    });
  }

});

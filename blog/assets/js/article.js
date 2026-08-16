document.addEventListener('DOMContentLoaded', () => {

  // Intersection Observer fade-in (replaces AOS)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); observer.unobserve(e.target); } });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

  // Immediately animate anything already in view on load
  requestAnimationFrame(() => {
    document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('aos-animate');
    });
  });

  // Category filter (replaces Isotope)
  const filterBtns = document.querySelectorAll('.filter-button');
  const gridItems = document.querySelectorAll('.blog-grid .grid-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const filterClass = filter === '*' ? null : filter.replace('.', '');
      gridItems.forEach(item => {
        item.style.display = (!filterClass || item.classList.contains(filterClass)) ? '' : 'none';
      });
    });
  });

  // Back-to-top
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => { btt.classList.toggle('active', window.scrollY > 300); });
    btt.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // Sticky CTA
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.sticky-cta').forEach(el => el.classList.toggle('show', window.scrollY > 300));
  });

});

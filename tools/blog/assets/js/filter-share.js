document.addEventListener('DOMContentLoaded', () => {
  // Initialize Isotope for breeder rows
  const $breedersList = $('.breeders-list').isotope({
    itemSelector: '.breeder-row',
    layoutMode: 'fitRows',
    transitionDuration: '0.4s'
  });

  // Handle filter clicks
  $('.filter-button').on('click', function() {
    $('.filter-button').removeClass('active');
    $(this).addClass('active');
    const filterValue = $(this).attr('data-filter');
    $breedersList.isotope({ filter: filterValue });

    // Update seed-bank-btn visibility
    const selectedFilter = filterValue === '*' ? 'all' : filterValue.replace('.worldwide', 'worldwide');
    $('.seed-bank-btn').each(function() {
      const buttonFilters = $(this).data('filters').split(' ');
      const isVisible = selectedFilter === 'all' || buttonFilters.includes(selectedFilter);
      $(this).css('display', isVisible ? 'inline-block' : 'none');
    });

    // Re-layout after transition
    setTimeout(() => {
      $breedersList.isotope('layout');
    }, 400);
  });

  // Reference link scrolling
  document.querySelectorAll('sup').forEach(sup => {
    sup.addEventListener('click', () => {
      const refNum = sup.textContent.match(/\d+/)[0];
      document.querySelector(`.reference-item:nth-child(${refNum})`).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Progress Bar
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('reading-progress').style.width = scrolled + '%';
  });
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  
    // Sticky CTA logic
    $(window).scroll(function() {
      if ($(this).scrollTop() > 300) {
        $('.sticky-cta').addClass('show');
      } else {
        $('.sticky-cta').removeClass('show');
      }
    });
  });

  // Blog Landing Page Scripts
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (already in article.js, but ensuring it’s called for blog.html)
  AOS.init({
    duration: 800,
    once: true,
    offset: 100
  });

  // Initialize Isotope for blog grid
  const $grid = $('.blog-grid').isotope({
    itemSelector: '.grid-item',
    layoutMode: 'fitRows',
    layoutMode: window.innerWidth <= 768 ? 'vertical' : 'fitRows'
  });

  // Category filter buttons
  $('.filter-button').on('click', function() {
    $('.filter-button').removeClass('active');
    $(this).addClass('active');
    const filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
  });

  // Re-layout Isotope on window resize
  window.addEventListener('resize', function() {
    $grid.isotope({
      layoutMode: window.innerWidth <= 768 ? 'vertical' : 'fitRows'
    });
  });
});
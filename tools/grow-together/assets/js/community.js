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
/**
 * Efficient script and style loading
 */
(function() {
  // Load CSS asynchronously
  function loadCSS(href, media = 'all') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = function() {
      this.media = media;
    };
    document.head.appendChild(link);
  }

  // Load JS asynchronously
  function loadJS(src, async = true, defer = true) {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    document.body.appendChild(script);
    return script;
  }

  // Load critical resources first
  document.addEventListener('DOMContentLoaded', function() {
    // Load non-critical CSS asynchronously
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css');
    loadCSS('https://cdn.jsdelivr.net/npm/swiper@11.1.15/swiper-bundle.min.css');
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/glightbox/3.2.0/css/glightbox.min.css');
    
    // Load non-critical JS with defer
    loadJS('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js');
    loadJS('https://cdnjs.cloudflare.com/ajax/libs/glightbox/3.2.0/js/glightbox.min.js');
    
    // Load fonts asynchronously
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css?family=Open+Sans:400,600,700|Raleway:400,600,700|Poppins:400,500,600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  });
})();
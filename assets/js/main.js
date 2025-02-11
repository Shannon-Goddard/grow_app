(function() {
  "use strict";

  

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    // Check if el exists and is a valid selector
    if (!el || typeof el !== 'string') {
      return null;
    }
    
    el = el.trim();
    
    // Return null if selector is empty after trimming
    if (!el) {
      return null;
    }
  
    try {
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    } catch (e) {
      console.warn('Invalid selector:', el);
      return null;
    }
  }
  

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    // Check if this.hash exists and is not empty
    if (this.hash && this.hash.trim()) {
      e.preventDefault();
  
      let navbar = select('#navbar');
      if (navbar && navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        let navbarToggle = select('.mobile-nav-toggle');
        if (navbarToggle) {
          navbarToggle.classList.toggle('bi-list');
          navbarToggle.classList.toggle('bi-x');
        }
      }
      scrollto(this.hash);
    }
  }, true);
  

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Clients Slider
   */
  new Swiper('.clients-slider', {
    speed: 3500,
    loop: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false
    },

    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider SHOP
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

  document.addEventListener("DOMContentLoaded", function() {
    // Hide the loader and show content when everything is ready
    window.addEventListener('load', function() {
        document.documentElement.classList.add('loaded');
        document.getElementById('loader-wrapper').style.display = 'none';
    });


//////////////indexedDB//////////////////////////////////
//////////////indexedDB//////////////////////////////////
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    if (!el || typeof el !== 'string') {
      return null;
    }
    
    el = el.trim();
    if (!el) {
      return null;
    }
  
    try {
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    } catch (e) {
      console.warn('Invalid selector:', el);
      return null;
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Table Management and Initialization
   */
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Only handle the current table based on the page
      const currentTable = document.querySelector('[id^="table"]');
      if (currentTable && window.tableStorage) {
        const tableId = currentTable.id;
        console.log(`Found table element: ${tableId}`);

        // Set up mutation observer for the current table
        const observer = new MutationObserver((mutations) => {
          if (window.tableStorage) {
            // Create a deep clone of the table for saving
            const tableClone = currentTable.cloneNode(true);
            const hiddenRows = tableClone.querySelectorAll('tr[style*="display: none"]');
            
            // Show all rows in the clone (invisible to user)
            hiddenRows.forEach(row => {
              row.style.display = '';
            });

            // Save complete table content from clone
            window.tableStorage.saveTableData(tableId, tableClone.innerHTML)
              .then(() => console.log(`Changes saved for ${tableId}`))
              .catch(error => console.error(`Error saving changes for ${tableId}:`, error));
          }
        });

        // Start observing the table
        observer.observe(currentTable, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true
        });
        
        console.log(`Set up observer for ${tableId}`);
      }

    } catch (error) {
      console.error('Error initializing table:', error);
    }
  });

  /**
   * Handle page visibility changes
   */
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.tableStorage) {
      window.tableStorage.restoreTableData()
        .then(() => console.log('Table data refreshed on visibility change'))
        .catch(error => console.error('Error refreshing table data:', error));
    }
  });

  /**
   * Handle page unload
   */
  window.addEventListener('beforeunload', async () => {
    const currentTable = document.querySelector('[id^="table"]');
    if (currentTable && window.tableStorage) {
      try {
        // Create a clone for saving complete data
        const tableClone = currentTable.cloneNode(true);
        const hiddenRows = tableClone.querySelectorAll('tr[style*="display: none"]');
        hiddenRows.forEach(row => {
          row.style.display = '';
        });

        await window.tableStorage.saveTableData(
          currentTable.id, 
          tableClone.innerHTML
        );
      } catch (error) {
        console.error(`Error saving ${currentTable.id} before unload:`, error);
      }
    }
  });

  /**
   * Handle network status changes
   */
  window.addEventListener('online', () => {
    if (window.tableStorage) {
      console.log('Network connection restored');
      window.tableStorage.restoreTableData()
        .then(() => console.log('Table data synchronized after coming online'))
        .catch(error => console.error('Error synchronizing table data:', error));
    }
  });

})();


//////////////////////////////in code///////////
});

})()
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
    window.addEventListener('load', function() {
        document.documentElement.classList.add('loaded');
        const loader = document.getElementById('loader-wrapper');
        if (loader) {
            loader.style.display = 'none';
        }
    });
});

})()

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification: 'error', 'success', or 'info'
 */
function showToast(message, type = 'error') {
  // Create container if it doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  // Remove toast after animation
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Make showToast available globally
window.showToast = showToast;

/**
 * Global page transition loader
 */
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href]');
  if (link && !link.href.includes('#') && !link.target && !link.hasAttribute('download')) {
    // Don't show loading for buttons that have validation (they handle their own loading)
    if (link.id === 'taskButton') {
      return; // Let the page-specific JS handle loading animation
    }
    // Show loading overlay before navigation
    document.body.classList.add('page-transitioning');
  }
});

// Clear loading animation on page load (handles back button)
window.addEventListener('pageshow', function() {
  document.body.classList.remove('page-transitioning');
});

// Clear loading animation if page load takes too long
window.addEventListener('load', function() {
  document.body.classList.remove('page-transitioning');
});

/**
 * Age Gate Verification
 */
document.addEventListener('DOMContentLoaded', function() {
  const ageGate = document.getElementById('ageGate');
  const enterBtn = document.getElementById('enterBtn');
  const exitBtn = document.getElementById('exitBtn');
  
  if (!ageGate || !enterBtn || !exitBtn) return;
  
  // Check if user already verified (24 hour session)
  const verified = sessionStorage.getItem('ageVerified');
  if (verified) {
    ageGate.classList.add('hidden');
    return;
  }
  
  enterBtn.addEventListener('click', function() {
    sessionStorage.setItem('ageVerified', 'true');
    ageGate.classList.add('hidden');
  });
  
  exitBtn.addEventListener('click', function() {
    window.location.href = 'https://www.google.com';
  });
});
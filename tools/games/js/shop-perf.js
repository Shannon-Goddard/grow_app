/**
 * Performance optimizations for shop.html
 */
document.addEventListener('DOMContentLoaded', function() {
  // 1. Immediately load above-fold images
  const loadAboveFoldImages = () => {
    // Get all images in the first 3 portfolio items (above the fold)
    const aboveFoldImages = document.querySelectorAll('.portfolio-item:nth-child(-n+3) img[data-src]');
    aboveFoldImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  };

  // 2. Lazy load remaining images
  const lazyLoadImages = () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });
      
      // Only observe images that aren't above the fold
      document.querySelectorAll('.portfolio-item:nth-child(n+4) img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  };

  // 3. Progressive loading of portfolio items
  const loadPortfolioItems = () => {
    const items = document.querySelectorAll('.portfolio-item');
    const itemObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          itemObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    items.forEach(item => {
      itemObserver.observe(item);
    });
  };

  // 4. Optimize Isotope initialization
  const initIsotope = () => {
    const portfolioContainer = document.querySelector('.portfolio-container');
    if (portfolioContainer && window.Isotope) {
      // Mark container as loaded to trigger fade-in
      portfolioContainer.classList.add('loaded');
      
      // Initialize isotope with a slight delay
      setTimeout(() => {
        const iso = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item',
          layoutMode: 'fitRows'
        });
        
        // Handle filter clicks
        document.querySelectorAll('#portfolio-flters li').forEach(filter => {
          filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('#portfolio-flters li').forEach(f => {
              f.classList.remove('filter-active');
            });
            
            this.classList.add('filter-active');
            
            iso.arrange({
              filter: this.getAttribute('data-filter')
            });
            
            if (typeof AOS !== 'undefined') {
              AOS.refresh();
            }
          });
        });
      }, 100);
    }
  };

  // 5. Amazon Associate disclaimer - moved to after image loading
  const initTypedText = () => {
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");
    
    if (!typedTextSpan || !cursorSpan) return;

    const textArray = ["No animals were harmed.", "Do not use as ear plugs.", "Just grow it.", "Do not eat.", "Not dishwasher safe.", "15 minutes could save you 15% or more on grow supplies.", "Do not use while driving.", "Grow what you can't.", "Well done is better than well said.", "Grow moments. Grow life.", "Betcha' can't grow just one.", "Grow happiness.", "Save money. Grow better.", "Bringing inspiration and innovation to every grower."];
    const typingDelay = 100;
    const erasingDelay = 100;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
      }
    }

    // Start typing effect with a longer delay to ensure images load first
    if(textArray.length) setTimeout(type, newTextDelay + 1000);
  };

  // Execute optimizations in order of importance
  loadAboveFoldImages(); // Load above-fold images immediately
  loadPortfolioItems();
  
  // Defer non-critical initializations
  setTimeout(() => {
    lazyLoadImages(); // Lazy load remaining images
    initIsotope();
  }, 100);
  
  // Further delay the disclaimer to ensure it doesn't block image loading
  setTimeout(() => {
    initTypedText();
  }, 1000);
});

// Fix HTML issues - duplicate class attributes
window.addEventListener('load', function() {
  document.querySelectorAll('img[class="img-fluid"][class="img-fluid"]').forEach(img => {
    img.setAttribute('class', 'img-fluid');
  });
});
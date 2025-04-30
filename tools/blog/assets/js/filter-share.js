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

});

  
  
// Share Functions (Local Scope)
const shareOnX = function() {
  try {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Just found the ultimate guide for new cannabis growers! 🌱 Check out the Top 20 Breeders for 2025 and start growing dank buds. #GrowApp #Cannabis2025");
    
    if (/Android/i.test(navigator.userAgent)) {
      const intentUrl = `intent://twitter.com/intent/tweet?text=${text}&url=${url}#Intent;package=com.twitter.android;scheme=https;end`;
      window.location.href = intentUrl;
      setTimeout(() => {
        window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      }, 1000);
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = `twitter://post?message=${text}%20${url}`;
      setTimeout(() => {
        window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      }, 1000);
    } else {
      window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  } catch (err) {
    console.error('shareOnX error:', err);
    alert('Failed to share on X. Please try copying the link manually.');
  }
};

const shareOnInstagram = function() {
  try {
    const url = encodeURIComponent(window.location.href);
    
    if (/Android/i.test(navigator.userAgent)) {
      copyLink();
      const intentUrl = `intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end`;
      window.location.href = intentUrl;
      setTimeout(() => {
        alert("Instagram opened. Paste the copied link in a post or story!");
      }, 1000);
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      copyLink();
      window.location.href = `instagram://app`;
      setTimeout(() => {
        alert("Instagram opened. Paste the copied link in a post or story!");
      }, 1000);
    } else {
      copyLink();
      alert("Instagram sharing is not directly supported via web. Paste the copied link in your Instagram post or story!");
    }
  } catch (err) {
    console.error('shareOnInstagram error:', err);
    alert('Failed to share on Instagram. Please try copying the link manually.');
  }
};

const shareOnFacebook = function() {
  try {
    const url = encodeURIComponent(window.location.href);
    
    if (/Android/i.test(navigator.userAgent)) {
      const intentUrl = `intent://sharer/sharer.php?u=${url}#Intent;package=com.facebook.katana;scheme=https;end`;
      window.location.href = intentUrl;
      setTimeout(() => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      }, 1000);
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = `fb://publish/?text=${url}`;
      setTimeout(() => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      }, 1000);
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
  } catch (err) {
    console.error('shareOnFacebook error:', err);
    alert('Failed to share on Facebook. Please try copying the link manually.');
  }
};

const shareOnReddit = function() {
  try {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent("Check out the 10 Best Cannabis Seeds for 2025! #GrowApp");
    
    if (/Android/i.test(navigator.userAgent)) {
      const intentUrl = `intent://reddit.com/submit?url=${url}&title=${title}#Intent;package=com.reddit.frontpage;scheme=https;end`;
      window.location.href = intentUrl;
      setTimeout(() => {
        window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank');
      }, 1000);
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = `reddit://submit?url=${url}&title=${title}`;
      setTimeout(() => {
        window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank');
      }, 1000);
    } else {
      window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank');
    }
  } catch (err) {
    console.error('shareOnReddit error:', err);
    alert('Failed to share on Reddit. Please try copying the link manually.');
  }
};

const copyLink = function() {
  try {
    const url = window.location.href;
    const input = document.getElementById('copyLinkInput');
    
    input.value = url;
    input.focus();
    input.select();
    
    const successful = document.execCommand('copy');
    if (successful) {
      alert("Link copied to clipboard! Share it with your friends.");
    } else {
      throw new Error('Copy command failed');
    }
  } catch (err) {
    console.error('copyLink error:', err);
    prompt("Copy the link below:", window.location.href);
  }
};

// Initialize Isotope, bind events, and other functionality
document.addEventListener('DOMContentLoaded', () => {
  try {
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

      const selectedFilter = filterValue === '*' ? 'all' : filterValue.replace('.worldwide', 'worldwide');
      $('.seed-bank-btn').each(function() {
        const buttonFilters = $(this).data('filters').split(' ');
        const isVisible = selectedFilter === 'all' || buttonFilters.includes(selectedFilter);
        $(this).css('display', isVisible ? 'inline-block' : 'none');
      });

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

    // Bind Share Button Events
    document.querySelectorAll('.share-x').forEach(btn => btn.addEventListener('click', shareOnX));
    document.querySelectorAll('.share-instagram').forEach(btn => btn.addEventListener('click', shareOnInstagram));
    document.querySelectorAll('.share-facebook').forEach(btn => btn.addEventListener('click', shareOnFacebook));
    document.querySelectorAll('.share-reddit').forEach(btn => btn.addEventListener('click', shareOnReddit));
    document.querySelectorAll('.share-copy').forEach(btn => btn.addEventListener('click', copyLink));
    document.querySelectorAll('.manual-share-link').forEach(link => link.addEventListener('click', copyLink));
  } catch (err) {
    console.error('DOMContentLoaded error:', err);
  }
});


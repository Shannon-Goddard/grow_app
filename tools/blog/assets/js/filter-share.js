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

// Share Functions (Global)
window.shareOnX = function() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("Just found the ultimate guide for new cannabis growers! 🌱 Check out the Top 20 Breeders for 2025 and start growing dank buds. #GrowApp #Cannabis2025");
  window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
};

window.shareOnInstagram = function() {
  const url = encodeURIComponent(window.location.href);
  alert("Instagram sharing is not directly supported via web. Copy the link and share it in your Instagram post or story!");
  window.copyLink();
};

window.shareOnFacebook = function() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

window.shareOnReddit = function() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent("Check out the 10 Best Cannabis Seeds for 2025! #GrowApp");
  window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank');
};

window.copyLink = function() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert("Link copied to clipboard! Share it with your friends.");
  }).catch(err => {
    console.error('Failed to copy: ', err);
    alert("Failed to copy the link. Please copy it manually.");
  });
};

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
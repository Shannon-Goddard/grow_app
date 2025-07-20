document.addEventListener('DOMContentLoaded', function () {
  const banner = document.getElementById('growtogether-banner');
  const closeButton = document.querySelector('.banner-close');

  // Check if banner was previously dismissed
  if (localStorage.getItem('growtogetherBannerDismissed') === 'true') {
    banner.classList.add('hidden');
  }

  // Close banner on click
  if (closeButton) {
    closeButton.addEventListener('click', function () {
      banner.classList.add('hidden');
      localStorage.setItem('growtogetherBannerDismissed', 'true');
    });
  }
});
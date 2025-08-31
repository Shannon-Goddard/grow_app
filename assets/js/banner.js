document.addEventListener('DOMContentLoaded', function () {
  const banner = document.getElementById('growtogether-banner');
  const closeButton = document.querySelector('.banner-close');
  // Updated key to force banner to reappear
  const bannerVersion = 'growtogetherBannerDismissed_v2'; // Changed variable name

  // Check if banner was previously dismissed with the new version key
  if (localStorage.getItem(bannerVersion) === 'true') {
    banner.classList.add('hidden');
  }

  // Close banner and store new dismissal state
  if (closeButton) {
    closeButton.addEventListener('click', function () {
      banner.classList.add('hidden');
      localStorage.setItem(bannerVersion, 'true');
    });
  }
});
// Fix for video play button issue with navigation
document.addEventListener('DOMContentLoaded', function() {
  // Add event listener to video elements
  const videos = document.querySelectorAll('video');
  
  videos.forEach(video => {
    // Handle desktop clicks
    video.addEventListener('click', function(e) {
      // Prevent the page transition animation
      e.stopPropagation();
      document.body.classList.remove('page-transitioning');
    });
    
    // Handle mobile touch events
    video.addEventListener('touchstart', function(e) {
      e.stopPropagation();
      document.body.classList.remove('page-transitioning');
    });
    
    // Also handle play button click/touch
    video.addEventListener('play', function() {
      document.body.classList.remove('page-transitioning');
    });
    
    // Handle video end event
    video.addEventListener('ended', function() {
      document.body.classList.remove('page-transitioning');
    });
    
    // Handle pause event
    video.addEventListener('pause', function() {
      document.body.classList.remove('page-transitioning');
    });
  });
  
  // Fix for breadcrumb navigation
  const breadcrumbLinks = document.querySelectorAll('#breadcrumbs a');
  breadcrumbLinks.forEach(link => {
    // Desktop clicks
    link.addEventListener('click', function(e) {
      e.stopPropagation();
      // Force remove transitioning class
      document.body.classList.remove('page-transitioning');
    });
    
    // Mobile touches
    link.addEventListener('touchend', function(e) {
      e.stopPropagation();
      // Remove transitioning class immediately
      document.body.classList.remove('page-transitioning');
    });
  });
  
  // Global fix for all links in the plant-doctor pages
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      setTimeout(function() {
        document.body.classList.remove('page-transitioning');
      }, 50);
    }
  });
});
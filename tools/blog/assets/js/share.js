// share.js

// Share on X
window.shareOnX = function() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("Just found the ultimate guide for new cannabis growers! 🌱 Check out the Top 20 Breeders for 2025 and start growing dank buds. #GrowApp #Cannabis2025");
  window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
};

// Share on Instagram
window.shareOnInstagram = function() {
  const url = encodeURIComponent(window.location.href);
  alert("Instagram sharing is not directly supported via web. Copy the link and share it in your Instagram post or story!");
  window.copyLink();
};

// Share on Facebook
window.shareOnFacebook = function() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

// Share on Reddit
window.shareOnReddit = function() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent("Check out the 10 Best Cannabis Seeds for 2025! #GrowApp");
  window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank');
};

// Copy Link to Clipboard
window.copyLink = function() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert("Link copied to clipboard! Share it with your friends.");
  }).catch(err => {
    console.error('Failed to copy: ', err);
    alert("Failed to copy the link. Please copy it manually.");
  });
};
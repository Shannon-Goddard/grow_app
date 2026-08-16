let isSmokeMessageActive = false;
window.isSmokeMessageActive = isSmokeMessageActive;

function showSmokeMessage(message) {
  if (!window.gameInitialized || isSmokeMessageActive) {
    // Remove: console.log("showSmokeMessage skipped:", { gameInitialized: window.gameInitialized, isSmokeMessageActive });
    return;
  }
  isSmokeMessageActive = true;
  window.isSmokeMessageActive = isSmokeMessageActive;
  // Remove: console.log("showSmokeMessage called with message:", message);

  const smokeMessage = document.getElementById('smoke-message');
  const smokeMessageContent = document.getElementById('smoke-message-content');

  if (!smokeMessage || !smokeMessageContent) {
    console.error("Smoke message elements not found:", { smokeMessage, smokeMessageContent });
    isSmokeMessageActive = false;
    window.isSmokeMessageActive = isSmokeMessageActive;
    return;
  }

  // Reset state
  smokeMessage.style.display = 'none';
  smokeMessage.classList.remove('smoke-message-active');
  smokeMessageContent.textContent = message;

  // Force reflow to restart animation
  void smokeMessage.offsetWidth;

  // Show and animate
  smokeMessage.style.display = 'flex';
  // Remove: console.log("After setting display to flex, classList:", smokeMessage.classList);
  requestAnimationFrame(() => {
    smokeMessage.classList.add('smoke-message-active');
    // Remove: console.log("After adding smoke-message-active, classList:", smokeMessage.classList);
  });

  // Hide after animation
  setTimeout(() => {
    smokeMessage.style.display = 'none';
    smokeMessage.classList.remove('smoke-message-active');
    isSmokeMessageActive = false;
    window.isSmokeMessageActive = isSmokeMessageActive;
    // Remove: console.log("Smoke message hidden after 3 seconds");
  }, 3000);
}
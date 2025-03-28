if (typeof window.callJesseUsed === 'undefined') {
  window.callJesseUsed = false;
}

document.getElementById('call-jesse').addEventListener('click', () => {
  try {
    if (window.callJesseUsed) return;
    window.callJesseUsed = true;
    document.getElementById('call-jesse').disabled = true;
    if (window.isSoundOn && !window.lifelineSoundPlaying) {
      window.callJesseSound.play();
      window.lifelineSoundPlaying = true;
    }
    const buttons = document.querySelectorAll('.options button');
    const wrongOptions = Array.from(buttons).filter((btn, i) => String.fromCharCode(65 + i) !== window.currentQuestion.correct);
    wrongOptions.slice(0, 2).forEach(btn => {
      btn.disabled = true;
    });
    showSmokeMessage("Two wrong answers have been removed!");
  } catch (error) {
    console.error("Error in Call Jesse lifeline:", error);
  }
});
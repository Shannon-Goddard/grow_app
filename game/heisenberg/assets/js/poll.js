if (typeof window.pollCartelUsed === 'undefined') {
  window.pollCartelUsed = false;
}

document.getElementById('poll-cartel').addEventListener('click', () => {
  try {
    if (window.pollCartelUsed) return;
    window.pollCartelUsed = true;
    document.getElementById('poll-cartel').disabled = true;
    if (window.isSoundOn && !window.lifelineSoundPlaying) {
      window.pollCartelSound.play();
      window.lifelineSoundPlaying = true;
    }
    const correctIndex = window.currentQuestion.correct.charCodeAt(0) - 65;
    const votes = [20, 20, 20, 20];
    votes[correctIndex] += 20;
    const remaining = 100 - votes.reduce((a, b) => a + b, 0);
    votes[Math.floor(Math.random() * 4)] += remaining;

    const pollResults = document.getElementById('poll-results');
    pollResults.style.display = 'block';
    ['a', 'b', 'c', 'd'].forEach((letter, i) => {
      const bar = document.getElementById(`poll-${letter}`);
      bar.style.width = `${votes[i]}%`;
      bar.textContent = `${votes[i]}%`;
    });

    setTimeout(() => {
      pollResults.style.display = 'none';
    }, 3000);

    showSmokeMessage("The votes are in!");
  } catch (error) {
    console.error("Error in Poll Cartel lifeline:", error);
  }
});
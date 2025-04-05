document.addEventListener('DOMContentLoaded', () => {
  // Game state
  let currentStrain, strainName, puzzle, points = 0, spinsLeft = 5, solveAttempts = 3, isMuted = true;

  // DOM elements
  const puzzleBoard = document.getElementById('puzzle-board');
  const cluesDiv = document.getElementById('clues');
  const wheelContainer = document.getElementById('wheel-container');
  const wheel = document.getElementById('wheel');
  const wheelCenter = document.getElementById('wheel-center');
  const spinBtn = document.getElementById('spin-btn');
  const guessSection = document.getElementById('guess-section');
  const guessInput = document.getElementById('letter-guess');
  const guessBtn = document.getElementById('guess-btn');
  const solveSection = document.getElementById('solve-section');
  const solveInput = document.getElementById('solve-guess');
  const solveBtn = document.getElementById('solve-btn');
  const hintBtn = document.getElementById('hint-btn');
  const scoreDisplay = document.getElementById('score');
  const highScoreDisplay = document.getElementById('high-score');
  const spinsLeftDisplay = document.getElementById('spins-left');
  const solveAttemptsDisplay = document.getElementById('solve-attempts');
  const leaderboardList = document.getElementById('leaderboard-list');
  const logoReveal = document.getElementById('logo-reveal');
  const wheelSpinSound = document.getElementById('wheel-spin-sound');
  const dingSound = document.getElementById('ding-sound');
  const wrongGuessSound = document.getElementById('wrong-guess-sound');
  const gameOverSound = document.getElementById('game-over-sound');
  const puzzleSolvedSound = document.getElementById('puzzle-solved-sound');
  const hintSound = document.getElementById('hint-sound');
  const volumeBtn = document.getElementById('volume-btn');
  const volumeIcon = document.getElementById('volume-icon');
  const notification = document.getElementById('notification');
  const closeNotificationBtn = document.getElementById('close-notification');

  // Wheel outcomes
  const wheelOutcomes = [
    '2500', '1000', '600', '700', '600', '650', '500', '700',
    '600', '550', '500', '600', '650', '700', '800', '900',
    'Free Play', '700', 'Lose A Turn', '800', '600', '650', '500', '900', 'Bankrupt'
  ];

  // Audio setup
  function initializeAudio() {
    const audioElements = [wheelSpinSound, dingSound, wrongGuessSound, gameOverSound, puzzleSolvedSound, hintSound];
    audioElements.forEach(audio => audio && (audio.volume = isMuted ? 0 : 1));
  }

  function toggleSound() {
    isMuted = !isMuted;
    const audioElements = [wheelSpinSound, dingSound, wrongGuessSound, gameOverSound, puzzleSolvedSound, hintSound];
    audioElements.forEach(audio => audio && (audio.volume = isMuted ? 0 : 1));
    volumeIcon.textContent = isMuted ? '🔇' : '🔊';
    volumeBtn.textContent = `${volumeIcon.textContent} Sound ${isMuted ? 'Off' : 'On'}`;
    volumeBtn.className = `btn mb-3 ${isMuted ? 'muted' : 'unmuted'}`;
  }

  function playSound(audio) {
    if (!isMuted && audio) {
      audio.currentTime = 0;
      audio.play().catch(error => console.log('Audio error:', audio.src, error));
    }
  }

  // Notifications
  function showNotification(message) {
    notification.querySelector('p').textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 3000);
  }

  // Game logic
  function initializeGameState() {
    if (!data || data.length === 0) {
      console.error('No strain data available');
      showNotification('No strain data available. Game cannot start.');
      return false;
    }
    currentStrain = data[Math.floor(Math.random() * data.length)];
    if (!currentStrain || typeof currentStrain.strain !== 'string') {
      console.error('Invalid strain data:', currentStrain);
      showNotification('Error: Invalid strain data. Retrying...');
      setTimeout(startGame, 1000);
      return false;
    }
    strainName = currentStrain.strain;
    puzzle = strainName.split('').map(char => (char === ' ' ? ' ' : '_'));
    points = Math.max(0, points);
    spinsLeft = 5;
    solveAttempts = 3;
    return true;
  }

  function updateLeaderboard() {
    let scores = JSON.parse(localStorage.getItem('wheelScores') || '[]');
    scores.push(points);
    scores = scores.sort((a, b) => b - a).slice(0, 5);
    localStorage.setItem('wheelScores', JSON.stringify(scores));
    highScoreDisplay.textContent = `High Score: ${scores[0] || 0}`;
    leaderboardList.innerHTML = scores.map((score, i) => `<li>${i + 1}. ${score}</li>`).join('');
  }

  function updateCounters() {
    spinsLeftDisplay.textContent = `Spins Left: ${spinsLeft}`;
    solveAttemptsDisplay.textContent = `Solve Attempts: ${solveAttempts}`;
    if (spinsLeft <= 0) {
      spinBtn.classList.add('hidden');
      solveSection.classList.remove('hidden');
      solveBtn.disabled = false;
    }
  }

  function createPuzzleBoard() {
    puzzleBoard.innerHTML = ''; // Clear previous puzzle
    strainName.split('').forEach((char, i) => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.index = i;
      const tileInner = document.createElement('div');
      tileInner.className = 'tile-inner';
      const tileFront = document.createElement('div');
      tileFront.className = 'tile-front';
      tileFront.textContent = char === ' ' ? '' : '_';
      const tileBack = document.createElement('div');
      tileBack.className = 'tile-back';
      tileBack.textContent = char === ' ' ? '' : char;
      tileInner.appendChild(tileFront);
      tileInner.appendChild(tileBack);
      tile.appendChild(tileInner);
      if (char === ' ') tile.style.visibility = 'hidden';
      puzzleBoard.appendChild(tile);
    });
  }

  function updateClues() {
    const clueText = (currentStrain.more || currentStrain.info || 'No description.')
      .split('.')[0]
      .replace(new RegExp(strainName, 'gi'), '[Strain Name]');
    cluesDiv.textContent = `Clues: ${currentStrain.THC}% THC, Flowers in ${currentStrain.Grow} weeks, ${clueText}.`;
  }

  function updateScore() {
    scoreDisplay.textContent = `Score: ${points}`;
  }

  function resetUI() {
    wheelContainer.classList.remove('hidden');
    wheel.classList.remove('hidden');
    wheelCenter.classList.remove('hidden');
    wheel.style.transform = 'rotate(0deg)';
    wheelCenter.textContent = 'Spin Me!';
    wheelCenter.className = 'd-flex justify-content-center align-items-center';
    spinBtn.classList.remove('hidden');
    spinBtn.disabled = false;
    guessSection.classList.add('hidden');
    guessBtn.disabled = true;
    solveSection.classList.remove('hidden');
    solveBtn.disabled = false;
    hintBtn.classList.remove('hidden');
    hintBtn.disabled = false;
    logoReveal.classList.add('hidden');
    logoReveal.innerHTML = ''; // Clear logoReveal
    notification.classList.add('hidden');
    updateCounters();
  }

  function startGame() {
    if (!initializeGameState()) return;

    // Clear and recreate puzzle board
    puzzleBoard.innerHTML = '';
    createPuzzleBoard();
    updateClues();
    updateScore();
    updateLeaderboard();
    resetUI();
    solveInput.value = '';

    // Ensure button states are reset
    spinBtn.disabled = false;
    guessBtn.disabled = true;
    solveBtn.disabled = false;
    hintBtn.disabled = false;

    console.log('New game started with strain:', strainName); // Debug log
  }

  function spinWheel() {
    if (spinsLeft <= 0) {
      showNotification('No spins left! Solve the puzzle.');
      spinBtn.classList.add('hidden');
      solveSection.classList.remove('hidden');
      solveBtn.disabled = false;
      return;
    }
    spinBtn.disabled = true;
    playSound(wheelSpinSound);
    const spins = 5 + Math.random() * 5;
    wheel.style.transform = `rotate(${spins * 360}deg)`;

    const result = wheelOutcomes[Math.floor(Math.random() * wheelOutcomes.length)];
    spinsLeft--;
    updateCounters();

    if (result === 'Bankrupt') {
      points = 0;
      updateScore();
    } else if (result === 'Lose A Turn') {
      // No action needed
    } else {
      guessBtn.disabled = false;
    }
    solveBtn.disabled = false;

    setTimeout(() => {
      wheelCenter.textContent = result;
      wheelCenter.className = 'd-flex justify-content-center align-items-center';
      if (result === 'Bankrupt') wheelCenter.classList.add('bankrupt');
      else if (result === 'Lose A Turn') wheelCenter.classList.add('lose-a-turn');
      else if (result === 'Free Play') wheelCenter.classList.add('free-play');
      else wheelCenter.classList.add('points');

      if (result === 'Bankrupt') {
        spinBtn.disabled = false;
        if (spinsLeft > 0) spinBtn.classList.remove('hidden');
        guessSection.classList.add('hidden');
      } else if (result === 'Lose A Turn') {
        spinBtn.disabled = false;
        if (spinsLeft > 0) spinBtn.classList.remove('hidden');
        guessSection.classList.add('hidden');
      } else {
        spinBtn.classList.add('hidden');
        guessSection.classList.remove('hidden');
        guessInput.focus();
      }
      solveSection.classList.remove('hidden');
      updateCounters();
    }, 5000);
  }

  function guessLetter() {
    const guess = guessInput.value.toUpperCase().trim();
    if (!guess || guess.length !== 1) return;
    const spinResult = parseInt(wheelCenter.textContent) || 0;
    const isFreePlay = wheelCenter.textContent === 'Free Play';

    if ((spinResult > 0 || isFreePlay) && strainName.toUpperCase().includes(guess)) {
      let count = 0;
      strainName.split('').forEach((char, i) => {
        if (char.toUpperCase() === guess) {
          puzzle[i] = char;
          const tile = puzzleBoard.querySelector(`.tile[data-index="${i}"]`);
          tile.classList.add('flipped');
          count++;
          playSound(dingSound);
        }
      });
      points += isFreePlay ? 500 * count : spinResult * count;
      updateScore();
    } else {
      playSound(wrongGuessSound);
      points = Math.max(0, points - 50);
      updateScore();
    }
    guessInput.value = '';
    if (spinsLeft > 0) {
      spinBtn.classList.remove('hidden');
      spinBtn.disabled = false;
    }
    guessSection.classList.add('hidden');
    guessBtn.disabled = true;
    updateCounters();
  }

  function revealHint() {
    const unguessed = strainName.split('').reduce((acc, char, i) => {
      if (char !== ' ' && puzzle[i] === '_') acc.push(i);
      return acc;
    }, []);
    if (unguessed.length === 0) return;
    const index = unguessed[Math.floor(Math.random() * unguessed.length)];
    puzzle[index] = strainName[index];
    const tile = puzzleBoard.querySelector(`.tile[data-index="${index}"]`);
    tile.classList.add('flipped');
    playSound(hintSound);
    points = Math.max(0, points - 50);
    updateScore();
  }

  function checkSolve() {
    const guess = solveInput.value.trim();
    if (solveAttempts <= 0) return;

    if (guess.toLowerCase() === strainName.toLowerCase()) {
      puzzle = strainName.split('');
      puzzleBoard.querySelectorAll('.tile').forEach((tile, i) => {
        if (strainName[i] !== ' ') tile.classList.add('flipped');
      });
      points += currentStrain.THC * 10;
      updateScore();
      wheelContainer.classList.add('hidden');
      spinBtn.classList.add('hidden');
      guessSection.classList.add('hidden');
      solveSection.classList.add('hidden');
      hintBtn.classList.add('hidden');
      const logoSrc = currentStrain.logo || 'assets/img/default-win-logo.png';
      const img = new Image();
      img.src = logoSrc;
      img.alt = strainName;
      img.onload = () => {
        console.log('Win logo loaded:', logoSrc);
        logoReveal.innerHTML = '';
        logoReveal.appendChild(img);
        logoReveal.classList.remove('hidden');
        playSound(puzzleSolvedSound);
        if (typeof confetti === 'function') {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
          console.warn('Confetti library not loaded');
        }
        updateLeaderboard();
        setTimeout(() => {
          logoReveal.classList.add('hidden');
          logoReveal.innerHTML = ''; // Clear for next game
          startGame();
        }, 4000);
      };
      img.onerror = () => {
        console.error('Win logo failed to load, using default:', logoSrc);
        logoReveal.innerHTML = `<img src="assets/img/default-win-logo.png" alt="${strainName}">`;
        logoReveal.classList.remove('hidden');
        playSound(puzzleSolvedSound);
        if (typeof confetti === 'function') {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
          console.warn('Confetti library not loaded');
        }
        updateLeaderboard();
        setTimeout(() => {
          logoReveal.classList.add('hidden');
          logoReveal.innerHTML = ''; // Clear for next game
          startGame();
        }, 4000);
      };
    } else {
      solveAttempts--;
      points -= 50;
      updateScore();
      updateCounters();
      playSound(wrongGuessSound);
      solveInput.value = '';
      if (solveAttempts <= 0 || (spinsLeft <= 0 && solveAttempts <= 0)) {
        puzzle = strainName.split('');
        puzzleBoard.querySelectorAll('.tile').forEach((tile, i) => {
          if (strainName[i] !== ' ') tile.classList.add('flipped');
        });
        wheelContainer.classList.add('hidden');
        spinBtn.classList.add('hidden');
        guessSection.classList.add('hidden');
        solveSection.classList.add('hidden');
        hintBtn.classList.add('hidden');
        const logoSrc = currentStrain.logo || 'assets/img/default-lose-logo.png';
        const img = new Image();
        img.src = logoSrc;
        img.alt = strainName;
        img.className = 'sad';
        img.onload = () => {
          console.log('Lose logo loaded:', logoSrc);
          logoReveal.innerHTML = '';
          logoReveal.appendChild(img);
          logoReveal.classList.remove('hidden');
          playSound(gameOverSound);
          updateLeaderboard();
          setTimeout(() => {
            logoReveal.classList.add('hidden');
            logoReveal.innerHTML = '';
            startGame();
          }, 4000);
        };
        img.onerror = () => {
          console.error('Lose logo failed to load, using default:', logoSrc);
          logoReveal.innerHTML = `<img src="assets/img/default-lose-logo.png" alt="${strainName}" class="sad">`;
          logoReveal.classList.remove('hidden');
          playSound(gameOverSound);
          updateLeaderboard();
          setTimeout(() => {
            logoReveal.classList.add('hidden');
            logoReveal.innerHTML = '';
            startGame();
          }, 4000);
        };
      } else {
        if (spinsLeft > 0) {
          spinBtn.classList.remove('hidden');
          spinBtn.disabled = false;
        }
        guessSection.classList.add('hidden');
        guessBtn.disabled = true;
        solveSection.classList.remove('hidden');
        solveBtn.disabled = false;
      }
    }
  }

  // Event listeners
  spinBtn.addEventListener('click', spinWheel);
  guessBtn.addEventListener('click', guessLetter);
  solveBtn.addEventListener('click', checkSolve);
  hintBtn.addEventListener('click', revealHint);
  volumeBtn.addEventListener('click', toggleSound);
  closeNotificationBtn.addEventListener('click', () => notification.classList.add('hidden'));

  // Initialize
  initializeAudio();
  startGame();
});
const gameBoard = document.getElementById('gameBoard');
const moveCounterDisplay = document.getElementById('moveCounter');
const timerDisplay = document.getElementById('timer');
const winOverlay = document.getElementById('winOverlay');
const winMessage = document.getElementById('winMessage');
const scoreList = document.getElementById('scoreList');
const newGameButton = document.getElementById('newGameButton');
const playAgainButton = document.getElementById('playAgainButton');
const soundToggle = document.getElementById('soundToggle');
const flipSound = document.getElementById('flipSound');
const buttonSound = document.getElementById('buttonSound');
const winSound = document.getElementById('winSound');
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timerInterval = null;
let gameCards = [];
let isSoundOn = true;

let scores = JSON.parse(localStorage.getItem('shortTermRamRomScores')) || [];

function saveScore(moves, seconds) {
    scores.push({ moves, seconds });
    scores.sort((a, b) => a.moves === b.moves ? a.seconds - b.seconds : a.moves - b.moves);
    scores = scores.slice(0, 5);
    localStorage.setItem('shortTermRamRomScores', JSON.stringify(scores));
    displayScores();
}

function displayScores() {
    scoreList.innerHTML = '';
    scores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1}: ${score.moves} moves, ${score.seconds}s`;
        scoreList.appendChild(li);
    });
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = seconds;
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resizeGameBoard() {
    const maxWidth = Math.min(window.innerWidth * 0.9, 500);
    const maxHeight = Math.min(window.innerHeight * 0.7, 700); // Cap height
    const cardAspect = 5 / 7;
    const gridRows = 4;
    const gridCols = 4;
    const gap = parseFloat(getComputedStyle(gameBoard).gap) || 10;

    // Calculate board size to fit viewport
    const boardWidth = Math.min(maxWidth, (maxHeight - gap * (gridRows - 1)) * cardAspect * gridCols / (gridRows * cardAspect));
    gameBoard.style.width = `${boardWidth}px`;
    gameBoard.style.maxHeight = `${boardWidth * (gridRows * cardAspect + gap * (gridRows - 1)) / gridCols}px`;

    const cards = gameBoard.querySelectorAll('.card');
    cards.forEach(card => {
        const strainName = card.querySelector('.strain-name');
        if (strainName) {
            strainName.style.fontSize = `${Math.max(boardWidth / 38, 9)}px`; // Min 9px
        }
    });
}

function resetGame() {
    stopTimer();
    moves = 0;
    seconds = 0;
    matchedPairs = 0;
    flippedCards = [];
    moveCounterDisplay.textContent = moves;
    timerDisplay.textContent = seconds;

    gameBoard.innerHTML = '';
    winOverlay.style.display = 'none';

    // Filter out risky strain names
    const safeStrains = data.filter(strain => !/memory/i.test(strain.strain));
    const randomStrains = safeStrains.sort(() => Math.random() - 0.5).slice(0, 8);
    gameCards = [...randomStrains, ...randomStrains].sort(() => Math.random() - 0.5);

    createBoard();
    resizeGameBoard();
}

function createBoard() {
    gameCards.forEach((strain, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.strain = strain.strain;
        card.dataset.index = index;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        const logoDiv = document.createElement('div');
        logoDiv.classList.add('card-logo');

        const strainName = document.createElement('div');
        strainName.classList.add('strain-name');
        strainName.textContent = strain.strain;

        cardFront.appendChild(logoDiv);
        cardFront.appendChild(strainName);
        cardInner.appendChild(cardBack);
        cardInner.appendChild(cardFront);
        card.appendChild(cardInner);

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function throwCards() {
    for (let i = 0; i < 20; i++) {
        const card = document.createElement('div');
        card.classList.add('thrown-card');
        card.style.left = `${Math.random() * 100}vw`;
        card.style.top = `${Math.random() * 100}vh`;
        card.style.animationDelay = `${Math.random() * 2}s`;
        winOverlay.appendChild(card);
        setTimeout(() => card.remove(), 3000);
    }
}

function showWinEffect() {
    winMessage.textContent = `You won! Blaze it!\nMoves: ${moves}\nTime: ${seconds}s`;
    winOverlay.style.display = 'flex';
    throwCards();
    if (isSoundOn) winSound.play();
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
        if (moves === 0 && seconds === 0) {
            startTimer();
        }

        this.classList.add('flipped');
        const logoDiv = this.querySelector('.card-logo');
        logoDiv.style.background = `url('${gameCards[this.dataset.index].logo}') center/contain no-repeat`;
        flippedCards.push(this);
        if (isSoundOn) flipSound.play();

        if (flippedCards.length === 2) {
            moves++;
            moveCounterDisplay.textContent = moves;
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.strain === card2.dataset.strain) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === 8) {
            stopTimer();
            saveScore(moves, seconds);
            setTimeout(showWinEffect, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            const logoDiv1 = card1.querySelector('.card-logo');
            const logoDiv2 = card2.querySelector('.card-logo');
            logoDiv1.style.background = "none";
            logoDiv2.style.background = "none";
            flippedCards = [];
        }, 1000);
    }
}

function toggleSound() {
    isSoundOn = !isSoundOn;
    soundToggle.textContent = isSoundOn ? '🔊' : '🔇';
    flipSound.muted = !isSoundOn;
    buttonSound.muted = !isSoundOn;
    winSound.muted = !isSoundOn;
}

soundToggle.addEventListener('click', () => {
    toggleSound();
    if (isSoundOn) buttonSound.play();
});

newGameButton.addEventListener('click', () => {
    if (isSoundOn) buttonSound.play();
    resetGame();
});

playAgainButton.addEventListener('click', () => {
    if (isSoundOn) buttonSound.play();
    resetGame();
});

// Prevent iOS zoom
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

window.addEventListener('resize', resizeGameBoard);
displayScores();
resetGame();
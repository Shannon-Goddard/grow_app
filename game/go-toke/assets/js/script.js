const opponentHand = document.getElementById('opponentHand');
const drawPile = document.getElementById('drawPile');
const playerHand = document.getElementById('playerHand');
const playerStashDisplay = document.getElementById('playerStash');
const aiStashDisplay = document.getElementById('aiStash');
const gameMessage = document.getElementById('gameMessage');
const soundToggle = document.getElementById('soundToggle');
const newGameButton = document.getElementById('newGameButton');
const flipSound = document.getElementById('flipSound');
const buttonSound = document.getElementById('buttonSound');
const winSound = document.getElementById('winSound');
let playerCards = [];
let aiCards = [];
let deck = [];
let playerStash = 0;
let aiStash = 0;
let isPlayerTurn = true;
let isSoundOn = true;

// Pick 8 random strains (4 cards each)
const randomStrains = data.sort(() => Math.random() - 0.5).slice(0, 8);
const gameCards = [];
randomStrains.forEach(strain => {
    for (let i = 0; i < 4; i++) {
        gameCards.push({ strain: strain.strain, logo: strain.logo });
    }
});

function resetGame() {
    // Reset game state
    playerCards = [];
    aiCards = [];
    deck = [...gameCards].sort(() => Math.random() - 0.5); // Reshuffle the deck
    playerStash = 0;
    aiStash = 0;
    isPlayerTurn = true;
    playerStashDisplay.textContent = playerStash;
    aiStashDisplay.textContent = aiStash;
    gameMessage.textContent = '';

    // Deal new cards
    dealCards();
}

function dealCards() {
    playerCards = deck.splice(0, 7);
    aiCards = deck.splice(0, 7);
    checkForSets(playerCards, true);
    checkForSets(aiCards, false);
    renderGame();
}

function checkForSets(cards, isPlayer) {
    const strainCounts = {};
    cards.forEach(card => {
        strainCounts[card.strain] = (strainCounts[card.strain] || 0) + 1;
    });

    for (const strain in strainCounts) {
        if (strainCounts[strain] === 4) {
            if (isPlayer) {
                playerStash++;
                playerStashDisplay.textContent = playerStash;
                gameMessage.textContent = `You stashed 4 ${strain}s!`;
            } else {
                aiStash++;
                aiStashDisplay.textContent = aiStash;
                gameMessage.textContent = `AI stashed 4 ${strain}s!`;
            }
            cards.splice(cards.findIndex(card => card.strain === strain), 4);
        }
    }

    if (playerStash + aiStash === 8) {
        endGame();
    }
}

function renderGame() {
    opponentHand.innerHTML = '';
    aiCards.forEach(() => {
        const card = document.createElement('div');
        card.classList.add('card', 'card-back');
        opponentHand.appendChild(card);
    });

    drawPile.innerHTML = '';
    const pileCard = document.createElement('div');
    pileCard.classList.add('card', 'card-back');
    pileCard.textContent = deck.length;
    drawPile.appendChild(pileCard);

    playerHand.innerHTML = '';
    playerCards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        const logoDiv = document.createElement('div');
        logoDiv.classList.add('card-logo');
        logoDiv.style.background = `url('${card.logo}') center/contain no-repeat`;
        const strainName = document.createElement('div');
        strainName.classList.add('strain-name');
        strainName.textContent = card.strain;
        cardDiv.appendChild(logoDiv);
        cardDiv.appendChild(strainName);
        cardDiv.addEventListener('click', () => askForCard(card.strain));
        playerHand.appendChild(cardDiv);
    });
}

function askForCard(strain) {
    if (!isPlayerTurn) return;
    gameMessage.textContent = `You asked for ${strain}...`;
    if (isSoundOn) buttonSound.play();

    const aiHasCard = aiCards.filter(card => card.strain === strain);
    if (aiHasCard.length > 0) {
        aiCards = aiCards.filter(card => card.strain !== strain);
        playerCards.push(...aiHasCard);
        gameMessage.textContent = `AI had ${aiHasCard.length} ${strain}(s)! Your turn again.`;
        checkForSets(playerCards, true);
    } else {
        gameMessage.textContent = `Go Toke! Drawing a card...`;
        setTimeout(drawCard, 1000, strain);
    }
    renderGame();
}

function drawCard(requestedStrain) {
    if (deck.length === 0) {
        gameMessage.textContent = `Draw pile empty! AI's turn.`;
        isPlayerTurn = false;
        setTimeout(aiTurn, 1000);
        return;
    }

    const drawnCard = deck.shift();
    playerCards.push(drawnCard);
    if (isSoundOn) flipSound.play();
    gameMessage.textContent = `You drew a ${drawnCard.strain}.`;
    checkForSets(playerCards, true);

    if (drawnCard.strain === requestedStrain) {
        gameMessage.textContent = `Buzzed! You drew a ${drawnCard.strain}! Your turn again.`;
    } else {
        isPlayerTurn = false;
        setTimeout(aiTurn, 1000);
    }
    renderGame();
}

function aiTurn() {
    if (!deck.length && !playerCards.length) {
        endGame();
        return;
    }

    const aiStrains = [...new Set(aiCards.map(card => card.strain))];
    const randomStrain = aiStrains[Math.floor(Math.random() * aiStrains.length)];
    gameMessage.textContent = `AI asks for ${randomStrain}...`;

    const playerHasCard = playerCards.filter(card => card.strain === randomStrain);
    if (playerHasCard.length > 0) {
        playerCards = playerCards.filter(card => card.strain !== randomStrain);
        aiCards.push(...playerHasCard);
        gameMessage.textContent = `You had ${playerHasCard.length} ${randomStrain}(s)! AI's turn again.`;
        checkForSets(aiCards, false);
        setTimeout(aiTurn, 1000);
    } else {
        gameMessage.textContent = `AI goes to toke! Drawing a card...`;
        if (deck.length === 0) {
            gameMessage.textContent = `Draw pile empty! Your turn.`;
            isPlayerTurn = true;
        } else {
            const drawnCard = deck.shift();
            aiCards.push(drawnCard);
            if (isSoundOn) flipSound.play();
            gameMessage.textContent = `AI drew a card.`;
            checkForSets(aiCards, false);
            if (drawnCard.strain === randomStrain) {
                gameMessage.textContent = `AI got buzzed and drew a ${drawnCard.strain}! AI's turn again.`;
                setTimeout(aiTurn, 1000);
            } else {
                gameMessage.textContent = `Your turn!`;
                isPlayerTurn = true;
            }
        }
    }
    renderGame();
}

function endGame() {
    const winner = playerStash > aiStash ? 'You win!' : aiStash > playerStash ? 'AI wins!' : 'It\'s a tie!';
    gameMessage.textContent = `${winner} Final Score - You: ${playerStash} sets, AI: ${aiStash} sets.`;
    if (isSoundOn) winSound.play();
}

function toggleSound() {
    isSoundOn = !isSoundOn;
    soundToggle.textContent = isSoundOn ? '🔊' : '🔇';
    flipSound.muted = !isSoundOn;
    buttonSound.muted = !isSoundOn;
    winSound.muted = !isSoundOn;
}

soundToggle.addEventListener('click', toggleSound);

newGameButton.addEventListener('click', () => {
    if (isSoundOn) buttonSound.play();
    resetGame();
});

resetGame();
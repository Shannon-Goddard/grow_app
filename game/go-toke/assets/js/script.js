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

// Pick 20 random strains (4 cards each)
const randomStrains = data.sort(() => Math.random() - 0.5).slice(0, 20);
const gameCards = [];
randomStrains.forEach(strain => {
    for (let i = 0; i < 4; i++) {
        gameCards.push({ strain: strain.strain, logo: strain.logo });
    }
});

function resetGame() {
    playerCards = [];
    aiCards = [];
    deck = [...gameCards].sort(() => Math.random() - 0.5); // 80 cards total
    playerStash = 0;
    aiStash = 0;
    isPlayerTurn = true;
    playerStashDisplay.textContent = playerStash;
    aiStashDisplay.textContent = aiStash;
    gameMessage.textContent = '';
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

    console.log(`Checking sets for ${isPlayer ? 'player' : 'AI'}. Strains:`, strainCounts);

    for (const strain in strainCounts) {
        while (strainCounts[strain] >= 4) {
            if (isPlayer) {
                playerStash++;
                playerStashDisplay.textContent = playerStash;
                gameMessage.textContent = `You stashed 4 ${strain}s!`;
                const initialLength = playerCards.length;
                let removed = 0;
                playerCards = playerCards.filter(card => {
                    if (card.strain === strain && removed < 4) {
                        removed++;
                        return false;
                    }
                    return true;
                });
                console.log(`Removed 4 ${strain}s from player. Before: ${initialLength}, After: ${playerCards.length}`);
            } else {
                aiStash++;
                aiStashDisplay.textContent = aiStash;
                gameMessage.textContent = `AI stashed 4 ${strain}s!`;
                const initialLength = aiCards.length;
                let removed = 0;
                aiCards = aiCards.filter(card => {
                    if (card.strain === strain && removed < 4) {
                        removed++;
                        return false;
                    }
                    return true;
                });
                console.log(`Removed 4 ${strain}s from AI. Before: ${initialLength}, After: ${aiCards.length}`);
            }
            strainCounts[strain] -= 4; // Update the count after removal
            renderGame(); // Update hand immediately after removing cards
        }
    }

    // Check for win condition: first to 8 sets
    if (playerStash >= 8) {
        gameMessage.textContent = `You win! Final Score - You: ${playerStash} sets, AI: ${aiStash} sets.`;
        if (isSoundOn) winSound.play();
        return;
    }
    if (aiStash >= 8) {
        gameMessage.textContent = `AI wins! Final Score - You: ${playerStash} sets, AI: ${aiStash} sets.`;
        if (isSoundOn) winSound.play();
        return;
    }
}

function renderGame() {
    opponentHand.innerHTML = '';
    console.log('AI cards length:', aiCards.length);
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
    console.log('Player cards length:', playerCards.length);
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
        gameMessage.textContent = `No Fish! Drawing a card...`;
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
    renderGame(); // Ensure render after drawing

    if (drawnCard.strain === requestedStrain) {
        gameMessage.textContent = `Nice one, bud! You drew a ${drawnCard.strain}! Your turn again.`;
    } else {
        isPlayerTurn = false;
        setTimeout(aiTurn, 1000);
    }
}

function aiTurn() {
    // Check win condition first
    if (playerStash >= 8 || aiStash >= 8) return;

    // When draw pile is empty and player has no cards, let AI finish
    if (deck.length === 0 && playerCards.length === 0) {
        gameMessage.textContent = `Draw pile empty and you have no cards! AI's turn to finish.`;
        checkForSets(aiCards, false); // Check AI's hand for sets
        renderGame(); // Force render to update AI's hand
        if (aiStash >= 8) {
            gameMessage.textContent = `AI wins! Final Score - You: ${playerStash} sets, AI: ${aiStash} sets.`;
            if (isSoundOn) winSound.play();
            return;
        }
        // If AI didn't win, continue turn (though it should win if it has sets)
        setTimeout(aiTurn, 1000);
        return;
    }

    // When deck is empty, keep trading
    if (deck.length === 0 && (playerCards.length > 0 || aiCards.length > 0)) {
        const playerStrains = new Set(playerCards.map(card => card.strain));
        const aiStrains = new Set(aiCards.map(card => card.strain));
        const allStrains = new Set([...playerStrains, ...aiStrains]);
        
        let aiAskStrain = [...playerStrains][Math.floor(Math.random() * playerStrains.size)] || [...aiStrains][0];
        gameMessage.textContent = `AI asks for ${aiAskStrain}...`;

        const playerHasCard = playerCards.filter(card => card.strain === aiAskStrain);
        if (playerHasCard.length > 0) {
            playerCards = playerCards.filter(card => card.strain !== aiAskStrain);
            aiCards.push(...playerHasCard);
            gameMessage.textContent = `You had ${playerHasCard.length} ${aiAskStrain}(s)! AI's turn again.`;
            checkForSets(aiCards, false);
            renderGame(); // Force render after trade and set check
            setTimeout(aiTurn, 1000);
        } else {
            gameMessage.textContent = `AI has no match! Your turn.`;
            isPlayerTurn = true;
        }
        renderGame();
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
        renderGame(); // Force render after trade and set check
        setTimeout(aiTurn, 1000);
    } else {
        gameMessage.textContent = `No Fish! Drawing a card...`;
        if (deck.length === 0) {
            gameMessage.textContent = `Draw pile empty! Your turn.`;
            isPlayerTurn = true;
        } else {
            const drawnCard = deck.shift();
            aiCards.push(drawnCard);
            if (isSoundOn) flipSound.play();
            gameMessage.textContent = `AI drew a card.`;
            checkForSets(aiCards, false);
            renderGame(); // Ensure render after AI draws
            if (drawnCard.strain === randomStrain) {
                gameMessage.textContent = `AI got a whopper and drew a ${drawnCard.strain}! AI's turn again.`;
                setTimeout(aiTurn, 1000);
            } else {
                gameMessage.textContent = `Your turn!`;
                isPlayerTurn = true;
            }
        }
    }
    renderGame();
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
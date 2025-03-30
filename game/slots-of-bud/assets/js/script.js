// Elements for Slots of Bud
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const spinButton = document.getElementById('spin-button');
const result = document.getElementById('result');
const betAmountInput = document.getElementById('bet-amount');
const balanceDisplay = document.getElementById('balance');
const paytableButton = document.getElementById('paytable-button');
const paytable = document.getElementById('paytable');
const closePaytableButton = document.getElementById('close-paytable');
const resetButton = document.getElementById('reset-button');
const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');
const jackpotSound = document.getElementById('jackpot-sound');

// Game state
let balance = 1000; // Starting balance
balanceDisplay.textContent = balance;

// Toggle paytable visibility
paytableButton.addEventListener('click', () => {
    paytable.classList.remove('hidden');
});

closePaytableButton.addEventListener('click', () => {
    paytable.classList.add('hidden');
});

// Reset the game
resetButton.addEventListener('click', () => {
    balance = 1000;
    balanceDisplay.textContent = balance;
    spinButton.disabled = false;
    resetButton.classList.add('hidden');
    result.textContent = 'Spin to Win!';
    // Reset reels to initial symbols
    reel1.innerHTML = `<img src="assets/img/seven.png" alt="Symbol">`;
    reel2.innerHTML = `<img src="assets/img/seven.png" alt="Symbol">`;
    reel3.innerHTML = `<img src="assets/img/seven.png" alt="Symbol">`;
});

// The data array is loaded from assets/js/data.js (via the <script> tag in index.html)
if (!data || !Array.isArray(data)) {
    console.error('Error: Strain data not loaded correctly. Check assets/js/data.js.');
    result.textContent = 'Error: Strain data not loaded.';
    spinButton.disabled = true;
    throw new Error('Strain data not loaded');
}

// Filter out strain logos with missing or invalid paths
const validStrains = data.filter(entry => entry.logo && entry.logo !== '');
const strainLogos = validStrains.map(entry => ({
    type: 'blocker',
    logo: entry.logo,
    name: entry.strain
}));

// Define symbols for each reel
const reel1Symbols = [
    { type: 'seven', logo: 'assets/img/seven.png', name: '7' },
    { type: 'triple_seven', logo: 'assets/img/triple_seven.png', name: '777' },
    { type: 'bar', logo: 'assets/img/bar.png', name: 'Bar' },
    { type: 'triple_bar', logo: 'assets/img/triple_bar.png', name: 'Bar Bar Bar' },
    { type: 'multiplier', logo: 'assets/img/multiplier_4x.png', name: '4x' },
    ...strainLogos
];

const reel2Symbols = [
    { type: 'double_seven', logo: 'assets/img/double_seven.png', name: '77' },
    { type: 'triple_seven', logo: 'assets/img/triple_seven.png', name: '777' },
    { type: 'double_bar', logo: 'assets/img/double_bar.png', name: 'Bar Bar' },
    { type: 'triple_bar', logo: 'assets/img/triple_bar.png', name: 'Bar Bar Bar' },
    { type: 'multiplier', logo: 'assets/img/multiplier_2x.png', name: '2x' },
    ...strainLogos
];

const reel3Symbols = [
    { type: 'seven', logo: 'assets/img/seven.png', name: '7' },
    { type: 'triple_seven', logo: 'assets/img/triple_seven.png', name: '777' },
    { type: 'bar', logo: 'assets/img/bar.png', name: 'Bar' },
    { type: 'triple_bar', logo: 'assets/img/triple_bar.png', name: 'Bar Bar Bar' },
    { type: 'multiplier', logo: 'assets/img/multiplier_0x.png', name: '0x' },
    ...strainLogos
];

// Spin the reels
spinButton.addEventListener('click', spinReels);

function spinReels() {
    // Get the bet amount
    const bet = parseInt(betAmountInput.value);
    if (isNaN(bet) || bet <= 0 || bet > balance) {
        result.textContent = 'Invalid bet amount or insufficient balance!';
        return;
    }

    // Deduct the bet from the balance
    balance -= bet;
    balanceDisplay.textContent = balance;

    // Play spin sound
    spinSound.currentTime = 0; // Reset to start
    spinSound.play();

    // Disable the button while spinning
    spinButton.disabled = true;
    result.textContent = 'Spinning...';

    // Add spinning animation
    reel1.classList.add('spinning');
    reel2.classList.add('spinning');
    reel3.classList.add('spinning');

    // Simulate spinning with a delay
    setTimeout(() => {
        // Randomly select symbols for each reel
        const symbol1 = reel1Symbols[Math.floor(Math.random() * reel1Symbols.length)];
        const symbol2 = reel2Symbols[Math.floor(Math.random() * reel2Symbols.length)];
        const symbol3 = reel3Symbols[Math.floor(Math.random() * reel3Symbols.length)];

        // Update the reels with new symbols
        reel1.innerHTML = `<img src="${symbol1.logo}" alt="${symbol1.name}">`;
        reel2.innerHTML = `<img src="${symbol2.logo}" alt="${symbol2.name}">`;
        reel3.innerHTML = `<img src="${symbol3.logo}" alt="${symbol3.name}">`;

        // Stop the spinning animation
        reel1.classList.remove('spinning');
        reel2.classList.remove('spinning');
        reel3.classList.remove('spinning');

        // Check for a win
        const payout = calculatePayout(symbol1, symbol2, symbol3, bet);
        balance += payout;
        balanceDisplay.textContent = balance;

        if (payout > 0) {
            result.textContent = `You won ${payout}! 🎉`;
            // Play sound based on the type of win
            if (symbol1.name === '4x' && symbol2.name === '2x' && symbol3.name === '0x') {
                jackpotSound.currentTime = 0;
                jackpotSound.play();
            } else {
                winSound.currentTime = 0;
                winSound.play();
            }
        } else {
            result.textContent = 'Try Again!';
        }

        // Check if the player is out of money
        if (balance <= 0) {
            result.textContent = 'Game Over! You’re out of money.';
            spinButton.disabled = true;
            resetButton.classList.remove('hidden');
        } else {
            spinButton.disabled = false;
        }
    }, 2000); // 2-second delay to simulate spinning
}

function calculatePayout(symbol1, symbol2, symbol3, bet) {
    // Jackpot: 4x, 2x, 0x
    if (symbol1.name === '4x' && symbol2.name === '2x' && symbol3.name === '0x') {
        return bet * 50; // Big jackpot payout (50x the bet)
    }

    // Check for blockers (strain logos)
    if (symbol1.type === 'blocker' || symbol2.type === 'blocker' || symbol3.type === 'blocker') {
        return 0; // No payout if any symbol is a blocker
    }

    // Check for matching symbols
    // Triple Seven (777, 777, 777)
    if (symbol1.name === '777' && symbol2.name === '777' && symbol3.name === '777') {
        return bet * 30; // 777, 777, 777 payout (30x the bet)
    }

    // Seven combinations
    if (symbol1.name === '7' && symbol2.name === '77' && symbol3.name === '7') {
        return bet * 20; // 7, 77, 7 payout (20x the bet)
    }
    if (symbol1.name === '7' && symbol2.name === '7' && symbol3.name === '7') {
        return bet * 10; // 7, 7, 7 payout (10x the bet)
    }

    // Triple Bar (Bar Bar Bar, Bar Bar Bar, Bar Bar Bar)
    if (symbol1.name === 'Bar Bar Bar' && symbol2.name === 'Bar Bar Bar' && symbol3.name === 'Bar Bar Bar') {
        return bet * 25; // Bar Bar Bar, Bar Bar Bar, Bar Bar Bar payout (25x the bet)
    }

    // Bar combinations
    if (symbol1.name === 'Bar' && symbol2.name === 'Bar Bar' && symbol3.name === 'Bar') {
        return bet * 15; // Bar, Bar Bar, Bar payout (15x the bet)
    }
    if (symbol1.name === 'Bar' && symbol2.name === 'Bar' && symbol3.name === 'Bar') {
        return bet * 5; // Bar, Bar, Bar payout (5x the bet)
    }

    return 0; // No payout for other combinations
}
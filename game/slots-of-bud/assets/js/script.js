// Elements
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const reel4 = document.getElementById('reel4');
const reel5 = document.getElementById('reel5');
const spinButton = document.getElementById('spin-button');
const result = document.getElementById('result');
const betButtons = document.querySelectorAll('.bet-btn'); // Replace betAmountInput
const balanceDisplay = document.getElementById('balance');
const paytableButton = document.getElementById('paytable-button');
const paytable = document.getElementById('paytable');
const closePaytableButton = document.getElementById('close-paytable');
const resetButton = document.getElementById('reset-button');
const soundToggle = document.getElementById('sound-toggle');
const winSound = document.getElementById('win-sound');
const jackpotSound = document.getElementById('jackpot-sound');
const reelStopSound = document.getElementById('reel-stop-sound');

// Game state
let balance = 1000;
balanceDisplay.textContent = balance;
let isSoundOn = false;
let currentBet = 5; // Default bet

// Initialize audio as muted
winSound.muted = true;
jackpotSound.muted = true;
reelStopSound.muted = true;

// Paytable toggle
paytableButton.addEventListener('click', () => paytable.classList.remove('hidden'));
closePaytableButton.addEventListener('click', () => paytable.classList.add('hidden'));

// Bet button handling
betButtons.forEach(button => {
    button.addEventListener('click', () => {
        betButtons.forEach(btn => btn.classList.remove('active')); // Remove active from all
        button.classList.add('active'); // Set clicked button as active
        currentBet = parseInt(button.getAttribute('data-bet')); // Update bet
    });
});

// Reset game
resetButton.addEventListener('click', () => {
    balance = 1000;
    balanceDisplay.textContent = balance;
    spinButton.disabled = false;
    resetButton.classList.add('hidden');
    result.textContent = 'Spin to Win!';
    currentBet = 5; // Reset to default
    betButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.bet-btn[data-bet="5"]').classList.add('active');
    populateReelStrips();
});

// Check strain data (unchanged)
if (!data || !Array.isArray(data)) {
    console.error('Error: Strain data not loaded correctly. Ensure data.js defines a "data" array.');
    result.textContent = 'Error: Strain data not loaded.';
    spinButton.disabled = true;
    throw new Error('Strain data not loaded');
}

const validStrains = data.filter(entry => entry.logo && entry.logo !== '');
const strainLogos = validStrains.map(entry => ({
    type: 'blocker',
    logo: entry.logo,
    name: entry.strain
}));

// Function to repeat a symbol N times (unchanged)
function repeatSymbol(symbol, times) {
    return Array(times).fill(symbol);
}

// Function to get a random subset of logos (unchanged)
function getRandomLogos(logos, count) {
    const shuffled = [...logos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Define symbols (unchanged)
const seven = { type: 'seven', logo: 'assets/img/seven.png', name: '7' };
const doubleSeven = { type: 'double_seven', logo: 'assets/img/double-seven.png', name: '77' };
const tripleSeven = { type: 'triple_seven', logo: 'assets/img/triple-seven.png', name: '777' };
const bar = { type: 'bar', logo: 'assets/img/bar.png', name: 'Bar' };
const doubleBar = { type: 'double_bar', logo: 'assets/img/double-bar.png', name: 'Bar Bar' };
const tripleBar = { type: 'triple_bar', logo: 'assets/img/triple-bar.png', name: 'Bar Bar Bar' };
const multiplier2x = { type: 'multiplier', logo: 'assets/img/multiplier_2x.png', name: '2x' };
const multiplier4x = { type: 'multiplier', logo: 'assets/img/multiplier_4x.png', name: '4x' };
const multiplier0x = { type: 'multiplier', logo: 'assets/img/multiplier_0x.png', name: '0x' };

// Select 50 random cannabis logos for each reel (unchanged)
const reel1Logos = getRandomLogos(strainLogos, 50);
const reel2Logos = getRandomLogos(strainLogos, 50);
const reel3Logos = getRandomLogos(strainLogos, 50);
const reel4Logos = getRandomLogos(strainLogos, 50);
const reel5Logos = getRandomLogos(strainLogos, 50);

// Reel symbols with increased frequency (unchanged)
const reel1Symbols = [
    ...repeatSymbol(seven, 10),
    ...repeatSymbol(tripleSeven, 10),
    ...repeatSymbol(bar, 10),
    ...repeatSymbol(tripleBar, 10),
    ...repeatSymbol(multiplier4x, 5),
    ...reel1Logos
];

const reel2Symbols = [
    ...repeatSymbol(doubleSeven, 10),
    ...repeatSymbol(tripleSeven, 10),
    ...repeatSymbol(doubleBar, 10),
    ...repeatSymbol(tripleBar, 10),
    ...repeatSymbol(multiplier2x, 5),
    ...reel2Logos
];

const reel3Symbols = [
    ...repeatSymbol(seven, 10),
    ...repeatSymbol(tripleSeven, 10),
    ...repeatSymbol(bar, 10),
    ...repeatSymbol(tripleBar, 10),
    ...repeatSymbol(multiplier0x, 5),
    ...reel3Logos
];

const reel4Symbols = [
    ...repeatSymbol(seven, 10),
    ...repeatSymbol(tripleSeven, 10),
    ...repeatSymbol(bar, 10),
    ...repeatSymbol(tripleBar, 10),
    ...repeatSymbol(multiplier4x, 5),
    ...reel4Logos
];

const reel5Symbols = [
    ...repeatSymbol(doubleSeven, 10),
    ...repeatSymbol(tripleSeven, 10),
    ...repeatSymbol(doubleBar, 10),
    ...repeatSymbol(tripleBar, 10),
    ...repeatSymbol(multiplier2x, 5),
    ...reel5Logos
];

// Shuffle array (unchanged)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to change the background image (unchanged)
function changeBackground() {
    const randomIndex = Math.floor(Math.random() * validStrains.length);
    const randomLogo = validStrains[randomIndex].logo;
    document.body.style.backgroundImage = `linear-gradient(to bottom, rgba(46, 125, 50, 0.7), rgba(129, 199, 132, 0.7)), url('${randomLogo}')`;
}

// Change background every 5 minutes (unchanged)
setInterval(changeBackground, 300000);

// Populate reel strips with 48 rows (unchanged)
function populateReelStrips() {
    const strips = [
        { element: reel1.querySelector('.reel-strip'), symbols: reel1Symbols },
        { element: reel2.querySelector('.reel-strip'), symbols: reel2Symbols },
        { element: reel3.querySelector('.reel-strip'), symbols: reel3Symbols },
        { element: reel4.querySelector('.reel-strip'), symbols: reel4Symbols },
        { element: reel5.querySelector('.reel-strip'), symbols: reel5Symbols }
    ];

    strips.forEach((strip, index) => {
        if (!strip.element) {
            console.error(`Reel strip ${index + 1} not found!`);
            return;
        }

        strip.element.innerHTML = '';

        const numRows = 48;
        const shuffled = shuffleArray([...strip.symbols]);

        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('div');
            row.classList.add('grid-row');
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            const symbolIndex = i % shuffled.length;
            const symbol = shuffled[symbolIndex];
            const className = symbol.type === 'blocker' ? 'blocker' : '';
            cell.innerHTML = `<img src="${symbol.logo}" alt="${symbol.name}" class="${className}" onerror="console.error('Failed to load image: ${symbol.logo}')">`;
            row.appendChild(cell);
            strip.element.appendChild(row);
        }

        const rowHeight = window.innerWidth <= 576 ? 54 : window.innerWidth <= 768 ? 82 : 110;
        strip.element.style.height = `${numRows * rowHeight}px`;
    });
}

// Spin reels independently with a downward motion
spinButton.addEventListener('click', spinReels);
spinButton.addEventListener('touchstart', (event) => {
    event.preventDefault();
    spinReels();
});

function spinReels() {
    const bet = currentBet; // Use currentBet instead of betAmountInput.value
    if (bet > balance) {
        result.textContent = 'Insufficient balance!';
        return;
    }

    balance -= bet;
    balanceDisplay.textContent = balance;
    spinButton.disabled = true;
    result.textContent = 'Spinning...';

    const strips = [
        { element: reel1.querySelector('.reel-strip'), symbols: reel1Symbols },
        { element: reel2.querySelector('.reel-strip'), symbols: reel2Symbols },
        { element: reel3.querySelector('.reel-strip'), symbols: reel3Symbols },
        { element: reel4.querySelector('.reel-strip'), symbols: reel4Symbols },
        { element: reel5.querySelector('.reel-strip'), symbols: reel5Symbols }
    ];

    const rowsToEvaluate = [0, 1, 2, 3];
    const rowSymbols = rowsToEvaluate.map(rowIndex => [
        reel1Symbols[Math.floor(Math.random() * reel1Symbols.length)],
        reel2Symbols[Math.floor(Math.random() * reel2Symbols.length)],
        reel3Symbols[Math.floor(Math.random() * reel3Symbols.length)],
        reel4Symbols[Math.floor(Math.random() * reel4Symbols.length)],
        reel5Symbols[Math.floor(Math.random() * reel5Symbols.length)]
    ]);

    const totalSpinTime = 5000;
    const baseDuration = 2000;
    const durationIncrement = (totalSpinTime - baseDuration) / 4;
    const spinDurations = strips.map((_, index) => {
        const minDuration = baseDuration + index * durationIncrement;
        const randomExtra = Math.random() * 200;
        return minDuration + randomExtra;
    });

    strips.forEach((strip, index) => {
        strip.element.classList.add('spinning');

        setTimeout(() => {
            strip.element.classList.remove('spinning');
            strip.element.style.animation = '';
            const shuffled = shuffleArray([...strip.symbols]);

            const rows = strip.element.querySelectorAll('.grid-row');
            rows.forEach((row, rowIndex) => {
                const cell = row.querySelector('.grid-cell');
                let symbol;
                if (rowsToEvaluate.includes(rowIndex)) {
                    const rowEvalIndex = rowsToEvaluate.indexOf(rowIndex);
                    symbol = rowSymbols[rowEvalIndex][index];
                } else {
                    const symbolIndex = rowIndex % shuffled.length;
                    symbol = shuffled[symbolIndex];
                }
                const className = symbol.type === 'blocker' ? 'blocker' : '';
                cell.innerHTML = `<img src="${symbol.logo}" alt="${symbol.name}" class="${className}" onerror="console.error('Failed to load image: ${symbol.logo}')">`;
            });

            if (isSoundOn) {
                reelStopSound.currentTime = 0;
                reelStopSound.play();
            }
        }, spinDurations[index]);
    });

    setTimeout(() => {
        const reelSymbols = [];
        for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
            const reel = rowsToEvaluate.map(rowIndex => rowSymbols[rowIndex][reelIndex]);
            reelSymbols.push(reel);
        }

        const totalPayout = calculatePayout(reelSymbols, rowSymbols, bet);

        balance += totalPayout;
        balanceDisplay.textContent = balance;

        if (totalPayout > 0) {
            result.textContent = `You won ${totalPayout}! 🎉`;
            const allSymbols = rowSymbols.flat();
            if (isSoundOn) {
                if (allSymbols.filter(symbol => symbol.name === '4x').length >= 1 &&
                    allSymbols.filter(symbol => symbol.name === '777').length >= 2 &&
                    allSymbols.filter(symbol => symbol.name === '2x').length >= 1 &&
                    allSymbols.filter(symbol => symbol.name === '0x').length >= 1) {
                    jackpotSound.currentTime = 0;
                    jackpotSound.play();
                } else {
                    winSound.currentTime = 0;
                    winSound.play();
                }
            }
        } else {
            result.textContent = 'Try Again!';
        }

        if (balance <= 0) {
            result.textContent = 'Game Over! You’re out of money.';
            spinButton.disabled = true;
            resetButton.classList.remove('hidden');
        } else {
            spinButton.disabled = false;
        }
    }, Math.max(...spinDurations) + 300);
}

function calculatePayout(reelSymbols, rowSymbols, bet) {
    const allSymbols = reelSymbols.flat();

    if (allSymbols.filter(symbol => symbol.name === '4x').length >= 1 &&
        allSymbols.filter(symbol => symbol.name === '777').length >= 2 &&
        allSymbols.filter(symbol => symbol.name === '2x').length >= 1 &&
        allSymbols.filter(symbol => symbol.name === '0x').length >= 1) {
        console.log("Jackpot condition met!");
        return applyMultiplier(allSymbols, bet * 1000);
    }

    for (let row of rowSymbols) {
        if (row.every(symbol => symbol.name === '777')) {
            console.log("Five Triple 7s condition met!");
            return applyMultiplier(allSymbols, bet * 75);
        }
        if (row.every(symbol => symbol.name === '77')) {
            console.log("Five Double 7s condition met!");
            return applyMultiplier(allSymbols, bet * 50);
        }
        if (row.every(symbol => symbol.name === '7')) {
            console.log("Five Single 7s condition met!");
            return applyMultiplier(allSymbols, bet * 25);
        }
        if (row.every(symbol => symbol.name === 'Bar Bar Bar')) {
            console.log("Five Triple Bars condition met!");
            return applyMultiplier(allSymbols, bet * 30);
        }
        if (row.every(symbol => symbol.name === 'Bar Bar')) {
            console.log("Five Double Bars condition met!");
            return applyMultiplier(allSymbols, bet * 20);
        }
        if (row.every(symbol => symbol.name === 'Bar')) {
            console.log("Five Single Bars condition met!");
            return applyMultiplier(allSymbols, bet * 10);
        }
    }

    const hasSevenOrBarInEachReel = reelSymbols.every((reel, index) => {
        const nonBlockerSymbols = reel.filter(symbol => symbol.type !== 'blocker');
        const hasAnySeven = nonBlockerSymbols.some(symbol => 
            symbol.name === '7' || symbol.name === '77' || symbol.name === '777'
        );
        const hasAnyBar = nonBlockerSymbols.some(symbol => 
            symbol.name === 'Bar' || symbol.name === 'Bar Bar' || symbol.name === 'Bar Bar Bar'
        );
        const result = hasAnySeven || hasAnyBar;
        console.log(`Reel ${index + 1}: hasAnySeven=${hasAnySeven}, hasAnyBar=${hasAnyBar}, result=${result}`);
        return result;
    });

    if (hasSevenOrBarInEachReel) {
        console.log("Any 7 or Bar in each reel condition met!");
        return applyMultiplier(allSymbols, bet * 5);
    }

    return 0;
}

function applyMultiplier(allSymbols, payout) {
    let multiplier = 1;
    allSymbols.forEach(symbol => {
        if (symbol.name === '2x') multiplier *= 2;
        if (symbol.name === '4x') multiplier *= 4;
        if (symbol.name === '0x') multiplier *= 1;
    });
    return payout * multiplier;
}

// Function to toggle sound (unchanged)
function toggleSound() {
    isSoundOn = !isSoundOn;
    if (isSoundOn) {
        soundToggle.classList.remove('sound-off');
        soundToggle.classList.add('sound-on');
        soundToggle.textContent = '🔊';
        winSound.muted = false;
        jackpotSound.muted = false;
        reelStopSound.muted = false;
    } else {
        soundToggle.classList.remove('sound-on');
        soundToggle.classList.add('sound-off');
        soundToggle.textContent = '🔇';
        winSound.muted = true;
        jackpotSound.muted = true;
        reelStopSound.muted = true;
    }
}

// Add event listener for sound toggle (unchanged)
soundToggle.addEventListener('click', toggleSound);

// Set initial background and populate reels on page load (unchanged)
document.addEventListener('DOMContentLoaded', () => {
    changeBackground();
    populateReelStrips();
});
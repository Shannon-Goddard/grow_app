// Elements
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const reel4 = document.getElementById('reel4');
const reel5 = document.getElementById('reel5');
const spinButton = document.getElementById('spin-button');
const result = document.getElementById('result');
const betAmountInput = document.getElementById('bet-amount');
const balanceDisplay = document.getElementById('balance');
const paytableButton = document.getElementById('paytable-button');
const paytable = document.getElementById('paytable');
const closePaytableButton = document.getElementById('close-paytable');
const resetButton = document.getElementById('reset-button');
const winSound = document.getElementById('win-sound');
const jackpotSound = document.getElementById('jackpot-sound');
const reelStopSound = document.getElementById('reel-stop-sound');

// Game state
let balance = 1000;
balanceDisplay.textContent = balance;

// Paytable toggle
paytableButton.addEventListener('click', () => paytable.classList.remove('hidden'));
closePaytableButton.addEventListener('click', () => paytable.classList.add('hidden'));

// Reset game
resetButton.addEventListener('click', () => {
    balance = 1000;
    balanceDisplay.textContent = balance;
    spinButton.disabled = false;
    resetButton.classList.add('hidden');
    result.textContent = 'Spin to Win!';
    populateReelStrips();
});

// Check strain data
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

// Function to repeat a symbol N times
function repeatSymbol(symbol, times) {
    return Array(times).fill(symbol);
}

// Function to get a random subset of logos
function getRandomLogos(logos, count) {
    const shuffled = [...logos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Define symbols with increased frequency
const seven = { type: 'seven', logo: 'assets/img/seven.png', name: '7' };
const doubleSeven = { type: 'double_seven', logo: 'assets/img/double-seven.png', name: '77' };
const tripleSeven = { type: 'triple_seven', logo: 'assets/img/triple-seven.png', name: '777' };
const bar = { type: 'bar', logo: 'assets/img/bar.png', name: 'Bar' };
const doubleBar = { type: 'double_bar', logo: 'assets/img/double-bar.png', name: 'Bar Bar' };
const tripleBar = { type: 'triple_bar', logo: 'assets/img/triple-bar.png', name: 'Bar Bar Bar' };
const multiplier2x = { type: 'multiplier', logo: 'assets/img/multiplier_2x.png', name: '2x' };
const multiplier4x = { type: 'multiplier', logo: 'assets/img/multiplier_4x.png', name: '4x' };
const multiplier0x = { type: 'multiplier', logo: 'assets/img/multiplier_0x.png', name: '0x' };

// Select 50 random cannabis logos for each reel
const reel1Logos = getRandomLogos(strainLogos, 50);
const reel2Logos = getRandomLogos(strainLogos, 50);
const reel3Logos = getRandomLogos(strainLogos, 50);
const reel4Logos = getRandomLogos(strainLogos, 50);
const reel5Logos = getRandomLogos(strainLogos, 50);

// Reel symbols with increased frequency
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

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to change the background image
function changeBackground() {
    const randomIndex = Math.floor(Math.random() * validStrains.length);
    const randomLogo = validStrains[randomIndex].logo;
    document.body.style.backgroundImage = `linear-gradient(to bottom, rgba(46, 125, 50, 0.7), rgba(129, 199, 132, 0.7)), url('${randomLogo}')`;
}

// Change background every 5 minutes (300,000 milliseconds)
setInterval(changeBackground, 300000);

// Populate reel strips with 48 rows to ensure continuous tiles
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

        // Clear existing rows
        strip.element.innerHTML = '';

        // Create 48 rows to ensure continuous tiles during the 5-second spin
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

        // Set the height of the reel-strip to accommodate all rows
        // Use the CSS-defined row height (110px by default, adjusted in responsive breakpoints)
        const rowHeight = window.innerWidth <= 576 ? 54 : window.innerWidth <= 768 ? 82 : 110;
        strip.element.style.height = `${numRows * rowHeight}px`;
    });
}

// Spin reels independently with a downward motion
spinButton.addEventListener('click', spinReels);

function spinReels() {
    const bet = parseInt(betAmountInput.value);
    if (isNaN(bet) || bet <= 0 || bet > balance) {
        result.textContent = 'Invalid bet amount or insufficient balance!';
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

    // We'll evaluate all 4 rows
    const rowsToEvaluate = [0, 1, 2, 3]; // 0-based indices for the 4 rows
    const rowSymbols = rowsToEvaluate.map(rowIndex => [
        reel1Symbols[Math.floor(Math.random() * reel1Symbols.length)],
        reel2Symbols[Math.floor(Math.random() * reel2Symbols.length)],
        reel3Symbols[Math.floor(Math.random() * reel3Symbols.length)],
        reel4Symbols[Math.floor(Math.random() * reel4Symbols.length)],
        reel5Symbols[Math.floor(Math.random() * reel5Symbols.length)]
    ]);

    // Generate spin durations to total ~5 seconds
    const totalSpinTime = 5000; // 5 seconds
    const baseDuration = 2000; // Minimum spin time for the first reel
    const durationIncrement = (totalSpinTime - baseDuration) / 4; // Distribute remaining time across reels
    const spinDurations = strips.map((_, index) => {
        const minDuration = baseDuration + index * durationIncrement;
        const randomExtra = Math.random() * 200; // Small random variation
        return minDuration + randomExtra;
    });

    strips.forEach((strip, index) => {
        strip.element.classList.add('spinning');

        setTimeout(() => {
            strip.element.classList.remove('spinning');
            strip.element.style.animation = ''; // Stop the animation
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

            reelStopSound.currentTime = 0;
            reelStopSound.play();
        }, spinDurations[index]);
    });

    setTimeout(() => {
        // Organize symbols by reel (column) instead of by row
        const reelSymbols = [];
        for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
            const reel = rowsToEvaluate.map(rowIndex => rowSymbols[rowIndex][reelIndex]);
            reelSymbols.push(reel);
        }

        // Calculate the payout based on symbols in each reel
        const totalPayout = calculatePayout(reelSymbols, bet);

        balance += totalPayout;
        balanceDisplay.textContent = balance;

        if (totalPayout > 0) {
            result.textContent = `You won ${totalPayout}! 🎉`;
            // Check for jackpot condition across the entire grid
            const allSymbols = rowSymbols.flat();
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

function calculatePayout(reelSymbols, bet) {
    // Log the symbols in each reel for debugging
    reelSymbols.forEach((reel, index) => {
        console.log(`Reel ${index + 1} symbols:`, reel.map(s => s.name).join(', '));
    });

    // Check for jackpot: At least one 4x, two 777, one 2x, one 0x across the entire grid
    const allSymbols = reelSymbols.flat();
    if (allSymbols.filter(symbol => symbol.name === '4x').length >= 1 &&
        allSymbols.filter(symbol => symbol.name === '777').length >= 2 &&
        allSymbols.filter(symbol => symbol.name === '2x').length >= 1 &&
        allSymbols.filter(symbol => symbol.name === '0x').length >= 1) {
        console.log("Jackpot condition met!");
        return applyMultiplier(allSymbols, bet * 1000); // Jackpot: 1,000x
    }

    // Check each reel for either a 7 or a Bar
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

    console.log("hasSevenOrBarInEachReel:", hasSevenOrBarInEachReel);

    // If each reel has either a 7 or a Bar, award 5x payout
    if (hasSevenOrBarInEachReel) {
        console.log("5x payout condition met!");
        return applyMultiplier(allSymbols, bet * 5); // Each reel has a 7 or a Bar: 5x
    }

    return 0;
}

// Apply multiplier based on symbols present
function applyMultiplier(allSymbols, payout) {
    let multiplier = 1;
    allSymbols.forEach(symbol => {
        if (symbol.name === '2x') multiplier *= 2;
        if (symbol.name === '4x') multiplier *= 4;
        if (symbol.name === '0x') multiplier *= 1; // Updated to 1 instead of 0
    });
    return payout * multiplier;
}
// Set initial background and populate reels on page load
document.addEventListener('DOMContentLoaded', () => {
    changeBackground();
    populateReelStrips();
});
console.log(window.data[0]);

let currentQuestion = null;
let currentPrize = 100;
const prizeLevels = [100, 200, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
let timerInterval = null;
let timeLeft = 20; // Changed to 20 seconds
let lifelineSoundPlaying = false;
let isSoundOn = false;

// Track lifeline usage
let callJesseUsed = false;
let askGusUsed = false;
let pollCartelUsed = false;

// Audio elements
const countdownSound = new Audio('assets/audio/countdown.mp3');
const callJesseSound = new Audio('assets/audio/call-button-sound.mp3');
const askGusSound = new Audio('assets/audio/ask-button-sound.mp3');
const pollCartelSound = new Audio('assets/audio/poll-button-sound.mp3');
const correctSound = new Audio('assets/audio/correct-answer.mp3');
const wrongSound = new Audio('assets/audio/wrong-answer.mp3');

// Function to toggle sound
function toggleSound() {
  isSoundOn = !isSoundOn;
  const soundToggleButton = document.getElementById('sound-toggle');
  if (isSoundOn) {
    soundToggleButton.classList.remove('sound-off');
    soundToggleButton.classList.add('sound-on');
    soundToggleButton.textContent = '🔊';
    if (timerInterval && timeLeft > 0) {
      countdownSound.loop = true;
      countdownSound.play();
    }
  } else {
    soundToggleButton.classList.remove('sound-on');
    soundToggleButton.classList.add('sound-off');
    soundToggleButton.textContent = '🔇';
    stopAllSounds();
  }
}

// Function to display a message in a smoke poof
function showSmokeMessage(message) {
  const smokeMessage = document.getElementById('smoke-message');
  const smokeMessageContent = document.getElementById('smoke-message-content');
  smokeMessageContent.textContent = message;
  smokeMessage.style.display = 'flex';
  smokeMessage.classList.remove('smoke-message');
  void smokeMessage.offsetWidth;
  smokeMessage.classList.add('smoke-message');
  setTimeout(() => {
    smokeMessage.style.display = 'none';
  }, 3000);
}

// Helper function to get a hint for "Ask Gus"
function getGusHint(column, stage) {
  const hints = {
    // FoxFarm Nutrients
    "Beastie Bloomz®": {
      "GERMINATION": "Beastie Bloomz® is not used during germination. It’s for later stages like flowering.",
      "VEGETATIVE": "Beastie Bloomz® is typically not used in the vegetative stage. It’s more common in flowering.",
      "FLOWERING": "Beastie Bloomz® is often used in the flowering stage to boost bud development, around 0.5-1 tsp per gallon."
    },
    "Cal-Mag® Plus": {
      "GERMINATION": "Cal-Mag® Plus is usually not needed during germination, but a small amount like 0.5mL might be used if starting in a medium.",
      "VEGETATIVE": "Cal-Mag® Plus is often used in vegetative growth to support leaf development, usually around 5-10mL.",
      "FLOWERING": "Cal-Mag® Plus might still be used in flowering, but the amount could decrease. Check the day."
    },
    "Bio·Bloom": {
      "GERMINATION": "Bio·Bloom is not used during germination. It’s for later stages like flowering.",
      "VEGETATIVE": "Bio·Bloom is often used in small amounts during vegetative stage, around 5mL.",
      "FLOWERING": "Bio·Bloom is more common in flowering, often around 10-15mL."
    },
    "Tiger Bloom®": {
      "GERMINATION": "Tiger Bloom® is not used during germination. It’s for flowering stages.",
      "VEGETATIVE": "Tiger Bloom® is typically not used in vegetative stage. It’s more for flowering.",
      "FLOWERING": "Tiger Bloom® is often used in flowering to enhance blooms, around 2-3 tsp per gallon."
    },
    "Big Bloom®": {
      "GERMINATION": "Big Bloom® can be used lightly during germination, around 1-2 Tbsp per gallon, to support early growth.",
      "VEGETATIVE": "Big Bloom® can be used in vegetative stage for organic growth, often around 2-4 Tbsp per gallon.",
      "FLOWERING": "Big Bloom® is great in flowering to enhance blooms, often around 2-4 Tbsp per gallon."
    },
    "Grow Big®": {
      "GERMINATION": "Grow Big® is not typically used during germination. It’s for vegetative growth.",
      "VEGETATIVE": "Grow Big® is ideal for vegetative growth, usually around 2-3 tsp per gallon.",
      "FLOWERING": "Grow Big® is typically reduced or stopped in flowering to focus on bloom nutrients."
    },
    "Boomerang®": {
      "GERMINATION": "Boomerang® is not used during germination. It’s for stressed plants in later stages.",
      "VEGETATIVE": "Boomerang® can be used in vegetative stage to help stressed plants recover, around 1-2 tsp per gallon.",
      "FLOWERING": "Boomerang® can help flowering plants recover from stress, around 1-2 tsp per gallon."
    },
    "Kangaroots®": {
      "GERMINATION": "Kangaroots® can be used during germination to enhance root development, around 0.5-1 tsp per gallon.",
      "VEGETATIVE": "Kangaroots® supports root growth in vegetative stage, often around 1-2 tsp per gallon.",
      "FLOWERING": "Kangaroots® can still be used in flowering to maintain healthy roots, around 1 tsp per gallon."
    },
    "Microbe Brew®": {
      "GERMINATION": "Microbe Brew® can be used lightly during germination to establish microbial life, around 0.5 tsp per gallon.",
      "VEGETATIVE": "Microbe Brew® enhances microbial activity in vegetative stage, around 1 tsp per gallon.",
      "FLOWERING": "Microbe Brew® supports root health in flowering, around 1 tsp per gallon."
    },
    "Wholly Mackerel®": {
      "GERMINATION": "Wholly Mackerel® can be used lightly during germination for organic nutrients, around 0.5 tsp per gallon.",
      "VEGETATIVE": "Wholly Mackerel® provides organic nutrients in vegetative stage, around 1-2 tsp per gallon.",
      "FLOWERING": "Wholly Mackerel® can be used in flowering for additional organic support, around 1 tsp per gallon."
    },
    "Kelp Me Kelp You®": {
      "GERMINATION": "Kelp Me Kelp You® can be used during germination to boost early growth, around 0.5 tsp per gallon.",
      "VEGETATIVE": "Kelp Me Kelp You® supports vegetative growth with kelp extracts, around 1-2 tsp per gallon.",
      "FLOWERING": "Kelp Me Kelp You® can enhance flowering with kelp benefits, around 1 tsp per gallon."
    },
    "Bembé®": {
      "GERMINATION": "Bembé® is not typically used during germination. It’s for flowering stages.",
      "VEGETATIVE": "Bembé® can be used sparingly in vegetative stage, around 0.5 tsp per gallon.",
      "FLOWERING": "Bembé® enhances flowering with sweet nutrients, around 1-2 tsp per gallon."
    },
    "Open Sesame®": {
      "GERMINATION": "Open Sesame® is not used during germination. It’s for early flowering.",
      "VEGETATIVE": "Open Sesame® is typically not used in vegetative stage. It’s for early flowering.",
      "FLOWERING": "Open Sesame® is used in early flowering to trigger blooms, around 0.5-1 tsp per gallon."
    },
    "Cha Ching®": {
      "GERMINATION": "Cha Ching® is not used during germination. It’s for late flowering.",
      "VEGETATIVE": "Cha Ching® is typically not used in vegetative stage. It’s for late flowering.",
      "FLOWERING": "Cha Ching® is used in late flowering to maximize production, around 0.5-1 tsp per gallon."
    },
    // General Hydroponics Nutrients
    "FloraGro®": {
      "GERMINATION": "FloraGro® is not typically used during germination. It’s for vegetative growth.",
      "VEGETATIVE": "FloraGro® is used in vegetative stage for structural growth, often around 1-2 tsp per gallon.",
      "FLOWERING": "FloraGro® is reduced in flowering, often around 0.5-1 tsp per gallon."
    },
    "FloraBloom®": {
      "GERMINATION": "FloraBloom® is not used during germination. It’s for flowering stages.",
      "VEGETATIVE": "FloraBloom® is used sparingly in vegetative stage, around 0.5-1 tsp per gallon.",
      "FLOWERING": "FloraBloom® is key in flowering for bloom development, often around 2-3 tsp per gallon."
    },
    "FloraMicro®": {
      "GERMINATION": "FloraMicro® can be used lightly during germination for micronutrients, around 0.5 tsp per gallon.",
      "VEGETATIVE": "FloraMicro® provides essential micronutrients in vegetative stage, around 1-2 tsp per gallon.",
      "FLOWERING": "FloraMicro® continues in flowering for micronutrient support, around 1-2 tsp per gallon."
    },
    "FloraNova Grow": {
      "GERMINATION": "FloraNova Grow is not typically used during germination. It’s for vegetative growth.",
      "VEGETATIVE": "FloraNova Grow is ideal for vegetative growth, around 1-2 tsp per gallon.",
      "FLOWERING": "FloraNova Grow is typically reduced in flowering to focus on bloom nutrients."
    },
    "FloraNova Bloom": {
      "GERMINATION": "FloraNova Bloom is not used during germination. It’s for flowering stages.",
      "VEGETATIVE": "FloraNova Bloom is used sparingly in vegetative stage, around 0.5 tsp per gallon.",
      "FLOWERING": "FloraNova Bloom is key in flowering for bloom development, around 1-2 tsp per gallon."
    },
    // Advanced Nutrients
    "VooDoo Juice": {
      "GERMINATION": "VooDoo Juice can be used during germination to boost root microbes, around 2mL per liter.",
      "VEGETATIVE": "VooDoo Juice enhances root development in vegetative stage, around 2mL per liter.",
      "FLOWERING": "VooDoo Juice can still be used in flowering for root health, around 2mL per liter."
    },
    "Big Bud": {
      "GERMINATION": "Big Bud is not used during germination. It’s for flowering stages.",
      "VEGETATIVE": "Big Bud is typically not used in vegetative stage. It’s for flowering.",
      "FLOWERING": "Big Bud enhances bud development in flowering, around 2mL per liter."
    },
    "B-52": {
      "GERMINATION": "B-52 can be used lightly during germination for B-vitamins, around 1mL per liter.",
      "VEGETATIVE": "B-52 provides B-vitamins for vegetative growth, around 2mL per liter.",
      "FLOWERING": "B-52 supports flowering with B-vitamins, around 2mL per liter."
    },
    "Overdrive": {
      "GERMINATION": "Overdrive is not used during germination. It’s for late flowering.",
      "VEGETATIVE": "Overdrive is typically not used in vegetative stage. It’s for late flowering.",
      "FLOWERING": "Overdrive boosts late flowering for bigger yields, around 2mL per liter."
    },
    "Piranha": {
      "GERMINATION": "Piranha can be used during germination to establish beneficial fungi, around 2mL per liter.",
      "VEGETATIVE": "Piranha enhances root fungi in vegetative stage, around 2mL per liter.",
      "FLOWERING": "Piranha supports root health in flowering, around 2mL per liter."
    },
    "Bud Candy": {
      "GERMINATION": "Bud Candy is not typically used during germination. It’s for flowering.",
      "VEGETATIVE": "Bud Candy can be used sparingly in vegetative stage, around 1mL per liter.",
      "FLOWERING": "Bud Candy enhances flavor and aroma in flowering, around 2mL per liter."
    },
    "Final Phaze": {
      "GERMINATION": "Final Phaze is not used during germination. It’s for flushing at the end.",
      "VEGETATIVE": "Final Phaze is not used in vegetative stage. It’s for flushing.",
      "FLOWERING": "Final Phaze is used at the end of flowering to flush, around 2mL per liter."
    },
    "Tarantula": {
      "GERMINATION": "Tarantula can be used during germination to establish beneficial bacteria, around 2mL per liter.",
      "VEGETATIVE": "Tarantula enhances root bacteria in vegetative stage, around 2mL per liter.",
      "FLOWERING": "Tarantula supports root health in flowering, around 2mL per liter."
    },
    "Nirvana": {
      "GERMINATION": "Nirvana can be used lightly during germination for organic nutrients, around 1mL per liter.",
      "VEGETATIVE": "Nirvana provides organic nutrients in vegetative stage, around 2mL per liter.",
      "FLOWERING": "Nirvana enhances flowering with organic support, around 2mL per liter."
    },
    "Sensizym": {
      "GERMINATION": "Sensizym can be used during germination to break down dead roots, around 1mL per liter.",
      "VEGETATIVE": "Sensizym helps break down dead roots in vegetative stage, around 2mL per liter.",
      "FLOWERING": "Sensizym supports root health in flowering, around 2mL per liter."
    },
    "Bud Ignitor": {
      "GERMINATION": "Bud Ignitor is not used during germination. It’s for early flowering.",
      "VEGETATIVE": "Bud Ignitor is typically not used in vegetative stage. It’s for early flowering.",
      "FLOWERING": "Bud Ignitor triggers early flowering for more bud sites, around 2mL per liter."
    },
    "Rhino Skin": {
      "GERMINATION": "Rhino Skin is not typically used during germination. It’s for later stages.",
      "VEGETATIVE": "Rhino Skin strengthens plant structure in vegetative stage, around 2mL per liter.",
      "FLOWERING": "Rhino Skin enhances plant strength in flowering, around 2mL per liter."
    },
    "Bud Factor X": {
      "GERMINATION": "Bud Factor X is not typically used during germination. It’s for flowering.",
      "VEGETATIVE": "Bud Factor X can be used sparingly in vegetative stage, around 1mL per liter.",
      "FLOWERING": "Bud Factor X enhances resin and aroma in flowering, around 2mL per liter."
    },
    "pH Perfect® Grow": {
      "GERMINATION": "pH Perfect® Grow is not typically used during germination. It’s for vegetative growth.",
      "VEGETATIVE": "pH Perfect® Grow is ideal for vegetative growth, around 4mL per liter.",
      "FLOWERING": "pH Perfect® Grow is typically reduced in flowering to focus on bloom nutrients."
    },
    "pH Perfect® Micro": {
      "GERMINATION": "pH Perfect® Micro can be used lightly during germination for micronutrients, around 1mL per liter.",
      "VEGETATIVE": "pH Perfect® Micro provides micronutrients in vegetative stage, around 4mL per liter.",
      "FLOWERING": "pH Perfect® Micro continues in flowering for micronutrient support, around 4mL per liter."
    },
    "pH Perfect® Bloom": {
      "GERMINATION": "pH Perfect® Bloom is not used during germination. It’s for flowering stages.",
      "VEGETATIVE": "pH Perfect® Bloom is used sparingly in vegetative stage, around 1mL per liter.",
      "FLOWERING": "pH Perfect® Bloom is key in flowering for bloom development, around 4mL per liter."
    }
  };
  return hints[column]?.[stage] || "'Check the stage of growth for this nutrient.'";
}

function generateQuestion() {
  const row = window.data[Math.floor(Math.random() * window.data.length)];
  const stage = row.Stage;
  const day = row.Day;

  const columns = [
    // FoxFarm Nutrients
    "Beastie Bloomz®",
    "Cal-Mag® Plus",
    "Bio·Bloom",
    "Tiger Bloom®",
    "Big Bloom®",
    "Grow Big®",
    "Boomerang®",
    "Kangaroots®",
    "Microbe Brew®",
    "Wholly Mackerel®",
    "Kelp Me Kelp You®",
    "Bembé®",
    "Open Sesame®",
    "Cha Ching®",
    // General Hydroponics Nutrients
    "FloraGro®",
    "FloraBloom®",
    "FloraMicro®",
    "FloraNova Grow",
    "FloraNova Bloom",
    // Advanced Nutrients
    "VooDoo Juice",
    "Big Bud",
    "B-52",
    "Overdrive",
    "Piranha",
    "Bud Candy",
    "Final Phaze",
    "Tarantula",
    "Nirvana",
    "Sensizym",
    "Bud Ignitor",
    "Rhino Skin",
    "Bud Factor X",
    "pH Perfect® Grow",
    "pH Perfect® Micro",
    "pH Perfect® Bloom"
  ];
  const column = columns[Math.floor(Math.random() * columns.length)];
  const correctAnswer = row[column] || "None";

  const wrongAnswers = ["5mL", "10mL", "15mL", "None"].filter(a => a !== correctAnswer);
  const options = [
    correctAnswer,
    ...wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
  ].sort(() => Math.random() - 0.5);

  return {
    question: `On Day ${day} of ${stage}, what is the amount of ${column} you give your plant?`,
    options: options.map((opt, i) => `${String.fromCharCode(65 + i)}.) ${opt}`),
    correct: String.fromCharCode(65 + options.indexOf(correctAnswer)),
    correctAnswer: correctAnswer,
    stage: stage,
    column: column
  };
}

function startTimer() {
  stopAllSounds();
  timeLeft = 20; // Changed to 20 seconds
  const timerDisplay = document.getElementById('timer');
  timerDisplay.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
  if (isSoundOn) {
    countdownSound.loop = true;
    countdownSound.play();
  }

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      countdownSound.pause();
      showSmokeMessage("Time's up! Game Over.");
      if (isSoundOn) wrongSound.play();
      setTimeout(resetGame, 3000);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  countdownSound.pause();
}

function stopAllSounds() {
  countdownSound.pause();
  callJesseSound.pause();
  askGusSound.pause();
  pollCartelSound.pause();
  correctSound.pause();
  wrongSound.pause();
  lifelineSoundPlaying = false;
}

function displayQuestion() {
  currentQuestion = generateQuestion();
  document.querySelector('.question').textContent = currentQuestion.question;
  const buttons = document.querySelectorAll('.options button');
  buttons.forEach((button, i) => {
    button.textContent = currentQuestion.options[i];
    button.disabled = false;
  });
  document.querySelector('.prize').textContent = `$${currentPrize}`;
  startTimer();
}

function checkAnswer(selected) {
  stopTimer();
  stopAllSounds();
  if (selected === currentQuestion.correct) {
    showSmokeMessage("Correct! Moving to the next question...");
    if (isSoundOn) correctSound.play();
    const currentIndex = prizeLevels.indexOf(currentPrize);
    if (currentIndex < prizeLevels.length - 1) {
      currentPrize = prizeLevels[currentIndex + 1];
      setTimeout(displayQuestion, 3000);
    } else {
      showSmokeMessage("Congratulations! You've won $1,000,000 in Heisenberg Bucks!");
      setTimeout(resetGame, 3000);
    }
  } else {
    showSmokeMessage("Wrong! Game Over.");
    if (isSoundOn) wrongSound.play();
    setTimeout(resetGame, 3000);
  }
}

function resetGame() {
  currentPrize = 100;
  stopAllSounds();
  // Reset lifeline usage
  callJesseUsed = false;
  askGusUsed = false;
  pollCartelUsed = false;
  // Re-enable lifeline buttons
  document.getElementById('call-jesse').disabled = false;
  document.getElementById('ask-gus').disabled = false;
  document.getElementById('poll-cartel').disabled = false;
  displayQuestion();
  document.getElementById('poll-results').style.display = 'none';
}

// Lifelines
document.getElementById('call-jesse').addEventListener('click', () => {
  if (callJesseUsed) return; // Prevent reuse
  callJesseUsed = true;
  document.getElementById('call-jesse').disabled = true; // Disable after use
  if (isSoundOn && !lifelineSoundPlaying) {
    callJesseSound.play();
    lifelineSoundPlaying = true;
  }
  const buttons = document.querySelectorAll('.options button');
  const wrongOptions = Array.from(buttons).filter((btn, i) => String.fromCharCode(65 + i) !== currentQuestion.correct);
  wrongOptions.slice(0, 2).forEach(btn => {
    btn.disabled = true;
  });
  showSmokeMessage("Two wrong answers have been removed!");
});

document.getElementById('ask-gus').addEventListener('click', () => {
  if (askGusUsed) return; // Prevent reuse
  askGusUsed = true;
  document.getElementById('ask-gus').disabled = true; // Disable after use
  if (isSoundOn && !lifelineSoundPlaying) {
    askGusSound.play();
    lifelineSoundPlaying = true;
  }
  const hint = getGusHint(currentQuestion.column, currentQuestion.stage);
  showSmokeMessage(hint);
});

document.getElementById('poll-cartel').addEventListener('click', () => {
  if (pollCartelUsed) return; // Prevent reuse
  pollCartelUsed = true;
  document.getElementById('poll-cartel').disabled = true; // Disable after use
  if (isSoundOn && !lifelineSoundPlaying) {
    pollCartelSound.play();
    lifelineSoundPlaying = true;
  }
  const correctIndex = currentQuestion.correct.charCodeAt(0) - 65;
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
});

// Sound toggle button
document.getElementById('sound-toggle').addEventListener('click', toggleSound);

// Start the game
displayQuestion();
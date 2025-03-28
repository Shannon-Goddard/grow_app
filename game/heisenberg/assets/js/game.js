// Log the initial state of the smoke-message element
document.addEventListener('DOMContentLoaded', () => {
  const smokeMessage = document.getElementById('smoke-message');
  // Remove: console.log("Initial state of smoke-message:", smokeMessage.style.display);
});

// Remove: console.log(window.data[0]);

// Game State
let currentQuestion = null;
window.currentQuestion = currentQuestion;
let currentPrize = 100;
window.currentPrize = currentPrize;
const prizeLevels = [100, 200, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
let timerInterval = null;
let timeLeft = 20;
let lifelineSoundPlaying = false;
window.lifelineSoundPlaying = lifelineSoundPlaying;
let isSoundOn = false;
window.isSoundOn = isSoundOn;
let gameInitialized = false;
window.gameInitialized = gameInitialized;

// Audio elements
const countdownSound = new Audio('assets/audio/countdown.mp3');
window.countdownSound = countdownSound;
const callJesseSound = new Audio('assets/audio/call-button-sound.mp3');
window.callJesseSound = callJesseSound;
const askGusSound = new Audio('assets/audio/ask-button-sound.mp3');
window.askGusSound = askGusSound;
const pollCartelSound = new Audio('assets/audio/poll-button-sound.mp3');
window.pollCartelSound = pollCartelSound;
const correctSound = new Audio('assets/audio/correct-answer.mp3');
window.correctSound = correctSound;
const wrongSound = new Audio('assets/audio/wrong-answer.mp3');
window.wrongSound = wrongSound;

// Function to toggle sound
function toggleSound() {
  try {
    isSoundOn = !isSoundOn;
    window.isSoundOn = isSoundOn;
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
  } catch (error) {
    console.error("Error in toggleSound:", error);
  }
}

function generateQuestion() {
  try {
    const row = window.data[Math.floor(Math.random() * window.data.length)];
    const stage = row.Stage;
    const day = row.Day;

    const columns = [
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
      "FloraGro®",
      "FloraBloom®",
      "FloraMicro®",
      "FloraNova Grow",
      "FloraNova Bloom",
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
  } catch (error) {
    console.error("Error in generateQuestion:", error);
    return null;
  }
}

function startTimer() {
  try {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    stopAllSounds();
    timeLeft = 20;
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
        timerInterval = null;
        countdownSound.pause();
        showSmokeMessage("Time's up! Game Over.");
        if (isSoundOn) wrongSound.play();
        setTimeout(() => {
          if (!window.isSmokeMessageActive) {
            resetGame();
          } else {
            const checkInterval = setInterval(() => {
              if (!window.isSmokeMessageActive) {
                clearInterval(checkInterval);
                resetGame();
              }
            }, 100);
          }
        }, 3100);
      }
    }, 1000);
  } catch (error) {
    console.error("Error in startTimer:", error);
  }
}

function stopTimer() {
  try {
    clearInterval(timerInterval);
    timerInterval = null;
    countdownSound.pause();
  } catch (error) {
    console.error("Error in stopTimer:", error);
  }
}

function stopAllSounds() {
  try {
    countdownSound.pause();
    callJesseSound.pause();
    askGusSound.pause();
    pollCartelSound.pause();
    correctSound.pause();
    wrongSound.pause();
    lifelineSoundPlaying = false;
    window.lifelineSoundPlaying = lifelineSoundPlaying;
  } catch (error) {
    console.error("Error in stopAllSounds:", error);
  }
}

function displayQuestion() {
  try {
    // Remove: console.log("displayQuestion called");
    currentQuestion = generateQuestion();
    window.currentQuestion = currentQuestion;
    if (!currentQuestion) throw new Error("Failed to generate question");
    document.querySelector('.question').textContent = currentQuestion.question;
    const buttons = document.querySelectorAll('.options button');
    buttons.forEach((button, i) => {
      button.textContent = currentQuestion.options[i];
      button.disabled = false;
    });
    document.querySelector('.prize').textContent = `$${currentPrize}`;
    startTimer();
  } catch (error) {
    console.error("Error in displayQuestion:", error);
  }
}

function checkAnswer(selected) {
  try {
    stopTimer();
    stopAllSounds();
    if (selected === currentQuestion.correct) {
      showSmokeMessage("Correct! Moving to the next question...");
      if (isSoundOn) correctSound.play();
      const currentIndex = prizeLevels.indexOf(currentPrize);
      if (currentIndex < prizeLevels.length - 1) {
        currentPrize = prizeLevels[currentIndex + 1];
        window.currentPrize = currentPrize;
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
  } catch (error) {
    console.error("Error in checkAnswer:", error);
  }
}

function resetGame() {
  try {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    currentPrize = 100;
    window.currentPrize = currentPrize;
    stopAllSounds();
    window.callJesseUsed = false;
    window.askGusUsed = false;
    window.pollCartelUsed = false;
    // Remove: console.log("After reset, lifeline states:", { callJesseUsed: window.callJesseUsed, askGusUsed: window.askGusUsed, pollCartelUsed: window.pollCartelUsed });
    document.getElementById('call-jesse').disabled = false;
    document.getElementById('ask-gus').disabled = false;
    document.getElementById('poll-cartel').disabled = false;
    document.getElementById('poll-results').style.display = 'none';
    displayQuestion();
  } catch (error) {
    console.error("Error in resetGame:", error);
  }
}

// Sound toggle button
document.getElementById('sound-toggle').addEventListener('click', toggleSound);

// Start the game
displayQuestion();
gameInitialized = true;
window.gameInitialized = gameInitialized;
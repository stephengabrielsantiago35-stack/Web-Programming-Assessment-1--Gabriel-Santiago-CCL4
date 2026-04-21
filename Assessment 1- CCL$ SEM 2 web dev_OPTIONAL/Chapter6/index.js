// index.js – RGB guessing game with lives & score
// contains all game logic, UI updates, and event handling

// ---------- DOM element references ----------
const rgbSpan = document.getElementById('rgbValue');           // Element displaying target RGB
const livesDisplay = document.getElementById('livesDisplay'); // Element displaying hearts for lives
const scoreSpan = document.getElementById('scoreDisplay');    // Element displaying current score
const gridContainer = document.getElementById('gridContainer'); // Container for color squares
const messageArea = document.getElementById('messageArea');   // Area for feedback messages
const resetBtn = document.getElementById('resetGameBtn');     // New game button
const modalOverlay = document.getElementById('gameOverModal'); // Modal overlay element
const finalScoreSpan = document.getElementById('finalScoreSpan'); // Final score in modal
const replayBtn = document.getElementById('replayBtn');       // Play again button in modal

// ---------- game state ----------
let targetColor = { r: 0, g: 0, b: 0 };          // correct RGB for current round (object with r,g,b properties)
let lives = 3;                                    // remaining lives (starts at 3)
let score = 0;                                    // correct guesses (score counter)
let gameActive = true;                             // if false, no clicks are processed (game over state)
let squares = [];                                  // array of square DOM elements (rebuilt each round)
let currentColors = [];                            // array of {r,g,b} objects for each square (index matches square)

// ---------- helper: generate random 0-255 ----------
const rand = () => Math.floor(Math.random() * 256); // Returns random integer between 0-255 inclusive

// ---------- generate random RGB object ----------
const randomRGB = () => ({ r: rand(), g: rand(), b: rand() }); // Returns object with random r,g,b values

// ---------- format RGB object to css string ----------
const toCssRGB = (rgb) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`; // Converts RGB object to CSS color string

// ---------- update lives display (hearts) ----------
function updateLivesUI() {
  let hearts = '';                                // Start with empty string
  for (let i = 0; i < lives; i++) hearts += '❤️';  // Add a heart for each remaining life
  // if no lives, show empty hearts (optional)
  livesDisplay.textContent = hearts || '🖤';       // Show hearts or black heart if zero lives
}

// ---------- update score UI ----------
function updateScoreUI() {
  scoreSpan.textContent = score;                   // Update score display with current score
}

// ---------- disable a single square (on wrong guess) ----------
function disableSquare(index) {
  const square = squares[index];                    // Get square by index
  if (!square) return;                              // Safety check - exit if square doesn't exist
  square.classList.add('disabled');                 // Add disabled class (grays out and removes pointer events)
  // also remove pointer events via CSS, but we also check in click handler
}

// ---------- reset all squares to active (remove disabled) ----------
function enableAllSquares() {
  squares.forEach(sq => sq.classList.remove('disabled')); // Remove disabled class from every square
}

// ---------- generate a new round: new target & new colours ----------
function newRound() {
  if (!gameActive) return; // do not generate new round if game over

  // 1. generate new target colour
  targetColor = randomRGB();                         // Create random target color
  rgbSpan.textContent = toCssRGB(targetColor);       // Display target RGB value

  // 2. build array of 6 colours: 1 correct + 5 random
  const colourSet = [targetColor];                    // Start with correct color
  for (let i = 0; i < 5; i++) {                       // Add 5 random colors
    colourSet.push(randomRGB());
  }
  
  // shuffle the array so correct is not always first
  for (let i = colourSet.length - 1; i > 0; i--) {    // Fisher-Yates shuffle algorithm
    const j = Math.floor(Math.random() * (i + 1));    // Pick random index from 0 to i
    [colourSet[i], colourSet[j]] = [colourSet[j], colourSet[i]]; // Swap elements
  }
  currentColors = [...colourSet]; // store for comparison (spread operator creates copy)

  // 3. create or update squares in the grid
  // first clear container
  gridContainer.innerHTML = '';                       // Remove all existing squares
  squares = [];                                       // Reset squares array

  // create 6 square elements, assign background, attach listener
  for (let i = 0; i < colourSet.length; i++) {
    const square = document.createElement('div');     // Create new div element
    square.className = 'square';                       // Add square class for styling
    square.style.backgroundColor = toCssRGB(colourSet[i]); // Set background color
    // store index as data attribute for easy retrieval
    square.dataset.index = i;                          // Store index in data-index attribute
    // add click listener
    square.addEventListener('click', squareClickHandler); // Attach click handler
    gridContainer.appendChild(square);                 // Add square to grid
    squares.push(square);                              // Store reference in squares array
  }

  // 4. ensure no square is disabled (new round = all active)
  enableAllSquares();

  // 5. update message (optional)
  messageArea.textContent = '➤ new round · pick a colour';
}

// ---------- click handler for squares ----------
function squareClickHandler(e) {
  if (!gameActive) return; // game over – no interaction

  const square = e.currentTarget;                      // The clicked square element
  // if square already disabled, do nothing (extra safety)
  if (square.classList.contains('disabled')) return;   // Exit if already disabled

  const index = parseInt(square.dataset.index, 10);    // Get index from data attribute
  const clickedColor = currentColors[index];           // Get RGB object for clicked square

  // compare with target color (deep compare)
  const isCorrect = (
    clickedColor.r === targetColor.r &&                 // Compare red values
    clickedColor.g === targetColor.g &&                 // Compare green values
    clickedColor.b === targetColor.b                    // Compare blue values
  );

  if (isCorrect) {
    // ---------- CORRECT GUESS ----------
    score += 1;                                         // Increment score
    updateScoreUI();                                    // Update score display
    messageArea.textContent = '✅ correct! +1 point · next round';
    // start a new round (all squares reset)
    newRound();                                         // Generate new colors and target
  } else {
    // ---------- INCORRECT GUESS ----------
    lives -= 1;                                         // Decrease lives
    updateLivesUI();                                    // Update hearts display
    // disable the clicked square so it cannot be clicked again this round
    disableSquare(index);                               // Gray out this square
    messageArea.textContent = `❌ wrong · life lost (${lives} left)`;

    // check if game over (lives === 0)
    if (lives <= 0) {
      gameActive = false;                               // Deactivate game
      endGame();                                        // Show game over modal
    }
    // if still active, the round continues with the remaining active squares
  }
}

// ---------- end game: show modal with final score ----------
function endGame() {
  gameActive = false;                                   // Disable further clicks
  finalScoreSpan.textContent = score;                   // Set final score in modal
  modalOverlay.classList.add('show');                    // Show modal (adds show class)
  // optional: disable all squares visually (already disabled by gameActive, but also add class)
  squares.forEach(sq => sq.classList.add('disabled'));  // Disable all squares
  messageArea.textContent = '💀 game over · no lives left'; // Update message
}

// ---------- reset everything (new game) ----------
function resetGame() {
  // reset state
  lives = 3;                                            // Reset lives to 3
  score = 0;                                            // Reset score to 0
  gameActive = true;                                    // Reactivate game
  updateLivesUI();                                      // Update hearts display
  updateScoreUI();                                      // Update score display
  // hide modal if visible
  modalOverlay.classList.remove('show');                 // Hide modal
  // generate first round
  newRound();                                           // Start new round
  messageArea.textContent = '➤ new game · good luck!';  // Welcome message
}

// ---------- attach event listeners to control buttons ----------
resetBtn.addEventListener('click', resetGame);          // Reset button triggers resetGame

replayBtn.addEventListener('click', () => {             // Replay button in modal
  resetGame();                                           // Also calls resetGame
});

// optional: close modal if click outside? not necessary, but user-friendly
window.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    // clicking backdrop does nothing, but we could close? we keep it intentional
    // we'll keep it as is – only replay button closes.
  }
});

// ---------- initialise game on page load ----------
resetGame(); // this sets everything up, including first round

// ---------- extra comments for clarity ----------
/*
  The game flow:
  - Each round presents a target RGB and 6 coloured squares.
  - One square exactly matches the target, the rest are random.
  - Clicking the correct square: score++, new round begins.
  - Clicking a wrong square: that square becomes disabled (cannot be guessed again),
    life is deducted. If lives reach 0 → game over modal.
  - The round continues until the correct square is found or lives hit 0.
  - "New game" button resets lives, score, and starts fresh.
  - All game state is stored in JS, UI reflects changes immediately.
*/
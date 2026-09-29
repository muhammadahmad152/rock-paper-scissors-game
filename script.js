// Selecting DOM Elements
const userScoreEl = document.getElementById('user-score');
const computerScoreEl = document.getElementById('computer-score');
const highScoreEl = document.getElementById('high-score');
const playerChoiceEl = document.getElementById('player-choice');
const computerChoiceEl = document.getElementById('computer-choice');
const resultEl = document.getElementById('result');
const historyList = document.getElementById('history-list');
const gameModeSelect = document.getElementById('game-mode');

// Buttons
const rockBtn = document.getElementById('rock');
const paperBtn = document.getElementById('paper');
const scissorsBtn = document.getElementById('scissors');
const resetBtn = document.getElementById('reset-btn');

// Game Variables
let userScore = 0;
let computerScore = 0;
let isProcessing = false;

// Load High Score from Local Storage
let highScore = localStorage.getItem('rpsHighScore') || 0;
highScoreEl.textContent = highScore;

// Moves setup
const moves = {
    rock: { name: 'Rock', emoji: '👊' },
    paper: { name: 'Paper', emoji: '✋' },
    scissors: { name: 'Scissors', emoji: '✌️' }
};

// Computer Choice Generator
function getComputerChoice() {
    const keys = Object.keys(moves);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return moves[keys[randomIndex]];
}

// Main Game Function
function playRound(playerMoveKey) {
    if (isProcessing) return; // Prevent spam clicking

    const targetScore = parseInt(gameModeSelect.value);

    // Stop game if match was already won in Best of 3 / 5
    if (targetScore > 0 && (userScore >= targetScore || computerScore >= targetScore)) {
        return;
    }

    isProcessing = true;
    const playerMove = moves[playerMoveKey];

    // Show Player Choice Immediately
    playerChoiceEl.textContent = playerMove.emoji;
    computerChoiceEl.textContent = '🎲';
    computerChoiceEl.classList.add('shaking');
    resultEl.textContent = "Computer is choosing...";
    resultEl.className = "";

    // Delay computer result for smooth animation
    setTimeout(() => {
        computerChoiceEl.classList.remove('shaking');
        const computerMove = getComputerChoice();
        computerChoiceEl.textContent = computerMove.emoji;

        // Check Round Result
        checkWinner(playerMove, computerMove, targetScore);
        isProcessing = false;
    }, 600);
}

// Winner Logic
function checkWinner(player, computer, target) {
    if (player.name === computer.name) {
        // Tie
        resultEl.textContent = `It's a Tie! Both chose ${player.name}.`;
        resultEl.className = 'tie';
        addHistory(player.emoji, computer.emoji, 'Tie');

    } else if (
        (player.name === 'Rock' && computer.name === 'Scissors') ||
        (player.name === 'Paper' && computer.name === 'Rock') ||
        (player.name === 'Scissors' && computer.name === 'Paper')
    ) {
        // Player Win
        userScore++;
        userScoreEl.textContent = userScore;
        resultEl.textContent = `You Win! ${player.name} beats ${computer.name}.`;
        resultEl.className = 'win';
        addHistory(player.emoji, computer.emoji, 'Win');

        // Check High Score
        if (userScore > highScore) {
            highScore = userScore;
            localStorage.setItem('rpsHighScore', highScore);
            highScoreEl.textContent = highScore;
        }

    } else {
        // Computer Win
        computerScore++;
        computerScoreEl.textContent = computerScore;
        resultEl.textContent = `You Lose! ${computer.name} beats ${player.name}.`;
        resultEl.className = 'lose';
        addHistory(player.emoji, computer.emoji, 'Loss');
    }

    // Check Match End (Best of 3 / 5)
    if (target > 0) {
        if (userScore === target) {
            resultEl.textContent = `🎉 Congratulations! You won the match!`;
        } else if (computerScore === target) {
            resultEl.textContent = `💥 Game Over! Computer won the match!`;
        }
    }
}

// Add match history entry
function addHistory(userEmoji, compEmoji, status) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>You:</strong> ${userEmoji} vs <strong>Comp:</strong> ${compEmoji} — <em>${status}</em>`;
    historyList.prepend(li);

    // Keep history list to last 5 rounds only
    if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Reset Game State
function resetGame() {
    userScore = 0;
    computerScore = 0;
    userScoreEl.textContent = '0';
    computerScoreEl.textContent = '0';
    playerChoiceEl.textContent = '❓';
    computerChoiceEl.textContent = '❓';
    resultEl.textContent = 'Select an option to play!';
    resultEl.className = '';
    historyList.innerHTML = '';
}

// Event Listeners
rockBtn.addEventListener('click', () => playRound('rock'));
paperBtn.addEventListener('click', () => playRound('paper'));
scissorsBtn.addEventListener('click', () => playRound('scissors'));
resetBtn.addEventListener('click', resetGame);
gameModeSelect.addEventListener('change', resetGame);
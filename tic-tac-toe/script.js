document.addEventListener('DOMContentLoaded', () => {
    const gameBoardElement = document.getElementById('gameBoard');
    const statusDisplay = document.getElementById('statusArea');
    const currentPlayerSpan = document.getElementById('currentPlayer');
    const restartButton = document.getElementById('restartButton');

    let board = ['', '', '', '', '', '', '', '', '']; // Represents the 9 cells
    let currentPlayer = 'X';
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal from top-left
        [2, 4, 6]  // Diagonal from top-right
    ];

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase()); // For styling X or O
        clickedCell.classList.add('occupied'); // Prevent further clicks/hover effects
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentPlayerSpan.textContent = currentPlayer;
        statusDisplay.innerHTML = `Player <span id="currentPlayer">${currentPlayer}</span>'s turn`;
    }

    function checkWin() {
        let roundWon = false;
        let winningLine = [];

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue; // Skip if any cell in the condition is empty
            }
            if (a === b && b === c) {
                roundWon = true;
                winningLine = winCondition;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = `Player ${currentPlayer} has won! 🎉`;
            gameActive = false;
            // Highlight winning cells
            winningLine.forEach(index => {
                document.querySelector(`.cell[data-index='${index}']`).classList.add('winning-cell');
            });
            return true;
        }
        return false;
    }

    function checkDraw() {
        if (!board.includes('') && gameActive) { // All cells filled and no winner
            statusDisplay.textContent = 'Game ended in a draw! 🤝';
            gameActive = false;
            return true;
        }
        return false;
    }

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive) {
            return; // Cell already played or game over
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        if (checkWin()) return;
        if (checkDraw()) return;
        handlePlayerChange();
    }

    function restartGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        statusDisplay.innerHTML = `Player <span id="currentPlayer">X</span>'s turn`;
        currentPlayerSpan.textContent = currentPlayer; // Update span separately if needed

        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'occupied', 'winning-cell');
        });
    }

    // Create board cells
    function createBoard() {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            gameBoardElement.appendChild(cell);
        }
    }

    // Initialize game
    createBoard();
    restartButton.addEventListener('click', restartGame);
});
document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('chessBoard');
    const currentPlayerTurnElement = document.getElementById('currentPlayerTurn');
    const statusMessageElement = document.getElementById('statusMessage');

    const PIECES = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟', // Black pieces
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'  // White pieces
    };

    // Initial board setup (rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR FEN-like)
    // null represents an empty square
    let boardState = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    let selectedPiece = null; // { piece, fromRow, fromCol, element }
    let currentPlayer = 'white'; // 'white' or 'black'

    function getPieceColor(pieceChar) {
        if (!pieceChar) return null;
        return pieceChar === pieceChar.toUpperCase() ? 'white' : 'black';
    }

    function renderBoard() {
        boardElement.innerHTML = ''; // Clear previous board
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((r + c) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = r;
                square.dataset.col = c;

                const pieceChar = boardState[r][c];
                if (pieceChar) {
                    square.textContent = PIECES[pieceChar];
                    square.classList.add(getPieceColor(pieceChar) === 'white' ? 'piece-white' : 'piece-black');
                }

                square.addEventListener('click', handleSquareClick);
                boardElement.appendChild(square);
            }
        }
        currentPlayerTurnElement.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
        statusMessageElement.textContent = ''; // Clear status on re-render
    }

    function handleSquareClick(event) {
        const clickedSquareElement = event.currentTarget;
        const row = parseInt(clickedSquareElement.dataset.row);
        const col = parseInt(clickedSquareElement.dataset.col);
        const pieceOnClickedSquare = boardState[row][col];
        const colorOfPieceOnClickedSquare = getPieceColor(pieceOnClickedSquare);

        statusMessageElement.textContent = ''; // Clear previous messages

        if (selectedPiece) { // A piece is already selected, try to move
            const targetPiece = boardState[row][col];
            const targetPieceColor = getPieceColor(targetPiece);

            // Basic move validation:
            // 1. Cannot move to a square occupied by your own piece
            if (targetPieceColor === currentPlayer) {
                statusMessageElement.textContent = "Cannot move to a square occupied by your own piece.";
                // If clicking the same piece, deselect it
                if (row === selectedPiece.fromRow && col === selectedPiece.fromCol) {
                    deselectPiece();
                } else { // If clicking another of your own pieces, select that one instead
                    deselectPiece(); // Deselect previous
                    selectPiece(row, col, pieceOnClickedSquare, clickedSquareElement);
                }
                return;
            }

            // Move the piece in boardState
            boardState[row][col] = selectedPiece.piece;
            boardState[selectedPiece.fromRow][selectedPiece.fromCol] = null;

            deselectPiece();
            switchPlayer();
            renderBoard(); // Re-render the entire board after a move

        } else { // No piece selected, try to select one
            if (pieceOnClickedSquare && colorOfPieceOnClickedSquare === currentPlayer) {
                selectPiece(row, col, pieceOnClickedSquare, clickedSquareElement);
            } else if (pieceOnClickedSquare) {
                statusMessageElement.textContent = `Not ${currentPlayer}'s turn to move ${colorOfPieceOnClickedSquare} pieces.`;
            }
        }
    }

    function selectPiece(row, col, pieceChar, element) {
        if (selectedPiece && selectedPiece.element) {
            selectedPiece.element.classList.remove('selected');
        }
        selectedPiece = { piece: pieceChar, fromRow: row, fromCol: col, element: element };
        element.classList.add('selected');
        statusMessageElement.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} selected ${PIECES[pieceChar]}. Click a destination square.`;
    }

    function deselectPiece() {
        if (selectedPiece && selectedPiece.element) {
            selectedPiece.element.classList.remove('selected');
        }
        selectedPiece = null;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    }

    // Initial render
    renderBoard();
});
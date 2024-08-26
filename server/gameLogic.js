function initializeGame() {
    return {
        currentPlayer: 'A',
        board: [
            ['A-P1', 'A-H1', 'A-H2', '', 'A-P2'],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['B-P1', '', '', '', 'B-P2'],
            ['B-H1', '', 'B-H2', '', 'B-P3']
        ],
        moveHistory: [],
        gameOver: false,
        winner: null,
    };
}

function processMove(gameState, move) {
    const { currentPlayer, board } = gameState;
    const { character, direction } = move;
    const piecePosition = findPiecePosition(board, character);

    if (!piecePosition) {
        return { valid: false, state: gameState, message: 'Piece not found on the board' };
    }

    const { row, col } = piecePosition;

    // Determine the new position based on the direction
    let newRow = row;
    let newCol = col;

    switch (direction) {
        case 'F': // Move Forward
            newRow -= 1;
            break;
        case 'B': // Move Backward
            newRow += 1;
            break;
        case 'L': // Move Left
            newCol -= 1;
            break;
        case 'R': // Move Right
            newCol += 1;
            break;
        case 'FL': // Move Forward-Left
            newRow -= 1;
            newCol -= 1;
            break;
        case 'FR': // Move Forward-Right
            newRow -= 1;
            newCol += 1;
            break;
        case 'BL': // Move Backward-Left
            newRow += 1;
            newCol -= 1;
            break;
        case 'BR': // Move Backward-Right
            newRow += 1;
            newCol += 1;
            break;
        default:
            return { valid: false, state: gameState, message: 'Invalid direction' };
    }

    // Validate the move
    if (isMoveValid(newRow, newCol, board, currentPlayer)) {
        // Move the piece
        board[newRow][newCol] = character;
        board[row][col] = '';

        // Update game state
        gameState.moveHistory.push({ character, from: { row, col }, to: { row: newRow, col: newCol } });

        // Check for capture
        checkForCapture(board, newRow, newCol, currentPlayer);

        // Switch player
        gameState.currentPlayer = currentPlayer === 'A' ? 'B' : 'A';

        return { valid: true, state: gameState };
    } else {
        return { valid: false, state: gameState, message: 'Invalid move' };
    }
}

function findPiecePosition(board, character) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === character) {
                return { row, col };
            }
        }
    }
    return null;
}

function isMoveValid(row, col, board, currentPlayer) {
    // Check if the move is within bounds
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
        return false;
    }

    // Check if the destination cell is empty or contains an opponent's piece
    const cell = board[row][col];
    if (cell === '' || cell[0] !== currentPlayer) {
        return true;
    }

    return false;
}

function checkForCapture(board, row, col, currentPlayer) {
    // Check if there is an opponent's piece in the destination cell
    const cell = board[row][col];
    if (cell !== '' && cell[0] !== currentPlayer) {
        console.log(`Capture! ${cell} has been captured by ${currentPlayer}`);
    }
}

module.exports = { initializeGame, processMove };

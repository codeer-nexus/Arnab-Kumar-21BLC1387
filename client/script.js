const board = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

let selectedSquare = null;

function createBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', onSquareClick);
            square.textContent = board[row][col];
            chessboard.appendChild(square);
        }
    }
}

function onSquareClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (selectedSquare) {
        // Move piece if valid
        movePiece(selectedSquare, { row, col });
        selectedSquare = null;
    } else {
        // Select the square
        selectedSquare = { row, col };
    }
}

function movePiece(from, to) {

    const piece = board[from.row][from.col];
    board[from.row][from.col] = "";
    board[to.row][to.col] = piece;
    updateBoard();
    // Send move to backend
    sendMoveToServer(from, to);
}

function updateBoard() {
    createBoard();
}

function sendMoveToServer(from, to) {
    fetch('/api/move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('gameStatus').textContent = data.message;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.getElementById('resetButton').addEventListener('click', () => {
    createBoard();
});

document.getElementById('undoButton').addEventListener('click', () => {
});

createBoard();

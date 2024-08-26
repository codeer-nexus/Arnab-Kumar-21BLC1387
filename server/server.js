const WebSocket = require('ws');
const { initializeGame, processMove } = require('./gameLogic');

const wss = new WebSocket.Server({ port: 8080 });

let gameState = initializeGame();

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'gameState', state: gameState }));

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === 'move') {
            const { move } = parsedMessage;
            const result = processMove(gameState, move);

            if (result.valid) {
                gameState = result.state;
                broadcast({ type: 'gameState', state: gameState });
            } else {
                ws.send(JSON.stringify({ type: 'invalidMove', reason: result.reason }));
            }
        }
    });
});

function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

console.log('WebSocket server is running on ws://localhost:8080');

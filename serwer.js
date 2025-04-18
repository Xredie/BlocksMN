const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    console.log('New player connected');

    ws.on('message', message => {
        // Broadcasting the player's position to all connected clients
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Player disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:808
            0');

const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] ||
                    req.socket.remoteAddress; // req.connection.remoteAddress; to get IP Address
        console.log('New Client : ', ip);
        ws.on('message', (message) => {
            console.log(message);
        });
        ws.on('error', (err) => {
            console.error(error);
        });
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval);
        });
        ws.interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) { //OPEN, CLOSE, CLOSING, CONNECTING
                ws.send('Message From Server.');
            }
        }, 3000);
    });
};
const WebSocket = require('ws');

function corsValidation(origin) {
    return process.env.CORS_ORIGIN === '*' || process.env.CORS_ORIGIN.startsWith(origin);
}

function verifyClient(info, callback) {
    if (!corsValidation(info.origin)){
        return callback(false);
    }
    else {
        return callback(true);
    }
}

async function onClose(ws) {
    console.log(`Disconnected`);
}

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

async function onMessage(data) {
    console.log('Response ready')
    const message = JSON.parse(data);

    return JSON.stringify(message);
}

module.exports = (server) => {
    const wss = new WebSocket.Server({
        server,
        verifyClient
    });
    
    wss.on('connection', async function connection(ws, req) {
        ws.on('error', error => onError(ws, error));
        ws.on('close', data => onClose(ws));
        console.log(`onConnection`);

        ws.on('message', async function message(data, isBinary) {
            let response = await onMessage(data)
            
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(response, { binary: isBinary });
                }
            });
        });
    });

    console.log(`App Web Socket Server is running!`);
    return wss;
}
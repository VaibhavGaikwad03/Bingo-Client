const WebSocket = require('ws');

const wss = new WebSocket.Server({port:3001} , ()=> {
    console.log("Websocket server is running ");
});

wss.on('connection' , (ws) => {
    console.log(("Client Connected"));
    // ws.send("Hello from Server!");

    ws.on('message' , (message) => {
        console.log(`Received : ${message}`);
        ws.send(JSON.stringify({
        
          }));
    });

    ws.on('close' , ()=> {
        console.log("Client disconnected");
    });

});
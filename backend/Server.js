const WebSocket = require('ws');

const wss = new WebSocket.Server({port:3001} , ()=> {
    console.log("Websocket server is running ");
});

wss.on('connection' , (ws) => {
    console.log(("Client Connected"));
    // ws.send("Hello from Server!");

    ws.on('message' , (message) => {
        console.log(`Received : ${message}`);
        ws.send(JSON.stringify(
            {
          
            "message_type": 102,
            "status": 0,
            "user_id": 3,
            "error_code": 0
          
          },
        // {
            
        //         "message_type": 108,
        //         "count": 2,
        //         "users" : [
        //           {
        //             "user_id"     : "21",
        //             "username"    : "vaibhav.g",
        //             "display_name": "Vaibhav Gaikwad"
        //           },
        //           {
        //             "user_id"     : "3",
        //             "username"    : "test",
        //             "display_name": "test user"
        //           }
        //         ]
              
        // }
        ));
    });

    ws.on('close' , ()=> {
        console.log("Client disconnected");
    });

});
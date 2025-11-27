const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 2121 }, () => {
  console.log("WebSocket server is running");
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    const msg102 = {
      message_type: 102,
      status: 0,
      auth_token: 123,
      user_id: 3,
      error_code: 0,
    };

    const msg108 = {
      message_type: 108,
      count: 2,
      users: [
        { user_id: "21", username: "vaibhav.g", display_name: "Vaibhav Gaikwad" },
        { user_id: "3", username: "test", display_name: "Test User" },
      ],
    };

    const msg112 = {
      message_type: 112,
      count: 2,
      friends_list: [
        {
          user_id: "10",
          username: "rutuja.d",
          fullname: "Rutuja Dabhade",
          gender: "female",
          dob: "12-12-2012",
        },
        {
          user_id: "11",
          username: "vaibhav.g",
          fullname: "Vaibhav Gaikwad",
          gender: "male",
          dob: "10-10-2010",
        },
      ],
    };

    const msg113 = {
      message_type: 113,
      pending_friend_requests_list: [
        {
          sender_id: 21,
          sender: "vaibhav.g",
          name_of_sender: "Vaibhav Gaikwad",
          receiver_id: 32,
          receiver: "rutuja.d",
          name_of_receiver: "Rutuja Dabhade",
          timestamp: "2025-06-14T00:30:00Z",
        },
        {
          sender_id: 22,
          sender: "john.d",
          name_of_sender: "John Doe",
          receiver_id: 33,
          receiver: "rutuja.d",
          name_of_receiver: "Rutuja Dabhade",
          timestamp: "2025-06-15T10:15:00Z",
        },
      ],
    };

    ws.send(JSON.stringify(msg102));
    ws.send(JSON.stringify(msg108));
    ws.send(JSON.stringify(msg112));
    ws.send(JSON.stringify(msg113)); 
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

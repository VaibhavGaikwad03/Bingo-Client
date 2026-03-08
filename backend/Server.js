import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 2121 }, () => {
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

    // User Search/Directory (10 Users)
    const msg108 = {
      message_type: 108,
      count: 10,
      users: [
        { user_id: "3", username: "test", display_name: "Test User" },
        { user_id: "101", username: "amit.s", display_name: "Amit Sharma" },
        { user_id: "102", username: "priya.p", display_name: "Priya Patil" },
        { user_id: "103", username: "rahul.v", display_name: "Rahul Verma" },
        { user_id: "104", username: "sneha.k", display_name: "Sneha Kulkarni" },
        { user_id: "105", username: "aniket.m", display_name: "Aniket More" },
        { user_id: "106", username: "pooja.r", display_name: "Pooja Rao" },
        { user_id: "107", username: "sagar.j", display_name: "Sagar Jadhav" },
        { user_id: "108", username: "neha.w", display_name: "Neha Walia" },
      ],
    };

    // Friends List (10 Friends)
    const msg112 = {
      message_type: 112,
      count: 10,
      friends_list: [
        { user_id: "10", username: "rutuja.d", fullname: "Rutuja Dabhade", gender: "female", dob: "12-12-2012" },
        { user_id: "12", username: "rohan.m", fullname: "Rohan Mehta", gender: "male", dob: "05-05-1995" },
        { user_id: "13", username: "tanvi.s", fullname: "Tanvi Sawant", gender: "female", dob: "20-08-1998" },
        { user_id: "14", username: "aditya.k", fullname: "Aditya Kumar", gender: "male", dob: "15-02-1992" },
        { user_id: "15", username: "megha.g", fullname: "Megha Gupta", gender: "female", dob: "30-11-1994" },
        { user_id: "16", username: "vikram.s", fullname: "Vikram Singh", gender: "male", dob: "22-07-1990" },
        { user_id: "17", username: "shweta.b", fullname: "Shweta Bhosale", gender: "female", dob: "01-01-2000" },
        { user_id: "18", username: "karan.p", fullname: "Karan Panwar", gender: "male", dob: "14-03-1993" },
        { user_id: "19", username: "divya.n", fullname: "Divya Nair", gender: "female", dob: "19-09-1996" },
      ],
    };

    const msg113 = {
      message_type: 113,
      pending_friend_requests_list: [
        { sender_id: 21, sender: "vaibhav.g", name_of_sender: "Sakshi Chavan", receiver_id: 32, receiver: "rutuja.d", name_of_receiver: "Rutuja Dabhade", timestamp: "2025-06-14T00:30:00Z" },
        { sender_id: 22, sender: "john.d", name_of_sender: "John Doe", receiver_id: 33, receiver: "rutuja.d", name_of_receiver: "Rutuja Dabhade", timestamp: "2025-06-15T10:15:00Z" },
      ],
    };

    const msg126 = {
      message_type : 126,
      chat_message_id : 7
    }

    ws.send(JSON.stringify(msg102));
    ws.send(JSON.stringify(msg108));
    ws.send(JSON.stringify(msg112));
    ws.send(JSON.stringify(msg113)); 
    ws.send(JSON.stringify(msg126)); 

  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
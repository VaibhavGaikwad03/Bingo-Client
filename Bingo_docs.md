# Bingo docs

## Status and Message Type Codes

**Status Codes:**

- `0` SUCCESS
- `1` ERROR

**Message Type Codes:**

- `101` LOGIN_REQUEST
- `102` LOGIN_RESPONSE
- `103` SIGNUP_REQUEST
- `104` SIGNUP_RESPONSE
- `105` LOGOUT_REQUEST
- `106` LOGOUT_RESPONSE
- `107` SEARCH_USER_REQUEST
- `108` SEARCH_USER_RESPONSE
- `109` FRIEND_REQ_REQUEST  
- `110` FRIEND_REQ_RESPONSE  
- `111` USER_PROFILE_INFORMATION  
- `112` USER_FRIENDS_LIST  
- `113` USER_PENDING_FRIEND_REQUESTS_LIST  
- `114` USER_MESSAGE_HISTORY  

## Error Codes

**Login Error Codes:**

- `0` NONE
- `1001` USERNAME_NOT_FOUND
- `1002` INCORRECT_PASSWORD

**Sign-up Error Codes:**

- `0` NONE
- `2001` USERNAME_ALREADY_EXISTS
- `2002` EMAIL_ALREADY_EXISTS
- `2003` PHONE_ALREADY_EXISTS

**Error Codes**

- `-1` INVALID_USER_ID  

## Friendship Status Codes

- `0` FRIEND  
- `1` PENDING  
- `2` NOT_FRIEND  

## Database

### `message_history` Table

| Column         | Type                                     |
| -------------- | ---------------------------------------- |
| message_id     | int AUTO_INCREMENT PRIMARY KEY           |
| sender_id      | int NOT NULL                             |
| sender         | varchar(50) NOT NULL                     |
| receiver_id    | int NOT NULL                             |
| receiver       | varchar(50) NOT NULL                     |
| message        | TEXT NOT NULL                            |
| message_status | ENUM('sent','delivered','seen') NOT NULL |
| timestamp      | TIMESTAMP DEFAULT CURRENT_TIMESTAMP      |

```sql
CREATE TABLE message_history (
  message_id int AUTO_INCREMENT PRIMARY KEY,
  sender_id int NOT NULL,
  sender varchar(50) NOT NULL,
  receiver_id int NOT NULL,
  receiver varchar(50) NOT NULL,
  message TEXT NOT NULL,
  message_status ENUM('sent','delivered','seen') NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### `friend_request` Table

| Column          | Type                                           |
| --------------- | ---------------------------------------------- |
| request_id      | INT AUTO_INCREMENT PRIMARY KEY                 |
| sender_id       | int NOT NULL                                   |
| sender          | VARCHAR(50) NOT NULL                           |
| name_of_sender  | VARCHAR(255) NOT NULL                          |
| receiver_id     | int NOT NULL                                   |
| receiver        | VARCHAR(50) NOT NULL                           |
| name_of_receiver| VARCHAR(255) NOT NULL                          |
| request_status  | ENUM('pending','accepted','rejected') NOT NULL |
| timestamp       | TIMESTAMP DEFAULT CURRENT_TIMESTAMP            |

```sql
CREATE TABLE friend_request (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id int NOT NULL,
  sender VARCHAR(50) NOT NULL,
  name_of_sender VARCHAR(255) NOT NULL,
  receiver_id int NOT NULL,
  receiver VARCHAR(50) NOT NULL,
  name_of_receiver VARCHAR(255) NOT NULL,
  request_status ENUM('pending','accepted','rejected') NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## `friendship` Table

| Column        | Type                                |
| ------------- | ----------------------------------- |
| friendship_id | INT FOREIGN KEY                     |
| user_id       | INT NOT NULL                        |
| user          | VARCHAR(50) NOT NULL                |
| name_of_user  | VARCHAR(255) NOT NULL               |
| friend_id     | INT NOT NULL                        |
| friend        | VARCHAR(50) NOT NULL                |
| name_of_friend| VARCHAR(255) NOT NULL               |
| timestamp     | TIMESTAMP DEFAULT CURRENT_TIMESTAMP |

```sql
CREATE TABLE friendship (
  friendship_id INT FOREIGN KEY,
  user_id INT NOT NULL,
  user VARCHAR(50) NOT NULL,
  name_of_user VARCHAR(255) NOT NULL , 
  friend_id INT NOT NULL,
  friend VARCHAR(50) NOT NULL,
  name_of_friend VARCHAR(255) NOT NULL , 
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## `user_credentials` Table

| Column           | Type                                     |
| ---------------- | ---------------------------------------- |
| user_id          | INT AUTO_INCREMENT PRIMARY KEY           |
| username         | VARCHAR(50) NOT NULL UNIQUE              |
| password         | VARCHAR(255) NOT NULL                    |
| fullname         | VARCHAR(100) NOT NULL                    |
| dob              | DATE NOT NULL                            |
| gender           | ENUM('Male', 'Female', 'Other') NOT NULL |
| email            | VARCHAR(100) NOT NULL UNIQUE             |
| phone            | VARCHAR(15) NOT NULL UNIQUE              |
| signup_timestamp | TIMESTAMP DEFAULT CURRENT_TIMESTAMP      |

```sql
CREATE TABLE user_credentials (
    user_id int AUTO_INCREMENT PRIMARY KEY ,
    username varchar(50) NOT NULL UNIQUE,
    password  varchar(255) NOT NULL,
    fullname varchar(100) NOT NULL,
    dob date NOT NULL,
    gender ENUM('Male' ,'Female' , 'Other') NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    phone varchar(15) UNIQUE NOT NULL,
    signup_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Message Format

```json
{
  "message_type": "LOGIN_REQUEST",
  "username": "vaibhav",
  "password": "12345",
  "timestamp": "2025-06-14T00:30:00Z"
}
```

```json
{
  "message_type": "LOGIN_RESPONSE",
  "status": "error or success",
  "user_id": "",
  "error_code": 0
}
```

```json
{
  "message_type": "SIGNUP_REQUEST",
  "username": "testuser",
  "password": "1312",
  "fullname": "testname",
  "gender": "m/f/o",
  "dob": "dd-mm-yyyy",
  "email": "test@gmail.com",
  "phone": "1234567890",
  "timestamp": "2025-06-14T00:30:00Z"
}
```

```json
{
  "message_type": "SIGNUP_RESPONSE",
  "status": "error or success",
  "user_id": "",
  "error_code": 0
}
```

```json
{
  "message_type": "CHAT_MESSAGE",
  "to": "client2",
  "from": "client1",
  "sender_user_id": "21",
  "timestamp": "2025-06-14T00:30:00Z"
}
```

```json
{
  "message_type": "SEARCH_USER_REQUEST",
  "username": "vaibz",
  "Requested_by": "test"
}
```

```json
{
  "message_type": "SEARCH_USER_RESPONSE",
  "count": 2,
  "users": [
    {
      "user_id": "21",
      "username": "vaibhav.g",
      "display_name": "Vaibhav Gaikwad",
      "is_friend": true
    },
    {
      "user_id": "3",
      "username": "test",
      "display_name": "test user",
      "is_friend": false
    }
  ]
}
```

```json
{
  "message_type": "FRIEND_REQ_REQUEST",
  "sender_id": 21,
  "sender": "senderusername",
  "receiver_id": 32,
  "receiver": "receiverusername",
  "timestamp": "2025-06-14T00:30:00Z"
}
```

```json
{
  "message_type": "FRIEND_REQ_RESPONSE",
  "sender_id": 21,
  "sender": "testuser1",
  "receiver_id": 22,
  "receiver": "testuser2",
  "request_status": "ACCEPTED", // or "REJECTED"
  "timestamp": "2025-06-14T00:30:00Z"
}
```

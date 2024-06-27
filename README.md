# Chess Game

This is an online chess game built using Express, Socket.io, and the Chess.js library. The game allows two players to play a game of chess in real-time, while additional users can join as spectators.

## Technologies Used

- **Express:** A web application framework for Node.js, used to create the server.
- **Socket.io:** A library that enables real-time, bidirectional, and event-based communication between web clients and servers.
- **Chess.js:** A JavaScript library for chess move generation, validation, and manipulation.
- **EJS:** A simple templating language that lets you generate HTML markup with plain JavaScript.
- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.

## Features

- **Real-time Gameplay:** Moves are updated in real-time for all connected clients.
- **Player Roles:** The first two connected users are assigned the roles of white and black players, respectively. Subsequent users are assigned as spectators.
- **Move Validation:** The Chess.js library is used to ensure that all moves are valid according to the rules of chess.
- **Disconnect Handling:** Player roles are managed dynamically when users disconnect from the game.


## preview

![Chess Board]([https://example.com/path/to/your/image.png](https://drive.google.com/file/d/1rcfgsdE2iWo4oMemeKhbPN2cddyWXUEE/view?usp=drive_link))


## Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>

2. **Navigate to the project directory:**
     cd chess-game
   
3. **Install dependencies:**
    npm i

4.**Run the server**
    npm start
   

   

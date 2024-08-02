const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let Players = {};

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

io.on("connection", (socket) => {
    console.log("A user connected");

    // Send initial board state to the newly connected client
    socket.emit("boardState", chess.fen());

    socket.on("setUsername", (username) => {
        socket.username = username;

        if (!Players.white) {
            Players.white = { id: socket.id, username };
            socket.emit("playerRole", { role: "w", username });
        } else if (!Players.black) {
            Players.black = { id: socket.id, username };
            socket.emit("playerRole", { role: "b", username });
        } else {
            socket.emit("spectatorRole");
        }

        io.emit("updatePlayers", Players);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
        if (Players.white && socket.id === Players.white.id) {
            delete Players.white;
        } else if (Players.black && socket.id === Players.black.id) {
            delete Players.black;
        }
        io.emit("updatePlayers", Players);
    });

    socket.on("move", (move) => {
        try {
            // Check if it's the player's turn
            if (chess.turn() === "w" && (!Players.white || socket.id !== Players.white.id)) return;
            if (chess.turn() === "b" && (!Players.black || socket.id !== Players.black.id)) return;

            const result = chess.move(move);
            if (result) {
                io.emit("move", move);
                io.emit("boardState", chess.fen());

                // Check for game over conditions
                if (chess.isGameOver()) {
                    let gameResult = "";
                    if (chess.isCheckmate()) gameResult = `Checkmate! ${chess.turn() === 'w' ? 'Black' : 'White'} wins!`;
                    else if (chess.isDraw()) gameResult = "It's a draw!";
                    else if (chess.isStalemate()) gameResult = "Stalemate!";
                    io.emit("gameOver", gameResult);
                }
            } else {
                console.log("Invalid move");
                socket.emit("invalidMove", move);
            }
        } catch (err) {
            console.log(err);
            socket.emit("invalidMove", move);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
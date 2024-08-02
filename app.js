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

io.on("connection", function(socket) {
    console.log("connected");

<<<<<<< HEAD
    socket.on("setUsername", (username) => {
        socket.username = username;
        
        if (!Players.white) {
            Players.white = { id: socket.id, username };
            socket.emit("playerRole", { role: "w", username });
        } else if (!Players.black) {
            Players.black = { id: socket.id, username };
            socket.emit("playerRole", { role: "b", username });
        } else {
            socket.emit("spectatorRole", username);
        }

        io.emit("updatePlayers", Players);
    });

    socket.on("disconnect", function() {
        if (Players.white && socket.id === Players.white.id) {
            delete Players.white;
        } else if (Players.black && socket.id === Players.black.id) {
            delete Players.black;
        }
        io.emit("updatePlayers", Players);
    });

    socket.on("move", (move) => {
        try {
            if (chess.turn() === "w" && socket.id !== Players.white.id) return;
            if (chess.turn() === "b" && socket.id !== Players.black.id) return;

            const result = chess.move(move);
            if (result) {
=======
    if (!Players.white) {
        Players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    } else if (!Players.black) {
        Players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    } else {
        uniquesocket.emit("spectatorRole");
    }

    uniquesocket.on("disconnect", function() {
        if (uniquesocket.id === Players.white) {
            delete Players.white;
        } else if (uniquesocket.id === Players.black) {
            delete Players.black;
        }
    });

    uniquesocket.on("move", (move) => {
        try {
            if (chess.turn() === "w" && uniquesocket.id !== Players.white) return;
            if (chess.turn() === "b" && uniquesocket.id !== Players.black) return;

            const result = chess.move(move);
            if (result) {
                currentPlayer = chess.turn();
>>>>>>> 89419d909455b85bb5e5be499366d9c25d65a67f
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            } else {
                console.log("Invalid move");
<<<<<<< HEAD
                socket.emit("invalidMove", move);
            }
        } catch (err) {
            console.log(err);
            socket.emit("invalidMove", move);
=======
                uniquesocket.emit("invalidMove", move);
            }
        } catch (err) {
            console.log(err);
            uniquesocket.emit("invalidMove", move);
>>>>>>> 89419d909455b85bb5e5be499366d9c25d65a67f
        }
    });
});

server.listen(3000, function() {
    console.log("Listening on server 3000");
});

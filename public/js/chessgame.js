const socket = io();
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");
const gameResultElement = document.querySelector("#game-result");
const playerInfoElement = document.querySelector("#player-info");

let draggedPiece = null;
let playerRole = null;
let sourceSquare = null;
let username = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );
                pieceElement.innerText = getPieceUnicode(square);

                // Only allow dragging if it's the player's turn and they're not a spectator
                pieceElement.draggable = playerRole === square.color && playerRole === chess.turn();
                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };

                    handleMove(sourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });

    if (playerRole === 'b') {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }
};

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q'
    };
    if (chess.move(move)) {
        socket.emit("move", move);
        renderBoard();
    } else {
        console.log("Invalid move");
    }
};

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: "♙",
        r: "♜",
        n: "♞",
        b: "♝",
        q: "♛",
        k: "♚",
        P: "♙",
        R: "♖",
        N: "♘",
        B: "♗",
        Q: "♕",
        K: "♔"
    };

    return unicodePieces[piece.type] || "";
};

const submitUsername = () => {
    username = document.getElementById("username").value;
    if (username) {
        socket.emit("setUsername", username);
        document.getElementById("username-form").style.display = "none";
        document.getElementById("chess-image").style.display = "none";
        document.getElementById("game").style.display = "block";
        playerInfoElement.innerText = `Welcome, ${username}`;
    }
};

socket.on("playerRole", function(data) {
    playerRole = data.role;
    playerInfoElement.innerText = `You are playing as ${data.role === "w" ? "White" : "Black"} (${data.username})`;
    renderBoard();
});

socket.on("spectatorRole", function() {
    playerRole = null;
    playerInfoElement.innerText = `You are a spectator (${username})`;
    renderBoard();
    // Disable all piece dragging for spectators
    document.querySelectorAll('.piece').forEach(piece => piece.draggable = false);
});

socket.on("updatePlayers", function(players) {
    let playerInfoText = "";
    if (players.white) {
        playerInfoText += `White: ${players.white.username}\n`;
    }
    if (players.black) {
        playerInfoText += `Black: ${players.black.username}\n`;
    }
    playerInfoElement.innerText = playerInfoText;
});

socket.on("boardState", function(fen) {
    chess.load(fen);
    renderBoard();
});

socket.on("move", function(move) {
    chess.move(move);
    renderBoard();
});

// New event handlers
socket.on("invalidMove", (move) => {
    console.log("Invalid move:", move);
    // You could show an error message to the user here
    alert("Invalid move. Please try again.");
});

socket.on("gameOver", (result) => {
    gameResultElement.innerText = result;
    // Disable further moves
    document.querySelectorAll('.piece').forEach(piece => piece.draggable = false);
    // You could add a "New Game" button here if desired
});

renderBoard();

// Initial connection to get the current board state
socket.emit("getBoardState");
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
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index"); 
});

io.on("connection", function(uniquesocket) {
    console.log("connected");
   if(!Players.white){
    Players.white = uniquesocket.id;
    uniquesocket.emit("playerRole","w")
   }
   else if(!Players.black){
    Players.black=uniquesocket.id;
    uniquesocket.emit("playerRole","b")
   }
   else{
    uniquesocket.emit("spectator role")
   }

   uniquesocket.on("disconnect",function(){
    if(uniquesocket.id === Players.white){
        delete Players.white;
    }
    else if(uniquesocket.id === Players.black){
        delete Players.black;
    }

    uniquesocket.on("move",(move)=>{
        try {
            if(chess.turn() === "w" && uniquesocket.id !== Players.white) return;
            if(chess.turn() === "b" && uniquesocket.id !== Players.black) return;

            const result = chess.move(move);
            if(result){
                currentPlayer = chess.turn();
                io.emit("move",move);
                io.emit("boardState",chess.fen());
            }
            else{
                console.log("invalid move");
                uniquesocket.emit("invalid move",move);
            }
        } catch (err) {
            console.log(err);
            uniquesocket.emit("invalid move",move);
        }
       
    })
   })
 
});

server.listen(3000, function() {
    console.log("listening on server 3000");
});

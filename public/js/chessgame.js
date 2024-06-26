const socket = io();
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let playerRole = null;
let sourceSquare = null;

const renderBoard = ()=>{
    const board = chess.board();
    boardElement.innerHtml = "";
    board.forEach((row,rowindex)=>{
        row.forEach((square,squareIndex)=>{
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowindex+squareIndex)%2 === 0 ? "light" : "dark;"
            );
            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareIndex;

            if(square){
                const pieceElement = document.createElement("div"); 
                pieceElement.classList.add(
                    "piece",
                    square.color == "w" ? "white" : "black"
                );
                pieceElement.innerText=getPieceUnicode(square);

                pieceElement.draggable = playerRole === square.color;
                pieceElement.addEventListener("dragstart",(e) => {
                    if(pieceElement.draggable){
                        draggedPiece =  pieceElement;
                        sourceSquare = {row: rowindex, col: squareIndex };
                        e.dataTransfer.setData("text/plain","")
                    }
                })
                pieceElement.addEventListener("dragend",(e)=>{
                    draggedPiece =  pieceElement;
                    sourceSquare = {row: rowindex, col: squareIndex };
                })

                pieceElement.addEventListener("dragend",(e)=>{
                    draggedPiece=null;
                    sourceSquare=null;
                })

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover",(e)=>{
                e.preventDefault();
            })

            squareElement.addEventListener("drop",(e)=>{
                e.preventDefault();
                if(draggedPiece){
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };

                    handlemove(sourceSquare,targetSource);
                }
            })
            boardElement.appendChild(squareElement);
        })    
    })
};

const handlemove = ()=>{

}

const getPieceUnicode = (piece)=>{
    const unicodePieces ={
    p: "♙",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♚",
    k: "♛",
    P: "♙",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♔",
    K: "♕"
    };

   return unicodePieces[piece.type] || ""
};

renderBoard();
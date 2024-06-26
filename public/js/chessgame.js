const socket = io();
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let playerRole = null;
let sourceSquare = null;

const renderBoard = ()=>{
    const board = chess.board();
    boardElement.innerHtml = "";
    board.foreach((row,rowidx)=>{

    })


}

const handleemove = ()=>{

}

const getPieceUnicode = ()=>{

}

renderBoard();
/**
 * Tic-Tac-Toe against AI.
 *
 * Tic-Tac-Toe game against AI (Minimax) using p5.js.
 *
 * @link   https://github.com/sBobshit/AITicTacToe
 * @file   This file is the main file which contains almost all the code.
 * @author Saleh Bubshait.
 * @since  1.0.0
 */

// Constants:
const length = 450; // length of the square representing the canvas.
const segment = length / 3; // a segment is one third of the length. declared as this will be used repeatedly in this file.

const PLAYERS = {
    "HUMAN": 1, // human player will be X, which is reperesnted as 1 in this program.
    "AI": 2 // human player will be O, which is reperesnted as 2 in this program.
};

/**
 * Setup function for initanting the canvas (p5.js). (use period)
 */
function setup() {
  createCanvas(length, length);
}

// Variables:
var currentBoard = [0,0,0,0,0,0,0,0,0];

/**
 * Main drawing method for p5.js
 */
function draw() {

  // if the game is over already, just show who won.
  if (isGameOver(currentBoard).status) {
    showText(isGameOver(currentBoard).message);
  } else {

    // If not over, draw the board and place all segment and O's as required.
    drawBoard();

    for (var slot in currentBoard) {
      if (currentBoard[slot] == PLAYERS.HUMAN) drawX(slot); // Human will be always segment
      else if (currentBoard[slot] == PLAYERS.AI) drawO(slot); // AI will be always O
    }
  }
}

/**
 * Writing some text, txt, in the middle of the canvas.
 * 
 * Will be used only for showing the results when the game is over.
 * 
 * @access  private
 */
function showText(txt) {
  background(220)
  textAlign(CENTER)
  textSize(27)
  text(txt, 3*segment/2, 3*segment/2)
}

/**
 * Drawing the Tic-Tac-Toe board on the canvas (p5).
 * 
 * @access  private
 */
function drawBoard() {
  background(220);
  fill(0,0,0);
  line(segment, 0, segment, 450);
  line(2*segment, 0, 2*segment, 450);
  line(0,segment, 450, segment);
  line(0, 2*segment, 450, 2*segment);
}

/**
 * Draws an X in a provided square, which is the intended square to play.
 * Squares are arranged from top-left corner to bottom-right corner from 0 to 8.
 * 
 * @param {integer} sq the square to draw an X in, from 0 to 8.
 */
function drawX(sq) {
  line(segment*(sq%3)+15,Math.floor(sq/3)*segment + 15, segment*((sq % 3)+1)-15,segment*(Math.floor(sq/3)+1)-15);
  line(segment * (sq%3 + 1)-15, Math.floor(sq/3)*segment+15,(sq % 3)*segment+15,(Math.floor(sq/3) + 1)*segment-15);
}

/**
 * Draws an O in a provided square, which is the intended square to play.
 * Squares are arranged from top-left corner to bottom-right corner from 0 to 8.
 * 
 * @param {integer} sq the square to draw an O in, from 0 to 8.
 */
function drawO(sq) {
  fill(255,255,255);
  circle((sq % 3 + (sq%3 + 1))*segment / 2, (2 * Math.floor(sq /3) + 1) * segment /2, 100)
  fill(0,0,0);
}

/**
 * Determines the square number in which the mouse is currently hovering over.
 * 
 * @return  {integer}  The square which the mouse hovering over currently, from 0 to 8.
 */
function getHoveredSquare() {
  return Math.floor(mouseX / segment) + 3 * Math.floor(mouseY / segment);
}

/**
 * When the mouse is pressed
 */
function mousePressed() {
  // if the game has already ended, start a new game.
  if (isGameOver(currentBoard).status) 
    return currentBoard = [0,0,0,0,0,0,0,0,0];

  // preventing changing other plays
  if (currentBoard[getHoveredSquare()] != 0) return;

  currentBoard[getHoveredSquare()] = PLAYERS.HUMAN; // human plays in the clicked square
  var bestMove = Minimax(currentBoard, true, 0); // AI finds the best move
  currentBoard[bestMove] = PLAYERS.AI; // AI plays the best move.
}

/**
 * Checks if the game is over (either win or tie).
 * Check the status of the game. Returns an object with status (of boolean value). If status is true then the game is over and the object returned includes a key, message, which explains why the game is over and a key, winner, which retuns the winner or 0 if tie.
 * 
 * @returns {object}  An object containing a boolean status key, which will be true if the game is over.
 */
function isGameOver(board) {
  for (var i=0; i < 3; i++) {
    // Case 1: Win by horizontal line
    if (board[3*i] != 0 && board[3*i] == board[3*i + 1] && board[3*i] == board[3*i + 2])
      return {status: true, winner: board[3*i], message: `${board[3*i] == PLAYERS.HUMAN ? "X" : "O"} won by a horizontal line`}
    // Case 2: Win by vertical line
    if (board[i] != 0 && board[i] == board[i + 3] && board[i] == board[i + 6])
    return {status: true, winner: board[i],message: `${board[i] == PLAYERS.HUMAN ? "X" : "O"} won by a vertical line`}
  }

  // Case 3 win by diagonal line:
  if (board[4] != 0 && ((board[0] == board[4] && board[0] == board[8]) || (board[2] == board[4] && board[2] == board[6] )))
    return {status: true, winner: board[4], message: `${board[4] == PLAYERS.HUMAN ? "X" : "O"} won by a diagonal line`};

  
  // Case 4: No places left:
  // NB: no palces check is after checking all the winning situations as there might be a win in the last play.
  var isThereAnyLeft = false;
  for (var i of board) {
    if (i == 0) {
      isThereAnyLeft = true;
      break;
    }
  }
  if (!isThereAnyLeft) 
    return {status: true, winner: 0, message: "Tie!"} // status: 1 means game's over & tie since no places are left
  
  // Otherwise it would have not finished yet!
  return {status: false}
  
}

/**
 * Minimax method to find the best move for the AI player to play in a given Tic-Tac-Toe board, board.
 * A recusrive method used to find the best move for the AI player by evaluting all possible moves in the current board, taking into account the steps needed to reach the 'game-over' state.
 * 
 * @param {Array} board 1D array of integers of length 9 representing the board from the top-left square to bottom-right square.
 * @param {boolean} isMaxPlayer is it the AI player's (the one we want to maximise or find the best move for) turn? This is for recursive calls only (Should be passed as true).
 * @param {integer} steps the steps taken so far. This is for recursive calls only (Should be passed as 0).
 * @returns {integer} returns the square represnting the best move. (In recursive calls, it will return evaluation for the board passed)
 */
function Minimax(board, isMaxPlayer, steps) {
  
  // Base cases:
  // if who starts first is alternating, then this would be uncommented. However, in this version, the human player will always go first
  // if (isEmpty(board))
  //   return 0; // any position. It does not matter.
  // If the game is over at the board, then evaluate it from the AI player's perspective. If AI wins, then its +10, if it loses, then its -10, and if it is a tie then its a 0 (neutral).
  if (isEmpty(board)) {
    return 0;
  }
  if (isGameOver(board).status) {
    return isGameOver(board).winner == 2 ? 10 - steps : (isGameOver(board).winner == 1 ? steps-10 : 0);
  }


  if (isMaxPlayer) { // if AI turn
      var maxScore = -10; // negative so there will be always a bestMove
      var bestMove;
      // evaluating each possibility of placing the O in each empty square.
      for (var square in board) {
          if (board[square] != 0)
              continue;
          board[square] = isMaxPlayer ? 2 : 1;
          var eval = Minimax(board, false, steps+1);
          if (eval > maxScore) { // if this move would yield a higher score than best so far, then it is the best move so far.
              maxScore = eval;
              bestMove = square;
          }
          board[square] = 0;
      }
      
      // if it is the main calls, then return the best move, otherwise return the maxScore to be used in parent nodes.
      if (steps == 0) {       
          return bestMove;
      }
      return maxScore;

  }else { // if it is the human turn

      var minScore = 10; // positive, so there will always be a best move for the human player.
      for (var square in board) {
          if (board[square] != 0)
              continue;
          board[square] = isMaxPlayer ? 2 : 1;
          var eval = Minimax(board, true, steps+1);
          minScore = eval < minScore ? eval : minScore; 
          board[square] = 0;
      }
      // return the minimum score to be used in parent nodes. No need to check if its the first step (i.e. steps == 0) since it will never be.
      return minScore;
  }

}

/**
 * Checks if the board is empty.
 * @param {*} board 1D array of integers of length 9 representing the board from the top-left square to bottom-right square.
 * @returns {boolean} whether the board is completely empty or not.
 */
function isEmpty(board) {
  for (var slot of board) {
    if (slot != 0)
      return false;
  }
  return true;
}
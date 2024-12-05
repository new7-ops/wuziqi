import { useState } from 'react';  

function Square({ value, onSquareClick }) {  
  let className = 'square';  
  if (value === 'X') {  
    className += ' x';  
  } else if (value === 'O') {  
    className += ' o';  
  }  

  return (  
    <button className={className} onClick={onSquareClick}>  
      {value}  
    </button>  
  );  
}  

function Board({ xIsNext, squares, onPlay }) {  
  function handleClick(i) {  
    if (calculateWinner(squares) || squares[i]) {  
      return;  
    }  
    const nextSquares = squares.slice();  
    if (xIsNext) {  
      nextSquares[i] = 'X';  
    } else {  
      nextSquares[i] = 'O';  
    }  
    onPlay(nextSquares);  
  }  

  const winner = calculateWinner(squares);  
  let status;  
  if (winner) {  
    status = 'Winner: ' + winner;  
  } else if (squares.every((square) => square !== null)) {  
    status = 'It\'s a tie!';  
  } else {  
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');  
  }  

  return (  
    <>  
      <div className="status">{status}</div>  
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((row) => (  
        <div className="board-row" key={row}>  
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((col) => (  
            <Square  
              key={row * 15 + col}  
              value={squares[row * 15 + col]}  
              onSquareClick={() => handleClick(row * 15 + col)}  
            />  
          ))}  
        </div>  
      ))}  
    </>  
  );  
}  

export default function Game() {  
  const [history, setHistory] = useState([Array(225).fill(null)]);  
  const [currentMove, setCurrentMove] = useState(0);  
  const xIsNext = currentMove % 2 === 0;  
  const currentSquares = history[currentMove];  

  function handlePlay(nextSquares) {  
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];  
    setHistory(nextHistory);  
    setCurrentMove(nextHistory.length - 1);  
  }  

  function jumpTo(nextMove) {  
    setCurrentMove(nextMove);  
  }  

  const moves = history.map((squares, move) => {  
    let description;  
    if (move > 0) {  
      description = 'Go to move #' + move;  
    } else {  
      description = 'Go to game start';  
    }  
    return (  
      <li key={move}>  
        <button onClick={() => jumpTo(move)}>{description}</button>  
      </li>  
    );  
  });  

  return (  
    <div className="game">  
      <div className="game-board">  
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />  
      </div>  
      <div className="game-info">  
        <ol>{moves}</ol>  
      </div>  
    </div>  
  );  
}  

function calculateWinner(squares) {  
  const lines = [];  
  for (let i = 0; i < 15; i++) {  
    for (let j = 0; j < 15; j++) {  
      // Horizontal  
      if (j <= 10) {  
        lines.push([i * 15 + j, i * 15 + j + 1, i * 15 + j + 2, i * 15 + j + 3, i * 15 + j + 4]);  
      }  
      // Vertical  
      if (i <= 10) {  
        lines.push([i * 15 + j, (i + 1) * 15 + j, (i + 2) * 15 + j, (i + 3) * 15 + j, (i + 4) * 15 + j]);  
      }  
      // Diagonal (top-left to bottom-right)  
      if (i <= 10 && j <= 10) {  
        lines.push([i * 15 + j, (i + 1) * 15 + j + 1, (i + 2) * 15 + j + 2, (i + 3) * 15 + j + 3, (i + 4) * 15 + j + 4]);  
      }  
      // Diagonal (top-right to bottom-left)  
      if (i <= 10 && j >= 4) {  
        lines.push([i * 15 + j, (i + 1) * 15 + j - 1, (i + 2) * 15 + j - 2, (i + 3) * 15 + j - 3, (i + 4) * 15 + j - 4]);  
      }  
    }  
  }  

  for (let i = 0; i < lines.length; i++) {  
    const [a, b, c, d, e] = lines[i];  
    if (  
      squares[a] &&  
      squares[a] === squares[b] &&  
      squares[a] === squares[c] &&  
      squares[a] === squares[d] &&  
      squares[a] === squares[e]  
    ) {  
      return squares[a];  
    }  
  }  
  return null;  
}
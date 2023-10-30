import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

let winnerLine = '';
let winnerLineDirection = ''

function checkWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    let [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winnerLine = lines[i];
        if (i <= 2) {
          winnerLineDirection = 'horizontal'
        } else if (i > 2 && i <= 5) {
          winnerLineDirection = 'vertical'
        } else if (i === 6) {
          winnerLineDirection = 'diagonal-r'
        } else if (i === 7 ) {
          winnerLineDirection = 'diagonal-l'
        }
      return squares[a];
    }
  }
  return null;
}

class Square extends React.Component {
  render () {
    const className = this.props.isWinning ? `winning ${winnerLineDirection}` : 'square';
    const XorO = this.props.idName;

    return (
      <button 
      className={className}
      id={XorO}
      onClick={this.props.onClick}
      >
        {this.props.value}
      </button>
    )
  }
}

class Board extends React.Component {
  renderSquare(i) {
    const isWinning = winnerLine.includes(i);
    const idName = this.props.squares[i] === 'X' ? 'X' : 'O';

      return (
        <Square value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        isWinning={isWinning}
        idName={idName}
        />
      )
  }

  render() {

    const boardSize = 3;
    let squares = [];

    for (let i = 0; i < boardSize; i++) {
      let row = [];
      for (let j = 0; j < boardSize; j++) {
        row.push(this.renderSquare(i * boardSize + j));
      }
      squares.push(<div className='board-row' key={i}>{row}</div>);
    }

    return (
      <div>
        {squares}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moves: []
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moves = current.moves.slice();
    
    if (checkWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    moves[this.state.stepNumber] = squares[i] + '-' + (i + 1);

    this.setState({
      history: history.concat([{
        squares: squares,
        moves: moves
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState ({
      stepNumber: step,
      xIsNext: (step % 2 === 0)
    })
    winnerLine = '';
  }

  render () {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const moves = current.moves.slice();
    const winner = checkWinner(current.squares);

    const movesHistory = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move + ': ' + moves[move-1]:
      'Go to start';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status = '';
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (!current.squares.includes(null)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  }

    return (
      <div className='game' >
        <div className='status'>{status}</div>
        <div className='game-board' >
        <Board 
        squares={current.squares}
        onClick={(i) => this.handleClick(i)}
        winningLine={winnerLine || []}
        />
        </div>

        <div className='game-info'>
          <ol>{movesHistory}</ol>
        </div>
      </div>
    )
  } 
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
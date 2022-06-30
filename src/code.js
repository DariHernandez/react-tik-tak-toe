function calculateWinner(squares) {
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
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={"cell " + i}
      />
    );
  }

  render() {

    // Generate cells with loops
    let rows_buttons = []
    for (let row = 0; row < 3; row++) { 
      let buttons = []

      for (let column = 0; column < 3; column++) {
        buttons.push (this.renderSquare(row*3+column))
      }

      let row_buttons = <div className="board-row" key={"row " + row}>{buttons}</div>
      rows_buttons.push (row_buttons)
    }

    return (
      <div>
        {rows_buttons}
      </div>
    );
  }
}

class Game extends React.Component {
  
  constructor (props){
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick (i) {

    const history = this.state.history.slice (0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? "X" : "O"
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo (step) {
    this.setState ({
      stepNumber: step,
      xIsNext: (step % 2 === 0),
    })
  }

  render() {
    const history = this.state.history
    const current = history [this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map ((step, move) => {
      let desc
      if (move) {

        // Get the new symbol in the board
        const last_step = history[move-1]
        let symbol
        let diference = step["squares"].map ((cell, cell_id) => {
          if (last_step["squares"][cell_id] == cell) {
            return null
          } else {
            symbol = cell
            return cell
          } 
        })
        
        // get position of the new symbol in board
        let row
        let start_cell
        if (diference.indexOf (symbol) < 3) {
          row = 1
        } else if (diference.indexOf (symbol) < 6) {
          row = 2
        } else {
          row = 3
        }
        const column = diference.indexOf (symbol) - (row-1)*3 +1

        // generate button text with position and symbol
        desc = `Go move to #${move}, "${symbol}" (${row},${column})"` 
        

      } else {
        desc = 'Go to start game'
      }
      return (
        <li key={move} className={(move == this.state.stepNumber ? "active": "")}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    console.log ("------------")

    let status
    if (winner) {
      status = "Winner: " + winner
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X": "O")
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

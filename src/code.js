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
      return {winner: squares[a], winner_line: lines[i]}; // Return winner symbol and linw
    }
  }
  return {winner: null, winner_line: null};
}

function Square(props) {
  return (
    <button 
      className={"square " + (props.winner ? "winner" : "")} // Add "winner" class to cell winner lines
      onClick={props.onClick}> 
        {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {

    // Check if there is a winner
    const winner_line = this.props.winner_line

    let squere
    if (winner_line.includes (i)) {
      console.log ("valid cell")
      squere = <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={"cell " + i}
        winner={true}
        />
    } else {
      squere = <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={"cell " + i}
        winner={false}
        />
    }
    return (squere);
  }

  render() {

    // Generate cells with loops
    let rows_buttons = []
    for (let row = 0; row < 3; row++) { 
      let buttons = []

      for (let column = 0; column < 3; column++) {
        const button_num = row*3+column
        buttons.push (this.renderSquare(button_num))
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
      historyInverse: false,
      winner_line: []
    }
  }

  handleClick (i) {

    let history = this.state.history.slice (0, this.state.stepNumber + 1)
    let current = history[history.length - 1]
    let squares = current.squares.slice()

    // Ignore click when cell is in use or already there is a winner
    if (squares[i] || calculateWinner(squares)["winner"]) {
      return
    }
    
    // Update squeres history data
    squares[i] = this.state.xIsNext ? "X" : "O"
    history_new = history.concat([{
        squares: squares,
    }])
  
    // validate winner and update winner_line variable status
    const winner_data = calculateWinner(squares)
    if (winner_data["winner"]) {
      winner_line = winner_data["winner_line"]
      this.setState({
        winner_line: winner_line
      })
    }

    // Update state
    this.setState({
      history: history_new,
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

  historyInverse() {
    const historyInverse = this.state.historyInverse
    this.setState ({
      historyInverse: !historyInverse,
    })
  }

  render() {
    const history = this.state.history
    const current = history [this.state.stepNumber]
    const winner = calculateWinner(current.squares)["winner"]

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

    let status
    if (winner) {
      status = "Winner: " + winner
    } else {
      // Validate if all cells aren't empty
      const empty_cells = current.squares.filter ((cell) => cell == null)
      if (empty_cells.length == 0) {
        status = "Draw" // Draw message
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X": "O") // Next player message
      }

    }

    // Reverse button order
    const historyInverse = this.state.historyInverse

    if (historyInverse) {
      moves.reverse ()
      moves_list = <ol reversed>{moves}</ol>
    } else {
      moves_list = <ol>{moves}</ol>
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winner_line={this.state.winner_line} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.historyInverse()}>Inverse order</button>
          {moves_list}
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

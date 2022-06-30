var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function calculateWinner(squares) {
  var lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (var i = 0; i < lines.length; i++) {
    var _lines$i = _slicedToArray(lines[i], 3),
        a = _lines$i[0],
        b = _lines$i[1],
        c = _lines$i[2];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square(props) {
  return React.createElement(
    "button",
    { className: "square", onClick: props.onClick },
    props.value
  );
}

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board() {
    _classCallCheck(this, Board);

    return _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).apply(this, arguments));
  }

  _createClass(Board, [{
    key: "renderSquare",
    value: function renderSquare(i) {
      var _this2 = this;

      return React.createElement(Square, {
        value: this.props.squares[i],
        onClick: function onClick() {
          return _this2.props.onClick(i);
        },
        key: "cell " + i
      });
    }
  }, {
    key: "render",
    value: function render() {

      // Generate cells with loops
      var rows_buttons = [];
      for (var row = 0; row < 3; row++) {
        var buttons = [];

        for (var column = 0; column < 3; column++) {
          buttons.push(this.renderSquare(row * 3 + column));
        }

        var row_buttons = React.createElement(
          "div",
          { className: "board-row", key: "row " + row },
          buttons
        );
        rows_buttons.push(row_buttons);
      }

      return React.createElement(
        "div",
        null,
        rows_buttons
      );
    }
  }]);

  return Board;
}(React.Component);

var Game = function (_React$Component2) {
  _inherits(Game, _React$Component2);

  function Game(props) {
    _classCallCheck(this, Game);

    var _this3 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

    _this3.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
    return _this3;
  }

  _createClass(Game, [{
    key: "handleClick",
    value: function handleClick(i) {

      var history = this.state.history.slice(0, this.state.stepNumber + 1);
      var current = history[history.length - 1];
      var squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  }, {
    key: "jumpTo",
    value: function jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: step % 2 === 0
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var history = this.state.history;
      var current = history[this.state.stepNumber];
      var winner = calculateWinner(current.squares);

      var moves = history.map(function (step, move) {
        var desc = void 0;
        if (move) {

          // Get the new symbol in the board
          var last_step = history[move - 1];
          var symbol = void 0;
          var diference = step["squares"].map(function (cell, cell_id) {
            if (last_step["squares"][cell_id] == cell) {
              return null;
            } else {
              symbol = cell;
              return cell;
            }
          });

          // get position of the new symbol in board
          var row = void 0;
          var start_cell = void 0;
          if (diference.indexOf(symbol) <= 3) {
            row = 1;
            start_cell = 0;
          } else if (diference.indexOf(symbol) <= 6) {
            row = 2;
            start_cell = 3;
          } else {
            row = 3;
            start_cell = 6;
          }
          var column = diference.indexOf(symbol) - start_cell + 1;

          // generate button text with position and symbol
          desc = "Go move to #" + move + ", \"" + symbol + "\" (" + row + "," + column + ")\"";
        } else {
          desc = 'Go to start game';
        }
        return React.createElement(
          "li",
          { key: move, className: move == _this4.state.stepNumber ? "active" : "" },
          React.createElement(
            "button",
            { onClick: function onClick() {
                return _this4.jumpTo(move);
              } },
            desc
          )
        );
      });

      console.log("------------");

      var status = void 0;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }

      return React.createElement(
        "div",
        { className: "game" },
        React.createElement(
          "div",
          { className: "game-board" },
          React.createElement(Board, { squares: current.squares, onClick: function onClick(i) {
              return _this4.handleClick(i);
            } })
        ),
        React.createElement(
          "div",
          { className: "game-info" },
          React.createElement(
            "div",
            null,
            status
          ),
          React.createElement(
            "ol",
            null,
            moves
          )
        )
      );
    }
  }]);

  return Game;
}(React.Component);

// ========================================

var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Game, null));
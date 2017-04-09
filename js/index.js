'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SIZE = 7;
var STEALS = 2;

function Square(props) {
  return React.createElement(
    'button',
    { className: "square " + props.value, onClick: props.onClick },
    props.value
  );
}

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board() {
    _classCallCheck(this, Board);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    var grid = Array(SIZE).fill(null);
    for (var row = 0; row < SIZE; row++) {
      grid[row] = Array(row + 1).fill(null);
    }

    _this.state = {
      grid: grid,
      isXNextPlayer: true,
      score: {
        X: 0,
        O: 0
      },
      steals: {
        X: STEALS,
        O: STEALS
      }
    };
    return _this;
  }

  Board.prototype.handleClick = function handleClick(row, col) {
    var currPlayer = this.state.isXNextPlayer ? 'X' : 'O';
    var currVal = this.state.grid[row][col];
    var isSteal = false;

    if (currVal) {
      if (currVal === currPlayer) {
        return;
      }
      if (this.state.steals[currPlayer] <= 0) {
        return;
      }
      isSteal = true;
    }

    var grid = this.state.grid.map(function (row) {
      return row.slice();
    });
    grid[row][col] = currPlayer;

    var steals = Object.assign({}, this.state.steals);
    if (isSteal) {
      steals[currPlayer]--;
    }
    this.setState({
      grid: grid,
      isXNextPlayer: !this.state.isXNextPlayer,
      score: this.getScore(grid),
      steals: steals
    });
  };

  Board.prototype.getScore = function getScore(grid) {
    var score = {
      X: 0,
      O: 0
    };
    for (var row = 0; row < SIZE; row++) {
      for (var col = 0; col < grid[row].length; col++) {
        var player = grid[row][col];
        if (player !== null) {
          score[player] += this.getSquareScore(grid, row, col, player);
        }
      }
    }
    return score;
  };

  Board.prototype.getSquareScore = function getSquareScore(grid, row, col, player) {
    var score = 0;
    for (var i = row + 1; i < SIZE; i++) {
      var isAllGood = true;

      for (var j = col; j <= col + i - row; j++) {
        if (grid[i][j] !== player) {
          isAllGood = false;
          break;
        }
      }
      if (isAllGood) {
        score += 1;
      } else {
        break;
      }
    }
    return score;
  };

  Board.prototype.renderSquare = function renderSquare(row, col) {
    var _this2 = this;

    return React.createElement(Square, { key: col, value: this.state.grid[row][col], onClick: function onClick() {
        return _this2.handleClick(row, col);
      } });
  };

  Board.prototype.render = function render() {
    var _this3 = this;

    var rows = this.state.grid.map(function (row, rowNum) {
      return React.createElement(
        'div',
        { key: rowNum, className: 'board-row' },
        row.map(function (col, colNum) {
          return _this3.renderSquare(rowNum, colNum);
        })
      );
    });

    return React.createElement(
      'div',
      { className: 'board' },
      React.createElement(
        'div',
        { className: 'X player-status' + (this.state.isXNextPlayer ? ' active' : '') },
        React.createElement(
          'div',
          null,
          'X'
        ),
        React.createElement(
          'div',
          null,
          'Score: ',
          this.state.score['X']
        ),
        React.createElement(
          'div',
          null,
          'Steals: ',
          this.state.steals['X']
        )
      ),
      React.createElement(
        'div',
        { className: 'O player-status' + (!this.state.isXNextPlayer ? ' active' : '') },
        React.createElement(
          'div',
          null,
          'O'
        ),
        React.createElement(
          'div',
          null,
          'Score: ',
          this.state.score['O']
        ),
        React.createElement(
          'div',
          null,
          'Steals: ',
          this.state.steals['O']
        )
      ),
      rows
    );
  };

  return Board;
}(React.Component);

var Game = function (_React$Component2) {
  _inherits(Game, _React$Component2);

  function Game() {
    _classCallCheck(this, Game);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  Game.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'game' },
      React.createElement(
        'div',
        { className: 'game-board' },
        React.createElement(Board, null)
      ),
      React.createElement(
        'div',
        { className: 'game-info' },
        React.createElement('div', null),
        React.createElement('ol', null)
      )
    );
  };

  return Game;
}(React.Component);

// ========================================

ReactDOM.render(React.createElement(Game, null), document.getElementById('container'));

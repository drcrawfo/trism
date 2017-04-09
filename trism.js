const SIZE = 7;
const STEALS = 2;

function Square(props) {
    return (
      <button className={"square " + props.value} onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  constructor() {
    super();
    
    const grid = Array(SIZE).fill(null);
    for (var row = 0; row < SIZE; row++) {
      grid[row] = Array(row+1).fill(null);
    }
    
    this.state = {
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
  }
  
  handleClick(row, col) {
    const currPlayer = this.state.isXNextPlayer ? 'X' : 'O';
    const currVal = this.state.grid[row][col];
    var isSteal = false;
    
    if (currVal) {
      if (currVal === currPlayer) { return; }
      if (this.state.steals[currPlayer] <= 0) { return; }
      isSteal = true;
    }
    
    const grid = this.state.grid.map((row) => {
      return row.slice();
    });
    grid[row][col] = currPlayer;
    
    const steals = Object.assign({}, this.state.steals);
    if (isSteal) {
      steals[currPlayer]--
    }
    this.setState({
      grid: grid, 
      isXNextPlayer: !this.state.isXNextPlayer,
      score: this.getScore(grid),
      steals: steals
    });
  }
  
  getScore(grid) {
    var score = {
      X: 0,
      O: 0
    }
    for (var row = 0; row < SIZE; row++) {
      for (var col = 0; col < grid[row].length; col++) {
        const player = grid[row][col];
        if (player !== null) {
          score[player] += this.getSquareScore(grid, row, col, player);
        }
      }
    }
    return score;
  }
  
  getSquareScore(grid, row, col, player) {
    var score = 0;
    for (var i = row+1; i < SIZE; i++) {
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
  }
  
  renderSquare(row, col) {
    return <Square key={col} value={this.state.grid[row][col]} onClick={() => this.handleClick(row, col)}/>;
  }
  
  render() {
    const rows = this.state.grid.map((row, rowNum) => {
        return (<div key={rowNum} className="board-row">
          {row.map((col, colNum) => {
            return this.renderSquare(rowNum, colNum);
          })}
        </div>);
    });
    
    return (
      <div className="board">
        <div className={'X player-status' + (this.state.isXNextPlayer ? ' active' : '')}>
          <div>X</div>
          <div>Score: {this.state.score['X']}</div>
          <div>Steals: {this.state.steals['X']}</div>
        </div>
        <div className={'O player-status' + (!this.state.isXNextPlayer ? ' active' : '')}>
          <div>O</div>
          <div>Score: {this.state.score['O']}</div>
          <div>Steals: {this.state.steals['O']}</div>
        </div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

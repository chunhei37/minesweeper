import React from "react";
import Board from "./Component/Board";
import Scorebar from "./Component/Scorebar";

const FillMines = (boardValue, startPos = [0, 0], difficulty = 0) => {
  const board = Object.assign({}, boardValue);
  const boardSize = Object.keys(board).length;
  const totalMineCounts = Math.floor(
    boardSize * (2.5 + (Math.random() * difficulty + difficulty))
  );
  let mineLeft = totalMineCounts;
  while (mineLeft > 0) {
    const t = Math.floor(Math.random() * boardSize);
    const q = Math.floor(Math.random() * boardSize);
    let flag = true;
    const [x, y] = startPos.map((i) => parseInt(i));
    for (let i = -1; i <= 1; i++) {
      for (let o = -1; o <= 1; o++) {
        if (t === x + i || q === y + o) {
          flag = false;
        }
      }
    }
    if (flag) {
      board[t][q] = -1;
      mineLeft--;
    }
  }

  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (board[x][y] !== -1) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          let xx = x + i;
          if (xx in board) {
            for (let t = -1; t <= 1; t++) {
              let yy = y + t;
              if (yy in board[xx]) {
                if (board[xx][yy] === -1) {
                  count++;
                }
              }
            }
          }
        }
        board[x][y] = count;
      }
    }
  }
  console.log({ totalMineCounts: totalMineCounts, boardValue: board });
  return { totalMineCounts: totalMineCounts, boardValue: board };
};

const GenerateBlankBoard = (boardSize = 19) => {
  const board = {};
  const boardState = {};
  for (let i = 0; i < boardSize; i++) {
    board[i] = {};
    boardState[i] = {};
    for (let t = 0; t < boardSize; t++) {
      board[i][t] = 0;
      boardState[i][t] = 1;
    }
  }
  return { boardValue: board, boardState: boardState };
};

const GetHandlers = ({
  BoardValue,
  BoardState,
  Difficulty,
  setBoardValue,
  setBoardState,
  isFirstMove,
  setIsFirstMove,
  totalMineCounts,
  setTotalMineCounts,
  setGameOver,
}) => {
  const handlers = {};
  if (!BoardValue || !BoardState) {
    return handlers;
  }
  const board = Object.assign({}, BoardValue),
    boardState = Object.assign({}, BoardState);

  handlers["checkWin"] = () => {
    let counts = 0;
    for (const row in board) {
      for (const col in board[row]) {
        if (board[row][col] === -1 && boardState[row][col] === 2) {
          counts++;
        }
      }
    }
    if (counts === totalMineCounts) {
      alert("You Won!");
      setGameOver(true);
    }
  };

  handlers["gameover"] = () => {
    const bs = Object.assign({}, BoardState);
    for (const row in boardState) {
      for (const col in boardState[row]) {
        bs[row][col] = 0;
      }
    }
    setBoardState(bs);
    setTimeout(() => {
      alert("Game Over!");
      setGameOver(true);
    }, 100);
  };

  handlers["addFlag"] = (curPos) => {
    const [x, y] = curPos;
    boardState[x][y] = 2;
  };

  handlers["removeFlag"] = (curPos) => {
    const [x, y] = curPos;
    boardState[x][y] = 1;
  };

  handlers["rightClick"] = (curPos) => {
    if(isFirstMove) {
      return;
    }
    const [x, y] = curPos;
    if (boardState[x][y] === 1) {
      handlers.addFlag(curPos);
    } else if (boardState[x][y] === 2) {
      handlers.removeFlag(curPos);
    }
    setBoardState(boardState);
    setTimeout(() => {
      handlers.checkWin();
    }, 100);
  };

  handlers["click"] = (curPos) => {
    if (isFirstMove) {
      let newBoard = FillMines(board, curPos, Difficulty);
      setBoardValue(newBoard.boardValue);
      setIsFirstMove(false);
      setTotalMineCounts(newBoard.totalMineCounts);
    }
    const [x, y] = curPos.map((i) => parseInt(i));
    if (boardState[x][y] === 1) {
      boardState[x][y] = 0;
      if (board[x][y] === -1) {
        setTimeout(() => {
          handlers.gameover();
        }, 100);
      } else {
        if (board[x][y] === 0) {
          handlers.reveal(curPos);
        }
      }
    } else if (boardState[x][y] === 2) {
      handlers.removeFlag(curPos);
    }
    setBoardState(boardState);
  };

  handlers["reveal"] = (curPos) => {
    const [x, y] = curPos;
    const revealPos = [];
    const addedList = [];

    const findRevealPos = (x, y) => {
      x = parseInt(x);
      y = parseInt(y);
        revealPos.push([x, y]);
        if (board[x][y] === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let t = -1; t <= 1; t++) {
              const [xx, yy] = [x + i, y + t];
              if (xx in board && yy in board[xx]) {
                if (board[xx][yy] !== -1) {
                  if (board[xx][yy] === 0) {
                    if (addedList.indexOf(`${xx}-${yy}`) < 0) {
                      addedList.push(`${xx}-${yy}`);
                      findRevealPos(xx, yy);
                    }
                  } else {
                    revealPos.push([xx, yy]);
                  }
                }
              }
            }
          }
      }
    };

    findRevealPos(x, y);
    for (let i of revealPos) {
      const [x, y] = i;
      boardState[x][y] = 0;
    }
    setBoardState(boardState);
  };

  return handlers;
};

const WelcomeScreen = (setDifficulty) => {
  const LevelButton = ({ color, label, onClickEvent }) => {
    return (
      <button
        style={{
          background: color,
          padding: 10,
          borderRadius: 5,
          borderColor: "transparent",
          width: 100,
          fontSize: 18,
          fontWeight: "bold",
          margin: 10,
          color: "#efefef",
          textShadow: "1px 1px #333",
          boxShadow: "1px 1px rgba(0,0,0,0.5)",
        }}
        onClick={onClickEvent}
      >
        {label}
      </button>
    );
  };

  return (
    <div>
      <div style={{ textAlign: "center", fontSize: 36, color: "#222" }}>
        <h1 style={{ textShadow: "1px 1px #333" }}>Minesweeper</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LevelButton
          color="#63C132"
          label="Easy"
          onClickEvent={() => setDifficulty(0)}
        />
        <LevelButton
          color="#454ADE"
          label="Medium"
          onClickEvent={() => setDifficulty(1)}
        />
        <LevelButton
          color="#EF233C"
          label="Hard"
          onClickEvent={() => setDifficulty(2)}
        />
      </div>
    </div>
  );
};

const MainScreen = ({
  BoardValue,
  BoardState,
  EventsHandlers,
  totalMineCounts,
  Difficulty,
  timeSpent,
}) => {
  return (
    <div>
      <Scorebar
        totalMineCounts={totalMineCounts}
        Difficulty={Difficulty}
        timeSpent={timeSpent}
      />
      <div style={{ padding: 30 }}>
        <Board
          boardValue={BoardValue}
          boardState={BoardState}
          handlers={EventsHandlers}
        />
      </div>
    </div>
  );
};

function App() {
  const [GameOver, setGameOver] = React.useState(false);
  const [isFirstMove, setIsFirstMove] = React.useState(true);
  const [Difficulty, setDifficulty] = React.useState(null);
  const [BoardState, setBoardState] = React.useState(null);
  const [BoardValue, setBoardValue] = React.useState(null);
  const [EventsHandlers, setEventHandlers] = React.useState(null);
  const [totalMineCounts, setTotalMineCounts] = React.useState(0);
  const [timeSpent, setTimeSpent] = React.useState(0);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    if (!isFirstMove) {
      setTimeSpent(1);
    }
  }, [isFirstMove]);

  React.useEffect(() => {
    if (timeSpent > 0) {
      timerRef.current = setTimeout(() => setTimeSpent(timeSpent + 1), 1000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [timeSpent]);

  React.useEffect(() => {
    setIsFirstMove(true);
    const BlankBoard = GenerateBlankBoard(19);
    setBoardValue(BlankBoard.boardValue);
    setBoardState(BlankBoard.boardState);
    setEventHandlers(null);
    setTotalMineCounts(0);
    setDifficulty(null);
    setGameOver(false);
    setTimeSpent(0);
    clearTimeout(timerRef.current);
  }, [GameOver]);

  React.useEffect(() => {
    const handlers = GetHandlers({
      BoardValue: BoardValue,
      BoardState: BoardState,
      Difficulty: Difficulty,
      setGameOver: setGameOver,
      setBoardState: setBoardState,
      setBoardValue: setBoardValue,
      totalMineCounts: totalMineCounts,
      setTotalMineCounts: setTotalMineCounts,
      isFirstMove: isFirstMove,
      setIsFirstMove: setIsFirstMove,
    });
    setEventHandlers(handlers);
  }, [BoardState, BoardValue, Difficulty, totalMineCounts, isFirstMove]);

  return (
    <div
      style={{
        display: "flex",
        minWidth: 500,
        minHeight: 500,
        borderWidth: 5,
        borderStyle: "solid",
        borderRadius: 15,
        margin: 50,
        justifyContent: "center",
        background: "#D7D6D6",
      }}
    >
      {Difficulty == null
        ? WelcomeScreen(setDifficulty)
        : MainScreen({
            timeSpent: timeSpent,
            BoardValue: BoardValue,
            BoardState: BoardState,
            EventsHandlers: EventsHandlers,
            totalMineCounts: totalMineCounts,
            Difficulty: Difficulty,
          })}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";

interface Props {}

type Board = Array<Array<CELL_VALUES>>;

interface Coordinate {
  x: number;
  y: number;
}

enum GAME_STATE {
  WIN = "WIN",
  PLAYING = "PLAYING",
  LOSE = "LOSE",
}

enum CELL_STYLES {
  FLAG = "bg-gray-400",
  IDLE = "bg-gray-400 text-none",
  BOMB = "bg-gray-400 text-none",
  BOMB_TOUCHED = "bg-white",
}

enum CELL_VALUES {
  FLAG = "🚩",
  TOUCHED_BOMB = "💣",
  BOMB = -1,
  EMPTY = "",
  ONE_BOMB = 1,
  TWO_BOMB = 2,
  THREE_BOMB = 3,
  FOUR_BOMB = 4,
  FIVE_BOMB = 5,
  SIX_BOMB = 6,
  SEVEN_BOMB = 7,
  EIGHT_BOMB = 8,
  IDLE = 9,
}

const getClassname = (cell: string | number): CELL_STYLES => {
  const { IDLE, BOMB, TOUCHED_BOMB, FLAG } = CELL_VALUES;
  switch (cell) {
    case IDLE:
      return CELL_STYLES.IDLE;
    case FLAG:
      return CELL_STYLES.FLAG;
    case TOUCHED_BOMB:
      return CELL_STYLES.BOMB_TOUCHED;
    case BOMB:
      return CELL_STYLES.BOMB;
    default:
      break;
  }
};

export const createBoard = (rows: number, columns: number): Board => {
  return Array(rows)
    .fill(undefined)
    .map(() => Array(columns).fill(CELL_VALUES.IDLE));
};

export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getCoords = (rows: number, columns: number): Coordinate => ({
  x: getRandomNumber(0, rows),
  y: getRandomNumber(0, columns),
});

export const placeBombs = (bombs: number, rows: number, columns: number): Board => {
  const board = createBoard(rows, columns);
  for (let index = 0; index < bombs; index++) {
    let bomb = getCoords(rows, columns);
    while (board[bomb.x][bomb.y] === CELL_VALUES.BOMB) {
      bomb = getCoords(rows, columns);
    }

    board[bomb.x][bomb.y] = CELL_VALUES.BOMB;
  }

  return board;
};

const checkNeighbors = (x: number, y: number, startingBoard: Board): CELL_VALUES.EMPTY | number => {
  const { BOMB, EMPTY } = CELL_VALUES;
  let bombQuantity = 0;
  for (let i = -1; i <= 1; i++) {
    if (startingBoard[x + i] !== undefined) {
      for (let j = -1; j <= 1; j++) {
        if (startingBoard[x + i][y + j] !== undefined) {
          if (startingBoard[x + i][y + j] === BOMB) bombQuantity++;
        }
      }
    }
  }
  if (bombQuantity === 0) return EMPTY;
  return bombQuantity;
};

const addFlag = (
  event: React.MouseEvent,
  x: number,
  y: number,
  board: Board,
  setBoardCallback: React.Dispatch<React.SetStateAction<Board>>,
  cell: CELL_VALUES,
  gameStatus: GAME_STATE
): void => {
  event.preventDefault();
  const { IDLE, FLAG, BOMB } = CELL_VALUES;
  if (gameStatus !== GAME_STATE.PLAYING) return;

  if (board[x][y] === FLAG) {
    board[x][y] = cell;
    return setBoardCallback([...board]);
  }
  if (cell === IDLE || cell === BOMB) {
    board[x][y] = FLAG;
    return setBoardCallback([...board]);
  }
};

const MineSweeper = (props: Props) => {
  const rows = 5;
  const columns = 6;
  const bombs = 5;
  const [board, setBoard] = useState([[]]);
  const [flagsBoard, setFlagsBoard] = useState([[]]);
  const [referenceBoard, setReferenceBoard] = useState([[]]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState(GAME_STATE.PLAYING);

  const checkVictory = (): void => score === rows * columns - bombs && setGameStatus(GAME_STATE.WIN);
  const checkScore = (board: Board): number =>
    board.flat().filter((item) => item !== CELL_VALUES.IDLE && item !== CELL_VALUES.BOMB).length;
  const clickCell = (x, y, referenceBoard) => {
    const { IDLE, BOMB, TOUCHED_BOMB } = CELL_VALUES;
    const { PLAYING, LOSE } = GAME_STATE;
    if (gameStatus !== PLAYING) return;
    switch (referenceBoard[x][y]) {
      case BOMB:
        referenceBoard[x][y] = TOUCHED_BOMB;
        setGameStatus(LOSE);
        break;
      case IDLE:
        const numberNeighbors = checkNeighbors(x, y, referenceBoard);
        referenceBoard[x][y] = numberNeighbors;
        if (numberNeighbors === CELL_VALUES.EMPTY) checkEmptyCells(x, y, referenceBoard);
        break;
      default:
        break;
    }
    setScore(checkScore(referenceBoard));
    setBoard([...referenceBoard]);
  };

  const Cell = ({ handleClick, handleRightClick, children }) => {
    return (
      <div
        onClick={handleClick}
        onContextMenu={handleRightClick}
        className={`w-12 h-12 border inline-flex justify-center items-center leading-normal ${getClassname(children)} `}
      >
        {children}
      </div>
    );
  };

  const startGame = () => {
    let initBoard = placeBombs(bombs, rows, columns);
    setReferenceBoard(JSON.parse(JSON.stringify(initBoard)));
    setBoard(JSON.parse(JSON.stringify(initBoard)));
    setFlagsBoard(JSON.parse(JSON.stringify(initBoard)));
    setScore(0);
    setGameStatus(GAME_STATE.PLAYING);
  };

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    checkVictory();
    console.log(checkScore(board));
    setScore(checkScore(board));
  }, [score]);

  const checkEmptyCells = (x, y, board) => {
    if (board[x][y] !== CELL_VALUES.IDLE && board[x][y] !== CELL_VALUES.EMPTY) return false;

    for (let i = -1; i <= 1; i++) {
      if (board[x + i] !== undefined) {
        for (let j = -1; j <= 1; j++) {
          if (board[x + i][y + j] !== undefined) {
            if (board[x + i][y + j] === CELL_VALUES.IDLE) {
              clickCell(x + i, y + j, referenceBoard);
            }
          }
        }
      }
    }
    return;
  };

  const renderBoard = (board: Board) => {
    return (
      <div className="container mx-auto flex flex-col justify-center items-center">
        {board.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="flex">
              {row.map((cell, columnIndex) => {
                return (
                  <Cell
                    handleRightClick={(event) =>
                      addFlag(event, rowIndex, columnIndex, flagsBoard, setFlagsBoard, cell, gameStatus)
                    }
                    key={`(${rowIndex},${columnIndex})`}
                    handleClick={() => clickCell(rowIndex, columnIndex, referenceBoard)}
                  >
                    {cell === CELL_VALUES.IDLE || cell === CELL_VALUES.BOMB ? flagsBoard[rowIndex][columnIndex] : cell}
                  </Cell>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-screen h-screen text-center">
      <h1 className="text-xl my-6">Buscaminas</h1>
      <h2>Score: {score}</h2>

      <button
        onClick={() => {
          startGame();
        }}
        className="bg-purple-500 rounded-sm text-gray-200 px-4 py-2"
      >
        Reset
      </button>
      {gameStatus !== GAME_STATE.PLAYING && <h2> {gameStatus} </h2>}
      {board && renderBoard(board)}
    </div>
  );
};

export default MineSweeper;

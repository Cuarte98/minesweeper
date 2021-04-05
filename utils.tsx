import { CELL_VALUES, CELL_STYLES, Coordinate, Board, GAME_STATE } from "./types";

export const createBoard = (rows: number, columns: number): Board => {
  return Array(rows)
    .fill(undefined)
    .map(() => Array(columns).fill(CELL_VALUES.IDLE));
};

export const getClassname = (cell: string | number): CELL_STYLES => {
  const { IDLE, BOMB, BOMB_TOUCHED, FLAG } = CELL_VALUES;
  switch (cell) {
    case IDLE:
    case BOMB:
      return CELL_STYLES.IDLE;
    case FLAG:
      return CELL_STYLES.FLAG;
    case BOMB_TOUCHED:
      return CELL_STYLES.BOMB_TOUCHED;
  }
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

export const checkNeighbors = (x: number, y: number, startingBoard: Board): CELL_VALUES.EMPTY | number => {
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

export const checkScore = (board: Board): number =>
  board.flat().filter((item) => item !== CELL_VALUES.IDLE && item !== CELL_VALUES.BOMB).length;

export const copyBoard = (board: Board): Board => JSON.parse(JSON.stringify(board));

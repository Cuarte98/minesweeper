export type Board = Array<Array<CELL_VALUES>>;

export interface Coordinate {
  x: number;
  y: number;
}

export enum GAME_STATE {
  WIN = "WIN",
  PLAYING = "PLAYING",
  LOSE = "LOSE",
}

export enum CELL_STYLES {
  FLAG = "bg-gray-400",
  IDLE = "bg-gray-400 text-none",
  BOMB = "bg-gray-400 text-none",
  BOMB_TOUCHED = "bg-white",
}

export enum CELL_VALUES {
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

import { CELL_STYLES, CELL_VALUES } from "../types";
import { checkNeighbors, createBoard, getClassname, getCoords, placeBombs } from "../utils";

describe("All functions", () => {
  let rows;
  let columns;
  let bombs;
  let dummyBoard;
  let dummyBoardWithBombs;
  beforeEach(() => {
    rows = 5;
    columns = 5;
    bombs = 20;
    dummyBoard = [
      [9, 9, 9, 9, 9],
      [9, 9, 9, 9, 9],
      [9, 9, 9, 9, 9],
      [9, 9, 9, 9, 9],
      [9, 9, 9, 9, 9],
    ];
    dummyBoardWithBombs = [
      [-1, 9, 9, 9, 9],
      [9, 9, -1, 9, 9],
      [-1, 9, 9, -1, 9],
      [9, 9, 9, 9, 9],
      [9, 9, 9, 9, 9],
    ];
  });

  describe("createBoard function", () => {
    it("should create a board", () => {
      let resultBoard = createBoard(rows, columns);
      expect(resultBoard).toStrictEqual(dummyBoard);
    });
  });

  describe("getCoords function", () => {
    it("should get coords", () => {
      const coords = getCoords(rows, columns);
      expect(Object.keys(coords)).toStrictEqual(["x", "y"]);
      expect(coords.x).toBeGreaterThanOrEqual(0);
      expect(coords.x).toBeLessThanOrEqual(rows);
      expect(coords.y).toBeGreaterThanOrEqual(0);
      expect(coords.y).toBeLessThanOrEqual(columns);
    });
  });

  describe("placeBombs", () => {
    it("should place 20 bombs", () => {
      let boardWithBombs = placeBombs(bombs, rows, columns);
      let checkQuantity = boardWithBombs
        .map((arr) => {
          return arr.filter((i) => i === -1).length;
        })
        .reduce((prev, current) => prev + current);
      expect(checkQuantity).toBe(20);
    });
  });

  describe("getClassname", () => {
    it("given idle value should return idle styles", () => {
      const cell = CELL_VALUES.IDLE;
      const cellClassname = getClassname(cell);
      expect(cellClassname).toBe(CELL_STYLES.IDLE);
    });
    it("given flag value should return flag styles", () => {
      const cell = CELL_VALUES.FLAG;
      const cellClassname = getClassname(cell);
      expect(cellClassname).toBe(CELL_STYLES.FLAG);
    });
    it("given touched bomb value should return touched bomb styles", () => {
      const cell = CELL_VALUES.BOMB_TOUCHED;
      const cellClassname = getClassname(cell);
      expect(cellClassname).toBe(CELL_STYLES.BOMB_TOUCHED);
    });
    it("given bomb value should return idle styles", () => {
      const cell = CELL_VALUES.BOMB;
      const cellClassname = getClassname(cell);
      expect(cellClassname).toBe(CELL_STYLES.IDLE);
    });
  });

  describe("checkNeighbors", () => {
    it("should find 3 bombs in position (2,2)", () => {
      const bombCount = checkNeighbors(1, 1, dummyBoardWithBombs);
      expect(bombCount).toBe(3);
    });
    it("should return EMPTY if there is no bomb", () => {
      const bombCount = checkNeighbors(4, 0, dummyBoardWithBombs);
      expect(bombCount).toBe("");
    });
  });
});

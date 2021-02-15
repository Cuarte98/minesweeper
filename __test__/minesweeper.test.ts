import { createBoard, getCoords, placeBombs } from "../components/minesweeper";

describe("All functions", () => {
    let rows;
    let columns;
    let bombs;
    let dummyBoard;
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
    });

    describe("createBoard function", () => {
        it("should create a board", () => {
            let resultBoard = createBoard(rows, columns);
            expect(resultBoard).toStrictEqual(dummyBoard);
        });
    });

    it("should get coords", () => {
        const coords = getCoords(rows, columns);
        expect(Object.keys(coords)).toStrictEqual(["x", "y"]);
        expect(coords.x).toBeGreaterThanOrEqual(0);
        expect(coords.x).toBeLessThanOrEqual(rows);
        expect(coords.y).toBeGreaterThanOrEqual(0);
        expect(coords.y).toBeLessThanOrEqual(columns);
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
});

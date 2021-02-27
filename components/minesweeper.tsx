import React, { useEffect, useState } from "react";
import { CELL_VALUES, CELL_STYLES, Coordinate, Board, GAME_STATE } from "../types";
import { checkNeighbors, placeBombs, addFlag, getClassname } from "../utils";
import Options from "./options";
interface Props {}
import { useTranslation } from "react-i18next";

const MineSweeper = (props: Props) => {
  const { t, i18n } = useTranslation();
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(6);
  const [bombs, setBombs] = useState(5);

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
      <button onClick={() => i18n.changeLanguage("es")}>{t("spanish")}</button>
      <button onClick={() => i18n.changeLanguage("en")}>{t("english")}</button>

      <h1 className="text-xl my-6">{t("title")}</h1>

      <Options
        rows={rows}
        columns={columns}
        bombs={bombs}
        setRows={setRows}
        setColumns={setColumns}
        setBombs={setBombs}
        startGame={startGame}
      />

      <h2>
        {t("score")}: {score}
      </h2>

      {gameStatus !== GAME_STATE.PLAYING && <h2> {gameStatus} </h2>}
      {board && renderBoard(board)}
    </div>
  );
};

export default MineSweeper;

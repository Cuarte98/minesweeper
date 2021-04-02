import React, { useEffect, useState } from "react";
import { GAME_STATE, CELL_VALUES, Board } from "../types";
import { placeBombs, checkNeighbors, addFlag, checkScore } from "../utils";
import Cell from "./Cell";
import Options from "./options";

const copyBoard = (board: Board): Board => JSON.parse(JSON.stringify(board));

const useGenerateGame = (inputRows = 5, inputColumns = 5, inputBombs = 5) => {
  const [rows, setRows] = useState(inputRows);
  const [columns, setColumns] = useState(inputColumns);
  const [bombs, setBombs] = useState(inputBombs);
  const [board, setBoard] = useState([[]]);
  const [referenceBoard, setReferenceBoard] = useState([[]]);
  const [gameStatus, setGameStatus] = useState(GAME_STATE.PLAYING);
  const [flagsBoard, setFlagsBoard] = useState([[]]);
  const [score, setScore] = useState(0);

  const checkVictory = (): void => score === rows * columns - bombs && setGameStatus(GAME_STATE.WIN);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    checkVictory();
    setScore(checkScore(board));
  }, [score]);

  const startGame = () => {
    let initBoard = placeBombs(bombs, rows, columns);
    setReferenceBoard(copyBoard(initBoard));
    setBoard(copyBoard(initBoard));
    setFlagsBoard(copyBoard(initBoard));
    setScore(0);
    setGameStatus(GAME_STATE.PLAYING);
  };

  const clickCell = (referenceBoard) => (x, y) => {
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

  const checkEmptyCells = (x, y, board) => {
    if (board[x][y] !== CELL_VALUES.IDLE && board[x][y] !== CELL_VALUES.EMPTY) return false;

    for (let i = -1; i <= 1; i++) {
      if (board[x + i] !== undefined) {
        for (let j = -1; j <= 1; j++) {
          if (board[x + i][y + j] !== undefined) {
            if (board[x + i][y + j] === CELL_VALUES.IDLE) {
              clickCell(referenceBoard)(x + i, y + j);
            }
          }
        }
      }
    }
    return;
  };

  const renderBoard = (board: Board) => () => {
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
                    handleClick={() => clickCell(referenceBoard)(rowIndex, columnIndex)}
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

  const options = {
    rows,
    setRows,
    columns,
    setColumns,
    bombs,
    setBombs,
  };

  return {
    OptionsComponent: () => <Options {...options} startGame={startGame} />,
    board,
    score,
    gameStatus,
    renderBoard: renderBoard(board),
  };
};

export default useGenerateGame;

import React, { useEffect, useState } from "react";
import { GAME_STATE, CELL_VALUES, Board } from "../types";
import { placeBombs, checkNeighbors, checkScore, copyBoard } from "../utils";
import Cell from "./Cell";
import Options from "./options";

const useGenerateGame = (inputRows = 5, inputColumns = 5, inputBombs = 5) => {
  const { IDLE, FLAG, BOMB, BOMB_TOUCHED, EMPTY } = CELL_VALUES;
  const { PLAYING, LOSE, WIN } = GAME_STATE;

  const [rows, setRows] = useState(inputRows);
  const [columns, setColumns] = useState(inputColumns);
  const [bombs, setBombs] = useState(inputBombs);
  const [board, setBoard] = useState([[]]);
  const [referenceBoard, setReferenceBoard] = useState([[]]);
  const [gameStatus, setGameStatus] = useState(PLAYING);
  const [flagsBoard, setFlagsBoard] = useState([[]]);
  const [score, setScore] = useState(0);

  const checkVictory = (): void => score === rows * columns - bombs && setGameStatus(WIN);

  const addFlag = (
    event: React.MouseEvent,
    x: number,
    y: number,
    board: Board,
    cell: CELL_VALUES,
    gameStatus: GAME_STATE
  ): void => {
    event.preventDefault();
    if (gameStatus !== PLAYING) return;

    if (board[x][y] === FLAG) {
      board[x][y] = cell;
      return setFlagsBoard([...board]);
    }
    if (cell === IDLE || cell === BOMB) {
      board[x][y] = FLAG;
      return setFlagsBoard([...board]);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    checkVictory();
    setScore(checkScore(board));
  }, [score]);

  const startGame = (): void => {
    const initBoard = placeBombs(bombs, rows, columns);
    setReferenceBoard(copyBoard(initBoard));
    setBoard(copyBoard(initBoard));
    setFlagsBoard(copyBoard(initBoard));
    setScore(0);
    setGameStatus(PLAYING);
  };

  const clickCell = (referenceBoard, x, y) => {
    if (gameStatus !== PLAYING) return;
    switch (referenceBoard[x][y]) {
      case BOMB:
        referenceBoard[x][y] = BOMB_TOUCHED;
        setGameStatus(LOSE);
        break;
      case IDLE:
        const numberNeighbors = checkNeighbors(x, y, referenceBoard);
        referenceBoard[x][y] = numberNeighbors;
        if (numberNeighbors === EMPTY) checkEmptyCells(x, y, referenceBoard);
        break;
      default:
        break;
    }
    setScore(checkScore(referenceBoard));
    setBoard([...referenceBoard]);
  };

  const checkEmptyCells = (x, y, board) => {
    if (board[x][y] !== IDLE && board[x][y] !== EMPTY) return false;

    for (let i = -1; i <= 1; i++) {
      if (board[x + i] !== undefined) {
        for (let j = -1; j <= 1; j++) {
          if (board[x + i][y + j] !== undefined) {
            if (board[x + i][y + j] === IDLE) {
              clickCell(referenceBoard, x + i, y + j);
            }
          }
        }
      }
    }
    return;
  };

  /* 
    ¿Por qué estoy utilizando una función de tipo curry en la siguiente linea? 
    Esto se debe a que de esta manera, podemos pasar como argumento el tablero y guardarlo dentro de la función renderBoard,
    para luego en el componente que llamemos al hook, renderizar el tablero previamente guardado.
  */

  const renderBoard = (board: Board) => () => {
    return (
      <div className="container mx-auto flex flex-col justify-center items-center" data-testid="board">
        {board.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="flex">
              {row.map((cell, columnIndex) => {
                return (
                  <Cell
                    handleRightClick={(event) => addFlag(event, rowIndex, columnIndex, flagsBoard, cell, gameStatus)}
                    key={`(${rowIndex},${columnIndex})`}
                    handleClick={() => clickCell(referenceBoard, rowIndex, columnIndex)}
                  >
                    {cell === IDLE || cell === BOMB ? flagsBoard[rowIndex][columnIndex] : cell}
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

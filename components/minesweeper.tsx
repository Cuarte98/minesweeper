import React from "react";
import { GAME_STATE } from "../types";
import { useTranslation } from "react-i18next";
import useGenerateGame from "./useGenerateGame";

const MineSweeper = () => {
  const { t, i18n } = useTranslation();

  const { score, board, gameStatus, renderBoard, OptionsComponent } = useGenerateGame();

  return (
    <div className="w-screen h-screen text-center">
      <button onClick={() => i18n.changeLanguage("es")}>{t("spanish")} 🇪🇸</button>
      <button onClick={() => i18n.changeLanguage("en")}>{t("english")} 🇺🇸</button>

      <h1 className="text-xl my-6">{t("title")}</h1>

      <OptionsComponent />

      <h2>
        {t("score")}: {score}
      </h2>

      {gameStatus !== GAME_STATE.PLAYING && <h2> {gameStatus} </h2>}
      {board && renderBoard()}
    </div>
  );
};

export default MineSweeper;

import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  rows: number;
  columns: number;
  bombs: number;
  setRows: (number) => void;
  setColumns: (number) => void;
  setBombs: (number) => void;
  startGame: () => void;
}

const Options = ({ rows, columns, bombs, setRows, setColumns, setBombs, startGame }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="absolute shadow-lg bg-purple-200 top-4 left-4 rounded py-2 px-4 flex flex-col items-center">
        {t("rows")}
        <input
          className="border-gray-700 border mb-2"
          type="number"
          name="rows"
          id=""
          defaultValue={rows}
          onChange={(e) => setRows(parseInt(e.target.value))}
        />
        {t("columns")}
        <input
          className="border-gray-700 border mb-2"
          type="number"
          name="columns"
          id=""
          defaultValue={columns}
          onChange={(e) => setColumns(parseInt(e.target.value))}
        />
        {t("bombs")}
        <input
          className="border-gray-700 border mb-2"
          type="number"
          name="bombs"
          id=""
          defaultValue={bombs}
          onChange={(e) => setBombs(parseInt(e.target.value))}
        />
        <button
          onClick={() => {
            startGame();
          }}
          className="bg-purple-500 rounded-sm text-gray-200 px-4 py-2"
        >
          {t("new game")}
        </button>
      </div>
    </div>
  );
};

export default Options;

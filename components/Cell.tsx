import React from "react";
import { getClassname } from "../utils";

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

export default Cell;

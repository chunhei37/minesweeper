import React from "react";

const color = [
  "black",
  "blue",
  "green",
  "red",
  "purple",
  "darkred",
  "darkgreen",
  "yellow",
];

const flagIcon = "🚩";
const mineIcon = "💣";

const Cell = ({ state, value, onClick, onContextMenu }) => {
  const getDisplay = () => {
    if (state === 0) {
      if (value === -1) {
        return (
          <div style={{ width: "100%", height: "100%", background: "red" }}>
            {mineIcon}
          </div>
        );
      }
      return (
        <div style={{ width: "100%", height: "100%", background: "#c1c1c1" }}>
          {value !== 0 ? value : ""}
        </div>
      );
    }
    if (state === 1) {
      return "";
    }
    if (state === 2) {
      return flagIcon;
    }
  };
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{
        height: 25,
        width: 25,
        borderWidth: 1,
        borderColor: "black",
        borderStyle: "solid",
        textAlign: "center",
        userSelect: "none",
        fontWeight: 600,
        fontSize: 18,
        color: value < color.length ? color[value] : "gold",
      }}
    >
      {getDisplay()}
    </div>
  );
};

export default Cell;

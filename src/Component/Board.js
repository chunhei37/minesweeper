import React from "react";
import Cell from "./Cell";

const RowDiv = ({ items }) => {
  return <div style={{ display: "flex" }}>{items}</div>;
};

const Board = ({ boardValue, boardState, handlers }) => {

  const boardItems = [];
  for (const row in boardState) {
    const ColItems = [];
    for (const col in boardState[row]) {
      ColItems.push(
        <Cell
          key={`${row}-${col}`}
          value={boardValue[row][col] || 0}
          state={boardState[row][col]}
          onContextMenu={function (e) {
            e.preventDefault();
            handlers.rightClick([row, col]);
          }}
          onClick={function () {
            handlers.click([row, col]);
          }}
        />
      );
    }
    boardItems.push(<RowDiv key={boardItems.length} items={ColItems}></RowDiv>);
  }

  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
      }}
    >
      <div
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderStyle: "solid",
          backgroundColor: "white",
          marginTop: 50,
          marginBottom: 50,
        }}
      >
        {boardItems}
      </div>
    </div>
  );
};

export default Board;

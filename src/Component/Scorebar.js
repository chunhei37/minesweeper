import React from "react";

const Scorebar = ({ totalMineCounts,timeSpent }) => {
  return (
    <div style={{ justifyContent:"center", display:"flex", background: "#FFBD33", fontSize:28, fontWeight:600, borderTopRightRadius:10, borderTopLeftRadius:10,padding:5 }}>
      <div style={{marginRight:15}}>
        Total Mines: {totalMineCounts}
      </div>

      <div>Time spent: {timeSpent}</div>
    </div>
  );
};

export default Scorebar;

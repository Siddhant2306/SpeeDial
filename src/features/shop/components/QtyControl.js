import React from "react";

const QtyControl = ({ value, onDec, onInc }) => {
  return (
    <div className="qty-control">
      <button onClick={onDec}>-</button>
      <span>{value}</span>
      <button onClick={onInc}>+</button>
    </div>
  );
};

export default QtyControl;


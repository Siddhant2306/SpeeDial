import React from "react";

const QtyControl = ({ value, onDec, onInc, decDisabled = false, incDisabled = false }) => {
  return (
    <div className="qty-control" role="group" aria-label="Quantity">
      <button
        type="button"
        onClick={onDec}
        disabled={decDisabled}
        aria-label="Remove one"
        title="Remove"
      >
        −
      </button>
      <span aria-label={`Quantity ${value}`}>{value}</span>
      <button
        type="button"
        onClick={onInc}
        disabled={incDisabled}
        aria-label="Add one"
        title="Add"
      >
        +
      </button>
    </div>
  );
};

export default QtyControl;


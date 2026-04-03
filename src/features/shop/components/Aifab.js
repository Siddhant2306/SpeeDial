import React from "react";

const AiFab = ({onOpen }) => {
  return (
    <button className="aiFab" onClick={onOpen}>
      <span className="aifabIcon">🌟</span>
    </button>
  );
};

export default AiFab;

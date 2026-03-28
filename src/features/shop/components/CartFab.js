import React from "react";

const CartFab = ({ count, onOpen }) => {
  return (
    <button className="cartFab" onClick={onOpen}>
      <span className="cartFabIcon">🛒</span>
      {count > 0 && <span className="cartFabBadge">{count}</span>}
    </button>
  );
};

export default CartFab;


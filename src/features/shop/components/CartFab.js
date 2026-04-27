import React, { forwardRef } from "react";

const CartFab = forwardRef(({ count, onOpen }, ref) => {
  return (
    <button ref={ref} className="cartFab" onClick={onOpen} aria-label="Open cart">
      <span className="cartFabIcon">🛒</span>
      {count > 0 && <span className="cartFabBadge">{count}</span>}
    </button>
  );
});

export default CartFab;


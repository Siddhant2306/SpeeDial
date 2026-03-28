import React from "react";

const CartModal = ({
  open,
  lines,
  cartCount,
  cartTotal,
  onClose,
  onRemoveLine,
  onClearCart,
  onCheckout,
}) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Your cart</h3>
          <button className="x" onClick={onClose}>
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="empty">Cart is empty.</p>
        ) : (
          <div className="cart-list">
            {lines.map((line) => (
              <div className="cart-line" key={line.id}>
                <div>
                  <div className="cart-name">{line.name}</div>
                  <div className="cart-qty">
                    Qty: {line.qty} • ₹{line.price} each
                  </div>
                </div>
                <div className="cart-right">
                  <div className="cart-line-total">₹{line.lineTotal}</div>
                  <button className="mini" onClick={() => onRemoveLine(line.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-summary">
          <div>
            Items: <b>{cartCount}</b>
          </div>
          <div>
            Total: <b>₹{cartTotal}</b>
          </div>
        </div>

        <div className="modal-actions">
          <button className="buy-btn secondary" onClick={onClearCart}>
            Clear cart
          </button>
          <button className="buy-btn" onClick={onCheckout}>
            Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;


import React, { useState } from "react";

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
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // payment method state
  const [upiId, setUpiId] = useState(""); // UPI input

  if (!open) return null;

  const handleConfirmOrder = () => {
    if (!address.trim()) {
      alert("Please enter address");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (paymentMethod === "upi" && !upiId.trim()) {
      alert("Please enter your UPI ID");
      return;
    }
    
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("User not logged in");
      return;
    }

    if (onCheckout) {
      onCheckout({ address, paymentMethod, upiId, userId: userId });
    }

    // reset + close
    setAddress("");
    setPaymentMethod("");
    setUpiId("");
    setShowAddressModal(false);
  };

  return (
    <>
      {/* MAIN CART MODAL */}
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header relative">
            <h3>Your cart</h3>
            {/* Top-right cross button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={onClose}
            >
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
                    <button
                      className="mini"
                      onClick={() => onRemoveLine(line.id)}
                    >
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

            <button
              className="buy-btn"
              onClick={() => setShowAddressModal(true)}
            >
              Order
            </button>
          </div>
        </div>
      </div>

      {/* ADDRESS & PAYMENT POPUP */}
      {showAddressModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAddressModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* Top-right cross button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setShowAddressModal(false)}
            >
              ✕
            </button>

            <h3>Enter Delivery Address</h3>

            <textarea
              className="address-input"
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* PAYMENT OPTIONS */}
            <div className="payment-options">
              <div>
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="cod">Cash on Delivery</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="netbanking"
                  name="payment"
                  value="netbanking"
                  checked={paymentMethod === "netbanking"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="netbanking">Net Banking</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="upi"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="upi">UPI</label>
              </div>

              {/* Conditional UPI input */}
              {paymentMethod === "upi" && (
                <input
                  type="text"
                  className="upi-input"
                  placeholder="Enter your UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              )}
            </div>

            <div className="modal-actions">
              <button
                className="buy-btn secondary"
                onClick={() => setShowAddressModal(false)}
              >
                Cancel
              </button>

              <button className="buy-btn" onClick={handleConfirmOrder}>
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartModal;
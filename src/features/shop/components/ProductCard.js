import React from "react";
import QtyControl from "./QtyControl";

const ProductCard = ({ product, quantity, onChangeQuantity }) => {
  const brand = (product.brand || "").trim();
  const category = (product.category || "").trim();
  const desc = [brand, category].filter(Boolean).join(" • ");

  const availableQty = Number.isFinite(product.quantity) ? product.quantity : null;
  const isAvailable = Boolean(product.inStock) && (availableQty === null || availableQty > 0);
  const atMax = availableQty !== null ? quantity >= availableQty : false;

  return (
    <div className="product">
      <div className="product-media">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-body">
        <div className="product-title">{product.name}</div>
        <div className="product-meta">
          <div className="product-price">₹{product.price}</div>
          <div className="product-unit">per item</div>
        </div>
        <div className="product-desc">{desc || " "}</div>

        <div className="product-row">
          <QtyControl
            value={quantity}
            onDec={() => onChangeQuantity(product.id, -1)}
            onInc={() => onChangeQuantity(product.id, +1)}
            decDisabled={quantity <= 0}
            incDisabled={!isAvailable || atMax}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


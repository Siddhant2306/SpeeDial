import React from "react";
import QtyControl from "./QtyControl";

const ProductCard = ({ product, quantity, onChangeQuantity }) => {
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
        <div className="product-desc">{product.desc}</div>

        <div className="product-row">
          <QtyControl
            value={quantity}
            onDec={() => onChangeQuantity(product.id, -1)}
            onInc={() => onChangeQuantity(product.id, +1)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


import React, { useEffect, useRef, useState } from "react";
import QtyControl from "./QtyControl";

const ProductCard = ({ product, quantity, onChangeQuantity, onFlyToCart }) => {
  const brand = (product.brand || "").trim();
  const category = (product.category || "").trim();
  const desc = [brand, category].filter(Boolean).join(" • ");

  const availableQty = Number.isFinite(product.quantity) ? product.quantity : null;
  const isAvailable = Boolean(product.inStock) && (availableQty === null || availableQty > 0);
  const atMax = availableQty !== null ? quantity >= availableQty : false;

  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (typeof window === "undefined") {
      setInView(true);
      return;
    }

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof window.IntersectionObserver !== "function") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="productWrap" data-inview={inView ? "true" : "false"}>
      <div ref={cardRef} className="product">
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
              onInc={() => {
                if (typeof onFlyToCart === "function") onFlyToCart(cardRef.current);
                onChangeQuantity(product.id, +1);
              }}
              decDisabled={quantity <= 0}
              incDisabled={!isAvailable || atMax}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


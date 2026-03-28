import React, { useMemo, useState } from "react";
import "../css/shop.css";
import { placeBulkOrders } from "../api/orders";
import CartFab from "../features/shop/components/CartFab";
import CartModal from "../features/shop/components/CartModal";
import ProductCard from "../features/shop/components/ProductCard";
import ShopHero from "../features/shop/components/ShopHero";
import { PRODUCTS } from "../features/shop/products";

const PRODUCTS_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

const ShopPage = () => {
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const changeCartQuantity = (productId, delta) => {
    setCart((current) => {
      const nextQty = (current[productId] || 0) + delta;

      if (nextQty <= 0) {
        if (!current[productId]) return current;
        const next = { ...current };
        delete next[productId];
        return next;
      }

      return { ...current, [productId]: nextQty };
    });
  };

  const removeLine = (productId) => {
    setCart((current) => {
      if (!current[productId]) return current;
      const next = { ...current };
      delete next[productId];
      return next;
    });
  };

  const clearCart = () => setCart({});

  const { chips, snacks, drinks } = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = PRODUCTS.filter((p) => {
      const key = p.category || p.type;
      const matchesTab = activeTab === "all" ? true : key === activeTab;
      const matchesQuery =
        !normalizedQuery ||
        p.name.toLowerCase().includes(normalizedQuery) ||
        p.desc.toLowerCase().includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });

    return {
      chips: filtered.filter((p) => p.category === "chips"),
      snacks: filtered.filter((p) => p.type === "snack" && p.category !== "chips"),
      drinks: filtered.filter((p) => p.type === "drink"),
    };
  }, [activeTab, query]);

  const cartLines = useMemo(() => {
    return Object.entries(cart).map(([productId, qty]) => {
      const p = PRODUCTS_BY_ID.get(productId);
      const price = p?.price ?? 0;
      return {
        id: productId,
        name: p?.name || productId,
        qty,
        price,
        lineTotal: price * qty,
      };
    });
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cartLines.reduce((sum, line) => sum + line.lineTotal, 0);
  }, [cartLines]);

  const checkout = async () => {
    try {
      const items = cartLines.map((line) => ({
        item: line.id,
        quantity: line.qty,
      }));

      if (items.length === 0) {
        alert("🛒 Cart is empty");
        return;
      }

      const data = await placeBulkOrders({ items });

      alert(`✅ Order placed! Order IDs: ${(data.order_ids || []).join(", ")}`);
      clearCart();
      setCartOpen(false);
    } catch (err) {
      alert(`❌ ${err.message}`);
      console.error(err);
    }
  };

  const isEmpty = chips.length === 0 && snacks.length === 0 && drinks.length === 0;

  return (
    <div className="shop2">
      <div className="shop2-inner">
        <ShopHero
          activeTab={activeTab}
          onTabChange={setActiveTab}
          query={query}
          onQueryChange={setQuery}
          cartCount={cartCount}
        />

        {chips.length > 0 && (
          <>
            <div className="section2">Chips</div>
            <div className="grid2">
              {chips.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  quantity={cart[p.id] || 0}
                  onChangeQuantity={changeCartQuantity}
                />
              ))}
            </div>
          </>
        )}

        {snacks.length > 0 && (
          <>
            <div className="section2">Snacks</div>
            <div className="grid2">
              {snacks.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  quantity={cart[p.id] || 0}
                  onChangeQuantity={changeCartQuantity}
                />
              ))}
            </div>
          </>
        )}

        {drinks.length > 0 && (
          <>
            <div className="section2">Drinks</div>
            <div className="grid2">
              {drinks.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  quantity={cart[p.id] || 0}
                  onChangeQuantity={changeCartQuantity}
                />
              ))}
            </div>
          </>
        )}

        {isEmpty && <div className="empty2">No items match your search.</div>}
      </div>

      <CartFab count={cartCount} onOpen={() => setCartOpen(true)} />
      <CartModal
        open={cartOpen}
        lines={cartLines}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onClose={() => setCartOpen(false)}
        onRemoveLine={removeLine}
        onClearCart={clearCart}
        onCheckout={checkout}
      />
    </div>
  );
};

export default ShopPage;


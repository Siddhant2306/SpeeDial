import React, { useEffect, useMemo, useState } from "react";
import "../css/shop.css";
import { placeBulkOrders } from "../api/orders";
import { getProducts, syncQuickCommerce } from "../api/products";
import CartFab from "../features/shop/components/CartFab";
import CartModal from "../features/shop/components/CartModal";
import ProductCard from "../features/shop/components/ProductCard";
import ShopHero from "../features/shop/components/ShopHero";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [syncResult, setSyncResult] = useState(null);

  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
        setLoadingProducts(true);
      setProductsError("");
      try {
        const data = await getProducts();
        if (cancelled) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;
        setProductsError(err?.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const syncNow = async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncError("");
    setSyncResult(null);

    try {
      const q = (query || "").trim() || "milk";
      const result = await syncQuickCommerce({ query: q });
      setSyncResult(result || null);

      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setSyncError(err?.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const productsById = useMemo(() => {
    return new Map(products.map((p) => [p.id, p]));
  }, [products]);

  const tabs = useMemo(() => {
    const counts = new Map();

    products.forEach((p) => {
      const cat = (p.category || "").trim();
      if (!cat) return;
      counts.set(cat, (counts.get(cat) || 0) + 1);
    });

    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([cat]) => ({ id: cat, label: cat }));

    return [{ id: "all", label: "All" }, ...top];
  }, [products]);

  const changeCartQuantity = (productId, delta) => {
    setCart((current) => {
      const product = productsById.get(productId);
      const maxQty = product
        ? product.inStock
          ? Number.isFinite(product.quantity)
            ? Math.max(0, product.quantity)
            : Infinity
          : 0
        : Infinity;

      const desiredQty = (current[productId] || 0) + delta;
      const nextQty = Math.min(maxQty, desiredQty);

      if (nextQty === (current[productId] || 0)) return current;

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

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCategory = (activeTab || "all").trim().toLowerCase();

    return products.filter((p) => {
      const category = (p.category || "").trim().toLowerCase();
      const name = (p.name || "").trim().toLowerCase();
      const brand = (p.brand || "").trim().toLowerCase();

      const matchesTab =
        normalizedCategory === "all" ? true : category === normalizedCategory;

      const matchesQuery =
        !normalizedQuery ||
        name.includes(normalizedQuery) ||
        brand.includes(normalizedQuery) ||
        category.includes(normalizedQuery);

      return matchesTab && matchesQuery;
    });
  }, [products, activeTab, query]);

  const cartLines = useMemo(() => {
    return Object.entries(cart).map(([productId, qty]) => {
      const p = productsById.get(productId);
      const price = p?.price ?? 0;
      return {
        id: productId,
        name: p?.name || productId,
        qty,
        price,
        lineTotal: price * qty,
      };
    });
  }, [cart, productsById]);

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

  

  const isEmpty = filteredProducts.length === 0;

  return (
    <div className="shop2">
      <div className="shop2-inner">
        <ShopHero
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          query={query}
          onQueryChange={setQuery}
          cartCount={cartCount}
        />

        {loadingProducts && <div className="empty2">Loading products…</div>}
        {!loadingProducts && productsError && (
          <div className="empty2">
            {productsError === "unauthorized"
              ? "Unauthorized. Set REACT_APP_API_KEY in .env (frontend) to match API_KEY in backend/.env."
              : `Failed to load products: ${productsError}`}
          </div>
        )}

        {!loadingProducts && !productsError && !isEmpty && (
          <>
            <div className="section2">
              {activeTab === "all" ? "Products" : activeTab}
            </div>
            <div className="grid2">
              {filteredProducts.map((p) => (
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

        {!loadingProducts && !productsError && isEmpty && (
          <div className="empty2">
            <div>No products found.</div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="neon-btn" onClick={syncNow} disabled={syncing}>
                {syncing ? "Syncing…" : "Sync products"}
              </button>
              <div style={{ alignSelf: "center" }}>
                Uses query: <b>{(query || "").trim() || "milk"}</b>
              </div>
            </div>
            {syncError && <div style={{ marginTop: 10 }}>Sync failed: {syncError}</div>}
            {syncResult && (
              <div style={{ marginTop: 10 }}>
                Synced {syncResult.total ?? syncResult.saved ?? 0} items (inserted{" "}
                {syncResult.inserted ?? 0}, updated {syncResult.updated ?? 0}, fetched {syncResult.fetched ?? 0}).
              </div>
            )}
          </div>
        )}
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


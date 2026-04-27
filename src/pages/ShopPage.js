import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../css/shop.css";
import { placeBulkOrders } from "../api/orders";
import { getProducts, syncQuickCommerce } from "../api/products";
import CartFab from "../features/shop/components/CartFab";
import CartModal from "../features/shop/components/CartModal";
import OrderPlacingOverlay from "../features/shop/components/OrderPlacingOverlay";
import ProductCard from "../features/shop/components/ProductCard";
import ShopHero from "../features/shop/components/ShopHero";
import AiFab  from "../features/shop/components/Aifab";
import AiModal from "../features/shop/components/AIModal";
import { useNavigate } from "react-router-dom";

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

  const [aiopen, setaiopen] = useState(false);
  const cartFabRef = useRef(null);
  const navigate = useNavigate();
  const orderNavRef = useRef(null);

  const [orderOverlayOpen, setOrderOverlayOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [orderError, setOrderError] = useState("");

  const closeOrderOverlay = useCallback(() => {
    setOrderOverlayOpen(false);
    setPlacingOrder(false);
    setOrderDone(false);
    setOrderError("");
    orderNavRef.current = null;
  }, []);

  const handleOrderExitComplete = useCallback(() => {
    const coords = orderNavRef.current;
    closeOrderOverlay();
    navigate("/order-map", coords ? { state: coords } : undefined);
  }, [closeOrderOverlay, navigate]);

  const getUserCoords = useCallback(() => {
    return new Promise((resolve) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 9000, maximumAge: 60_000 }
      );
    });
  }, []);

  const flyToCart = useCallback((fromCardEl) => {
    const toEl = cartFabRef.current;
    if (!fromCardEl || !toEl) return;

    if (typeof window === "undefined" || typeof document === "undefined") return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof window.getComputedStyle !== "function") return;

    const img = fromCardEl.querySelector?.(".product-media img") || null;
    const fromRect = (img || fromCardEl).getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    if (!fromRect?.width || !fromRect?.height || !toRect?.width || !toRect?.height) return;

    const ghost = document.createElement("div");
    const src = img ? img.currentSrc || img.src : "";

    ghost.setAttribute("aria-hidden", "true");
    ghost.style.position = "fixed";
    ghost.style.left = `${fromRect.left}px`;
    ghost.style.top = `${fromRect.top}px`;
    ghost.style.width = `${fromRect.width}px`;
    ghost.style.height = `${fromRect.height}px`;
    ghost.style.borderRadius = "16px";
    ghost.style.overflow = "hidden";
    ghost.style.pointerEvents = "none";
    ghost.style.zIndex = "10001";
    ghost.style.boxShadow = "0 30px 110px rgba(0,0,0,0.60)";
    ghost.style.border = "1px solid rgba(255,255,255,0.14)";
    ghost.style.background = "rgba(10,12,18,0.95)";
    ghost.style.backdropFilter = "blur(10px)";
    ghost.style.willChange = "transform, opacity, filter";

    if (src) {
      ghost.style.backgroundImage = `url("${src}")`;
      ghost.style.backgroundSize = "cover";
      ghost.style.backgroundPosition = "center";
      ghost.style.backgroundRepeat = "no-repeat";
    }

    document.body.appendChild(ghost);

    const fromCx = fromRect.left + fromRect.width / 2;
    const fromCy = fromRect.top + fromRect.height / 2;
    const toCx = toRect.left + toRect.width / 2;
    const toCy = toRect.top + toRect.height / 2;

    const dx = toCx - fromCx;
    const dy = toCy - fromCy;

    const cleanup = () => {
      try {
        ghost.remove();
      } catch {}
    };

    try {
      const anim = ghost.animate(
        [
          {
            transform: "translate3d(0,0,0) rotate(0deg) scale(1)",
            opacity: 0.96,
            filter: "blur(0px)",
          },
          {
            offset: 0.12,
            transform: "translate3d(0,-18px,0) rotate(-6deg) scale(1.03)",
            opacity: 0.96,
            filter: "blur(0px)",
          },
          {
            offset: 0.28,
            transform: `translate3d(${dx * 0.22}px, ${dy * 0.16 - 30}px, 0) rotate(10deg) scale(0.92)`,
            opacity: 0.88,
            filter: "blur(0.06px)",
          },
          {
            offset: 0.48,
            transform: `translate3d(${dx * 0.48}px, ${dy * 0.44 - 16}px, 0) rotate(-12deg) scale(0.68)`,
            opacity: 0.72,
            filter: "blur(0.12px)",
          },
          {
            offset: 0.66,
            transform: `translate3d(${dx * 0.74}px, ${dy * 0.70 - 4}px, 0) rotate(12deg) scale(0.42)`,
            opacity: 0.54,
            filter: "blur(0.18px)",
          },
          {
            offset: 0.86,
            transform: `translate3d(${dx * 1.06}px, ${dy * 1.02}px, 0) rotate(-10deg) scale(0.18)`,
            opacity: 0.18,
            filter: "blur(0.45px)",
          },
          {
            transform: `translate3d(${dx}px, ${dy}px, 0) rotate(0deg) scale(0.10)`,
            opacity: 0.04,
            filter: "blur(0.65px)",
          },
        ],
        { duration: 1220, easing: "cubic-bezier(0.18, 1.18, 0.32, 1)", fill: "forwards" }
      );
      anim.addEventListener("finish", cleanup, { once: true });
    } catch {
      cleanup();
    }

    // Subtle cart bump.
    try {
      toEl.animate(
        [
          { transform: "scale(1)", filter: "brightness(1)" },
          { transform: "scale(1.18)", filter: "brightness(1.16)" },
          { transform: "scale(1)", filter: "brightness(1)" },
        ],
        { duration: 380, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
      );
    } catch {}

    window.setTimeout(cleanup, 1400);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
        setLoadingProducts(true);
      setProductsError("");
      try {
        const data = await getProducts();
        if (cancelled) return;
        const productsArray = Array.isArray(data) ? data : [];
        for (let i = productsArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [productsArray[i], productsArray[j]] = [productsArray[j], productsArray[i]];
        }
        setProducts(productsArray);
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

  const handleAiAddToCart = (payload, maybeQuantity) => {
    let rawNameOrId = "";
    let quantity = 1;

    if (typeof payload === "string") {
      rawNameOrId = payload;
      quantity = Number.parseInt(String(maybeQuantity ?? "1"), 10) || 1;
    } else if (payload && typeof payload === "object") {
      rawNameOrId =
        payload.id ||
        payload.product_id ||
        payload.productId ||
        payload.name ||
        payload.item ||
        "";
      quantity = Number.parseInt(String(payload.quantity ?? maybeQuantity ?? "1"), 10) || 1;
    }

    const nameOrId = String(rawNameOrId || "").trim();
    if (!nameOrId) return;
    if (!Number.isFinite(quantity) || quantity < 1) quantity = 1;

    // Prefer matching by product id; fallback to case-insensitive name match.
    let productId = nameOrId;
    if (!productsById.has(productId)) {
      const normalized = nameOrId.toLowerCase();
      const exactMatch = products.find(
        (p) => String(p?.name || "").trim().toLowerCase() === normalized
      );
      const partialMatch =
        exactMatch ||
        (normalized.length >= 3
          ? products.find((p) =>
              String(p?.name || "").trim().toLowerCase().includes(normalized)
            )
          : null);

      productId = partialMatch?.id || nameOrId;
    }

    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity,
    }));
  };

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
    if (placingOrder) return;

    try {
      setOrderOverlayOpen(true);
      setPlacingOrder(true);
      setOrderDone(false);
      setOrderError("");
      orderNavRef.current = null;
      setCartOpen(false);

      const items = cartLines.map((line) => ({
        item: line.id,
        quantity: line.qty,
      }));

      if (items.length === 0) {
        setOrderError("Cart is empty.");
        setPlacingOrder(false);
        return;
      }

      const [coords] = await Promise.all([getUserCoords(), placeBulkOrders({ items })]);
      orderNavRef.current = coords;
      clearCart();
      setOrderDone(true);
    } catch (err) {
      console.error(err);
      setOrderError(err?.message || "Order failed");
      setPlacingOrder(false);
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

        {loadingProducts && <div className="empty2">Loading products...</div>}
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
                  onFlyToCart={flyToCart}
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

      <AiFab onOpen={() => setaiopen(true)}/>
      <AiModal open={aiopen} onClose={() => setaiopen(false)}
          onAddToCart={handleAiAddToCart}
      />

      <CartFab ref={cartFabRef} count={cartCount} onOpen={() => setCartOpen(true)} />
      <CartModal
        open={cartOpen}
        lines={cartLines}
        cartCount={cartCount}
        cartTotal={cartTotal}
        placing={placingOrder}
        onClose={() => setCartOpen(false)}
        onRemoveLine={removeLine}
        onClearCart={clearCart}
        onCheckout={checkout}
      />

      <OrderPlacingOverlay
        open={orderOverlayOpen}
        done={orderDone}
        error={orderError}
        onClose={closeOrderOverlay}
        onExitComplete={handleOrderExitComplete}
      />
    </div>
  );
};

export default ShopPage;


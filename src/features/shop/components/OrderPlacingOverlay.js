import React, { useEffect, useMemo, useState } from "react";
import storeMarkerImg from "../../../assets/storeMarker.png";
import deliveryBoyImg from "../../../assets/deliveryboy.png";

const STAGES = [
  {
    id: "store",
    img: storeMarkerImg,
  },
  {
    id: "rider",
    img: deliveryBoyImg,
  },
];

const OrderPlacingOverlay = ({ open, done, error, onClose, onExitComplete }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  const stage = useMemo(() => STAGES[Math.min(STAGES.length - 1, stageIndex)], [stageIndex]);

  useEffect(() => {
    if (!open) return;
    setStageIndex(0);
    setExiting(false);

    const t = window.setTimeout(() => setStageIndex(1), 940);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (error) {
      setExiting(false);
      return;
    }

    if (!done) return;

    setStageIndex(1);
    const t = window.setTimeout(() => setExiting(true), 520);
    return () => window.clearTimeout(t);
  }, [done, error, open]);

  useEffect(() => {
    if (!open) return;
    if (!exiting) return;
    if (typeof onExitComplete !== "function") return;

    const t = window.setTimeout(() => onExitComplete(), 700);
    return () => window.clearTimeout(t);
  }, [exiting, onExitComplete, open]);

  if (!open) return null;

  return (
    <div
      className={"orderOverlay" + (exiting ? " exiting" : "")}
      role="dialog"
      aria-modal="true"
      aria-label="Placing order"
      onClick={() => {
        if (error) onClose?.();
      }}
    >
      <div
        className={"orderOverlayVisual" + (exiting ? " exiting" : "")}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={`${stage.id}-${exiting ? "exit" : "in"}`}
          src={stage.img}
          alt={stage.id === "store" ? "SpeeDial" : "Delivery partner"}
          className="orderOverlayImg"
        />
      </div>
    </div>
  );
};

export default OrderPlacingOverlay;

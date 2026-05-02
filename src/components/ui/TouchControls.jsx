import React, { useCallback } from "react";

function TouchButton({ control, emoji, touchStart, touchEnd, style }) {
  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault(); // prevent zoom/scroll
      touchStart(control);
    },
    [control, touchStart],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      e.preventDefault();
      touchEnd(control);
    },
    [control, touchEnd],
  );

  return (
    <button
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => touchEnd(control)} // safety: release if finger slides off
      onContextMenu={(e) => e.preventDefault()} // prevent long-press menu
      style={{
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.4)",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(4px)",
        color: "white",
        fontSize: "1.8rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none", // prevents browser gestures
        userSelect: "none", // prevents text selection
        WebkitUserSelect: "none",
        cursor: "pointer",
        ...style,
      }}
    >
      {emoji}
    </button>
  );
}
export default function TouchControls({ touchStart, touchEnd }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "200px",
        pointerEvents: "none",
        zIndex: 25,
      }}
    >
      {/* ---- LEFT SIDE: Steering ---- */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "20px",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >
        <TouchButton
          control="left"
          emoji="◀"
          touchStart={touchStart}
          touchEnd={touchEnd}
        />
        <TouchButton
          control="right"
          emoji="▶"
          touchStart={touchStart}
          touchEnd={touchEnd}
        />
      </div>

      {/* ---- RIGHT SIDE: Gas / Brake / Reverse ---- */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          pointerEvents: "auto",
        }}
      >
        {/* Gas (top) */}
        <TouchButton
          control="forward"
          emoji="🔼"
          touchStart={touchStart}
          touchEnd={touchEnd}
        />

        {/* Brake + Reverse (bottom row) */}
        <div style={{ display: "flex", gap: "10px" }}>
          <TouchButton
            control="backward"
            emoji="🔽"
            touchStart={touchStart}
            touchEnd={touchEnd}
          />
          <TouchButton
            control="brake"
            emoji="🛑"
            touchStart={touchStart}
            touchEnd={touchEnd}
            style={{ background: "rgba(255,0,0,0.3)" }}
          />
        </div>
      </div>
    </div>
  );
}

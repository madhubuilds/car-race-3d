import React, { useState, useEffect, useRef } from "react";
import useGameStore from "../../store/gameStore";

export default function Countdown() {
  const gameState = useGameStore((state) => state.gameState);
  const [count, setCount] = useState(null);

  // ✅ Ref guard — prevents double-execution from StrictMode
  const isRunning = useRef(false);
  const timeouts = useRef([]);

  // Clear all pending timeouts
  const clearAllTimeouts = () => {
    timeouts.current.forEach((t) => clearTimeout(t));
    timeouts.current = [];
  };

  useEffect(() => {
    if (gameState !== "countdown") {
      setCount(null);
      isRunning.current = false;
      clearAllTimeouts();
      return;
    }

    // ✅ If already running, don't start again
    if (isRunning.current) return;
    isRunning.current = true;

    clearAllTimeouts();

    timeouts.current.push(
      setTimeout(() => setCount(3), 500),
      setTimeout(() => setCount(2), 1500),
      setTimeout(() => setCount(1), 2500),
      setTimeout(() => setCount("GO!"), 3500),
      setTimeout(() => {
        setCount(null);
        isRunning.current = false;
        useGameStore.getState().beginRacing();
      }, 4300)
    );

    return () => {
      clearAllTimeouts();
      // ✅ DON'T reset isRunning here — StrictMode cleanup would allow re-run
    };
  }, [gameState]);

  if (count === null) return null;

  const isGo = count === "GO!";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        pointerEvents: "none",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          fontSize: isGo ? "8rem" : "12rem",
          fontWeight: "bold",
          fontFamily: "monospace",
          color: isGo ? "#00ff44" : "#ffffff",
          textShadow: isGo
            ? "0 0 40px #00ff44, 0 0 80px #00ff44, 0 0 120px #00ff44"
            : "0 0 20px #ffffff, 0 0 40px #ffffff, 0 0 80px rgba(255,255,255,0.5)",
          lineHeight: 1,
          WebkitTextStroke: isGo ? "2px #00cc33" : "2px rgba(255,255,255,0.8)",
        }}
      >
        {count}
      </div>
    </div>
  );
}
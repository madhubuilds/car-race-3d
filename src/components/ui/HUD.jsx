import React, { useCallback, useRef } from "react";
import useGameStore from "../../store/gameStore";
import useIsMobile from "../../hooks/useIsMobile";
import useControls from "../../hooks/useControls";
import TouchControls from "./TouchControls";
import Minimap from "./Minimap";

export default function HUD({carBodyRef}) {
  const speed = useGameStore((state) => state.speed);
  const lap = useGameStore((state) => state.lap);
  const totalLaps = useGameStore((state) => state.totalLaps);
  const timer = useGameStore((state) => state.timer);
  const gameState = useGameStore((state) => state.gameState);
  const isMobile = useIsMobile();

  // ✅ Get touch handlers from the shared controls hook
  const { touchStart, touchEnd } = useControls();

  // Convert speed to a display number (like km/h feel)
  const displaySpeed = Math.abs(Math.round(speed * 500)); // ← moved UP
  // Format timer
  const minutes = Math.floor(timer / 60);
  const seconds = Math.floor(timer % 60);
  const ms = Math.floor((timer % 1) * 100);
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;

  // ✅ Debounce ref — prevents double-clicks
  const isProcessing = useRef(false);

  // ✅ Debounced Start
  const handleStart = useCallback(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    // Call startRace directly from getState (always fresh)
    useGameStore.getState().startRace();

    setTimeout(() => {
      isProcessing.current = false;
    }, 1000);
  }, []);

  // ✅ Debounced Play Again
  const handlePlayAgain = useCallback(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    // Use getState() — guaranteed fresh, no stale closure
    useGameStore.getState().resetGame();

    setTimeout(() => {
      isProcessing.current = false;
    }, 1000);
  }, []);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // clicks pass through to canvas
        fontFamily: "monospace",
        color: "white",
        zIndex: 10,
      }}
    >
      {/* --- MENU SCREEN --- */}
      {gameState === "menu" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            pointerEvents: "auto", // ✅ clickable
            zIndex: 20, // ✅ above everything
          }}
        >
          <h1 style={{ fontSize: "3rem", margin: "0 0 1rem" }}>🏎️ Car Race</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
            {isMobile
              ? "Use on-screen buttons to drive!"
              : "W/S = Drive | A/D = Steer | Space = Brake"}
          </p>

          <button
            onClick={handleStart}
            style={{
              padding: "1rem 3rem",
              fontSize: "1.5rem",
              cursor: "pointer",
              background: "#00cc44",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            START RACE
          </button>
        </div>
      )}

      {/* --- RACING HUD --- */}
      {gameState === "racing" && (
        <>
          {/* Speed - bottom center */}
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? "220px" : "40px",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", fontWeight: "bold" }}>
              {displaySpeed}
            </div>
            <div style={{ fontSize: "1rem", opacity: 0.7 }}>KM/H</div>
          </div>

          {/* Timer - top center */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: isMobile ? "1.3rem" : "2rem",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            ⏱️ {timeDisplay}
          </div>

          {/* Laps - top right */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              fontSize: isMobile ? "1rem" : "1.5rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            🏁 Lap {lap + 1}/{totalLaps}
          </div>

          {/* ✅ Touch Controls — only on mobile */}
          {isMobile && (
            <TouchControls touchStart={touchStart} touchEnd={touchEnd} />
          )}
          <Minimap carBodyRef={carBodyRef} />
        </>
      )}

      {/* --- FINISHED SCREEN --- */}
      {gameState === "finished" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            pointerEvents: "auto", // ✅ clickable
            zIndex: 20,
          }}
        >
          <h1 style={{ fontSize: isMobile ? "2rem" : "3rem", margin: "0" }}>
            🏆 RACE COMPLETE!
          </h1>
          <p
            style={{ fontSize: isMobile ? "1.5rem" : "2rem", margin: "1rem 0" }}
          >
            Time: {timeDisplay}
          </p>
          <button
            onClick={handlePlayAgain}
            style={{
              padding: isMobile ? "0.8rem 2rem" : "1rem 3rem",
              fontSize: isMobile ? "1.2rem" : "1.5rem",

              cursor: "pointer",
              background: "#0066ff",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
              zIndex: 30,
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}

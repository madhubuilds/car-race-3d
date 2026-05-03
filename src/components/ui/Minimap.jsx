import React, { useRef, useEffect } from "react";
import useGameStore from "../../store/gameStore";

export default function Minimap({ carBodyRef }) {
  const canvasRef = useRef();

  useEffect(() => {
    let animationId;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const size = canvas.width;
      const center = size / 2;

      // --- CLEAR ---
      ctx.clearRect(0, 0, size, size);

      // --- BACKGROUND (dark circle) ---
      ctx.beginPath();
      ctx.arc(center, center, center, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fill();

      // --- SCALE: Convert world units to minimap pixels ---
      // Track outer radius = 35, we want it to fit inside the minimap
      // Leave some padding
      const scale = (size * 0.42) / 35;

      // --- GRASS (green ring area) ---
      ctx.beginPath();
      ctx.arc(center, center, 35 * scale + 5, 0, Math.PI * 2);
      ctx.fillStyle = "#2d5a1b";
      ctx.fill();

      // --- ROAD (dark ring between inner and outer walls) ---
      ctx.beginPath();
      ctx.arc(center, center, 35 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "#444444";
      ctx.fill();

      // Inner grass (inside inner wall)
      ctx.beginPath();
      ctx.arc(center, center, 25 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "#2d5a1b";
      ctx.fill();

      // --- INNER WALL (red circle) ---
      ctx.beginPath();
      ctx.arc(center, center, 25 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = "#ff4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- OUTER WALL (red circle) ---
      ctx.beginPath();
      ctx.arc(center, center, 35 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = "#ff4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- START/FINISH LINE (white dash) ---
      const startX = center + 25 * scale;
      const endX = center + 35 * scale;
      ctx.beginPath();
      ctx.moveTo(startX, center);
      ctx.lineTo(endX, center);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- CAR DOT ---
      const rb = carBodyRef?.current;
      if (rb && rb.translation) {
        try {
          const t = rb.translation();
          const r = rb.rotation();

          // Convert world position to minimap position
          // Note: world X → minimap X, world Z → minimap Y
          const carX = center + t.x * scale;
          const carY = center + t.z * scale;

          // --- CAR DIRECTION ARROW ---
          // Calculate forward direction from quaternion
          // We need the Y-axis rotation angle
          const angle = Math.atan2(
            2 * (r.w * r.y + r.x * r.z),
            1 - 2 * (r.y * r.y + r.z * r.z),
          );

          // Draw direction triangle
          const arrowLength = 8;
          const arrowWidth = 4;

          ctx.save();
          ctx.translate(carX, carY);
          ctx.rotate(-angle); // rotate to match car facing

          // Triangle pointing "forward"
          ctx.beginPath();
          ctx.moveTo(-arrowLength, 0); // tip (forward)
          ctx.lineTo(arrowWidth, -arrowWidth); // back-left
          ctx.lineTo(arrowWidth, arrowWidth); // back-right
          ctx.closePath();
          ctx.fillStyle = "#00ff88";
          ctx.fill();

          // White border for visibility
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();

          // Glowing dot at car center
          ctx.beginPath();
          ctx.arc(carX, carY, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#00ff88";
          ctx.fill();

          // Glow effect
          ctx.beginPath();
          ctx.arc(carX, carY, 6, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 255, 136, 0.3)";
          ctx.fill();
        } catch (e) {
          // Rapier not ready
        }
      }

      // --- BORDER ---
      ctx.beginPath();
      ctx.arc(center, center, center - 1, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [carBodyRef]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        width: "150px", // ✅ Fixed container size
        height: "150px",
        borderRadius: "50%",
        overflow: "hidden", // ✅ Clip anything outside circle
        pointerEvents: "none",
        zIndex: 15,
      }}
    >
      <canvas
        ref={canvasRef}
        width={150}
        height={150}
        style={{
          width: "150px", // ✅ Force CSS size to match canvas size
          height: "150px",
          display: "block", // ✅ Removes inline spacing
        }}
      />
    </div>
  );
}

import { useState, useEffect } from "react";

export default function useControls() {
  // Track which keys are currently pressed
  const [keys, setKeys] = useState({
    forward: false, // W or ArrowUp
    backward: false, // S or ArrowDown
    left: false, // A or ArrowLeft
    right: false, // D or ArrowRight
    brake: false, // Space
  });

  useEffect(() => {
    // Map keyboard keys to our control names
    const keyMap = {
      KeyW: "forward",
      ArrowUp: "forward",
      KeyS: "backward",
      ArrowDown: "backward",
      KeyA: "left",
      ArrowLeft: "left",
      KeyD: "right",
      ArrowRight: "right",
      Space: "brake",
    };

    const handleKeyDown = (e) => {
      const control = keyMap[e.code];
      if (control) {
        // Prevent page scrolling when pressing arrow keys
        e.preventDefault();
        setKeys((prev) => ({ ...prev, [control]: true }));
      }
    };

    const handleKeyUp = (e) => {
      const control = keyMap[e.code];
      if (control) {
        setKeys((prev) => ({ ...prev, [control]: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup: remove listeners when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
}

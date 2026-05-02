import { useState, useEffect, useCallback } from "react";
import useControlsStore from "../store/controlsStore";

export default function useControls() {
  const setControl = useControlsStore((state) => state.setControl);
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
        setControl(control, true);
      }
    };

    const handleKeyUp = (e) => {
      const control = keyMap[e.code];
      if (control) {
        setControl(control, false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup: remove listeners when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setControl]);

  // --- TOUCH INPUT ---
  const touchStart = useCallback(
    (control) => setControl(control, true),
    [setControl],
  );

  const touchEnd = useCallback(
    (control) => setControl(control, false),
    [setControl],
  );

  return { touchStart, touchEnd };
}

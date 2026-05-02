import { useState, useEffect } from "react";

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const smallScreen = window.innerWidth <= 768;
      setIsMobile(hasTouch && smallScreen);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

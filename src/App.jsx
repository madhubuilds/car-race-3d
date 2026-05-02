import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Experience from "./components/world/Experience";
import HUD from "./components/ui/HUD";

function App() { 

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Experience />
      <HUD />
    </div>
  );
}

export default App;

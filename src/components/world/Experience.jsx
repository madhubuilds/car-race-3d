import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Track } from "./Track";
import { Car } from "./Car";
import ChaseCamera from "./ChaseCamera";
import CheckPoint from "./CheckPoint";
import { Physics } from "@react-three/rapier";

const Experience = () => {
  const carRef = useRef();
  return (
    <Canvas
      camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 5, 5] }}
      shadows
    >
      <Sky sunPosition={[100, 50, 100]} />
      <ambientLight intensity={1} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <Physics gravity={[0, -9.81, 0]}>
        <Car ref={carRef} />
        <Track />
        <CheckPoint />
      </Physics>
      <ChaseCamera carRef={carRef} />
      {/* <OrbitControls enableDamping /> */}
    </Canvas>
  );
};

export default Experience;

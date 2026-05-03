import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sky } from "@react-three/drei";
import { Track } from "./Track";
import { Car } from "./Car";
import ChaseCamera from "./ChaseCamera";
import CheckPoint from "./CheckPoint";
import WheelSmoke from "./WheelSmoke";

const Experience = ({ carBodyRef }) => { 
  return (
    <Canvas
      camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 5, 5] }}
      shadows
    >
      <Sky sunPosition={[100, 50, 100]} />
      <ambientLight intensity={1} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]} timeStep="vary">
          <Car carBodyRef={carBodyRef} />
          <Track />
          <CheckPoint />
        </Physics>
      </Suspense>
      <WheelSmoke carBodyRef={carBodyRef} />
      <ChaseCamera carRef={carBodyRef} />
    </Canvas>
  );
};

export default Experience;

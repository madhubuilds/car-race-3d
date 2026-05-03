import React from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export const Track = () => {
  return (
    <group>
      {/* -------- LAYER 1: Ground (Grass) -------- */}
      {/* A big flat plane to act as the grass field */}
      {/* rotation: [-Math.PI / 2, 0, 0] flips it flat (default planes face the camera, we want it on the floor) */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[250, 0.1, 250]}
          position={[0, -0.2, 0]}
          friction={0.8}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#4a7c2e" />
        </mesh>
      </RigidBody>

      {/* -------- LAYER 2: Road Surface -------- */}
      {/* RingGeometry(innerRadius, outerRadius, segments) */}
      {/* innerRadius=25, outerRadius=35 → 10 units wide road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[25, 35, 64]} />
        <meshBasicMaterial color="#333333" />
      </mesh>

      {/* -------- LAYER 3: Start / Finish Line -------- */}
      {/* A thin white box placed across the track */}
      <mesh position={[30, 0.05, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[10, 0.1, 2]} />
        <meshStandardMaterial
          color="white"
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* -------- LAYER 4: Inner Wall -------- */}
      {/* TorusGeometry(radius, tubeThickness, radialSegments, tubularSegments) */}
      {/* trimesh = auto-generates collider from the mesh shape */}
      <RigidBody
        type="fixed"
        colliders="trimesh"
        friction={0} // ✅ SLIPPERY — car slides along
        restitution={0.5} // ✅ BOUNCY — pushes car away
      >
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[25, 0.5, 8, 64]} />
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff2222" // glow color
            emissiveIntensity={0.8} // glow strength
          />{" "}
          {/* red barrier */}
        </mesh>
      </RigidBody>

      {/* -------- LAYER 4: Outer Wall -------- */}
      <RigidBody
        type="fixed"
        colliders="trimesh"
        friction={0} // ✅ SLIPPERY
        restitution={0.5} // ✅ BOUNCY
      >
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[35, 0.5, 8, 64]} />
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff2222"
            emissiveIntensity={0.8}
          />
        </mesh>
      </RigidBody>
    </group>
  );
};

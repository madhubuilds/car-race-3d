import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier"; 
import useControls from "../../hooks/useControls";
import useGameStore from "../../store/gameStore";

// ✅ No more forwardRef — just a normal component with a prop
export const Car = ({ carBodyRef }) => {
  const rigidBodyRef = useRef();
  const { scene } = useGLTF("/models/cars/race.glb");
  const controls = useControls();

  const rotationRef = useRef(0);
  const currentTurn = useRef(0);
  const prevGameState = useRef("menu");

  const MAX_SPEED = 15;
  const ACCELERATION = 0.4;
  const REVERSE_FORCE = 0.2;
  const TURN_SPEED = 0.03;
  const BRAKE_FACTOR = 0.92;
  const TURN_SMOOTHING = 0.1;

  const resetCar = () => {
    const rb = rigidBodyRef.current;
    if (!rb || !rb.setTranslation) return;
    rb.setTranslation({ x: 30, y: 1, z: 0 }, true);
    rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
    rotationRef.current = 0;
    currentTurn.current = 0;
    const resetQuat = new THREE.Quaternion();
    resetQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    rb.setRotation(resetQuat, true);
  };

  useFrame((_, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb || !rb.translation) return;

    // ✅ SYNC ref to parent EVERY FRAME — bulletproof!
    if (carBodyRef) {
      carBodyRef.current = rb;
    }

    const { gameState, updateTimer, setSpeed } = useGameStore.getState();

    updateTimer(delta);

    // Reset car on state transitions
    if (gameState === "racing" && prevGameState.current !== "racing") {
      resetCar();
    }
    if (gameState === "menu" && prevGameState.current !== "menu") {
      resetCar();
    }
    prevGameState.current = gameState;

    if (gameState !== "racing") return;

    const vel = rb.linvel();
    const currentSpeed = Math.sqrt(vel.x ** 2 + vel.z ** 2);

    const forward = new THREE.Vector3(
      -Math.sin(rotationRef.current),
      0,
      -Math.cos(rotationRef.current),
    );

    // Smooth steering
    let targetTurn = 0;
    if (currentSpeed > 0.5) {
      const dot = vel.x * forward.x + vel.z * forward.z;
      const dir = dot >= 0 ? 1 : -1;
      if (controls.left) targetTurn = TURN_SPEED * dir;
      if (controls.right) targetTurn = -TURN_SPEED * dir;
    }

    currentTurn.current += (targetTurn - currentTurn.current) * TURN_SMOOTHING;
    rotationRef.current += currentTurn.current;

    const quat = new THREE.Quaternion();
    quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationRef.current);
    rb.setRotation(quat, true);

    if (controls.forward) {
      rb.applyImpulse(
        { x: forward.x * ACCELERATION, y: 0, z: forward.z * ACCELERATION },
        true,
      );
    }

    if (controls.backward) {
      rb.applyImpulse(
        { x: -forward.x * REVERSE_FORCE, y: 0, z: -forward.z * REVERSE_FORCE },
        true,
      );
    }

    if (controls.brake) {
      rb.setLinvel(
        { x: vel.x * BRAKE_FACTOR, y: vel.y, z: vel.z * BRAKE_FACTOR },
        true,
      );
    }

    if (currentSpeed > MAX_SPEED) {
      const factor = MAX_SPEED / currentSpeed;
      rb.setLinvel({ x: vel.x * factor, y: vel.y, z: vel.z * factor }, true);
    }

    setSpeed(currentSpeed / 50);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders={false}
      mass={1}
      linearDamping={1}
      angularDamping={10}
      enabledRotations={[false, false, false]}
      position={[30, 1, 0]}
    >
      <CuboidCollider args={[1, 0.3, 0.6]} restitution={0.2} friction={1} />
      <group>
        <primitive object={scene} scale={1.5} rotation={[0, Math.PI, 0]} />
      </group>
    </RigidBody>
  );
};

useGLTF.preload("/models/cars/race.glb");
export const CustomCar = () => {
  const carRef = useRef();
  return (
    <group ref={carRef} position={[30, 0.5, 0]}>
      {/* ---- Car Body (lower part) ---- */}
      {/* A wide flat box = the base/chassis */}

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.5, 1.2]} />{" "}
        {/* length=2, height=0.5, width=1.2 */}
        <meshStandardMaterial color="#0066ff" /> {/* blue body */}
      </mesh>

      {/* ---- Car Cabin (upper part) ---- */}
      {/* A smaller box on top = the roof/cabin */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1, 0.4, 1]} /> {/* shorter length, sits on top */}
        <meshStandardMaterial color="#003399" /> {/* darker blue */}
      </mesh>

      {/* ---- Wheels (4 cylinders) ---- */}
      {/* Front-Left */}
      <mesh position={[0.6, -0.2, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Front-Right */}
      <mesh position={[0.6, -0.2, -0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Back-Left */}
      <mesh position={[-0.6, -0.2, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Back-Right */}
      <mesh position={[-0.6, -0.2, -0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
};

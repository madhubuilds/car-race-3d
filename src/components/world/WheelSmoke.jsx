import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useGameStore from "../../store/gameStore";

const PARTICLE_COUNT = 30;

export default function WheelSmoke({ carBodyRef }) {
  const meshRef = useRef();
  // create particle pool - each particle has its own state
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      position: new THREE.Vector3(0, -100, 0),
      velocity: new THREE.Vector3(),
      opacity: 0,
      size: 0,
      life: 0,
      maxLife: 0,
    }));
  }, []);

  // Spawn index — cycles through pool
  const spawnIndex = useRef(0);
  const spawnTimer = useRef(0);
  // Temp objects (reused every frame, no garbage collection)
  const tempObj = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    const rb = carBodyRef.current;

    if (!rb || !rb.translation) return;
    if (!meshRef.current) return;

    const { gameState } = useGameStore.getState();
    if (gameState !== "racing") return;

    const vel = rb.linvel();
    const currentSpeed = Math.sqrt(vel.x ** 2 + vel.z ** 2);
    const t = rb.translation();
    const r = rb.rotation();

    const carQuat = new THREE.Quaternion(r.x, r.y, r.z, r.w);

    // --- SPAWN NEW PARTICLES ---
    // Only spawn when car is moving fast enough
    spawnTimer.current += delta;

    if (currentSpeed > 2 && spawnTimer.current > 0.03) {
      spawnTimer.current = 0;

      // Spawn at BOTH rear wheels
      const offsets = [
        new THREE.Vector3(-0.6, -0.1, 0.7), // back-left
        new THREE.Vector3(-0.6, -0.1, -0.7), // back-right
      ];

      for (const offset of offsets) {
        // Rotate offset to match car direction
        const worldOffset = offset.clone().applyQuaternion(carQuat);

        const p = particles[spawnIndex.current % PARTICLE_COUNT];

        // Set particle position at wheel
        p.position.set(
          t.x + worldOffset.x,
          t.y + worldOffset.y,
          t.z + worldOffset.z,
        );

        // Random upward + spread velocity
        p.velocity.set(
          (Math.random() - 0.5) * 1.5, // random X spread
          0.8 + Math.random() * 0.5, // float upward
          (Math.random() - 0.5) * 1.5, // random Z spread
        );

        // Life based on speed — faster = more visible smoke
        p.maxLife = 0.4 + Math.random() * 0.3;
        p.life = p.maxLife;
        p.opacity = Math.min(currentSpeed / 10, 0.6); // cap opacity
        p.size = 0.2 + Math.random() * 0.1;

        spawnIndex.current++;
      }
    }

    // --- UPDATE ALL PARTICLES ---
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      if (p.life > 0) {
        // Age the particle
        p.life -= delta;

        // Move it
        p.position.x += p.velocity.x * delta;
        p.position.y += p.velocity.y * delta;
        p.position.z += p.velocity.z * delta;

        // Slow down horizontal drift
        p.velocity.x *= 0.98;
        p.velocity.z *= 0.98;

        // Calculate fade: 1.0 → 0.0 as life decreases
        const lifeRatio = Math.max(p.life / p.maxLife, 0);

        // Grow as it fades (smoke expands)
        const scale = p.size + (1 - lifeRatio) * 0.8;

        // Set transform for this instance
        tempObj.position.copy(p.position);
        tempObj.scale.setScalar(scale);
        tempObj.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObj.matrix);

        // Set opacity via color alpha (white → transparent)
        tempColor.setRGB(
          0.85 + lifeRatio * 0.15, // slight warm tint when fresh
          0.85 + lifeRatio * 0.15,
          0.85 + lifeRatio * 0.15,
        );
        meshRef.current.setColorAt(i, tempColor);
      } else {
        // Dead particle — hide it
        tempObj.position.set(0, -100, 0);
        tempObj.scale.setScalar(0);
        tempObj.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObj.matrix);
      }
    }

    // Tell Three.js the instances changed
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.NormalBlending}
        color="#886644"
      />
    </instancedMesh>
  );
}

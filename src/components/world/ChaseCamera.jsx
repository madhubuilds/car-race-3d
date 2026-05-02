import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ChaseCamera({ carRef }) {
  const { camera } = useThree();

  // Reusable vectors (created once, updated every frame)
  const cameraPos = useRef(new THREE.Vector3());
  const lookAtPos = useRef(new THREE.Vector3());

  useFrame(() => {
    // carRef now points to the RigidBody (via useImperativeHandle)
    const rb = carRef.current;

    // ✅ Triple guard — skip until Rapier is truly ready
    if (!rb) return;
    if (!rb.translation) return;

    // ✅ Wrap in try-catch as extra safety for Rapier's WASM timing
    try {
      const t = rb.translation();
      const r = rb.rotation();

      const carPosition = new THREE.Vector3(t.x, t.y, t.z);
      const carQuaternion = new THREE.Quaternion(r.x, r.y, r.z, r.w);

      // Camera offset: behind + above
      const offset = new THREE.Vector3(0, 4, 8);
      offset.applyQuaternion(carQuaternion);
      cameraPos.current.copy(carPosition).add(offset);

      // Look-at offset: slightly ahead
      const lookOffset = new THREE.Vector3(0, 1, -4);
      lookOffset.applyQuaternion(carQuaternion);
      lookAtPos.current.copy(carPosition).add(lookOffset);

      // Smooth follow
      camera.position.lerp(cameraPos.current, 0.08);
      camera.lookAt(lookAtPos.current);
    } catch (e) {
      // Rapier not ready yet — skip this frame silently
    }
  });

  // Renders nothing — only controls the camera
  return null;
}

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  ChromaticAberration,
  DepthOfField,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import useGameStore from "../../store/gameStore";

export default function Effects() {
  const chromaRef = useRef();
  const vignetteRef = useRef();
  const bloomRef = useRef();

  useFrame(() => {
    const { speed, gameState } = useGameStore.getState();

    if (gameState !== "racing") return;

    // --- SPEED-BASED EFFECTS ---
    // speed is normalized (0 to ~0.3), so multiply to get useful range
    const normalizedSpeed = Math.min(speed * 3, 1); // 0 to 1

    // Chromatic Aberration: increases with speed
    // RGB split effect — subtle at low speed, noticeable at high speed
    if (chromaRef.current) {
      const offset = normalizedSpeed * 0.003; // max offset
      chromaRef.current.offset.set(offset, offset);
    }

    // Vignette: gets darker at high speed (tunnel vision effect)
    if (vignetteRef.current) {
      vignetteRef.current.darkness = 0.3 + normalizedSpeed * 0.5;
    }

    // Bloom: slightly stronger at high speed
    if (bloomRef.current) {
      bloomRef.current.intensity = 0.5 + normalizedSpeed * 1.0;
    }
  });

  return (
    <EffectComposer>
      {/* 🌟 BLOOM — makes bright things glow */}
      <Bloom
        ref={bloomRef}
        intensity={0.5} // base glow strength
        luminanceThreshold={0.9} // only things brighter than this glow
        luminanceSmoothing={0.025} // smooth glow falloff
        mipmapBlur // smoother, more realistic bloom
      />

      {/* 🔲 VIGNETTE — dark edges for cinematic feel */}
      <Vignette
        ref={vignetteRef}
        offset={0.3} // how far from edge the darkening starts
        darkness={0.4} // base darkness
        blendFunction={BlendFunction.NORMAL}
      />

      {/* 🎨 CHROMATIC ABERRATION — RGB split at high speed */}
      <ChromaticAberration
        ref={chromaRef}
        offset={new THREE.Vector2(0.0, 0.0)} // starts at 0 (no effect)
        blendFunction={BlendFunction.NORMAL}
        radialModulation={true} // stronger at edges, subtle at center
        modulationOffset={0.5}
      />
    </EffectComposer>
  );
}

import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import useGameStore from "../../store/gameStore";

export default function CheckPoint() {
  const incrementLap = useGameStore((state) => state.incrementLap);
  const gameState = useGameStore((state) => state.gameState);
  // car starts INSIDE checkpoint, ignore first overlap
  const hasLeftStart = useRef(false);
  // cooldown to prevent double-counting
  const canCount = useRef(true);

  //   reset checkpoint when new race starts
  useEffect(() => {
    if (gameState === "racing") {
      hasLeftStart.current = false;
      canCount.current = true;
    }
  }, [gameState]);

  const handleEnter = () => {
    // Only count during racing
    const { gameState } = useGameStore.getState();
    if (gameState !== "racing") return;
    // car started inside checkpoint - ignore until it leaves first
    if (!hasLeftStart.current) return;

    // Cooldown active - ignore
    if (!canCount.current) return;

    canCount.current = false;
    incrementLap();
    // 3-second cooldown before next lap can count
    setTimeout(() => {
      canCount.current = true;
    }, 3000);
  };

  const handleExit = () => {
    hasLeftStart.current = true;
  };

  return (
    <RigidBody
      type="fixed"
      sensor
      position={[30, 0.5, 0]}
      onIntersectionEnter={handleEnter}
      onCollisionExit={handleExit}
    >
      {/* Invisible trigger zone across the track */}
      {/* args = half-extents: [5, 1, 1] → full size 10 x 2 x 2 */}

      <CapsuleCollider args={[5, 1, 1]} />
    </RigidBody>
  );
}

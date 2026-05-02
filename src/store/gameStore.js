import { create } from "zustand";

const useGameStore = create((set, get) => ({
  // car state
  speed: 0,

  // Race state
  lap: 0,
  totalLaps: 3,
  timer: 0,
  bestTime: null,

  // --- Game State ---
  // 'menu' → 'countdown' → 'racing' → 'finished'
  gameState: "menu",
  //   Actions
  setSpeed: (speed) => set({ speed }),

  startRace: () =>
    set({
      gameState: "racing",
      timer: 0,
      lap: 0,
      speed: 0,
    }),

  incrementLap: () => {
    const { lap, totalLaps } = get();
    const newLap = lap + 1;
    if (newLap >= totalLaps) {
      set({ lap: newLap, gameState: "finished" });
    } else {
      set({ lap: newLap });
    }
  }, 

  resetGame: () =>
    set({
      speed: 0,
      lap: 0,
      timer: 0,
      gameState: "menu",
    }),
}));
export default useGameStore;

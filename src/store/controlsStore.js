import { create } from "zustand";

const useControlsStore = create((set) => ({
  forward: false,
  backward: false,
  left: false,
  right: false,
  brake: false,

  setControl: (control, value) =>
    set((state) => ({ ...state, [control]: value })),

  resetControls: () =>
    set({
      forward: false,
      backward: false,
      left: false,
      right: false,
      brake: false,
    }),
}));

export default useControlsStore;

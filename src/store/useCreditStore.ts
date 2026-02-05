import { create } from "zustand";

type CreditState = {
  score: number;
  index: number;
  show: boolean;

  setScore: (score: number) => void;
  setIndex: (index: number) => void;
  showResult: (value: boolean) => void;
};

export const useCreditStore = create<CreditState>((set) => ({
  score: 0,
  index: 0,
  show: false,

  setScore: (score) => set({ score }),
  setIndex: (index) => set({ index }),
  showResult: (value) => set({ show: value }),
}));

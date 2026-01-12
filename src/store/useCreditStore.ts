import { set } from "mongoose";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CreditState = {
  score: number;
  index: number;
  show: boolean;
  setScore: (score: number) => void;
  setIndex: (index: number) => void;
  showResult: () => void;
};

export const useCreditStore = create<CreditState>()(persist(
  (set) => ({
    score: 0,
    index: 0,
    show: false,

    setScore: (score) => set({ score }),
    setIndex: (index) => set({ index }),
    showResult: () => set({ show: true }),
  }),
  {name: "credit-store"}
));

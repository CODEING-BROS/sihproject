// src/store/profileUiStore.js
import { create } from "zustand";

const useProfileUiStore = create((set) => ({
  activeTab: "details", // initial state
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

export default useProfileUiStore;
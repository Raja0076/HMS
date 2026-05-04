import { create } from "zustand";

const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar:    (val) => set({ sidebarOpen: val }),
}));

export default useUIStore;
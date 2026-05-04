import { create } from "zustand";
import { setToken, removeToken } from "../utils/token";

interface User {
  id: string;
  role: 'admin' | 'staff' | 'resident';
  username?: string;
  email?: string;
  fullname?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isStaff: () => boolean;
  isResident: () => boolean;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  user:            null,
  isAuthenticated: false,
  isLoading:       true,

  setAuth: (user) => set({
    user,
    isAuthenticated: true,
    isLoading: false,
  }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    removeToken();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  // Helpers — read role directly from store
  isAdmin:    () => get().user?.role === "admin",
  isStaff:    () => get().user?.role === "staff",
  isResident: () => get().user?.role === "resident",
}));

export default useAuthStore;
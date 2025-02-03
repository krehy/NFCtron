import { create } from "zustand";

const API_URL = "https://nfctron-frontend-seating-case-study-2024.vercel.app";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Neplatný e-mail nebo heslo.");
      }

      const data = await response.json();
      set({ user: data.user });

      return true; // Úspěšné přihlášení
    } catch (error) {
      console.error(error);
      return false; // Neúspěšné přihlášení
    }
  },

  logout: () => set({ user: null }),
}));

import { create } from "zustand";

interface Seat {
  seatId: string;
  place: number;
  ticketTypeId: string;
}

interface CartState {
  cart: Seat[];
  addToCart: (seat: Seat) => void;
  removeFromCart: (seatId: string) => void;
  clearCart: () => void; // Přidáváme funkci pro vymazání košíku
}

export const useCart = create<CartState>((set) => ({
  cart: [],
  addToCart: (seat) => set((state) => ({ cart: [...state.cart, seat] })),
  removeFromCart: (seatId) =>
    set((state) => ({ cart: state.cart.filter((seat) => seat.seatId !== seatId) })),
  clearCart: () => set({ cart: [] }), // Implementace vyprázdnění košíku
}));

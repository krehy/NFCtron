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
}

export const useCart = create<CartState>((set) => ({
  cart: [],
  addToCart: (seat) => set((state) => ({ cart: [...state.cart, seat] })),
  removeFromCart: (seatId) =>
    set((state) => ({ cart: state.cart.filter((seat) => seat.seatId !== seatId) })),
}));

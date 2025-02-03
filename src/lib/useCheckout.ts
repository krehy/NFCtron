import { useState } from "react";
import { useCart } from "./useCart";

const API_URL = "https://nfctron-frontend-seating-case-study-2024.vercel.app";

interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
}

export function useCheckout() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const placeOrder = async (user: UserInfo, eventId: string | null) => {
    if (!eventId) {
      setError("Event ID is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    const orderData = {
      eventId,
      tickets: cart.map((seat) => ({
        ticketTypeId: seat.ticketTypeId,
        seatId: seat.seatId,
      })),
      user,
    };

    try {
      const response = await fetch(`${API_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order.");
      }

      const data = await response.json();
      setOrderId(data.orderId);
      clearCart();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading, error, orderId };
}

import { useState, useEffect } from "react";

const API_URL = "https://nfctron-frontend-seating-case-study-2024.vercel.app";

interface Seat {
  seatId: string;
  place: number;
  ticketTypeId: string;
}

interface SeatRow {
  seatRow: number;
  seats: Seat[];
}

interface TicketType {
  id: string;
  name: string;
  price: number;
}

interface EventTicketsResponse {
  ticketTypes: TicketType[];
  seatRows: SeatRow[];
}

export function useSeats(eventId: string | null) {
  const [seatData, setSeatData] = useState<EventTicketsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    async function fetchSeats() {
      try {
        const response = await fetch(`${API_URL}/event-tickets?eventId=${eventId}`);
        if (!response.ok) throw new Error("Chyba při načítání sedadel");

        const data: EventTicketsResponse = await response.json();
        setSeatData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchSeats();
  }, [eventId]);

  return { seatData, loading, error };
}

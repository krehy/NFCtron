import { useState, useEffect } from "react";

const API_URL = "https://nfctron-frontend-seating-case-study-2024.vercel.app";

interface EventData {
  eventId: string;
  namePub: string;
  description: string;
  currencyIso: string;
  dateFrom: string;
  dateTo: string;
  headerImageUrl: string;
  place: string;
}

export function useEvent() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`${API_URL}/event`);
        if (!response.ok) throw new Error("Chyba při načítání dat");

        const data: EventData = await response.json();
        setEvent(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, []);

  return { event, loading, error };
}

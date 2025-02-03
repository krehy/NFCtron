import { useState } from "react";
import { useCheckout } from "@/lib/useCheckout";
import { useEvent } from "@/lib/useEvent";
import { Button } from "@/components/ui/button";

export default function CheckoutForm({ closeModal }: { closeModal: () => void }) {
  const { event } = useEvent();
  const { placeOrder, loading, error, orderId } = useCheckout();
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState({ email: "", firstName: "", lastName: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(user, event?.eventId || null);
  };

  return (
    <div className="p-6 bg-white  rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>

      {orderId ? (
        <p className="text-green-500">✅ Objednávka úspěšně odeslána! ID: {orderId}</p>
      ) : (
        <>
          {!isGuest ? (
            <div className="flex flex-col gap-4">
              <Button variant="default" onClick={() => alert("Zde by bylo přihlášení")}>
                🔑 Přihlásit se
              </Button>
              <Button variant="secondary" onClick={() => setIsGuest(true)}>
                Pokračovat jako host
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="Jméno"
                value={user.firstName}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Příjmení"
                value={user.lastName}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={user.email}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-md"
              />
              {error && <p className="text-red-500">❌ {error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? "Odesílání..." : "Dokončit objednávku"}
              </Button>
            </form>
          )}
        </>
      )}

      <Button variant="ghost" className="mt-4" onClick={closeModal}>
        Zrušit
      </Button>
    </div>
  );
}

import { useState } from "react";
import { useCheckout } from "@/lib/useCheckout";
import { useEvent } from "@/lib/useEvent";
import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";

export default function CheckoutForm({ closeModal, openLogin }: { closeModal: () => void; openLogin: () => void }) {
  const { event } = useEvent();
  const { user } = useAuth(); // Získáme přihlášeného uživatele
  const { placeOrder, loading, error, orderId } = useCheckout();
  const [isGuest, setIsGuest] = useState(user ? false : null);
  const [userInfo, setUserInfo] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(userInfo, event?.eventId || null);
  };

  return (
    <div className="p-6 bg-white rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>

      {orderId ? (
        <p className="text-green-500">✅ Objednávka úspěšně odeslána! ID: {orderId}</p>
      ) : (
        <>
          {isGuest === null ? (
            // 🛑 Uživatel není přihlášený → Nabídka na přihlášení nebo pokračování jako host
            <div className="flex flex-col gap-4">
              <Button variant="default" onClick={openLogin}>
                🔑 Přihlásit se
              </Button>
              <Button variant="secondary" onClick={() => setIsGuest(true)}>
                Pokračovat jako host
              </Button>
            </div>
          ) : (
            // ✅ Uživatel je přihlášený nebo pokračuje jako host → zobrazíme formulář
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="Jméno"
                value={userInfo.firstName}
                onChange={handleChange}
                required
                disabled={!!user}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Příjmení"
                value={userInfo.lastName}
                onChange={handleChange}
                required
                disabled={!!user}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userInfo.email}
                onChange={handleChange}
                required
                disabled={!!user}
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
    </div>
  );
}

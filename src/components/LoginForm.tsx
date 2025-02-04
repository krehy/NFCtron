import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";

export default function LoginForm({ closeModal }: { closeModal: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("frontend@nfctron.com");
  const [password, setPassword] = useState("Nfctron2025");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await login(email, password);
    if (!success) {
      setError("Neplatný e-mail nebo heslo.");
      setLoading(false);
      return;
    }

    closeModal(); // Zavření modalu po úspěšném přihlášení
  };

  return (
    <div className="p-6 bg-white rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-black">Přihlášení</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Přihlašování..." : "Přihlásit se"}
        </Button>
      </form>
      <Button variant="ghost" className="mt-4" onClick={closeModal}>
        Zrušit
      </Button>
    </div>
  );
}

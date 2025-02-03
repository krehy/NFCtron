import { Seat } from "@/components/Seat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEvent } from "@/lib/useEvent"; // Načítání informací o eventu
import { useSeats } from "@/lib/useSeats"; // Načítání sedadel
import { useCart } from "@/lib/useCart"; // Správa košíku
import CheckoutForm from "@/components/CheckoutForm"; // Checkout formulář
import { addToCalendar } from "@/lib/addToCalendar"; // Import funkce
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/lib/useAuth";
import { useState } from "react";
import "./App.css";

function App() {
  const { event, loading: eventLoading, error: eventError } = useEvent();
  const { seatData, loading: seatsLoading, error: seatsError } = useSeats(event?.eventId || null);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <div className="flex flex-col grow">
      {/* Header */}
      <nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center p-4 md:p-6">
        <div className="max-w-screen-lg w-full flex items-center justify-between gap-3">
          <div className="max-w-[150px] md:max-w-[250px] w-full flex">
            <div className="bg-zinc-100 rounded-md size-12" />
          </div>
          <div className="bg-zinc-100 rounded-md h-8 w-[120px] md:w-[200px]" />
          <div className="max-w-[150px] md:max-w-[250px] w-full flex justify-end">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="https://source.boringavatars.com/marble/120/user-email" />
                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-zinc-500">{user.email}</span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px] md:w-[250px]">
                  <DropdownMenuLabel>{user.firstName} {user.lastName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={logout}>Odhlásit se</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setShowLogin(true)} variant="default">
                Přihlásit se
              </Button>
            )}
          </div>
        </div>
      </nav>
	  
	    {/* Main content */}
		<main className="grow flex flex-col justify-center">
  <div className="max-w-screen-lg m-auto p-4 flex flex-col md:flex-row-reverse items-start grow gap-3 w-full">
    {/* Event info (na mobilu nahoře, na PC vpravo) */}
    <aside className="w-full md:max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
      {eventLoading && <p>🔄 Načítám informace o akci...</p>}
      {eventError && <p className="text-red-500">❌ Chyba: {eventError}</p>}
      {event && (
        <>
          <img
            src={event.headerImageUrl}
            alt={event.namePub}
            className="w-full h-32 object-cover rounded-md"
          />
          <h1 className="text-xl text-zinc-900 font-semibold">{event.namePub}</h1>
          <p className="text-sm text-zinc-500">{event.description}</p>
          <p className="text-sm text-zinc-500">📍 {event.place}</p>
          <p className="text-sm text-zinc-500">
            📅 {new Date(event.dateFrom).toLocaleDateString()} - {new Date(event.dateTo).toLocaleDateString()}
          </p>
          {/* Tlačítko pro přidání do kalendáře */}
          <Button
            variant="secondary"
            onClick={() =>
              addToCalendar({
                name: event.namePub,
                location: event.place,
                startDate: event.dateFrom,
                endDate: event.dateTo,
              })
            }
          >
            📅 Přidat do kalendáře
          </Button>
        </>
      )}
    </aside>

    {/* Seating map (na mobilu pod event info, na PC vlevo) */}
    <div className="bg-white rounded-md grow p-3 self-stretch shadow-sm flex flex-col gap-2">
      {seatsLoading && <p>🔄 Načítám sedadla...</p>}
      {seatsError && <p className="text-red-500">❌ Chyba: {seatsError}</p>}

      {seatData &&
        seatData.seatRows.map((row, rowIndex) => (
          <div key={row.seatRow} className="flex justify-center gap-1">
            {row.seats.map((seat, seatIndex) => (
              <Seat key={seat.seatId} seat={{ ...seat, place: seatIndex + 1 }} rowNumber={rowIndex + 1} />
            ))}
          </div>
        ))}
    </div>
  </div>
</main>

      {/* Cart footer */}
      <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center p-4 md:p-6">
        <div className="max-w-screen-lg w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-zinc-500 flex flex-col">
            <span>Total for {cart.length} tickets</span>
            <span className="text-2xl font-semibold">{cart.length * 100} CZK</span>
          </div>
          <Button onClick={() => setShowCheckout(true)} disabled={cart.length === 0} variant="default">
            Koupit vstupenky
          </Button>
        </div>
      </nav>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-md shadow-lg relative w-full max-w-md md:max-w-lg">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowCheckout(false)}>
              ✖
            </button>
            <CheckoutForm closeModal={() => setShowCheckout(false)} openLogin={() => {
              setShowCheckout(false);
              setShowLogin(true);
            }} />
          </div>
        </div>
      )}
	  
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-md shadow-lg relative w-full max-w-md md:max-w-lg">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowLogin(false)}>
              ✖
            </button>
            <LoginForm closeModal={() => {
              setShowLogin(false);
              setShowCheckout(true); // Po přihlášení znovu otevřeme checkout
            }} />
          </div>
        </div>
      )}

    </>
  );
}

export default App;

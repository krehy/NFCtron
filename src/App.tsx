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
import "./App.css";

function App() {
  const { event, loading: eventLoading, error: eventError } = useEvent();
  const { seatData, loading: seatsLoading, error: seatsError } = useSeats(event?.eventId || null);
  const { cart } = useCart();

  return (
    <div className="flex flex-col grow">
      {/* Header */}
      <nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
        <div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
          <div className="max-w-[250px] w-full flex">
            <div className="bg-zinc-100 rounded-md size-12" />
          </div>
          <div className="bg-zinc-100 rounded-md h-8 w-[200px]" />
          <div className="max-w-[250px] w-full flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://source.boringavatars.com/marble/120/<user-email>?colors=25106C,7F46DB`}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-zinc-500">
                        john.doe@nfctron.com
                      </span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[250px]">
                <DropdownMenuLabel>John Doe</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem disabled>Logout</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="grow flex flex-col justify-center">
        <div className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full">
          {/* Seating map */}
          <div
            className="bg-white rounded-md grow grid p-3 self-stretch shadow-sm"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
              gridAutoRows: "40px",
            }}
          >
            {/* Stav načítání sedadel */}
            {seatsLoading && <p>🔄 Načítám sedadla...</p>}
            {seatsError && <p className="text-red-500">❌ Chyba: {seatsError}</p>}
            
            {/* Zobrazení sedadel z API */}
            {seatData &&
              seatData.seatRows.map((row) =>
                row.seats.map((seat) => <Seat key={seat.seatId} seat={seat} />)
              )}
          </div>

          {/* Event info */}
          <aside className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
            {eventLoading && <p>🔄 Načítám informace o akci...</p>}
            {eventError && <p className="text-red-500">❌ Chyba: {eventError}</p>}
            {event && (
              <>
                <img
                  src={event.headerImageUrl}
                  alt={event.namePub}
                  className="w-full h-32 object-cover rounded-md"
                />
                <h1 className="text-xl text-zinc-900 font-semibold">
                  {event.namePub}
                </h1>
                <p className="text-sm text-zinc-500">{event.description}</p>
                <p className="text-sm text-zinc-500">📍 {event.place}</p>
                <p className="text-sm text-zinc-500">
                  📅{" "}
                  {new Date(event.dateFrom).toLocaleDateString()} -{" "}
                  {new Date(event.dateTo).toLocaleDateString()}
                </p>
                <Button variant="secondary" disabled>
                  Add to calendar
                </Button>
              </>
            )}
          </aside>
        </div>
      </main>

      {/* Cart footer */}
      <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center">
        <div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
          <div className="flex flex-col">
            <span>Total for {cart.length} tickets</span>
            <span className="text-2xl font-semibold">{cart.length * 100} CZK</span>
          </div>
          <Button disabled={cart.length === 0} variant="default">
            Checkout now
          </Button>
        </div>
      </nav>
    </div>
  );
}

export default App;

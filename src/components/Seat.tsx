import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/useCart";
import React from "react";

interface SeatProps extends React.HTMLAttributes<HTMLElement> {
  seat: {
    seatId: string;
    place: number;
    ticketTypeId: string;
  };
  rowNumber: number;
}

export const Seat = React.forwardRef<HTMLDivElement, SeatProps>(({ seat, rowNumber, className }, ref) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const isInCart = cart.some((item) => item.seatId === seat.seatId);

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cn(
            "w-10 h-10 border border-gray-300 flex items-center justify-center font-semibold",
            isInCart ? "bg-green-500 text-white" : "bg-gray-500 hover:bg-gray-200",
            className
          )}
          ref={ref}
        >
          {rowNumber}-{seat.place}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-3 w-48 shadow-md rounded-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Řada {rowNumber}, Sedadlo {seat.place}</h3>
        <p className="text-sm text-gray-500">ID: {seat.seatId}</p>
        <p className="text-sm text-gray-500">Typ vstupenky: {seat.ticketTypeId}</p>

        <footer className="flex flex-col mt-3">
          {isInCart ? (
            <Button onClick={() => removeFromCart(seat.seatId)} variant="destructive" size="sm">
              Odebrat z košíku
            </Button>
          ) : (
            <Button onClick={() => addToCart(seat)} variant="default" size="sm">
              Přidat do košíku
            </Button>
          )}
        </footer>
      </PopoverContent>
    </Popover>
  );
});

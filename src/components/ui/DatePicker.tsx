import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { format } from "date-fns";

function DatePicker({
  date,
  onDateChange,
  id,
}: {
  date: Date | null;
  onDateChange: (date: Date) => void;
  id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full min-w-52 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MM/dd/yyyy") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                onDateChange(selectedDate);
                setIsOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}


export default DatePicker;
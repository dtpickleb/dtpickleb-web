"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  value?: Date;
  onChange?: (d?: Date) => void;
  placeholder?: string;
  withTime?: boolean;
  className?: string;
  futureOnly?: boolean;
  yearRange?: { from: number; to: number };
};

export default function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  withTime = true,
  className,
  futureOnly = true,
  yearRange
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<Date | undefined>(value);

  React.useEffect(() => setInternal(value), [value]);

  const handleSelect = (d?: Date) => {
    if (!d) return;
    if (!withTime) {
      const copy = new Date(d);
      setInternal(copy);
      onChange?.(copy);
    } else {
      const copy = new Date(d);
      // keep time from internal
      const hours = internal?.getHours() ?? 9;
      const minutes = internal?.getMinutes() ?? 0;
      copy.setHours(hours, minutes, 0, 0);
      setInternal(copy);
      onChange?.(copy);
    }
  };

  const disabled = (d: Date) => {
    if (!futureOnly) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today; // disable past dates
  };

  // Determine if we should use dropdown navigation
  const useDropdown = !futureOnly || yearRange;

  // Calculate year range for dropdown
  const currentYear = new Date().getFullYear();
  const fromYear = yearRange?.from ?? (futureOnly ? currentYear : currentYear - 100);
  const toYear = yearRange?.to ?? (futureOnly ? currentYear + 10 : currentYear);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !internal && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internal ? format(internal, withTime ? "PP p" : "PP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-sidebar">
        <div className="flex flex-col gap-2">
          <Calendar
            mode="single"
            selected={internal}
            onSelect={handleSelect}
            autoFocus
            disabled={disabled}
            captionLayout={useDropdown ? "dropdown" : "label"}
            fromYear={fromYear}
            toYear={toYear}
          />
          {withTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 opacity-60" />
              <Select
                value={String(internal?.getHours() ?? 9)}
                onValueChange={(h) => {
                  if (!internal) return;
                  const copy = new Date(internal);
                  copy.setHours(Number(h));
                  setInternal(copy);
                  onChange?.(copy);
                }}
              >
                <SelectTrigger className="w-[90px]">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="bg-sidebar">
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {String(i).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={String(internal?.getMinutes() ?? 0)}
                onValueChange={(m) => {
                  if (!internal) return;
                  const copy = new Date(internal);
                  copy.setMinutes(Number(m));
                  setInternal(copy);
                  onChange?.(copy);
                }}
              >
                <SelectTrigger className="w-[90px]">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="bg-sidebar">
                  {[0, 15, 30, 45].map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {String(m).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}


import React from "react";
import { Button } from "@/components/atoms/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { Calendar } from "@/components/atoms/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Input } from "@/components/atoms/input";

interface TimeRangeSelectorProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onReset: () => void;
  className?: string;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}) => {
  // Handle time change for start date
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startDate) return;
    
    const [hours, minutes] = e.target.value.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;
    
    const newDate = new Date(startDate);
    newDate.setHours(hours, minutes);
    onStartDateChange(newDate);
  };
  
  // Handle time change for end date
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!endDate) return;
    
    const [hours, minutes] = e.target.value.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;
    
    const newDate = new Date(endDate);
    newDate.setHours(hours, minutes);
    onEndDateChange(newDate);
  };
  
  // Format time as HH:MM for input value
  const formatTimeForInput = (date: Date | null) => {
    if (!date) return "00:00";
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("justify-start text-xs md:text-sm w-36 md:w-40", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "MMM dd, yyyy") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate || undefined}
                  onSelect={onStartDateChange}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-5 text-muted-foreground" />
              <Input
                type="time"
                value={formatTimeForInput(startDate)}
                onChange={handleStartTimeChange}
                className="w-26 h-9 text-xs"
                disabled={!startDate}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("justify-start text-xs md:text-sm w-36 md:w-40", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "MMM dd, yyyy") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate || undefined}
                  onSelect={onEndDateChange}
                  initialFocus
                  disabled={!startDate}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-5 text-muted-foreground" />
              <Input
                type="time"
                value={formatTimeForInput(endDate)}
                onChange={handleEndTimeChange}
                className="w-26 h-9 text-xs"
                disabled={!endDate}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimeRangeSelector;

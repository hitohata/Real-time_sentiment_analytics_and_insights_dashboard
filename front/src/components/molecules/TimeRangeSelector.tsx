import React from "react";
import { Button } from "../atoms/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../atoms/popover";
import { Calendar } from "../atoms/calendar";
import { cn } from "../../lib/utils";
import { format } from "date-fns";

interface TimeRangeSelectorProps {
	startDate: Date | null;
	endDate: Date | null;
	onStartDateChange: (date: Date | null) => void;
	onEndDateChange: (date: Date | null) => void;
	onPresetSelected: (preset: string) => void;
	isCustomRange: boolean;
	className?: string;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	onPresetSelected,
	isCustomRange,
	className,
}) => {
	return (
		<div className={cn("flex gap-2 items-center", className)}>
			<div className="flex gap-1 md:gap-2">
				<Button
					variant={!isCustomRange && startDate === null ? "default" : "outline"}
					size="sm"
					onClick={() => onPresetSelected("all")}
					className="text-xs md:text-sm"
				>
					All Time
				</Button>
				<Button
					variant={!isCustomRange && startDate !== null ? "default" : "outline"}
					size="sm"
					onClick={() => onPresetSelected("30days")}
					className="text-xs md:text-sm"
				>
					Last 30 Days
				</Button>
				<Button
					variant={isCustomRange ? "default" : "outline"}
					size="sm"
					onClick={() => onPresetSelected("custom")}
					className="text-xs md:text-sm"
				>
					Custom
				</Button>
			</div>

			{isCustomRange && (
				<div className="flex gap-2 items-center">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className={cn(
									"justify-start text-xs md:text-sm",
									!startDate && "text-muted-foreground",
								)}
							>
								{startDate
									? format(startDate, "MMM dd, yyyy")
									: "Select start date"}
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
					<span className="text-sm text-muted-foreground">to</span>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className={cn(
									"justify-start text-xs md:text-sm",
									!endDate && "text-muted-foreground",
								)}
							>
								{endDate ? format(endDate, "MMM dd, yyyy") : "Select end date"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={endDate || undefined}
								onSelect={onEndDateChange}
								initialFocus
								disabled={(date) => !startDate || date < startDate}
								className={cn("p-3 pointer-events-auto")}
							/>
						</PopoverContent>
					</Popover>
				</div>
			)}
		</div>
	);
};

export default TimeRangeSelector;

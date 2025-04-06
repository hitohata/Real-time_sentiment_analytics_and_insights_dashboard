import {FilterState, SourceType} from "../../types/feedback";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "../atoms/command";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { cn } from "../../lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

const SOURCES: SourceType[] = ["app", "web", "email"];

interface SourceFilterProps {
	filters: FilterState;
	onSelectionChange: (sources: SourceType[]) => void;
	className?: string;
}

const SourceFilter = ({
	filters,
	onSelectionChange,
	className,
}: SourceFilterProps) => {
	const [open, setOpen] = useState(false);

	const handleSelect = (source: SourceType) => {
		if (filters.sources.includes(source)) {
			onSelectionChange(filters.sources.filter((item) => item !== source));
		} else {
			onSelectionChange([...filters.sources, source]);
		}
	};

	const handleClearAll = () => {
		onSelectionChange(SOURCES);
	};

	return (
		<div className={className}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm" className="h-9 border-dashed">
						<span>Source</span>
						{filters.sources.length < SOURCES.length && (
							<Badge
								variant="secondary"
								className="ml-1 rounded-sm px-1 font-normal"
							>
								{SOURCES.length - filters.sources.length}
							</Badge>
						)}
						<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-52 p-0">
					<Command>
						<CommandInput placeholder="Search source..." />
						<CommandList>
							<CommandEmpty>No source found.</CommandEmpty>
							<CommandGroup>
								{SOURCES.map((source) => (
									<CommandItem
										key={source}
										value={source}
										onSelect={() => handleSelect(source)}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												filters.sources.includes(source)
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										<span>{source}</span>
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem
									onSelect={handleClearAll}
									className="justify-center text-center"
								>
									{filters.sources.length === SOURCES.length
										? "Clear filters"
										: "Show all"}
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<div className="mt-2 flex flex-wrap gap-1">
				{SOURCES.length > 0 &&
					SOURCES.length !== filters.sources.length &&
					filters.sources.map((source) => (
						<Badge
							key={source}
							variant="secondary"
							className="rounded-sm font-normal"
						>
							{source}
							<Button
								variant="ghost"
								size="sm"
								className="h-4 w-4 p-0 ml-1"
								onClick={() => handleSelect(source)}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					))}
			</div>
		</div>
	);
};

export default SourceFilter;

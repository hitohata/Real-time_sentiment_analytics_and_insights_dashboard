import { SourceType } from "../../types/feedback";
import { cn } from "../../lib/utils";

interface SourceBadgeProps {
	source: SourceType;
	className?: string;
}

const SourceBadge = ({ source, className }: SourceBadgeProps) => {
	const baseClasses =
		"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

	const sourceClasses = {
		App: "bg-purple-100 text-purple-800",
		Web: "bg-blue-100 text-blue-800",
		Email: "bg-amber-100 text-amber-800",
	};

	return (
		<span className={cn(baseClasses, sourceClasses[source], className)}>
			{source}
		</span>
	);
};

export default SourceBadge;

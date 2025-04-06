import { SentimentType } from "../../types/feedback";
import { cn } from "../../lib/utils";

interface SentimentBadgeProps {
	sentiment: SentimentType;
	className?: string;
	showLabel?: boolean;
}

const SentimentBadge = ({
	sentiment,
	className,
	showLabel = true,
}: SentimentBadgeProps) => {
	const baseClasses =
		"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

	const sentimentClasses = {
		positive: "bg-green-100 text-green-800",
		neutral: "bg-gray-100 text-gray-800",
		negative: "bg-red-100 text-red-800",
	};

	return (
		<span className={cn(baseClasses, sentimentClasses[sentiment], className)}>
			<span
				className={cn("h-1.5 w-1.5 rounded-full mr-1", {
					"bg-sentiment-positive": sentiment === "positive",
					"bg-sentiment-neutral": sentiment === "neutral",
					"bg-sentiment-negative": sentiment === "negative",
				})}
			/>
			{showLabel && sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
		</span>
	);
};

export default SentimentBadge;

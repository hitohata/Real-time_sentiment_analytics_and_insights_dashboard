import { SuggestedAction } from "@/types/feedback";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import SentimentBadge from "./SentimentBadge";

interface SuggestedActionsProps {
	actions: SuggestedAction[];
	className?: string;
}

const SuggestedActions = ({ actions, className }: SuggestedActionsProps) => {
	return (
		<div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
			{actions.map((action) => (
				<Card
					key={action.id}
					className="border-l-4 h-full"
					style={{
						borderLeftColor:
							action.relatedSentiment === "positive"
								? "#4ade80"
								: action.relatedSentiment === "neutral"
									? "#94a3b8"
									: "#f87171",
					}}
				>
					<CardHeader className="pb-2">
						<div className="flex justify-between items-start">
							<CardTitle className="text-lg font-medium">
								{action.action}
							</CardTitle>
							<div
								className={cn(
									"text-xs font-medium rounded-full px-2 py-1",
									action.impact === "high"
										? "bg-red-100 text-red-800"
										: action.impact === "medium"
											? "bg-amber-100 text-amber-800"
											: "bg-blue-100 text-blue-800",
								)}
							>
								{action.impact.charAt(0).toUpperCase() + action.impact.slice(1)}{" "}
								Impact
							</div>
						</div>
						<CardDescription className="text-sm mt-1">
							Based on{" "}
							<SentimentBadge
								sentiment={action.relatedSentiment}
								className="ml-1"
							/>{" "}
							feedback
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">{action.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default SuggestedActions;

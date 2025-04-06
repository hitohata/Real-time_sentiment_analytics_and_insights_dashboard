import { SuggestionsType } from "../../types/feedback";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../atoms/card";
import { cn } from "../../lib/utils";

interface SuggestedActionsProps {
	actions: SuggestionsType[];
	className?: string;
}

const SuggestedActions = ({ actions, className }: SuggestedActionsProps) => {
	return (
		<div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
			{actions.map((action) => (
				<Card
					key={action.reason}
					className="border-l-4 h-full"
				>
					<CardHeader className="pb-2">
						<div className="flex justify-between items-start">
							<CardTitle className="text-lg font-medium">
								{action.action}
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">{action.reason}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default SuggestedActions;

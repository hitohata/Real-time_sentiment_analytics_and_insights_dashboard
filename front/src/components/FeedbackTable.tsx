import { FeedbackItem } from "@/types/feedback";
import { format } from "date-fns";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import SentimentBadge from "./SentimentBadge";
import SourceBadge from "./SourceBadge";

interface FeedbackTableProps {
	data: FeedbackItem[];
	className?: string;
}

const FeedbackTable = ({ data, className }: FeedbackTableProps) => {
	return (
		<div className={`${className} overflow-auto`}>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[180px]">Timestamp</TableHead>
						<TableHead className="w-[100px]">Source</TableHead>
						<TableHead className="w-[120px]">Sentiment</TableHead>
						<TableHead className="w-[100px]">Score</TableHead>
						<TableHead>Feedback</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={5}
								className="text-center py-8 text-muted-foreground"
							>
								No feedback found matching the current filters.
							</TableCell>
						</TableRow>
					) : (
						data.map((item) => (
							<TableRow key={item.id}>
								<TableCell className="font-medium">
									{format(new Date(item.timestamp), "MMM dd, yyyy HH:mm")}
								</TableCell>
								<TableCell>
									<SourceBadge source={item.source} />
								</TableCell>
								<TableCell>
									<SentimentBadge sentiment={item.sentimentLabel} />
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1.5">
										<span
											className={`inline-block h-2 w-12 rounded-full relative overflow-hidden bg-gray-200`}
										>
											<span
												className={`absolute inset-0 h-full rounded-full transition-all duration-500 
                          ${
														item.sentimentLabel === "positive"
															? "bg-sentiment-positive"
															: item.sentimentLabel === "neutral"
																? "bg-sentiment-neutral"
																: "bg-sentiment-negative"
													}`}
												style={{ width: `${item.sentimentScore * 100}%` }}
											/>
										</span>
										<span className="text-xs text-gray-500">
											{item.sentimentScore.toFixed(2)}
										</span>
									</div>
								</TableCell>
								<TableCell className="max-w-md truncate">{item.text}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default FeedbackTable;

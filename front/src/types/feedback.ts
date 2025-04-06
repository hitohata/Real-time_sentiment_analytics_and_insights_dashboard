export type SentimentType = "positive" | "neutral" | "negative";
export type SourceType = "App" | "Web" | "Email";

export interface FeedbackItem {
	id: string;
	timestamp: string;
	source: SourceType;
	sentimentLabel: SentimentType;
	sentimentScore: number;
	text: string;
}

export interface TimeSeriesDataPoint {
	date: string;
	positive: number;
	neutral: number;
	negative: number;
}

export interface SourceBreakdownItem {
	source: SourceType;
	positive: number;
	neutral: number;
	negative: number;
}

export interface SuggestedAction {
	id: string;
	action: string;
	description: string;
	impact: "high" | "medium" | "low";
	relatedSentiment: SentimentType;
}

export interface FilterState {
	timeRange: {
		start: Date | null;
		end: Date | null;
	};
	sources: SourceType[];
	isCustomTimeRange: boolean;
}

/**
 * Feedback Datasource
 */
export const DataSources = ["app", "web", "email"] as const;
export type SourceType = (typeof DataSources)[number];

export type SentimentType = "positive" | "neutral" | "negative";

export interface FeedbackItem {
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

/**
 * Analysis summary interface
 */
export type AnalysisSummaryType = {
	timestamp: string;
	feedbackSource: string;
	feedback: string;
	sentimentLabel: "positive" | "neutral" | "negative";
	sentimentScore: number;
};

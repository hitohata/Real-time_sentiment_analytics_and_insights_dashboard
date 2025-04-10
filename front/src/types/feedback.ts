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
	sources: SourceType[];
}

export interface FilterTimeRange {
	start: Date | null;
	end: Date | null;
}

/**
 * Analysis summary type
 */
export type AnalysisSummaryType = {
	timestamp: string;
	feedbackSource: "app" | "web" | "email";
	feedback: string;
	sentimentLabel: "positive" | "neutral" | "negative";
	sentimentScore: number;
};

/**
 * suggestions type
 */
export type TrendSuggestionsType = {
	trend: string;
	suggestions: SuggestionsType[];
}

export type SuggestionsType = {
	action: string;
	reason: string;
}
import {
	FeedbackItem,
	SourceBreakdownItem,
	SourceType,
	SuggestedAction,
	TimeSeriesDataPoint,
} from "@/types/feedback";
import { addDays, format, isValid, subDays } from "date-fns";

// Helper to generate random feedback text
const positiveTexts = [
	"Love the new UI changes, much more intuitive!",
	"Great customer service experience today, very helpful team.",
	"App performance has improved significantly with the latest update.",
	"The new feature is exactly what I was hoping for, thank you!",
	"Very impressed with how quickly my issue was resolved.",
];

const neutralTexts = [
	"The app works fine but could use some more features.",
	"No issues to report, everything is functioning as expected.",
	"Had an average experience with the product.",
	"The service was acceptable but nothing special.",
	"Interface is functional but not particularly exciting.",
];

const negativeTexts = [
	"App keeps crashing when I try to upload files.",
	"Very disappointed with the response time from support.",
	"New update is confusing and difficult to navigate.",
	"Experiencing frequent errors when trying to save my work.",
	"The checkout process is too complicated and frustrating.",
];

const getRandomText = (sentiment: string): string => {
	if (sentiment === "positive") {
		return positiveTexts[Math.floor(Math.random() * positiveTexts.length)];
	} else if (sentiment === "neutral") {
		return neutralTexts[Math.floor(Math.random() * neutralTexts.length)];
	} else {
		return negativeTexts[Math.floor(Math.random() * negativeTexts.length)];
	}
};

const sources: SourceType[] = ["App", "Web", "Email"];

// Generate random feedback data
export const generateMockFeedbackData = (count: number): FeedbackItem[] => {
	const data: FeedbackItem[] = [];

	for (let i = 0; i < count; i++) {
		const sentiments = ["positive", "neutral", "negative"];
		const sentimentLabel = sentiments[
			Math.floor(Math.random() * sentiments.length)
		] as "positive" | "neutral" | "negative";

		// Generate a sentiment score based on the label
		let sentimentScore: number;
		if (sentimentLabel === "positive") {
			sentimentScore = 0.6 + Math.random() * 0.4; // 0.6 to 1.0
		} else if (sentimentLabel === "neutral") {
			sentimentScore = 0.4 + Math.random() * 0.2; // 0.4 to 0.6
		} else {
			sentimentScore = Math.random() * 0.4; // 0.0 to 0.4
		}

		const daysAgo = Math.floor(Math.random() * 30); // Random day within the last 30 days
		const timestamp = subDays(new Date(), daysAgo).toISOString();

		data.push({
			id: `feedback-${i}`,
			timestamp,
			source: sources[Math.floor(Math.random() * sources.length)],
			sentimentLabel,
			sentimentScore: parseFloat(sentimentScore.toFixed(2)),
			text: getRandomText(sentimentLabel),
		});
	}

	// Sort by timestamp descending (newest first)
	return data.sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
	);
};

// Generate time series data from feedback items
export const generateTimeSeriesData = (
	feedbackItems: FeedbackItem[],
): TimeSeriesDataPoint[] => {
	// Create a map of dates to count sentiment types
	const dateMap = new Map<
		string,
		{ positive: number; neutral: number; negative: number }
	>();

	// If there are no feedback items, return an empty array
	if (!feedbackItems.length) {
		return [];
	}

	// Get the date range
	const timestamps = feedbackItems
		.map((item) => new Date(item.timestamp))
		.filter((date) => isValid(date)); // Filter out invalid dates

	// If no valid timestamps, return empty array
	if (!timestamps.length) {
		return [];
	}

	const minDate = new Date(Math.min(...timestamps.map((t) => t.getTime())));
	const maxDate = new Date(Math.max(...timestamps.map((t) => t.getTime())));

	// Initialize all dates in the range
	let currentDate = minDate;
	while (currentDate <= maxDate) {
		const dateStr = format(currentDate, "yyyy-MM-dd");
		dateMap.set(dateStr, { positive: 0, neutral: 0, negative: 0 });
		currentDate = addDays(currentDate, 1);
	}

	// Count sentiments by date
	feedbackItems.forEach((item) => {
		try {
			const itemDate = new Date(item.timestamp);
			if (isValid(itemDate)) {
				const dateStr = format(itemDate, "yyyy-MM-dd");
				const counts = dateMap.get(dateStr) || {
					positive: 0,
					neutral: 0,
					negative: 0,
				};
				counts[item.sentimentLabel]++;
				dateMap.set(dateStr, counts);
			}
		} catch (error) {
			console.error("Invalid timestamp encountered:", item.timestamp);
		}
	});

	// Convert map to array of objects
	return Array.from(dateMap.entries())
		.map(([date, counts]) => ({
			date,
			...counts,
		}))
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Generate source breakdown data
export const generateSourceBreakdownData = (
	feedbackItems: FeedbackItem[],
): SourceBreakdownItem[] => {
	const sourceCounts = new Map<
		SourceType,
		{ positive: number; neutral: number; negative: number }
	>();

	// Initialize counts for all sources
	sources.forEach((source) => {
		sourceCounts.set(source, { positive: 0, neutral: 0, negative: 0 });
	});

	// Count sentiments by source
	feedbackItems.forEach((item) => {
		const counts = sourceCounts.get(item.source) || {
			positive: 0,
			neutral: 0,
			negative: 0,
		};
		counts[item.sentimentLabel]++;
		sourceCounts.set(item.source, counts);
	});

	// Convert map to array of objects
	return Array.from(sourceCounts.entries()).map(([source, counts]) => ({
		source,
		...counts,
	}));
};

// Generate suggested actions based on feedback
export const generateSuggestedActions = (
	feedbackItems: FeedbackItem[],
): SuggestedAction[] => {
	// This would normally be an AI-powered analysis
	// For mock data, we'll create predetermined suggestions based on sentiment counts

	const recentItems = feedbackItems.slice(0, 100);

	const negativeCount = recentItems.filter(
		(item) => item.sentimentLabel === "negative",
	).length;
	const positiveCount = recentItems.filter(
		(item) => item.sentimentLabel === "positive",
	).length;

	const suggestions: SuggestedAction[] = [];

	if (negativeCount > positiveCount) {
		suggestions.push({
			id: "1",
			action: "Improve App Stability",
			description:
				"Address the frequent crashes reported by users when uploading files.",
			impact: "high",
			relatedSentiment: "negative",
		});

		suggestions.push({
			id: "2",
			action: "Enhance Support Response Time",
			description:
				"Reduce customer support response time which is causing user frustration.",
			impact: "medium",
			relatedSentiment: "negative",
		});

		suggestions.push({
			id: "3",
			action: "Simplify UI Navigation",
			description:
				"Review and revise the recent UI changes that users find confusing.",
			impact: "high",
			relatedSentiment: "negative",
		});
	} else {
		suggestions.push({
			id: "1",
			action: "Expand New UI Features",
			description:
				"Build upon the positive reception to recent UI changes with additional improvements.",
			impact: "medium",
			relatedSentiment: "positive",
		});

		suggestions.push({
			id: "2",
			action: "Highlight Customer Service Excellence",
			description:
				"Promote the positive feedback about customer service in marketing materials.",
			impact: "low",
			relatedSentiment: "positive",
		});

		suggestions.push({
			id: "3",
			action: "Continue Performance Optimization",
			description:
				"Maintain focus on performance improvements that users are noticing and appreciating.",
			impact: "high",
			relatedSentiment: "positive",
		});
	}

	return suggestions;
};

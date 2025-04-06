import React from "react";
import { AnalysisSummaryType, DataSources, SourceBreakdownItem, SourceType } from "../../types/feedback";
import SourceBreakdownChart from "../molecules/SourceBreakdownChart";

interface IProps {
    analysisSummaries: AnalysisSummaryType[];
}

export const SentimentBarChart = ({ analysisSummaries }: IProps) => {
    return <SourceBreakdownChart data={generateBarChartData(generateMockData())} />
}

const generateMockData = (): AnalysisSummaryType[] => {
	const now = new Date();
	const data: AnalysisSummaryType[] = [];

	for (let i = 0; i < 10; i++) {
		const date = new Date(now.getTime() - i * 6 * 60 * 1000); // 6分間隔
		data.push({
			timestamp: date.toISOString(),
			feedbackSource: ["app", "web", "email"][
				Math.floor(Math.random() * 3)
			],
			feedback: "Sample feedback",
			sentimentLabel: ["positive", "negative", "neutral"][
				Math.floor(Math.random() * 3)
			],
			sentimentScore: Math.random(),
		});
	}

	return data;
};

const generateBarChartData = (analysisSummaries: AnalysisSummaryType[]): SourceBreakdownItem[] => {
	const sourceCounts = new Map<
		SourceType,
		{ positive: number; neutral: number; negative: number }
	>();

	// Initialize counts for all sources
 	for (const source of DataSources) {
		sourceCounts.set(source, { positive: 0, neutral: 0, negative: 0 });
	}

	// Count sentiments by source
	for (const summary of analysisSummaries) {
		const source = summary.feedbackSource as SourceType;
		const counts = sourceCounts.get(source) || {
			positive: 0,
			neutral: 0,
			negative: 0,
		};
		counts[summary.sentimentLabel]++;
		sourceCounts.set(source, counts);
	}

	// Convert map to array of objects
	return Array.from(sourceCounts.entries()).map(([source, counts]) => ({
		source,
		...counts,
	}));
}
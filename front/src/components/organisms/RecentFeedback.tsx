import React from "react";
import { AnalysisSummaryType, FeedbackItem } from "../../types/feedback";
import FeedbackTable from "../molecules/FeedbackTable";

interface IProps {
	analysisSummaries: AnalysisSummaryType[];
}

export const RecentFeedback = ({ analysisSummaries }: IProps) => {
    return <FeedbackTable data={generateFeedback(generateMockData())} />
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

const generateFeedback = (analysisSummaries: AnalysisSummaryType[]) => {
    const sortedSummaries = analysisSummaries.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return sortedSummaries.slice(-20)
}

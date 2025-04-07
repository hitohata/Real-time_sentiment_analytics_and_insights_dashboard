import React from "react";
import { AnalysisSummaryType, FeedbackItem } from "../../types/feedback";
import FeedbackTable from "../molecules/FeedbackTable";

interface IProps {
	analysisSummaries: AnalysisSummaryType[];
}

export const RecentFeedback = ({ analysisSummaries }: IProps) => {
    return <FeedbackTable data={generateFeedback(analysisSummaries)} />
}

const generateFeedback = (analysisSummaries: AnalysisSummaryType[]) => {
    const sortedSummaries = analysisSummaries.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return sortedSummaries.slice(-20)
}

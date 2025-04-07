import React from "react";
import { addMinutes, format, isValid } from "date-fns";
import { AnalysisSummaryType } from "@/types/feedback";
import TimeSeriesChart from "../molecules/TimeSeriesChart";

interface IProps {
	analysisSummaries: AnalysisSummaryType[];
}

export const FeedbackVolumeChart = ({ analysisSummaries }: IProps) => {
	return <TimeSeriesChart data={generateTimeSeriesData(analysisSummaries)} />;
};

/**
 * Generate time series data from analysis summaries
 * This function summarizes the number of the label every 5 minutes
 * @param analysisSummaries
 */
const generateTimeSeriesData = (analysisSummaries: AnalysisSummaryType[]) => {
	if (!analysisSummaries.length) {
		return [];
	}

	// Create a map of dates to count sentiment types
	const dateMap = new Map<
		string,
		{ positive: number; neutral: number; negative: number }
	>();

	// Get the date range
	const timestamps = analysisSummaries
		.map((item) => new Date(item.timestamp))
		.filter((date) => isValid(date)); // Filter out invalid dates

	// If no valid timestamps, return empty array
	if (!timestamps.length) {
		return [];
	}

	const minDate = new Date(Math.min(...timestamps.map((t) => t.getTime())));
	const maxDate = new Date(Math.max(...timestamps.map((t) => t.getTime())));

	// Initialize all dates in the range
	// the data is 5 minutes interval
	let currentTime = minDate;
	while (currentTime <= maxDate) {
		const dateStr = format(currentTime, "yyyy-MM-dd hh:mm");
		dateMap.set(dateStr, { positive: 0, neutral: 0, negative: 0 });
		currentTime = addMinutes(currentTime, 5);
	}

	// Count sentiments by every 5 minutes
	analysisSummaries.forEach((item) => {
		try {
			const itemDate = new Date(item.timestamp);
			if (isValid(itemDate)) {
				const dateStr = format(itemDate, "yyyy-MM-dd hh:mm");
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

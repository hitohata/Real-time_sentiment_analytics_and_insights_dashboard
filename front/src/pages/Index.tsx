import React from "react";
import { useCallback, useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/atoms/card";
import {
	FilterState,
	FeedbackItem,
	SourceType,
	AnalysisSummaryType, TrendSuggestionsType,
} from "@/types/feedback";
import { FeedbackVolumeChart } from "../components/organisms/FeedbackVolumeChart";
import { SentimentBarChart } from "../components/organisms/SentimentBarChart";
import { RecentFeedback } from "../components/organisms/RecentFeedback";
import { ActionsTable } from "../components/organisms/ActionsTable";
import FilterSection from "@/components/molecules/FilterSection";
import { Alert } from "@/components/organisms/Alert"

const Dashboard = () => {
	// State management
	const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>([]);
	const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([]);
	const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
	const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] =
		useState<boolean>(true);
	const [alerts, setAlerts] = useState<string[]>(["hoge", "fuge", "piyo"]);
	const [filters, setFilters] = useState<FilterState>({
		timeRange: {
			start: null,
			end: null,
		},
		sources: ["app", "web", "email"],
		isCustomTimeRange: false,
	});

	const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummaryType[]>(
		[],
	);
	const [trendSuggestions, setTrendSuggestions] = useState<TrendSuggestionsType>({
		trend: "positive",
		suggestions: [
			{
				action: "action1",
				reason: "reason1"
			},
			{
				action: "action2",
				reason: "reason2"
			},
			{
				action: "action3",
				reason: "reason3"
			}
		]
	});

	// Initial data load
	useEffect(() => {
		loadData();
	}, []);

	// Apply filters whenever they change
	useEffect(() => {
		applyFilters();
	}, [allFeedback, filters]);

	// Loading and refreshing data
	const loadData = useCallback(() => {
		// setAllFeedback(generateMockFeedbackData(200));
		setLastRefreshTime(new Date());
	}, []);

	const handleRefresh = useCallback(() => {
		loadData();
	}, [loadData]);

	// Filter management
	const applyFilters = useCallback(() => {
		let filtered = [...allFeedback];

		// Apply time range filter
		if (filters.timeRange.start) {
			filtered = filtered.filter(
				(item) => new Date(item.timestamp) >= filters.timeRange.start!,
			);
		}

		if (filters.timeRange.end) {
			filtered = filtered.filter(
				(item) => new Date(item.timestamp) <= filters.timeRange.end!,
			);
		}

		// Apply source filter
		if (filters.sources.length < 3) {
			filtered = filtered.filter((item) =>
				filters.sources.includes(item.source),
			);
		}

		setFilteredFeedback(filtered);
	}, [allFeedback, filters]);

	const handleTimeChange = (timeRange: { start: Date | null; end: Date | null }) => {
		setFilters((prev) => ({
			...prev,
			timeRange,
		}))
	}

	// Source filter handler
	const handleSourceFilterChange = (sources: SourceType[]) => {
		setFilters((prev) => ({
			...prev,
			sources,
		}));
	}

	const handleDeleteAlert = (index: number) => {
		setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
	}

	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold">Sentiment Insight Dashboard</h1>
					<p className="text-muted-foreground">
						Monitor customer feedback and sentiment trends
					</p>
				</div>

			</div>

			<Alert alerts={alerts} onAlertDelete={handleDeleteAlert}/>

		  	<FilterSection
				filters={filters}
				onTimeChange={handleTimeChange}
				onSourceFilterChange={handleSourceFilterChange}
		  	/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle>Feedback Volume Over Time</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<FeedbackVolumeChart analysisSummaries={analysisSummary} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle>Sentiment by Source</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<SentimentBarChart analysisSummaries={analysisSummary} />
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Top 3 Suggested Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<ActionsTable trendSuggestions={trendSuggestions} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>Recent Feedback</CardTitle>
						<div className="text-sm text-muted-foreground">
							Showing 10 results
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<RecentFeedback analysisSummaries={ analysisSummary	} />
				</CardContent>
			</Card>
		</div>
	);
};

export default Dashboard;

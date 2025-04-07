import React, {useRef} from "react";
import { useCallback, useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/atoms/card";
import {
	FilterState,
	SourceType,
	AnalysisSummaryType, TrendSuggestionsType,
} from "@/types/feedback";
import { FeedbackVolumeChart } from "../components/organisms/FeedbackVolumeChart";
import { SentimentBarChart } from "../components/organisms/SentimentBarChart";
import { RecentFeedback } from "../components/organisms/RecentFeedback";
import { ActionsTable } from "../components/organisms/ActionsTable";
import FilterSection from "@/components/molecules/FilterSection";
import { Alert } from "@/components/organisms/Alert"
import {getFeedbackSummaries, getFeedbackTrend} from "../api/dashboard";

const Dashboard = () => {
	// State management
	const [alerts, setAlerts] = useState<string[]>([]);
	const [filters, setFilters] = useState<FilterState>({
		sources: ["app", "web", "email"],
	});
	const [summaryNextCallTimeoutId, setSummaryNextCallTimeoutId] = useState(null);
	const [trendNextCallTimeoutId, setTrendNextCallTimeoutId] = useState(null);

	const [timeRange, setTimeRange] = useState<{from: Date | null, to: Date | null}>({from: null, to: null});
	const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummaryType[]>([]);
	const [filteredAnalysisSummaries, setFilteredAnalysisSummaries] = useState<AnalysisSummaryType[]>([]);

	const [trendSuggestions, setTrendSuggestions] = useState<TrendSuggestionsType | null>(null);

	const socket = useRef(null);

	// Websocket
  	useEffect(() => {
      socket.current = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

      socket.current.onmessage = (event) => {
		  // add an alert to the list
          const data = JSON.parse(event.data);
		  console.log("websocket data", data)
		  setAlerts((prevAlerts) => [...prevAlerts, data.message]);
      };
      socket.current.onclose = () => {
          console.log('WebSocket connection closed');
      };
      return () => {
          if (socket.current) {
              socket.current.close();
          }
      };
  }, [])

	// Initial data load
	useEffect(() => {
		const initialCall = async () => {
			await Promise.all([loadData(), loadTrend()]);
			scheduleSummaryCall(10000);
			scheduleTrendCall(10000);
		}
		initialCall();
		return () => {
			if (summaryNextCallTimeoutId) {
				clearTimeout(summaryNextCallTimeoutId);
			}
			if (trendNextCallTimeoutId) {
				clearTimeout(trendNextCallTimeoutId);
			}
		}
	}, []);

	// Apply filters whenever they change
	useEffect(() => {
		applyFilters();
	}, [analysisSummary, filters]);

	// When the time is selected
	useEffect(() => {
		if (timeRange.from && timeRange.to) {
			getFeedbackSummaries(timeRange.from, timeRange.to).then((result) => {
				if (result.ok) {
					setAnalysisSummary(result.value);
				} else {
					console.error(result.err)
				}
			})
			getFeedbackTrend(timeRange.from, timeRange.to).then((result) => {
				if (result.ok) {
					setTrendSuggestions(result.value);
				} else {
					console.error(result.err)
				}
			})
		} else {
			loadData()
			loadTrend()
			scheduleSummaryCall(10000);
			scheduleTrendCall(10000);
		}
	}, [timeRange]);

	const scheduleSummaryCall = (delay: number) => {
		setSummaryNextCallTimeoutId(
			setTimeout(async () => {
				await loadData();
				scheduleSummaryCall(10000);
			}, delay)
		)
	}
	const scheduleTrendCall = (delay: number) => {
		setTrendNextCallTimeoutId(
			setTimeout(async () => {
				await loadTrend();
				scheduleTrendCall(10000);
			}, delay)
		)
	}

	// Loading and refreshing data
	const loadData = async () => {
		// if time is not set
		console.log("time range", timeRange)
		if (!(timeRange.from && timeRange.to)) {
			getFeedbackSummaries().then((result) => {
				if (result.ok) {
					setAnalysisSummary(result.value);
				} else {
					console.error(result.err)
				}
			})
		}
	}

	const loadTrend = async () => {
		// if time is not set
		if (!(timeRange.from && timeRange.to)) {
			getFeedbackTrend().then((result) => {
				if (result.ok) {
					setTrendSuggestions(result.value);
				} else {
					console.error(result.err)
				}
			})
		}
	}

	// Filter management
	const applyFilters = useCallback(() => {
		let filtered = [...analysisSummary];

		// Apply time range filter
		// Apply source filter
		if (filters.sources.length < 3) {
			filtered = filtered.filter((item) =>
				filters.sources.includes(item.feedbackSource),
			);
		}

		setFilteredAnalysisSummaries(filtered);
	}, [analysisSummary, filters]);

	const handleTimeChange = (timeRange: { start: Date | null; end: Date | null }) => {
		setTimeRange({
			from: timeRange.start,
			to: timeRange.end,
		})
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
				timeRange={timeRange}
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
						<FeedbackVolumeChart analysisSummaries={filteredAnalysisSummaries} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle>Sentiment by Source</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<SentimentBarChart analysisSummaries={filteredAnalysisSummaries} />
					</CardContent>
				</Card>
			</div>

			{ trendSuggestions && (
				<Card>
					<CardHeader>
						<CardTitle>Top 3 Suggested Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<ActionsTable trendSuggestions={trendSuggestions} />
					</CardContent>
				</Card>
			)}

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
					<RecentFeedback analysisSummaries={ filteredAnalysisSummaries } />
				</CardContent>
			</Card>
		</div>
	);
};

export default Dashboard;

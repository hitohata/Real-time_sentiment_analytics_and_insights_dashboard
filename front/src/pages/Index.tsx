import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/atoms/card";
import { Button } from "../components/atoms/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/atoms/tabs";
import TimeSeriesChart from "../components/molecules/TimeSeriesChart";
import SourceBreakdownChart from "../components/molecules/SourceBreakdownChart";
import FeedbackTable from "../components/molecules/FeedbackTable";
import SuggestedActions from "../components/molecules/SuggestedActions";
import { FilterState, FeedbackItem, SourceType } from "@/types/feedback";
import {
	generateMockFeedbackData,
	generateSourceBreakdownData,
	generateSuggestedActions,
	generateTimeSeriesData,
} from "@/utils/mockData";
import TimeRangeSelector from "../components/molecules/TimeRangeSelector";
import SourceFilter from "../components/molecules/SourceFilter";
import RefreshIndicator from "../components/molecules/RefreshIndicator";
import { ChartBar, ChartPie } from "lucide-react";
import { subDays } from "date-fns";

const Dashboard = () => {
	// State management
	const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>([]);
	const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([]);
	const [chartView, setChartView] = useState<"bar" | "pie">("bar");
	const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
	const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] =
		useState<boolean>(true);
	const [filters, setFilters] = useState<FilterState>({
		timeRange: {
			start: subDays(new Date(), 30),
			end: null,
		},
		sources: ["App", "Web", "Email"],
		isCustomTimeRange: false,
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
		setAllFeedback(generateMockFeedbackData(200));
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

	// Time range filter handlers
	const handleTimePresetSelected = useCallback((preset: string) => {
		setIsAutoRefreshEnabled(preset !== "custom");

		if (preset === "all") {
			setFilters((prev) => ({
				...prev,
				timeRange: { start: null, end: null },
				isCustomTimeRange: false,
			}));
		} else if (preset === "30days") {
			setFilters((prev) => ({
				...prev,
				timeRange: { start: subDays(new Date(), 30), end: null },
				isCustomTimeRange: false,
			}));
		} else if (preset === "custom") {
			setFilters((prev) => ({
				...prev,
				isCustomTimeRange: true,
			}));
		}
	}, []);

	const handleStartDateChange = useCallback((date: Date | null) => {
		setFilters((prev) => ({
			...prev,
			timeRange: { ...prev.timeRange, start: date },
		}));
	}, []);

	const handleEndDateChange = useCallback((date: Date | null) => {
		setFilters((prev) => ({
			...prev,
			timeRange: { ...prev.timeRange, end: date },
		}));
	}, []);

	// Source filter handler
	const handleSourceFilterChange = useCallback((sources: SourceType[]) => {
		setFilters((prev) => ({
			...prev,
			sources,
		}));
	}, []);

	// Calculate data for charts
	const timeSeriesData = generateTimeSeriesData(filteredFeedback);
	const sourceBreakdownData = generateSourceBreakdownData(filteredFeedback);
	const suggestedActions = generateSuggestedActions(filteredFeedback);

	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold">Sentiment Insight Dashboard</h1>
					<p className="text-muted-foreground">
						Monitor customer feedback and sentiment trends
					</p>
				</div>

				<RefreshIndicator
					isAutoRefreshEnabled={isAutoRefreshEnabled}
					lastRefreshTime={lastRefreshTime}
					onRefreshClick={handleRefresh}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle>Feedback Volume Over Time</CardTitle>
							<TimeRangeSelector
								startDate={filters.timeRange.start}
								endDate={filters.timeRange.end}
								onStartDateChange={handleStartDateChange}
								onEndDateChange={handleEndDateChange}
								onPresetSelected={handleTimePresetSelected}
								isCustomRange={filters.isCustomTimeRange}
							/>
						</div>
					</CardHeader>
					<CardContent>
						<TimeSeriesChart data={timeSeriesData} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle>Sentiment by Source</CardTitle>

							<div className="flex items-center">
								<SourceFilter
									selectedSources={filters.sources}
									onSelectionChange={handleSourceFilterChange}
									className="mr-2"
								/>

								<Tabs
									value={chartView}
									onValueChange={(v) => setChartView(v as "bar" | "pie")}
								>
									<TabsList className="grid w-20 grid-cols-2">
										<TabsTrigger value="bar">
											<ChartBar className="h-4 w-4" />
										</TabsTrigger>
										<TabsTrigger value="pie">
											<ChartPie className="h-4 w-4" />
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<SourceBreakdownChart data={sourceBreakdownData} />
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Top 3 Suggested Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<SuggestedActions actions={suggestedActions} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>Recent Feedback</CardTitle>
						<div className="text-sm text-muted-foreground">
							Showing {filteredFeedback.length} results
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<FeedbackTable data={filteredFeedback.slice(0, 10)} />
				</CardContent>
			</Card>
		</div>
	);
};

export default Dashboard;

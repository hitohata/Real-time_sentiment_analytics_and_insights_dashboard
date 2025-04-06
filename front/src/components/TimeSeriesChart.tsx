import { useCallback, useMemo } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { TimeSeriesDataPoint } from "@/types/feedback";
import { format, isValid, parseISO } from "date-fns";

interface TimeSeriesChartProps {
	data: TimeSeriesDataPoint[];
	className?: string;
}

const TimeSeriesChart = ({ data, className }: TimeSeriesChartProps) => {
	const formattedData = useMemo(() => {
		return data.map((point) => {
			const parsedDate = parseISO(point.date);
			return {
				...point,
				formattedDate: isValid(parsedDate)
					? format(parsedDate, "MMM dd")
					: "Invalid date",
			};
		});
	}, [data]);

	const CustomTooltip = useCallback(({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			// Safely parse and format the date
			let formattedDate = "Invalid date";
			try {
				const parsedDate = parseISO(label);
				if (isValid(parsedDate)) {
					formattedDate = format(parsedDate, "MMM dd, yyyy");
				}
			} catch (error) {
				console.error("Error parsing date:", error);
			}

			return (
				<div className="bg-white p-3 border border-gray-200 rounded shadow-md text-sm">
					<p className="font-medium mb-1">{formattedDate}</p>
					{payload.map((entry: any, index: number) => (
						<div key={index} className="flex items-center gap-2">
							<div
								className="h-3 w-3 rounded-full"
								style={{ backgroundColor: entry.color }}
							/>
							<span className="capitalize">{entry.name}:</span>
							<span className="font-medium">{entry.value}</span>
						</div>
					))}
				</div>
			);
		}
		return null;
	}, []);

	return (
		<div className={className}>
			<ResponsiveContainer width="100%" height={300}>
				<AreaChart
					data={formattedData}
					margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
				>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis
						dataKey="formattedDate"
						stroke="#6b7280"
						tick={{ fill: "#6b7280", fontSize: 12 }}
					/>
					<YAxis
						stroke="#6b7280"
						tick={{ fill: "#6b7280", fontSize: 12 }}
						allowDecimals={false}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Legend />
					<Area
						type="monotone"
						dataKey="positive"
						stackId="1"
						stroke="#4ade80"
						fill="#4ade80"
						fillOpacity={0.6}
						name="Positive"
					/>
					<Area
						type="monotone"
						dataKey="neutral"
						stackId="1"
						stroke="#94a3b8"
						fill="#94a3b8"
						fillOpacity={0.6}
						name="Neutral"
					/>
					<Area
						type="monotone"
						dataKey="negative"
						stackId="1"
						stroke="#f87171"
						fill="#f87171"
						fillOpacity={0.6}
						name="Negative"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default TimeSeriesChart;

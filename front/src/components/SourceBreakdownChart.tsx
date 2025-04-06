import { useCallback } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { SourceBreakdownItem } from "@/types/feedback";

interface SourceBreakdownChartProps {
	data: SourceBreakdownItem[];
	className?: string;
}

const SourceBreakdownChart = ({
	data,
	className,
}: SourceBreakdownChartProps) => {
	const CustomTooltip = useCallback(({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border border-gray-200 rounded shadow-md text-sm">
					<p className="font-medium mb-1">Source: {label}</p>
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
				<BarChart
					data={data}
					margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
				>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis
						dataKey="source"
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
					<Bar dataKey="positive" stackId="a" fill="#4ade80" name="Positive" />
					<Bar dataKey="neutral" stackId="a" fill="#94a3b8" name="Neutral" />
					<Bar dataKey="negative" stackId="a" fill="#f87171" name="Negative" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default SourceBreakdownChart;

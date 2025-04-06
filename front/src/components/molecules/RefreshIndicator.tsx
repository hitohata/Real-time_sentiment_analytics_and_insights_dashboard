import { useEffect, useState } from "react";
import { Button } from "../atoms/button";
import { RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

interface RefreshIndicatorProps {
	isAutoRefreshEnabled: boolean;
	lastRefreshTime: Date;
	onRefreshClick: () => void;
	className?: string;
}

const RefreshIndicator = ({
	isAutoRefreshEnabled,
	lastRefreshTime,
	onRefreshClick,
	className,
}: RefreshIndicatorProps) => {
	const [countdown, setCountdown] = useState(10);

	useEffect(() => {
		if (!isAutoRefreshEnabled) {
			return;
		}

		const interval = setInterval(() => {
			setCountdown((prev) => {
				if (prev === 1) {
					onRefreshClick();
					return 10;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isAutoRefreshEnabled, onRefreshClick]);

	return (
		<div
			className={cn(
				"flex items-center text-sm text-muted-foreground gap-2",
				className,
			)}
		>
			<Button
				variant="ghost"
				size="sm"
				className="h-8 gap-1"
				onClick={onRefreshClick}
			>
				<RefreshCw
					className={cn("h-4 w-4", isAutoRefreshEnabled && "animate-spin")}
				/>
				<span>Refresh</span>
			</Button>

			<div className="text-xs">
				{isAutoRefreshEnabled ? (
					<div className="flex items-center gap-1">
						<span>Auto refreshing in</span>
						<span className="font-medium">{countdown}s</span>
					</div>
				) : (
					<div>
						<span className="opacity-70">Auto refresh paused</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default RefreshIndicator;

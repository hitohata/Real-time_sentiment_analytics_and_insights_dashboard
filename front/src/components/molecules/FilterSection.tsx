
import React, { useState } from "react";
import { Card, CardContent } from "@/components/atoms/card";
import TimeRangeSelector from "@/components/molecules/TimeRangeSelector";
import SourceFilter from "@/components/molecules/SourceFilter";
import { FilterState, SourceType } from "@/types/feedback";
import { Button } from "@/components/atoms/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface FilterSectionProps {
  filters: FilterState;
  onTimeChange: (timeRange: { start: Date | null; end: Date | null }) => void;
  onSourceFilterChange: (sources: SourceType[]) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onTimeChange,
  onSourceFilterChange,
}) => {
  // Local state to track filter changes before applying
  const [localTimeRange, setLocalTimeRange] = useState({
    start: filters.timeRange.start,
    end: filters.timeRange.end,
  });

  // Handle local changes
  const handleLocalStartDateChange = (date: Date | null) => {
    setLocalTimeRange(prev => ({ ...prev, start: date }));
  };

  const handleLocalEndDateChange = (date: Date | null) => {
    setLocalTimeRange(prev => ({ ...prev, end: date }));
  };

  const handleLocalResetTimeRange = () => {
    setLocalTimeRange({ start: null, end: null });
    onTimeChange({ start: null, end: null });
  };

  // Apply time range filters with validation
  const handleApplyTimeRange = () => {

    // Check if time range is valid
    if (localTimeRange.start && localTimeRange.end && localTimeRange.start >= localTimeRange.end) {
      toast.error("Start date must be before end date");
      return;
    }

    if (localTimeRange.start && localTimeRange.end) {
      // Apply time range filters
      onTimeChange(localTimeRange);

      toast.success("Time range applied successfully")
      return;
    }

    if (!localTimeRange.start && !localTimeRange.end) {
      // reset time range
      onTimeChange({ start: null, end: null });

      toast.success("Time range reset successfully")
      return;
    }

    // Validate that both dates are provided or none
    toast.error("Please select both start and end dates, or neither");
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Time Range</h3>
            <TimeRangeSelector
              startDate={localTimeRange.start}
              endDate={localTimeRange.end}
              onStartDateChange={handleLocalStartDateChange}
              onEndDateChange={handleLocalEndDateChange}
            />

            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mt-4">
              <div className="mt-4">
                <Button
                  onClick={handleApplyTimeRange}
                  className="w-24"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Apply
                </Button>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handleLocalResetTimeRange}
                  className="w-24"
                >
                  Reset
                </Button>
              </div>
              </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Source Filter</h3>
            <SourceFilter
              filters={filters}
              onSelectionChange={onSourceFilterChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;

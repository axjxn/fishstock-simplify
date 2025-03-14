
import { cn } from "@/lib/utils";
import { StockStatus, getStockStatus } from "@/utils/stockUtils";
import { Circle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BatchIndicatorProps {
  ageInDays: number;
  showLabel?: boolean;
  className?: string;
}

const BatchIndicator = ({ ageInDays, showLabel = false, className }: BatchIndicatorProps) => {
  const status = getStockStatus(ageInDays);
  
  const statusConfig = {
    [StockStatus.FRESH]: {
      color: "text-fresh",
      label: "Fresh",
      description: "0-1 days old"
    },
    [StockStatus.MODERATE]: {
      color: "text-moderate",
      label: "Moderate",
      description: "2 days old"
    },
    [StockStatus.URGENT]: {
      color: "text-urgent",
      label: "Urgent Sale",
      description: "3+ days old"
    }
  };
  
  const { color, label, description } = statusConfig[status];
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center", className)}>
            <Circle className={cn("h-3 w-3 fill-current", color)} />
            {showLabel && (
              <span className={cn("ml-1.5 text-xs font-medium", color)}>
                {label}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}: {description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BatchIndicator;

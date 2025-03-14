
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const DashboardCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: DashboardCardProps) => {
  return (
    <div className={cn("neo-card p-6 transition-all duration-300 animate-scale-in", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="section-title mb-1">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
          
          {trend && (
            <p className={cn(
              "text-xs font-medium flex items-center mt-1",
              trend.isPositive ? "text-fresh" : "text-urgent"
            )}>
              <span className={cn(
                "inline-block mr-1",
                trend.isPositive ? "transform rotate-45" : "transform -rotate-45"
              )}>→</span>
              {trend.isPositive ? "+" : "-"}{trend.value}% from previous
            </p>
          )}
          
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;

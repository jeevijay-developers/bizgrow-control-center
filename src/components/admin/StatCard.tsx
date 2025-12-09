import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'destructive';
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = 'default',
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const iconBgClass = {
    default: 'bg-primary/10 text-primary',
    accent: 'bg-accent text-accent-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : isNegative ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : null}
              <span
                className={cn(
                  'font-medium',
                  isPositive && 'text-success',
                  isNegative && 'text-destructive'
                )}
              >
                {isPositive && '+'}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-muted-foreground">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center', iconBgClass[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

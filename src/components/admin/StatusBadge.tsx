import { cn } from '@/lib/utils';

type StatusType = 
  | 'active' | 'inactive' | 'suspended' | 'onboarding'
  | 'pending' | 'approved' | 'rejected'
  | 'queued' | 'sent' | 'delivered' | 'failed' | 'read'
  | 'draft' | 'paid' | 'overdue' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: { label: 'Active', className: 'badge-success' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground' },
  suspended: { label: 'Suspended', className: 'badge-destructive' },
  onboarding: { label: 'Onboarding', className: 'badge-accent' },
  pending: { label: 'Pending', className: 'badge-accent' },
  approved: { label: 'Approved', className: 'badge-success' },
  rejected: { label: 'Rejected', className: 'badge-destructive' },
  queued: { label: 'Queued', className: 'bg-muted text-muted-foreground' },
  sent: { label: 'Sent', className: 'badge-primary' },
  delivered: { label: 'Delivered', className: 'badge-success' },
  failed: { label: 'Failed', className: 'badge-destructive' },
  read: { label: 'Read', className: 'badge-success' },
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  paid: { label: 'Paid', className: 'badge-success' },
  overdue: { label: 'Overdue', className: 'badge-destructive' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };
  
  return (
    <span className={cn('inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium', config.className, className)}>
      {config.label}
    </span>
  );
}

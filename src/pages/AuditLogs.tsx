import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FilterBar, ExportButton } from '@/components/admin/FilterBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AuditLog } from '@/types/admin';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Eye } from 'lucide-react';

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    tenant_id: 't1',
    tenant_name: 'Acme Corp',
    user_id: 'u1',
    user_email: 'admin@bizgrow360.com',
    action: 'IMPERSONATE_START',
    resource_type: 'tenant',
    resource_id: 't1',
    details: { reason: 'Support ticket #1234' },
    ip_address: '103.45.67.89',
    created_at: '2024-12-09T10:30:00Z',
  },
  {
    id: '2',
    tenant_id: undefined,
    tenant_name: undefined,
    user_id: 'u2',
    user_email: 'support@bizgrow360.com',
    action: 'USER_CREATED',
    resource_type: 'user',
    resource_id: 'u5',
    details: { role: 'SUPPORT', name: 'New Support Agent' },
    ip_address: '192.168.1.100',
    created_at: '2024-12-09T09:15:00Z',
  },
  {
    id: '3',
    tenant_id: 't2',
    tenant_name: 'TechStart Inc',
    user_id: 'u1',
    user_email: 'admin@bizgrow360.com',
    action: 'PLAN_UPDATED',
    resource_type: 'tenant',
    resource_id: 't2',
    details: { old_plan: 'starter', new_plan: 'growth' },
    ip_address: '103.45.67.89',
    created_at: '2024-12-08T16:45:00Z',
  },
  {
    id: '4',
    tenant_id: 't1',
    tenant_name: 'Acme Corp',
    user_id: 'u3',
    user_email: 'finance@bizgrow360.com',
    action: 'INVOICE_SENT',
    resource_type: 'invoice',
    resource_id: 'INV-2024-001234',
    details: { amount: 125000, recipient: 'billing@acme.com' },
    ip_address: '192.168.1.105',
    created_at: '2024-12-08T14:20:00Z',
  },
  {
    id: '5',
    tenant_id: 't3',
    tenant_name: 'Global Retail',
    user_id: 'u1',
    user_email: 'admin@bizgrow360.com',
    action: 'TEMPLATE_APPROVED',
    resource_type: 'template',
    resource_id: 'tpl_shipping_update',
    details: { category: 'UTILITY' },
    ip_address: '103.45.67.89',
    created_at: '2024-12-08T11:00:00Z',
  },
];

const actionColors: Record<string, string> = {
  IMPERSONATE_START: 'badge-accent',
  IMPERSONATE_END: 'badge-accent',
  USER_CREATED: 'badge-success',
  USER_DELETED: 'badge-destructive',
  PLAN_UPDATED: 'badge-primary',
  INVOICE_SENT: 'bg-muted text-muted-foreground',
  TEMPLATE_APPROVED: 'badge-success',
  TEMPLATE_REJECTED: 'badge-destructive',
};

export function AuditLogs() {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const columns: Column<AuditLog>[] = [
    {
      key: 'created_at',
      header: 'Timestamp',
      sortable: true,
      cell: (row) => (
        <span className="text-sm tabular-nums">
          {format(new Date(row.created_at), 'MMM d, yyyy h:mm:ss a')}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      cell: (row) => (
        <Badge className={actionColors[row.action] || 'bg-muted text-muted-foreground'}>
          {row.action.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'user_email',
      header: 'User',
      cell: (row) => (
        <span className="text-sm">{row.user_email}</span>
      ),
    },
    {
      key: 'tenant_name',
      header: 'Tenant',
      cell: (row) => (
        row.tenant_name ? (
          <span className="text-sm">{row.tenant_name}</span>
        ) : (
          <span className="text-muted-foreground text-sm">Platform</span>
        )
      ),
    },
    {
      key: 'resource',
      header: 'Resource',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-sm capitalize">{row.resource_type}</span>
          <span className="text-xs text-muted-foreground font-mono">{row.resource_id}</span>
        </div>
      ),
    },
    {
      key: 'ip_address',
      header: 'IP Address',
      cell: (row) => (
        <span className="font-mono text-sm text-muted-foreground">{row.ip_address}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => (
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => setSelectedLog(row)}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      ),
    },
  ];

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.user_email.toLowerCase().includes(searchValue.toLowerCase()) ||
      log.action.toLowerCase().includes(searchValue.toLowerCase()) ||
      (log.tenant_name?.toLowerCase().includes(searchValue.toLowerCase()) ?? false);
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const uniqueActions = [...new Set(mockAuditLogs.map((log) => log.action))];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Track all platform activities and changes</p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search logs..."
        filters={[
          {
            key: 'action',
            label: 'Action',
            options: uniqueActions.map((action) => ({
              value: action,
              label: action.replace(/_/g, ' '),
            })),
            value: actionFilter,
            onChange: setActionFilter,
          },
        ]}
        hasActiveFilters={searchValue !== '' || actionFilter !== 'all'}
        onClearFilters={() => {
          setSearchValue('');
          setActionFilter('all');
        }}
        actions={
          <ExportButton onClick={() => toast({ title: 'Exporting audit logs...' })} />
        }
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        totalCount={filteredLogs.length}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        emptyMessage="No audit logs found."
      />

      {/* Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Timestamp:</span>
                  <p className="font-medium">
                    {format(new Date(selectedLog.created_at), 'PPpp')}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Action:</span>
                  <p>
                    <Badge className={actionColors[selectedLog.action]}>
                      {selectedLog.action.replace(/_/g, ' ')}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">User:</span>
                  <p className="font-medium">{selectedLog.user_email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">IP Address:</span>
                  <p className="font-mono">{selectedLog.ip_address}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Resource Type:</span>
                  <p className="font-medium capitalize">{selectedLog.resource_type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Resource ID:</span>
                  <p className="font-mono">{selectedLog.resource_id}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Details:</span>
                <pre className="mt-2 bg-muted/50 border border-border p-4 text-sm font-mono overflow-auto max-h-48">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AuditLogs;

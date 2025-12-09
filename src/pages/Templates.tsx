import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FilterBar } from '@/components/admin/FilterBar';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Check, X, Send } from 'lucide-react';
import { WhatsAppTemplate } from '@/types/admin';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const mockTemplates: WhatsAppTemplate[] = [
  {
    id: '1',
    tenant_id: 't1',
    tenant_name: 'Acme Corp',
    name: 'order_confirmation',
    category: 'UTILITY',
    language: 'en',
    status: 'approved',
    provider: 'gupshup',
    variables: ['order_id', 'customer_name', 'total_amount'],
    created_at: '2024-11-15T10:00:00Z',
  },
  {
    id: '2',
    tenant_id: 't2',
    tenant_name: 'TechStart Inc',
    name: 'payment_reminder',
    category: 'UTILITY',
    language: 'en',
    status: 'pending',
    provider: 'twilio',
    variables: ['invoice_number', 'due_date', 'amount'],
    created_at: '2024-12-01T14:30:00Z',
  },
  {
    id: '3',
    tenant_id: 't1',
    tenant_name: 'Acme Corp',
    name: 'promo_discount',
    category: 'MARKETING',
    language: 'en',
    status: 'rejected',
    provider: 'gupshup',
    variables: ['discount_code', 'expiry_date'],
    created_at: '2024-11-28T09:15:00Z',
  },
  {
    id: '4',
    tenant_id: 't3',
    tenant_name: 'Global Retail',
    name: 'shipping_update',
    category: 'UTILITY',
    language: 'en',
    status: 'pending',
    provider: 'msg91',
    variables: ['tracking_number', 'delivery_date'],
    created_at: '2024-12-05T16:45:00Z',
  },
];

export function Templates() {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);

  const columns: Column<WhatsAppTemplate>[] = [
    {
      key: 'name',
      header: 'Template',
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium font-mono text-sm">{row.name}</span>
          <span className="text-sm text-muted-foreground">{row.tenant_name}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: (row) => (
        <Badge variant="outline">{row.category}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'provider',
      header: 'Provider',
      cell: (row) => (
        <span className="text-sm capitalize">{row.provider}</span>
      ),
    },
    {
      key: 'variables',
      header: 'Variables',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.variables.slice(0, 2).map((v) => (
            <Badge key={v} variant="secondary" className="text-xs font-mono">
              {`{{${v}}}`}
            </Badge>
          ))}
          {row.variables.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{row.variables.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      cell: (row) => (
        <span className="text-muted-foreground">
          {format(new Date(row.created_at), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedTemplate(row)}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            {row.status === 'pending' && (
              <>
                <DropdownMenuItem onClick={() => toast({ title: 'Template approved' })}>
                  <Check className="mr-2 h-4 w-4 text-success" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: 'Template rejected' })}>
                  <X className="mr-2 h-4 w-4 text-destructive" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {row.status === 'approved' && (
              <DropdownMenuItem onClick={() => toast({ title: 'Test message sent' })}>
                <Send className="mr-2 h-4 w-4" />
                Send Test
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      template.tenant_name.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockTemplates.filter((t) => t.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">WhatsApp Templates</h1>
          <p className="text-muted-foreground">Manage and approve message templates</p>
        </div>
        {pendingCount > 0 && (
          <Badge className="badge-accent">
            {pendingCount} pending approval
          </Badge>
        )}
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search templates..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        hasActiveFilters={searchValue !== '' || statusFilter !== 'all'}
        onClearFilters={() => {
          setSearchValue('');
          setStatusFilter('all');
        }}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredTemplates}
        totalCount={filteredTemplates.length}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        emptyMessage="No templates found."
      />

      {/* Template Preview Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-mono">{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Template preview for {selectedTemplate?.tenant_name}
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-medium">{selectedTemplate.category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Provider:</span>
                  <p className="font-medium capitalize">{selectedTemplate.provider}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Language:</span>
                  <p className="font-medium uppercase">{selectedTemplate.language}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p><StatusBadge status={selectedTemplate.status} /></p>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Variables:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((v) => (
                    <Badge key={v} variant="outline" className="font-mono">
                      {`{{${v}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="bg-muted/50 border border-border p-4">
                <p className="text-sm text-muted-foreground mb-2">Message Preview:</p>
                <p className="text-sm">
                  Hello <span className="bg-accent px-1">{`{{customer_name}}`}</span>, your order{' '}
                  <span className="bg-accent px-1">{`{{order_id}}`}</span> has been confirmed.
                  Total: <span className="bg-accent px-1">{`{{total_amount}}`}</span>
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Close
            </Button>
            {selectedTemplate?.status === 'pending' && (
              <>
                <Button variant="destructive" onClick={() => {
                  toast({ title: 'Template rejected' });
                  setSelectedTemplate(null);
                }}>
                  Reject
                </Button>
                <Button onClick={() => {
                  toast({ title: 'Template approved' });
                  setSelectedTemplate(null);
                }}>
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Templates;

import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FilterBar, ExportButton } from '@/components/admin/FilterBar';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, RefreshCw, Download } from 'lucide-react';
import { Invoice } from '@/types/admin';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const mockInvoices: Invoice[] = [
  {
    id: '1',
    tenant_id: 't1',
    tenant_name: 'Acme Corp',
    invoice_number: 'INV-2024-001234',
    amount: 125000,
    currency: 'INR',
    status: 'paid',
    razorpay_order_id: 'order_PqR123456789',
    created_at: '2024-12-01T10:00:00Z',
    due_date: '2024-12-15T23:59:59Z',
  },
  {
    id: '2',
    tenant_id: 't2',
    tenant_name: 'TechStart Inc',
    invoice_number: 'INV-2024-001235',
    amount: 45000,
    currency: 'INR',
    status: 'sent',
    razorpay_order_id: 'order_AbC987654321',
    created_at: '2024-12-05T14:30:00Z',
    due_date: '2024-12-20T23:59:59Z',
  },
  {
    id: '3',
    tenant_id: 't3',
    tenant_name: 'Global Retail',
    invoice_number: 'INV-2024-001236',
    amount: 340000,
    currency: 'INR',
    status: 'overdue',
    razorpay_order_id: 'order_XyZ456789012',
    created_at: '2024-11-15T09:00:00Z',
    due_date: '2024-11-30T23:59:59Z',
  },
  {
    id: '4',
    tenant_id: 't4',
    tenant_name: 'LocalBiz Store',
    invoice_number: 'INV-2024-001237',
    amount: 15000,
    currency: 'INR',
    status: 'draft',
    created_at: '2024-12-08T16:45:00Z',
    due_date: '2024-12-23T23:59:59Z',
  },
];

export function Invoices() {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns: Column<Invoice>[] = [
    {
      key: 'invoice_number',
      header: 'Invoice',
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium font-mono text-sm">{row.invoice_number}</span>
          <span className="text-sm text-muted-foreground">{row.tenant_name}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      className: 'text-right',
      cell: (row) => (
        <span className="font-medium tabular-nums">
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'razorpay_order_id',
      header: 'Razorpay ID',
      cell: (row) => (
        row.razorpay_order_id ? (
          <span className="font-mono text-xs text-muted-foreground">
            {row.razorpay_order_id}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
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
      key: 'due_date',
      header: 'Due Date',
      sortable: true,
      cell: (row) => (
        <span className={row.status === 'overdue' ? 'text-destructive font-medium' : 'text-muted-foreground'}>
          {format(new Date(row.due_date), 'MMM d, yyyy')}
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
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </DropdownMenuItem>
            {row.razorpay_order_id && (
              <DropdownMenuItem onClick={() => toast({ title: 'Querying Razorpay status...' })}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-query Razorpay
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchValue.toLowerCase()) ||
      invoice.tenant_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (invoice.razorpay_order_id?.toLowerCase().includes(searchValue.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = filteredInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">Platform-wide invoice management</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Invoiced</p>
          <p className="text-2xl font-semibold tabular-nums">₹{totalAmount.toLocaleString()}</p>
        </div>
        <div className="border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Collected</p>
          <p className="text-2xl font-semibold tabular-nums text-success">₹{paidAmount.toLocaleString()}</p>
        </div>
        <div className="border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Outstanding</p>
          <p className="text-2xl font-semibold tabular-nums text-destructive">
            ₹{(totalAmount - paidAmount).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search invoices or Razorpay ID..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'draft', label: 'Draft' },
              { value: 'sent', label: 'Sent' },
              { value: 'paid', label: 'Paid' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'cancelled', label: 'Cancelled' },
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
        actions={
          <ExportButton onClick={() => toast({ title: 'Exporting invoices to CSV...' })} />
        }
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredInvoices}
        totalCount={filteredInvoices.length}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        emptyMessage="No invoices found."
      />
    </div>
  );
}

export default Invoices;

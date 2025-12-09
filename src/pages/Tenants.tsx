import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FilterBar, ExportButton, AddButton } from '@/components/admin/FilterBar';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, UserCog, Settings, Ban } from 'lucide-react';
import { Tenant, TenantStatus, TenantPlan } from '@/types/admin';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

// Mock data
const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    plan: 'enterprise',
    status: 'active',
    owner_email: 'admin@acme.com',
    whatsapp_configured: true,
    razorpay_configured: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-12-01T14:20:00Z',
    product_count: 1247,
    user_count: 45,
    monthly_revenue: 125000,
  },
  {
    id: '2',
    name: 'TechStart Inc',
    slug: 'techstart',
    plan: 'growth',
    status: 'active',
    owner_email: 'ceo@techstart.io',
    whatsapp_configured: true,
    razorpay_configured: false,
    created_at: '2024-03-22T08:15:00Z',
    updated_at: '2024-11-28T09:45:00Z',
    product_count: 342,
    user_count: 12,
    monthly_revenue: 45000,
  },
  {
    id: '3',
    name: 'Global Retail Ltd',
    slug: 'global-retail',
    plan: 'enterprise',
    status: 'active',
    owner_email: 'ops@globalretail.com',
    whatsapp_configured: true,
    razorpay_configured: true,
    created_at: '2023-11-05T14:00:00Z',
    updated_at: '2024-12-02T11:30:00Z',
    product_count: 5621,
    user_count: 89,
    monthly_revenue: 340000,
  },
  {
    id: '4',
    name: 'LocalBiz Store',
    slug: 'localbiz',
    plan: 'starter',
    status: 'onboarding',
    owner_email: 'owner@localbiz.in',
    whatsapp_configured: false,
    razorpay_configured: false,
    created_at: '2024-12-01T16:45:00Z',
    updated_at: '2024-12-01T16:45:00Z',
    product_count: 0,
    user_count: 1,
    monthly_revenue: 0,
  },
  {
    id: '5',
    name: 'MegaMart',
    slug: 'megamart',
    plan: 'enterprise',
    status: 'suspended',
    owner_email: 'it@megamart.com',
    whatsapp_configured: true,
    razorpay_configured: true,
    created_at: '2023-06-12T09:30:00Z',
    updated_at: '2024-11-15T10:00:00Z',
    product_count: 8934,
    user_count: 156,
    monthly_revenue: 0,
  },
];

const planColors: Record<TenantPlan, string> = {
  free: 'bg-muted text-muted-foreground',
  starter: 'bg-primary/10 text-primary',
  growth: 'badge-primary',
  enterprise: 'badge-accent',
};

export function Tenants() {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleImpersonate = (tenant: Tenant) => {
    toast({
      title: 'Impersonation Started',
      description: `You are now viewing as ${tenant.name} (read-only mode)`,
    });
  };

  const columns: Column<Tenant>[] = [
    {
      key: 'name',
      header: 'Tenant',
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-sm text-muted-foreground">{row.slug}</span>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      sortable: true,
      cell: (row) => (
        <Badge className={planColors[row.plan]}>
          {row.plan.charAt(0).toUpperCase() + row.plan.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'integrations',
      header: 'Integrations',
      cell: (row) => (
        <div className="flex gap-2">
          {row.whatsapp_configured && (
            <Badge variant="outline" className="text-xs">WhatsApp</Badge>
          )}
          {row.razorpay_configured && (
            <Badge variant="outline" className="text-xs">Razorpay</Badge>
          )}
          {!row.whatsapp_configured && !row.razorpay_configured && (
            <span className="text-muted-foreground text-sm">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'users',
      header: 'Users',
      sortable: true,
      className: 'text-right',
      cell: (row) => <span className="tabular-nums">{row.user_count}</span>,
    },
    {
      key: 'products',
      header: 'Products',
      sortable: true,
      className: 'text-right',
      cell: (row) => <span className="tabular-nums">{row.product_count.toLocaleString()}</span>,
    },
    {
      key: 'revenue',
      header: 'MRR',
      sortable: true,
      className: 'text-right',
      cell: (row) => (
        <span className="tabular-nums font-medium">
          ₹{row.monthly_revenue.toLocaleString()}
        </span>
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
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleImpersonate(row)}>
              <UserCog className="mr-2 h-4 w-4" />
              Impersonate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Ban className="mr-2 h-4 w-4" />
              Suspend Tenant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      tenant.slug.toLowerCase().includes(searchValue.toLowerCase()) ||
      tenant.owner_email.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    const matchesPlan = planFilter === 'all' || tenant.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const hasActiveFilters = searchValue !== '' || statusFilter !== 'all' || planFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">Manage all platform tenants</p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search tenants..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'suspended', label: 'Suspended' },
              { value: 'onboarding', label: 'Onboarding' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            key: 'plan',
            label: 'Plan',
            options: [
              { value: 'free', label: 'Free' },
              { value: 'starter', label: 'Starter' },
              { value: 'growth', label: 'Growth' },
              { value: 'enterprise', label: 'Enterprise' },
            ],
            value: planFilter,
            onChange: setPlanFilter,
          },
        ]}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => {
          setSearchValue('');
          setStatusFilter('all');
          setPlanFilter('all');
        }}
        actions={
          <>
            <ExportButton onClick={() => toast({ title: 'Exporting tenants...' })} />
            <AddButton onClick={() => toast({ title: 'Open onboarding wizard' })} label="Add Tenant" />
          </>
        }
      />

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-4 bg-muted/50 border border-border p-3">
          <span className="text-sm font-medium">
            {selectedRows.length} selected
          </span>
          <Button variant="outline" size="sm">
            Export Selected
          </Button>
          <Button variant="outline" size="sm">
            Update Plan
          </Button>
          <Button variant="destructive" size="sm">
            Suspend Selected
          </Button>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredTenants}
        totalCount={filteredTenants.length}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        emptyMessage="No tenants found matching your criteria."
      />
    </div>
  );
}

export default Tenants;

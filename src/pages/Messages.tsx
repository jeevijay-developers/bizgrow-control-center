import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FilterBar } from '@/components/admin/FilterBar';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { QueuedMessage } from '@/types/admin';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const mockMessages: QueuedMessage[] = [
  {
    id: '1',
    tenant_id: 't1',
    tenant_name: 'Acme Corp',
    recipient: '+919876543210',
    template_name: 'order_confirmation',
    status: 'delivered',
    retry_count: 0,
    created_at: '2024-12-09T10:15:00Z',
    sent_at: '2024-12-09T10:15:02Z',
  },
  {
    id: '2',
    tenant_id: 't2',
    tenant_name: 'TechStart Inc',
    recipient: '+919123456789',
    template_name: 'payment_reminder',
    status: 'failed',
    retry_count: 3,
    error_message: 'Recipient not on WhatsApp',
    created_at: '2024-12-09T09:45:00Z',
  },
  {
    id: '3',
    tenant_id: 't1',
    tenant_name: 'Acme Corp',
    recipient: '+919555444333',
    template_name: 'shipping_update',
    status: 'queued',
    retry_count: 0,
    created_at: '2024-12-09T10:20:00Z',
  },
  {
    id: '4',
    tenant_id: 't3',
    tenant_name: 'Global Retail',
    recipient: '+919888777666',
    template_name: 'order_confirmation',
    status: 'sent',
    retry_count: 0,
    created_at: '2024-12-09T10:18:00Z',
    sent_at: '2024-12-09T10:18:01Z',
  },
  {
    id: '5',
    tenant_id: 't2',
    tenant_name: 'TechStart Inc',
    recipient: '+919222333444',
    template_name: 'promo_discount',
    status: 'failed',
    retry_count: 5,
    error_message: 'Template not approved by Meta',
    created_at: '2024-12-09T08:30:00Z',
  },
];

export function Messages() {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const columns: Column<QueuedMessage>[] = [
    {
      key: 'recipient',
      header: 'Recipient',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm">{row.recipient}</span>
          <span className="text-sm text-muted-foreground">{row.tenant_name}</span>
        </div>
      ),
    },
    {
      key: 'template_name',
      header: 'Template',
      cell: (row) => (
        <span className="font-mono text-sm">{row.template_name}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'retry_count',
      header: 'Retries',
      className: 'text-center',
      cell: (row) => (
        <span className={row.retry_count > 0 ? 'text-warning font-medium' : 'text-muted-foreground'}>
          {row.retry_count}
        </span>
      ),
    },
    {
      key: 'error_message',
      header: 'Error',
      cell: (row) => (
        row.error_message ? (
          <span className="text-sm text-destructive truncate max-w-[200px] block" title={row.error_message}>
            {row.error_message}
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
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.created_at), 'MMM d, h:mm a')}
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
            {(row.status === 'failed' || row.status === 'queued') && (
              <DropdownMenuItem onClick={() => toast({ title: 'Message queued for retry' })}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredMessages = mockMessages.filter((msg) => {
    const matchesSearch =
      msg.recipient.includes(searchValue) ||
      msg.template_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      msg.tenant_name.toLowerCase().includes(searchValue.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'queued') return matchesSearch && msg.status === 'queued';
    if (activeTab === 'failed') return matchesSearch && msg.status === 'failed';
    return matchesSearch;
  });

  const queuedCount = mockMessages.filter((m) => m.status === 'queued').length;
  const failedCount = mockMessages.filter((m) => m.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Monitor and manage WhatsApp message queue</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="queued" className="gap-2">
            Queued
            {queuedCount > 0 && (
              <span className="bg-warning text-warning-foreground text-xs px-1.5 py-0.5 rounded-sm">
                {queuedCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="failed" className="gap-2">
            Failed
            {failedCount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-sm">
                {failedCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-6">
          {/* Filter Bar */}
          <FilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search by recipient or template..."
            hasActiveFilters={searchValue !== ''}
            onClearFilters={() => setSearchValue('')}
            actions={
              selectedRows.length > 0 && (
                <Button 
                  size="sm" 
                  onClick={() => toast({ title: `Retrying ${selectedRows.length} messages...` })}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Selected ({selectedRows.length})
                </Button>
              )
            }
          />

          {/* Failed Messages Alert */}
          {activeTab === 'failed' && failedCount > 0 && (
            <div className="flex items-center gap-3 border border-destructive/20 bg-destructive/5 p-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="font-medium">Failed messages require attention</p>
                <p className="text-sm text-muted-foreground">
                  Some messages have exceeded retry limits. Review and take action.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({ title: 'Retrying all failed messages...' })}
              >
                Retry All
              </Button>
            </div>
          )}

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredMessages}
            totalCount={filteredMessages.length}
            page={page}
            pageSize={10}
            onPageChange={setPage}
            selectable={activeTab !== 'all'}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            emptyMessage="No messages found."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Messages;

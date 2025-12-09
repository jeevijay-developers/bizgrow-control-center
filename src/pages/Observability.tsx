import { StatCard } from '@/components/admin/StatCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { AlertTriangle, Clock, Activity, RefreshCw, Zap } from 'lucide-react';
import { WebhookFailure } from '@/types/admin';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

const webhookFailureData = [
  { hour: '00:00', failures: 2 },
  { hour: '04:00', failures: 0 },
  { hour: '08:00', failures: 5 },
  { hour: '12:00', failures: 12 },
  { hour: '16:00', failures: 8 },
  { hour: '20:00', failures: 3 },
];

const queueLengthData = [
  { time: '10:00', length: 150 },
  { time: '10:05', length: 180 },
  { time: '10:10', length: 220 },
  { time: '10:15', length: 190 },
  { time: '10:20', length: 234 },
  { time: '10:25', length: 210 },
];

const mockWebhookFailures: WebhookFailure[] = [
  {
    id: '1',
    tenant_id: 't2',
    tenant_name: 'TechStart Inc',
    endpoint: 'https://api.techstart.io/webhooks/orders',
    status_code: 500,
    error_message: 'Internal Server Error',
    payload_preview: '{"event":"order.created","order_id":"ORD-123"}',
    retry_count: 3,
    created_at: '2024-12-09T10:15:00Z',
  },
  {
    id: '2',
    tenant_id: 't3',
    tenant_name: 'Global Retail',
    endpoint: 'https://hooks.globalretail.com/inventory',
    status_code: 404,
    error_message: 'Endpoint not found',
    payload_preview: '{"event":"inventory.low","product_id":"PRD-456"}',
    retry_count: 5,
    created_at: '2024-12-09T09:45:00Z',
  },
  {
    id: '3',
    tenant_id: 't1',
    tenant_name: 'Acme Corp',
    endpoint: 'https://acme.com/api/webhooks',
    status_code: 503,
    error_message: 'Service Unavailable',
    payload_preview: '{"event":"payment.received","invoice_id":"INV-789"}',
    retry_count: 2,
    created_at: '2024-12-09T10:00:00Z',
  },
];

const mockErrors = [
  {
    id: '1',
    type: 'DatabaseConnectionError',
    message: 'Connection pool exhausted',
    count: 23,
    last_seen: '2024-12-09T10:20:00Z',
  },
  {
    id: '2',
    type: 'RazorpayAPIError',
    message: 'Rate limit exceeded',
    count: 12,
    last_seen: '2024-12-09T10:15:00Z',
  },
  {
    id: '3',
    type: 'WhatsAppProviderError',
    message: 'Template not found',
    count: 8,
    last_seen: '2024-12-09T10:10:00Z',
  },
];

export function Observability() {
  const [page, setPage] = useState(1);

  const webhookColumns: Column<WebhookFailure>[] = [
    {
      key: 'tenant_name',
      header: 'Tenant',
      cell: (row) => <span className="font-medium">{row.tenant_name}</span>,
    },
    {
      key: 'endpoint',
      header: 'Endpoint',
      cell: (row) => (
        <span className="font-mono text-xs truncate max-w-[200px] block" title={row.endpoint}>
          {row.endpoint}
        </span>
      ),
    },
    {
      key: 'status_code',
      header: 'Status',
      className: 'text-center',
      cell: (row) => (
        <span className="font-mono text-destructive font-medium">{row.status_code}</span>
      ),
    },
    {
      key: 'error_message',
      header: 'Error',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{row.error_message}</span>
      ),
    },
    {
      key: 'retry_count',
      header: 'Retries',
      className: 'text-center',
      cell: (row) => (
        <span className={row.retry_count >= 3 ? 'text-destructive font-medium' : ''}>
          {row.retry_count}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Time',
      cell: (row) => (
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.created_at), 'h:mm a')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast({ title: 'Webhook queued for retry' })}
          className="gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Observability</h1>
        <p className="text-muted-foreground">Monitor platform health and performance</p>
      </div>

      {/* Health Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Webhook Failures (24h)"
          value="12"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Queue Length"
          value="234"
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Avg Response Time"
          value="142ms"
          icon={Zap}
          variant="success"
        />
        <StatCard
          title="Active Jobs"
          value="18"
          icon={Activity}
          variant="default"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Webhook Failures (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={webhookFailureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="hour"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="failures" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Queue Length (Real-time)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={queueLengthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="length"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Details */}
      <Tabs defaultValue="webhooks">
        <TabsList>
          <TabsTrigger value="webhooks">Webhook Failures</TabsTrigger>
          <TabsTrigger value="errors">Error Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="mt-6">
          <DataTable
            columns={webhookColumns}
            data={mockWebhookFailures}
            totalCount={mockWebhookFailures.length}
            page={page}
            pageSize={10}
            onPageChange={setPage}
            emptyMessage="No webhook failures."
          />
        </TabsContent>

        <TabsContent value="errors" className="mt-6">
          <div className="border border-border">
            {mockErrors.map((error, index) => (
              <div
                key={error.id}
                className={`flex items-center justify-between p-4 ${
                  index !== mockErrors.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="space-y-1">
                  <p className="font-medium font-mono text-sm">{error.type}</p>
                  <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">{error.count}</p>
                    <p className="text-muted-foreground">occurrences</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">
                      {format(new Date(error.last_seen), 'h:mm a')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Stack
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Observability;

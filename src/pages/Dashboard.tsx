import { StatCard } from '@/components/admin/StatCard';
import {
  Building2,
  Users,
  DollarSign,
  MessageSquare,
  AlertTriangle,
  Clock,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 55000 },
  { name: 'Jun', revenue: 67000 },
  { name: 'Jul', revenue: 72000 },
];

const messageData = [
  { name: 'Mon', sent: 1200, failed: 23 },
  { name: 'Tue', sent: 1450, failed: 18 },
  { name: 'Wed', sent: 1380, failed: 31 },
  { name: 'Thu', sent: 1520, failed: 12 },
  { name: 'Fri', sent: 1680, failed: 8 },
  { name: 'Sat', sent: 890, failed: 5 },
  { name: 'Sun', sent: 720, failed: 3 },
];

const recentActivity = [
  { id: 1, action: 'New tenant onboarded', tenant: 'Acme Corp', time: '2 min ago' },
  { id: 2, action: 'Webhook failure spike', tenant: 'TechStart Inc', time: '15 min ago' },
  { id: 3, action: 'Template approved', tenant: 'Global Retail', time: '32 min ago' },
  { id: 4, action: 'Plan upgraded to Enterprise', tenant: 'MegaMart', time: '1 hour ago' },
  { id: 5, action: 'New support ticket', tenant: 'LocalBiz', time: '2 hours ago' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Platform Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform health and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tenants"
          value="1,284"
          change={12}
          changeLabel="vs last month"
          icon={Building2}
          variant="default"
        />
        <StatCard
          title="Active Users"
          value="8,432"
          change={8}
          changeLabel="vs last month"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Monthly Revenue"
          value="₹72.4L"
          change={15}
          changeLabel="vs last month"
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Messages Today"
          value="12,847"
          change={-3}
          changeLabel="vs yesterday"
          icon={MessageSquare}
          variant="default"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Failed Messages"
          value="47"
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatCard
          title="Queue Length"
          value="234"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Webhook Failures (24h)"
          value="12"
          icon={Activity}
          variant="warning"
        />
        <StatCard
          title="Avg Response Time"
          value="142ms"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.1)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Messages Chart */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Message Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={messageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="sent" fill="hsl(var(--primary))" name="Sent" />
                  <Bar dataKey="failed" fill="hsl(var(--destructive))" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.tenant}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;

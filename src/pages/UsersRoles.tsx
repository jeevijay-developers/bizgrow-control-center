import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FilterBar, AddButton } from '@/components/admin/FilterBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { PlatformUser, UserRole } from '@/types/admin';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const mockUsers: PlatformUser[] = [
  {
    id: '1',
    email: 'admin@bizgrow360.com',
    name: 'System Admin',
    role: 'PLATFORM_ADMIN',
    last_login: '2024-12-09T08:30:00Z',
    created_at: '2023-01-01T00:00:00Z',
    is_active: true,
  },
  {
    id: '2',
    email: 'support@bizgrow360.com',
    name: 'Support Agent',
    role: 'SUPPORT',
    last_login: '2024-12-09T09:15:00Z',
    created_at: '2024-02-15T10:00:00Z',
    is_active: true,
  },
  {
    id: '3',
    email: 'finance@bizgrow360.com',
    name: 'Finance Manager',
    role: 'FINANCE',
    last_login: '2024-12-08T17:45:00Z',
    created_at: '2024-03-20T14:30:00Z',
    is_active: true,
  },
  {
    id: '4',
    email: 'jane.doe@bizgrow360.com',
    name: 'Jane Doe',
    role: 'SUPPORT',
    last_login: '2024-12-05T11:20:00Z',
    created_at: '2024-06-10T09:00:00Z',
    is_active: false,
  },
];

const roleConfig: Record<UserRole, { icon: typeof Shield; color: string; label: string }> = {
  PLATFORM_ADMIN: { icon: ShieldAlert, color: 'badge-destructive', label: 'Platform Admin' },
  SUPPORT: { icon: ShieldCheck, color: 'badge-primary', label: 'Support' },
  FINANCE: { icon: Shield, color: 'badge-accent', label: 'Finance' },
};

export function UsersRoles() {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const columns: Column<PlatformUser>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-sm text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      cell: (row) => {
        const config = roleConfig[row.role];
        const Icon = config.icon;
        return (
          <Badge className={config.color}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.is_active ? 'default' : 'secondary'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'last_login',
      header: 'Last Login',
      sortable: true,
      cell: (row) => (
        <span className="text-muted-foreground">
          {format(new Date(row.last_login), 'MMM d, yyyy h:mm a')}
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
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users & Roles</h1>
        <p className="text-muted-foreground">Manage platform admin users and their permissions</p>
      </div>

      {/* Role Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(roleConfig).map(([role, config]) => {
          const Icon = config.icon;
          const count = mockUsers.filter((u) => u.role === role).length;
          return (
            <div
              key={role}
              className="border border-border bg-card p-4 flex items-center gap-4"
            >
              <div className={`flex h-10 w-10 items-center justify-center ${config.color.replace('badge-', 'bg-').replace('text-', '')}/10`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{config.label}</p>
                <p className="text-sm text-muted-foreground">{count} users</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search users..."
        filters={[
          {
            key: 'role',
            label: 'Role',
            options: [
              { value: 'PLATFORM_ADMIN', label: 'Platform Admin' },
              { value: 'SUPPORT', label: 'Support' },
              { value: 'FINANCE', label: 'Finance' },
            ],
            value: roleFilter,
            onChange: setRoleFilter,
          },
        ]}
        hasActiveFilters={searchValue !== '' || roleFilter !== 'all'}
        onClearFilters={() => {
          setSearchValue('');
          setRoleFilter('all');
        }}
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin User</DialogTitle>
                <DialogDescription>
                  Create a new platform admin user with specific role permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="admin@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLATFORM_ADMIN">Platform Admin</SelectItem>
                      <SelectItem value="SUPPORT">Support</SelectItem>
                      <SelectItem value="FINANCE">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({ title: 'User created successfully' });
                  setIsAddDialogOpen(false);
                }}>
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        totalCount={filteredUsers.length}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        emptyMessage="No users found."
      />
    </div>
  );
}

export default UsersRoles;

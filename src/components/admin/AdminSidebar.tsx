import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  FileText,
  Mail,
  ScrollText,
  Activity,
  Settings,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tenants', icon: Building2, label: 'Tenants' },
  { to: '/users', icon: Users, label: 'Users & Roles' },
  { to: '/templates', icon: MessageSquare, label: 'Templates' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
  { to: '/messages', icon: Mail, label: 'Messages' },
  { to: '/audit', icon: ScrollText, label: 'Audit Logs' },
  { to: '/observability', icon: Activity, label: 'Observability' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/support-tools', icon: Wrench, label: 'Support Tools' },
];

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">BizGrow360</span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center bg-primary mx-auto">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={cn(
                  'nav-item',
                  collapsed && 'justify-center px-2'
                )}
                activeClassName="nav-item-active"
                end={item.to === '/'}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="w-full"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}

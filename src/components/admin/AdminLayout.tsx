import { ReactNode, useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopNav onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={cn(
          "flex-1 overflow-auto p-6 scrollbar-thin",
          "animate-fade-in"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}

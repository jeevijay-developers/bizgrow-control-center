import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tenants from "./pages/Tenants";
import UsersRoles from "./pages/UsersRoles";
import Templates from "./pages/Templates";
import Invoices from "./pages/Invoices";
import Messages from "./pages/Messages";
import AuditLogs from "./pages/AuditLogs";
import Observability from "./pages/Observability";
import Settings from "./pages/Settings";
import SupportTools from "./pages/SupportTools";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper for admin pages
const AdminPage = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          <Route path="/tenants" element={<AdminPage><Tenants /></AdminPage>} />
          <Route path="/users" element={<AdminPage><UsersRoles /></AdminPage>} />
          <Route path="/templates" element={<AdminPage><Templates /></AdminPage>} />
          <Route path="/invoices" element={<AdminPage><Invoices /></AdminPage>} />
          <Route path="/messages" element={<AdminPage><Messages /></AdminPage>} />
          <Route path="/audit" element={<AdminPage><AuditLogs /></AdminPage>} />
          <Route path="/observability" element={<AdminPage><Observability /></AdminPage>} />
          <Route path="/settings" element={<AdminPage><Settings /></AdminPage>} />
          <Route path="/support-tools" element={<AdminPage><SupportTools /></AdminPage>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

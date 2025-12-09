// BizGrow360 Super Admin Types

export type TenantStatus = 'active' | 'inactive' | 'suspended' | 'onboarding';
export type TenantPlan = 'free' | 'starter' | 'growth' | 'enterprise';
export type UserRole = 'PLATFORM_ADMIN' | 'SUPPORT' | 'FINANCE';
export type MessageStatus = 'queued' | 'sent' | 'delivered' | 'failed' | 'read';
export type TemplateStatus = 'pending' | 'approved' | 'rejected';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  status: TenantStatus;
  owner_email: string;
  whatsapp_configured: boolean;
  razorpay_configured: boolean;
  created_at: string;
  updated_at: string;
  product_count: number;
  user_count: number;
  monthly_revenue: number;
}

export interface PlatformUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  last_login: string;
  created_at: string;
  is_active: boolean;
}

export interface WhatsAppTemplate {
  id: string;
  tenant_id: string;
  tenant_name: string;
  name: string;
  category: string;
  language: string;
  status: TemplateStatus;
  provider: string;
  variables: string[];
  created_at: string;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  tenant_name: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  razorpay_order_id?: string;
  created_at: string;
  due_date: string;
}

export interface QueuedMessage {
  id: string;
  tenant_id: string;
  tenant_name: string;
  recipient: string;
  template_name: string;
  status: MessageStatus;
  retry_count: number;
  error_message?: string;
  created_at: string;
  sent_at?: string;
}

export interface AuditLog {
  id: string;
  tenant_id?: string;
  tenant_name?: string;
  user_id: string;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, unknown>;
  ip_address: string;
  created_at: string;
}

export interface PlatformMetrics {
  total_tenants: number;
  active_tenants: number;
  total_users: number;
  total_revenue: number;
  messages_sent_today: number;
  messages_failed_today: number;
  webhook_failures_24h: number;
  queue_length: number;
  avg_response_time_ms: number;
}

export interface WebhookFailure {
  id: string;
  tenant_id: string;
  tenant_name: string;
  endpoint: string;
  status_code: number;
  error_message: string;
  payload_preview: string;
  retry_count: number;
  created_at: string;
}

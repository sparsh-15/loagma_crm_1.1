import { User } from '@shared/schema';

export function canAccessLeads(user: User | null): boolean {
  if (!user) return false;
  return ['admin', 'manager', 'exec'].includes(user.role);
}

export function canAccessClients(user: User | null): boolean {
  if (!user) return false;
  return ['admin', 'manager', 'exec'].includes(user.role);
}

export function canAccessQuotations(user: User | null): boolean {
  if (!user) return false;
  return ['admin', 'manager', 'exec', 'accountant'].includes(user.role);
}

export function canAccessInvoices(user: User | null): boolean {
  if (!user) return false;
  return ['admin', 'accountant'].includes(user.role);
}

export function canAccessTickets(user: User | null): boolean {
  if (!user) return false;
  return ['admin', 'engineer'].includes(user.role);
}

export function canApproveQuotations(user: User | null): boolean {
  if (!user) return false;
  return ['admin', 'manager'].includes(user.role);
}

export function canGenerateInvoices(user: User | null): boolean {
  if (!user) return false;
  return ['admin', 'accountant'].includes(user.role);
}

export function canConvertLeads(user: User | null): boolean {
  if (!user) return false;
  return ['admin', 'manager', 'exec'].includes(user.role);
}

export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Sales Manager',
    exec: 'Sales Executive',
    accountant: 'Accountant',
    engineer: 'Engineer',
    client: 'Client',
  };
  return roleNames[role] || role;
}

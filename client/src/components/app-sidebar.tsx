import { useAuth } from '@/lib/auth-context';
import { useLocation } from 'wouter';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileText, 
  Receipt, 
  Ticket,
  Building2,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName } from '@/lib/role-permissions';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const getMenuItems = () => {
    const items = [];

    items.push({ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard });

    if (['admin', 'manager', 'exec'].includes(user.role)) {
      items.push({ title: user.role === 'exec' ? 'My Leads' : 'Leads', url: '/leads', icon: UserPlus });
      items.push({ title: 'Clients', url: '/clients', icon: Users });
    }

    if (['admin', 'manager', 'exec', 'accountant'].includes(user.role)) {
      items.push({ title: 'Quotations', url: '/quotations', icon: FileText });
    }

    if (['admin', 'accountant'].includes(user.role)) {
      items.push({ title: 'Invoices', url: '/invoices', icon: Receipt });
    }

    if (['admin', 'engineer'].includes(user.role)) {
      items.push({ 
        title: user.role === 'engineer' ? 'My Tickets' : 'Service Tickets', 
        url: '/tickets', 
        icon: Ticket 
      });
    }

    if (user.role === 'client') {
      items.push({ title: 'My Quotations', url: '/quotations', icon: FileText });
      items.push({ title: 'My Invoices', url: '/invoices', icon: Receipt });
      items.push({ title: 'My Tickets', url: '/tickets', icon: Ticket });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm truncate">CRM & Accounting</h2>
            <p className="text-xs text-muted-foreground truncate">Management System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url || 
                  (item.url !== '/dashboard' && location.startsWith(item.url));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={isActive ? 'bg-sidebar-accent' : ''}
                      data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <a href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="space-y-3">
          <div className="px-3 py-2 rounded-lg bg-muted/50">
            <p className="text-sm font-medium truncate" data-testid="text-user-name">
              {user.name}
            </p>
            <Badge variant="secondary" className="mt-1 text-xs" data-testid="badge-user-role">
              {getRoleDisplayName(user.role)}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

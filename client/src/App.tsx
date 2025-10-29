import { Switch, Route, Redirect } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';

import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import LeadsList from '@/pages/leads/list';
import LeadForm from '@/pages/leads/form';
import LeadDetail from '@/pages/leads/detail';
import ClientsList from '@/pages/clients/list';
import ClientDetail from '@/pages/clients/detail';
import QuotationsList from '@/pages/quotations/list';
import QuotationForm from '@/pages/quotations/form';
import QuotationDetail from '@/pages/quotations/detail';
import InvoicesList from '@/pages/invoices/list';
import TicketsList from '@/pages/tickets/list';
import NotFound from '@/pages/not-found';

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/:rest*">
          <Redirect to="/login" />
        </Route>
      </Switch>
    );
  }

  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-3 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6 md:p-8">
            <Switch>
              <Route path="/">
                <Redirect to="/dashboard" />
              </Route>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/leads" component={LeadsList} />
              <Route path="/leads/new" component={LeadForm} />
              <Route path="/leads/:id/edit" component={LeadForm} />
              <Route path="/leads/:id" component={LeadDetail} />
              <Route path="/clients/:id" component={ClientDetail} />
              <Route path="/clients" component={ClientsList} />
              <Route path="/quotations/new" component={QuotationForm} />
              <Route path="/quotations/:id/edit" component={QuotationForm} />
              <Route path="/quotations/:id" component={QuotationDetail} />
              <Route path="/quotations" component={QuotationsList} />
              <Route path="/invoices" component={InvoicesList} />
              <Route path="/tickets" component={TicketsList} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

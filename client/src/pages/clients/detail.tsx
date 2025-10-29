import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import type { Client, Quotation, Invoice, Ticket } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, FileText, Receipt, Ticket as TicketIcon } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { format } from 'date-fns';

export default function ClientDetail() {
  const params = useParams();
  const clientId = parseInt(params.id!);
  const [, setLocation] = useLocation();

  const { data: client, isLoading } = useQuery<Client>({
    queryKey: ['/api/clients', clientId],
  });

  const { data: quotations } = useQuery<Quotation[]>({
    queryKey: ['/api/quotations', clientId],
  });

  const { data: invoices } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices', clientId],
  });

  const { data: tickets } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets', clientId],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  if (!client) {
    return <div className="text-center py-12">Client not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/clients')} data-testid="button-back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-client-name">{client.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{client.company}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm mt-1">{client.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm mt-1">{client.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-sm mt-1">{client.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">
                    {formatCurrency(client.totalRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Client Since</p>
                  <p className="text-sm mt-1">{format(new Date(client.createdDate), 'MMM d, yyyy')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quotations</CardTitle>
            </CardHeader>
            <CardContent>
              {quotations && quotations.length > 0 ? (
                <div className="space-y-3">
                  {quotations.map((quotation) => (
                    <div
                      key={quotation.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover-elevate cursor-pointer"
                      onClick={() => setLocation(`/quotations/${quotation.id}`)}
                      data-testid={`quotation-${quotation.id}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium font-mono text-sm">{quotation.quotationNumber}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(quotation.createdDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">{formatCurrency(quotation.total)}</p>
                        <StatusBadge status={quotation.status} type="quotation" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No quotations yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices && invoices.length > 0 ? (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover-elevate cursor-pointer"
                      onClick={() => setLocation(`/invoices/${invoice.id}`)}
                      data-testid={`invoice-${invoice.id}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium font-mono text-sm">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">{formatCurrency(invoice.total)}</p>
                        <StatusBadge status={invoice.status} type="invoice" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No invoices yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              {tickets && tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover-elevate cursor-pointer"
                      onClick={() => setLocation(`/tickets/${ticket.id}`)}
                      data-testid={`ticket-${ticket.id}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{ticket.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {ticket.ticketNumber} • {format(new Date(ticket.createdDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={ticket.priority} type="ticket-priority" />
                        <StatusBadge status={ticket.status} type="ticket-status" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No tickets yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation('/quotations/new')}
                data-testid="button-create-quotation"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Quotation
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation('/tickets/new')}
                data-testid="button-create-ticket"
              >
                <TicketIcon className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

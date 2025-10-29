import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import type { Quotation } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ArrowLeft, Check, X, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { canApproveQuotations, canGenerateInvoices } from '@/lib/role-permissions';

export default function QuotationDetail() {
  const params = useParams();
  const quotationId = parseInt(params.id!);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: quotation, isLoading } = useQuery<Quotation>({
    queryKey: ['/api/quotations', quotationId],
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/quotations/${quotationId}/approve`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotations', quotationId] });
      toast({
        title: 'Quotation approved',
        description: 'Quotation has been successfully approved.',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/quotations/${quotationId}/reject`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotations', quotationId] });
      toast({
        title: 'Quotation rejected',
        description: 'Quotation has been rejected.',
      });
    },
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/quotations/${quotationId}/generate-invoice`, undefined);
    },
    onSuccess: (invoice: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: 'Invoice generated',
        description: 'Invoice has been successfully generated.',
      });
      setLocation(`/invoices/${invoice.id}`);
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  if (!quotation) {
    return <div className="text-center py-12">Quotation not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/quotations')} data-testid="button-back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-mono tracking-tight" data-testid="text-quotation-number">
            {quotation.quotationNumber}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Quotation Details</p>
        </div>
        <div className="flex items-center gap-2">
          {quotation.status === 'Pending' && canApproveQuotations(user) && (
            <>
              <Button
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                data-testid="button-approve"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => rejectMutation.mutate()}
                disabled={rejectMutation.isPending}
                data-testid="button-reject"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          {quotation.status === 'Approved' && canGenerateInvoices(user) && (
            <Button
              onClick={() => generateInvoiceMutation.mutate()}
              disabled={generateInvoiceMutation.isPending}
              data-testid="button-generate-invoice"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
          )}
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">QUOTATION</CardTitle>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Date:</span> {format(new Date(quotation.createdDate), 'MMM d, yyyy')}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Valid Until:</span> {format(new Date(quotation.validUntil), 'MMM d, yyyy')}
                </p>
                <div className="mt-2">
                  <StatusBadge status={quotation.status} type="quotation" />
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold font-mono">{quotation.quotationNumber}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{quotation.clientName}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="font-semibold mb-2">Created By:</h3>
              <div className="text-sm space-y-1">
                <p>{quotation.createdByName}</p>
                {quotation.approvedBy && (
                  <p className="text-muted-foreground">
                    Approved on {format(new Date(quotation.approvedDate!), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold">Description</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold">Qty</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold">Unit Price</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quotation.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">{formatCurrency(quotation.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({quotation.taxRate}%):</span>
                <span className="font-medium">{formatCurrency(quotation.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total:</span>
                <span data-testid="text-total-amount">{formatCurrency(quotation.total)}</span>
              </div>
            </div>
          </div>

          {quotation.notes && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Notes / Terms:</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{quotation.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

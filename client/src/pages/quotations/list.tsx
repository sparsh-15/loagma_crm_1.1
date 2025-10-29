import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import type { Quotation } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { Plus, Eye, Pencil, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { canApproveQuotations } from '@/lib/role-permissions';

export default function QuotationsList() {
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: quotations, isLoading } = useQuery<Quotation[]>({
    queryKey: ['/api/quotations'],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('POST', `/api/quotations/${id}/approve`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      toast({
        title: 'Quotation approved',
        description: 'Quotation has been successfully approved.',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('POST', `/api/quotations/${id}/reject`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      toast({
        title: 'Quotation rejected',
        description: 'Quotation has been rejected.',
      });
    },
  });

  const filteredQuotations = quotations?.filter((quotation) => {
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    return matchesStatus;
  }) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Quotations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track quotations
          </p>
        </div>
        {['admin', 'manager', 'exec'].includes(user?.role || '') && (
          <Button onClick={() => setLocation('/quotations/new')} data-testid="button-create-quotation">
            <Plus className="w-4 h-4 mr-2" />
            New Quotation
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-32 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredQuotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <p className="text-sm text-muted-foreground">No quotations found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotations.map((quotation) => (
                    <TableRow key={quotation.id} data-testid={`row-quotation-${quotation.id}`}>
                      <TableCell className="font-mono font-medium text-sm">{quotation.quotationNumber}</TableCell>
                      <TableCell>{quotation.clientName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(quotation.createdDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(quotation.total)}</TableCell>
                      <TableCell>
                        <StatusBadge status={quotation.status} type="quotation" />
                      </TableCell>
                      <TableCell className="text-sm">{quotation.createdByName}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation(`/quotations/${quotation.id}`)}
                            data-testid={`button-view-${quotation.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {quotation.status === 'Draft' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setLocation(`/quotations/${quotation.id}/edit`)}
                              data-testid={`button-edit-${quotation.id}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          {quotation.status === 'Pending' && canApproveQuotations(user) && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => approveMutation.mutate(quotation.id)}
                                data-testid={`button-approve-${quotation.id}`}
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => rejectMutation.mutate(quotation.id)}
                                data-testid={`button-reject-${quotation.id}`}
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

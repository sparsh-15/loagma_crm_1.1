import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useParams } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { insertQuotationSchema, type InsertQuotation, type Quotation, type Client } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function QuotationForm() {
  const params = useParams();
  const quotationId = params.id ? parseInt(params.id) : null;
  const isEditing = quotationId !== null;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: quotation, isLoading: quotationLoading } = useQuery<Quotation>({
    queryKey: ['/api/quotations', quotationId],
    enabled: isEditing,
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const form = useForm<InsertQuotation>({
    resolver: zodResolver(insertQuotationSchema),
    defaultValues: {
      clientId: 0,
      items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
      taxRate: 18,
      status: 'Draft',
      createdBy: '',
      createdDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  useEffect(() => {
    if (quotation && isEditing) {
      form.reset({
        clientId: quotation.clientId,
        items: quotation.items,
        taxRate: quotation.taxRate,
        status: quotation.status,
        createdBy: quotation.createdBy,
        createdDate: quotation.createdDate,
        validUntil: quotation.validUntil,
        notes: quotation.notes,
      });
    }
  }, [quotation, isEditing, form]);

  const items = form.watch('items');

  useEffect(() => {
    items.forEach((item, index) => {
      const amount = item.quantity * item.unitPrice;
      if (item.amount !== amount) {
        form.setValue(`items.${index}.amount`, amount);
      }
    });
  }, [items, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: InsertQuotation) => {
      if (isEditing) {
        return apiRequest('PATCH', `/api/quotations/${quotationId}`, data);
      }
      return apiRequest('POST', '/api/quotations', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      toast({
        title: isEditing ? 'Quotation updated' : 'Quotation created',
        description: `Quotation has been successfully ${isEditing ? 'updated' : 'created'}.`,
      });
      setLocation('/quotations');
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertQuotation) => {
      if (isEditing) {
        return apiRequest('POST', `/api/quotations/${quotationId}/submit`, data);
      }
      const newData = { ...data, status: 'Pending' as const };
      return apiRequest('POST', '/api/quotations', newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      toast({
        title: 'Quotation submitted',
        description: 'Quotation has been submitted for approval.',
      });
      setLocation('/quotations');
    },
  });

  const onSaveDraft = (data: InsertQuotation) => {
    saveMutation.mutate({ ...data, status: 'Draft' });
  };

  const onSubmitForApproval = (data: InsertQuotation) => {
    submitMutation.mutate(data);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (form.watch('taxRate') / 100);
  const total = subtotal + taxAmount;

  if (quotationLoading && isEditing) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/quotations')} data-testid="button-back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
            {isEditing ? 'Edit Quotation' : 'New Quotation'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditing ? 'Update quotation details' : 'Create a new quotation for a client'}
          </p>
        </div>
      </div>

      <Card className="max-w-5xl">
        <CardHeader>
          <CardTitle>Quotation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger data-testid="select-client">
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name} - {client.company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" data-testid="input-valid-until" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Line Items</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ description: '', quantity: 1, unitPrice: 0, amount: 0 })}
                    data-testid="button-add-item"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-3 items-start">
                      <div className="col-span-5">
                        <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>Description</FormLabel>}
                              <FormControl>
                                <Input {...field} placeholder="Service description" data-testid={`input-description-${index}`} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>Qty</FormLabel>}
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="1"
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                  data-testid={`input-quantity-${index}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>Unit Price</FormLabel>}
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  data-testid={`input-unit-price-${index}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              {index === 0 && <FormLabel>Amount</FormLabel>}
                              <FormControl>
                                <Input {...field} type="number" disabled className="bg-muted" data-testid={`text-amount-${index}`} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-1 flex items-end">
                        {index === 0 && <div className="h-9" />}
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            data-testid={`button-remove-item-${index}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2 border rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium" data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (18%):</span>
                    <span className="font-medium" data-testid="text-tax">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span data-testid="text-total">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes / Terms</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Additional terms and conditions..." data-testid="textarea-notes" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/quotations')}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={form.handleSubmit(onSaveDraft)}
                  disabled={saveMutation.isPending}
                  data-testid="button-save-draft"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmitForApproval)}
                  disabled={submitMutation.isPending}
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit for Approval'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

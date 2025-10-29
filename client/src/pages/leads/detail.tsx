import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { Lead } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, UserCheck, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function LeadDetail() {
  const params = useParams();
  const leadId = parseInt(params.id!);
  const [, setLocation] = useLocation();
  const [newNote, setNewNote] = useState('');
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const { toast } = useToast();

  const { data: lead, isLoading } = useQuery<Lead>({
    queryKey: ['/api/leads', leadId],
  });

  const addNoteMutation = useMutation({
    mutationFn: async (note: string) => {
      return apiRequest('POST', `/api/leads/${leadId}/notes`, { text: note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads', leadId] });
      setNewNote('');
      toast({
        title: 'Note added',
        description: 'Your note has been successfully added.',
      });
    },
  });

  const convertMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/leads/${leadId}/convert`, undefined);
    },
    onSuccess: (client: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: 'Lead converted',
        description: 'Lead has been successfully converted to a client.',
      });
      setLocation(`/clients/${client.id}`);
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  if (!lead) {
    return <div className="text-center py-12">Lead not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/leads')} data-testid="button-back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-lead-name">{lead.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{lead.company}</p>
        </div>
        {lead.status !== 'Converted' && (
          <Button onClick={() => setShowConvertDialog(true)} data-testid="button-convert">
            <UserCheck className="w-4 h-4 mr-2" />
            Convert to Client
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm mt-1" data-testid="text-email">{lead.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm mt-1" data-testid="text-phone">{lead.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Source</p>
                  <p className="text-sm mt-1" data-testid="text-source">{lead.source}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={lead.status} type="lead" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                  <p className="text-sm mt-1" data-testid="text-assigned-to">{lead.assignedToName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                  <p className="text-sm mt-1" data-testid="text-created-date">
                    {format(new Date(lead.createdDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.notes.map((note, index) => (
                  <div key={index} className="flex gap-3 pb-4 border-b last:border-0" data-testid={`note-${index}`}>
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{note.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.user} • {format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
                {lead.notes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No notes yet</p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <Textarea
                  placeholder="Add a follow-up note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  data-testid="textarea-new-note"
                />
                <Button
                  onClick={() => newNote && addNoteMutation.mutate(newNote)}
                  disabled={!newNote || addNoteMutation.isPending}
                  size="sm"
                  data-testid="button-add-note"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
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
                onClick={() => setLocation(`/leads/${leadId}/edit`)}
                data-testid="button-edit"
              >
                Edit Lead
              </Button>
              {lead.status !== 'Converted' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowConvertDialog(true)}
                  data-testid="button-quick-convert"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Convert to Client
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convert Lead to Client</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new client record and mark this lead as converted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-convert">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => convertMutation.mutate()}
              data-testid="button-confirm-convert"
            >
              Convert to Client
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

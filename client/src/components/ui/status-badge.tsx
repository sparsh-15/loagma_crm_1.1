import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: 'lead' | 'quotation' | 'invoice' | 'ticket-status' | 'ticket-priority';
  className?: string;
}

export function StatusBadge({ status, type = 'lead', className }: StatusBadgeProps) {
  const getVariant = () => {
    if (type === 'lead') {
      switch (status) {
        case 'New': return 'default';
        case 'In Progress': return 'secondary';
        case 'Converted': return 'default';
        case 'Lost': return 'destructive';
        default: return 'secondary';
      }
    }
    
    if (type === 'quotation') {
      switch (status) {
        case 'Draft': return 'secondary';
        case 'Pending': return 'secondary';
        case 'Approved': return 'default';
        case 'Rejected': return 'destructive';
        default: return 'secondary';
      }
    }
    
    if (type === 'invoice') {
      switch (status) {
        case 'Generated': return 'default';
        case 'Sent': return 'secondary';
        case 'Paid': return 'default';
        case 'Partially Paid': return 'secondary';
        case 'Overdue': return 'destructive';
        default: return 'secondary';
      }
    }
    
    if (type === 'ticket-status') {
      switch (status) {
        case 'Open': return 'default';
        case 'In Progress': return 'secondary';
        case 'Resolved': return 'default';
        case 'Closed': return 'secondary';
        default: return 'secondary';
      }
    }
    
    if (type === 'ticket-priority') {
      switch (status) {
        case 'Low': return 'secondary';
        case 'Medium': return 'secondary';
        case 'High': return 'secondary';
        case 'Critical': return 'destructive';
        default: return 'secondary';
      }
    }
    
    return 'secondary';
  };

  const getCustomClasses = () => {
    if (type === 'lead') {
      switch (status) {
        case 'New': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800';
        case 'Converted': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
        case 'Lost': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
      }
    }
    
    if (type === 'quotation') {
      switch (status) {
        case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
        case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800';
        case 'Approved': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
        case 'Rejected': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
      }
    }
    
    if (type === 'invoice') {
      switch (status) {
        case 'Generated': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
        case 'Sent': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800';
        case 'Paid': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
        case 'Partially Paid': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
        case 'Overdue': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
      }
    }
    
    if (type === 'ticket-status') {
      switch (status) {
        case 'Open': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800';
        case 'Resolved': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
        case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      }
    }
    
    if (type === 'ticket-priority') {
      switch (status) {
        case 'Low': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
        case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800';
        case 'High': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
        case 'Critical': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
      }
    }
    
    return '';
  };

  return (
    <Badge 
      variant={getVariant()}
      className={cn('border whitespace-nowrap', getCustomClasses(), className)}
      data-testid={`badge-${type}-${status.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {status}
    </Badge>
  );
}

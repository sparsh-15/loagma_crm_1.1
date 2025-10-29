import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import type { DashboardMetrics, Activity } from '@shared/schema';
import { 
  Users, 
  UserPlus, 
  FileText, 
  DollarSign, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { user } = useAuth();

  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ['/api/dashboard/metrics'],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ['/api/dashboard/activities'],
  });

  if (!user) {
    return <div className="flex items-center justify-center h-screen">
      <p>Loading...</p>
    </div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const summaryCards = [
    {
      title: 'Total Leads',
      value: metrics?.totalLeads || 0,
      icon: UserPlus,
      visible: user.role === 'admin' || user.role === 'manager' || user.role === 'exec',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Total Clients',
      value: metrics?.totalClients || 0,
      icon: Users,
      visible: user.role === 'admin' || user.role === 'manager' || user.role === 'exec',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
    {
      title: 'Total Quotations',
      value: metrics?.totalQuotations || 0,
      icon: FileText,
      visible: user.role === 'admin' || user.role === 'manager' || user.role === 'exec' || user.role === 'accountant',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-950',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics?.totalRevenue || 0),
      icon: DollarSign,
      visible: user.role === 'admin' || user.role === 'accountant',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-950',
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(metrics?.pendingPayments || 0),
      icon: Clock,
      visible: user.role === 'admin' || user.role === 'accountant',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-950',
    },
  ];

  const leadStatusData = metrics?.leadStatusDistribution ? {
    labels: Object.keys(metrics.leadStatusDistribution),
    datasets: [
      {
        data: Object.values(metrics.leadStatusDistribution),
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 0,
      },
    ],
  } : null;

  const quotationStatusData = metrics?.quotationStatusDistribution ? {
    labels: Object.keys(metrics.quotationStatusDistribution),
    datasets: [
      {
        label: 'Quotations',
        data: Object.values(metrics.quotationStatusDistribution),
        backgroundColor: 'rgb(147, 51, 234)',
        borderRadius: 6,
      },
    ],
  } : null;

  const revenueData = metrics?.monthlyRevenue ? {
    labels: metrics.monthlyRevenue.map(m => m.month),
    datasets: [
      {
        label: 'Revenue',
        data: metrics.monthlyRevenue.map(m => m.revenue),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user.name || user.username || 'User'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {summaryCards.filter(card => card.visible).map((card) => (
          <Card key={card.title} data-testid={`card-${card.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid={`text-${card.title.toLowerCase().replace(/\s+/g, '-')}-value`}>
                  {card.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        {(user?.role === 'admin' || ['manager', 'exec'].includes(user?.role || '')) && leadStatusData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Lead Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                {metricsLoading ? (
                  <Skeleton className="w-full h-full rounded-lg" />
                ) : (
                  <Pie 
                    data={leadStatusData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                        },
                      },
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quotation Status */}
        {(user?.role === 'admin' || ['manager', 'exec', 'accountant'].includes(user?.role || '')) && quotationStatusData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quotation Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {metricsLoading ? (
                  <Skeleton className="w-full h-full rounded-lg" />
                ) : (
                  <Bar 
                    data={quotationStatusData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Revenue Trend */}
        {(user?.role === 'admin' || user?.role === 'accountant') && revenueData && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Monthly Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {metricsLoading ? (
                  <Skeleton className="w-full h-full rounded-lg" />
                ) : (
                  <Line 
                    data={revenueData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0" data-testid={`activity-${activity.id}`}>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">
                      {activity.user.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      {' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                      {' '}
                      <span className="font-medium">{activity.entity}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No recent activities</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

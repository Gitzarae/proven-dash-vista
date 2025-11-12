import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import KPICard from '@/components/dashboard/KPICard';
import { 
  FolderKanban, 
  CheckCircle, 
  TrendingUp, 
  AlertCircle,
  Download 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role) {
      const roleRoutes: Record<string, string> = {
        'top_management': '/dashboard/top-management',
        'project_owner': '/dashboard/project-owner',
        'project_manager': '/dashboard/project-manager',
        'project_officer': '/dashboard/project-officer',
        'system_admin': '/dashboard/admin',
      };
      navigate(roleRoutes[user.role] || '/dashboard');
    }
  }, [user, navigate]);

  // Mock data for charts
  const performanceData = [
    { month: 'Jan', spi: 0.95, cpi: 0.98 },
    { month: 'Feb', spi: 1.02, cpi: 1.01 },
    { month: 'Mar', spi: 0.98, cpi: 0.97 },
    { month: 'Apr', spi: 1.05, cpi: 1.03 },
    { month: 'May', spi: 1.08, cpi: 1.06 },
    { month: 'Jun', spi: 1.12, cpi: 1.09 },
  ];

  const decisionData = [
    { name: 'Closed', value: 156, color: 'hsl(var(--gra-green))' },
    { name: 'Pending', value: 42, color: 'hsl(var(--gra-gold))' },
    { name: 'Overdue', value: 12, color: 'hsl(var(--gra-red))' },
  ];

  const issueAgingData = [
    { severity: 'Critical', '0-7 days': 5, '8-14 days': 3, '15+ days': 2 },
    { severity: 'High', '0-7 days': 12, '8-14 days': 8, '15+ days': 4 },
    { severity: 'Medium', '0-7 days': 18, '8-14 days': 6, '15+ days': 3 },
    { severity: 'Low', '0-7 days': 25, '8-14 days': 10, '15+ days': 5 },
  ];

  const getRoleSpecificTitle = () => {
    switch (user?.role) {
      case 'top_management':
        return 'Strategic Overview';
      case 'project_owner':
        return 'Portfolio Dashboard';
      case 'project_manager':
        return 'Project Management';
      case 'project_officer':
        return 'Task Management';
      case 'system_admin':
        return 'System Administration';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{getRoleSpecificTitle()}</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Projects"
          value={24}
          change="+3 this month"
          changeType="positive"
          icon={FolderKanban}
          colorClass="text-primary"
        />
        <KPICard
          title="Closed Decisions"
          value={156}
          change="74% closure rate"
          changeType="positive"
          icon={CheckCircle}
          colorClass="text-gra-green"
        />
        <KPICard
          title="SLA Compliance"
          value="92%"
          change="+5% vs last month"
          changeType="positive"
          icon={TrendingUp}
          colorClass="text-chart-4"
        />
        <KPICard
          title="Pending Issues"
          value={42}
          change="12 critical"
          changeType="neutral"
          icon={AlertCircle}
          colorClass="text-gra-gold"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="glass-hover rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">SPI/CPI Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="spi" 
                stroke="hsl(var(--gra-green))" 
                strokeWidth={2}
                name="SPI"
              />
              <Line 
                type="monotone" 
                dataKey="cpi" 
                stroke="hsl(var(--gra-gold))" 
                strokeWidth={2}
                name="CPI"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Decision Closure */}
        <div className="glass-hover rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Decision Closure Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={decisionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {decisionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Issue Aging Chart */}
      <div className="glass-hover rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Issue Aging by Severity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={issueAgingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="severity" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="0-7 days" stackId="a" fill="hsl(var(--gra-green))" />
            <Bar dataKey="8-14 days" stackId="a" fill="hsl(var(--gra-gold))" />
            <Bar dataKey="15+ days" stackId="a" fill="hsl(var(--gra-red))" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-hover rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Project</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { project: 'Tax Modernization', type: 'Decision', status: 'Closed', date: '2025-01-10' },
                { project: 'Digital Services Platform', type: 'Issue', status: 'Open', date: '2025-01-09' },
                { project: 'Revenue Analytics', type: 'Milestone', status: 'Completed', date: '2025-01-08' },
                { project: 'Compliance System', type: 'Meeting', status: 'Scheduled', date: '2025-01-12' },
              ].map((item, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/50 transition-smooth">
                  <td className="py-3 px-4 text-sm">{item.project}</td>
                  <td className="py-3 px-4 text-sm">{item.type}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'Closed' || item.status === 'Completed' 
                        ? 'bg-gra-green/10 text-gra-green' 
                        : item.status === 'Open' 
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-gra-gold/10 text-gra-gold'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

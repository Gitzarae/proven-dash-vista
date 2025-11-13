import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, FolderKanban, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const roleDistribution = [
    { role: 'Top Management', active: 5, total: 6 },
    { role: 'Project Owner', active: 12, total: 15 },
    { role: 'Project Manager', active: 18, total: 20 },
    { role: 'Project Officer', active: 45, total: 50 },
    { role: 'System Admin', active: 3, total: 3 },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Created new project: Tax Modernization', timestamp: '2025-01-12 10:30 AM', type: 'project' },
    { user: 'Jane Smith', action: 'Approved decision DEC-045', timestamp: '2025-01-12 09:15 AM', type: 'decision' },
    { user: 'Mike Johnson', action: 'Resolved issue ISS-123', timestamp: '2025-01-12 08:45 AM', type: 'issue' },
    { user: 'System', action: 'Automated backup completed', timestamp: '2025-01-12 02:00 AM', type: 'system' },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-gra-navy';
      case 'decision': return 'bg-gra-gold';
      case 'issue': return 'bg-destructive';
      case 'system': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-muted-foreground mt-1">Manage users, audit logs, and system settings</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Users"
          value={156}
          change="85 active"
          changeType="positive"
          icon={Users}
          colorClass="text-primary"
        />
        <KPICard
          title="System Uptime"
          value="99.8%"
          change="Last 30 days"
          changeType="positive"
          icon={Activity}
          colorClass="text-gra-yellow"
        />
        <KPICard
          title="Total Projects"
          value={24}
          change="Active projects"
          changeType="neutral"
          icon={FolderKanban}
          colorClass="text-chart-4"
        />
        <KPICard
          title="Audit Logs"
          value={1247}
          change="This month"
          changeType="neutral"
          icon={FileText}
          colorClass="text-gra-gold"
        />
      </div>

      {/* User Role Distribution */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">User Role Distribution</h3>
          <Button variant="outline" size="sm">Manage Users</Button>
        </div>
        <div className="space-y-4">
          {roleDistribution.map((item) => (
            <div key={item.role} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="font-medium">{item.role}</span>
                <Badge variant="outline">{item.active} active</Badge>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gra-navy transition-all"
                      style={{ width: `${(item.active / item.total) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {item.active} / {item.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent System Activities */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent System Activities</h3>
          <Button variant="outline" size="sm">View All Logs</Button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-smooth">
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>     
    </div>
  );
};

export default AdminDashboard;

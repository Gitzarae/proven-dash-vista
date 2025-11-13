import { useState, useEffect } from 'react';
import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, FolderKanban, FileText } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface RoleCount {
  role: string;
  count: number;
}

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [auditLogCount, setAuditLogCount] = useState(0);
  const [roleCounts, setRoleCounts] = useState<RoleCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const roleDisplayMap: Record<string, string> = {
    'top_management': 'Top Management',
    'project_owner': 'Project Owner',
    'project_manager': 'Project Manager',
    'project_officer': 'Project Officer',
    'system_admin': 'System Admin',
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch total users
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;
        setTotalUsers(usersCount || 0);

        // Fetch total projects
        const { count: projectsCount, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        if (projectsError) throw projectsError;
        setTotalProjects(projectsCount || 0);

        // Fetch audit logs count
        const { count: logsCount, error: logsError } = await supabase
          .from('audit_logs')
          .select('*', { count: 'exact', head: true });

        if (logsError) throw logsError;
        setAuditLogCount(logsCount || 0);

        // Fetch user counts by role
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role');

        if (rolesError) throw rolesError;

        // Count users by role
        const counts: Record<string, number> = {};
        rolesData?.forEach(item => {
          counts[item.role] = (counts[item.role] || 0) + 1;
        });

        const roleCountsArray = Object.entries(counts).map(([role, count]) => ({
          role,
          count,
        }));

        setRoleCounts(roleCountsArray);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          value={loading ? '...' : totalUsers}
          change={`${totalUsers} registered`}
          changeType="neutral"
          icon={Users}
          colorClass="text-primary"
        />
        <KPICard
          title="System Uptime"
          value="99.8%"
          change="Last 30 days"
          changeType="positive"
          icon={Activity}
          colorClass="text-gra-green"
        />
        <KPICard
          title="Total Projects"
          value={loading ? '...' : totalProjects}
          change="Active projects"
          changeType="neutral"
          icon={FolderKanban}
          colorClass="text-chart-4"
        />
        <KPICard
          title="Audit Logs"
          value={loading ? '...' : auditLogCount}
          change="Total entries"
          changeType="neutral"
          icon={FileText}
          colorClass="text-gra-gold"
        />
      </div>

      {/* User Role Distribution */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">User Role Distribution</h3>
          <Link to="/user-management">
            <Button variant="outline" size="sm">Manage Users</Button>
          </Link>
        </div>
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : roleCounts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No users yet</p>
          ) : (
            roleCounts.map((item) => (
              <Link
                key={item.role}
                to={`/user-management?role=${item.role}`}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/50 transition-smooth"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-medium">{roleDisplayMap[item.role] || item.role}</span>
                  <Badge variant="outline">{item.count} {item.count === 1 ? 'user' : 'users'}</Badge>
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gra-green transition-all"
                        style={{ width: `${Math.min((item.count / totalUsers) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">
                    {((item.count / totalUsers) * 100).toFixed(0)}%
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Administration Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button variant="outline" className="h-20" asChild>
          <Link to="/user-management">
            <div className="text-center">
              <div className="font-semibold">User Management</div>
              <div className="text-xs text-muted-foreground">Add, edit, or remove users</div>
            </div>
          </Link>
        </Button>
        <Button variant="outline" className="h-20" disabled>
          <div className="text-center">
            <div className="font-semibold">System Settings</div>
            <div className="text-xs text-muted-foreground">Configure system</div>
          </div>
        </Button>
        <Button variant="outline" className="h-20" disabled>
          <div className="text-center">
            <div className="font-semibold">Audit Logs</div>
            <div className="text-xs text-muted-foreground">View system logs</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;

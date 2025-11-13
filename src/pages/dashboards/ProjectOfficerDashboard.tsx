import { useState, useEffect } from 'react';
import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Clock, CheckCircle, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ProjectOfficerDashboard = () => {
  const { user } = useAuth();
  const [assignedProjects, setAssignedProjects] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch assigned projects (placeholder - would need a project_assignments table)
        setAssignedProjects(0);

        // Fetch unread notifications
        const { count: notifCount, error: notifError } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false);

        if (notifError) throw notifError;
        setUnreadNotifications(notifCount || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Task Management</h1>
        <p className="text-muted-foreground mt-1">Manage your assignments and deliverables</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Assigned Projects"
          value={loading ? '...' : assignedProjects}
          change="Active assignments"
          changeType="neutral"
          icon={FolderKanban}
          colorClass="text-primary"
        />
        <KPICard
          title="Pending Deliverables"
          value={loading ? '...' : 0}
          change="Require action"
          changeType="neutral"
          icon={Clock}
          colorClass="text-gra-gold"
        />
        <KPICard
          title="Completed"
          value={loading ? '...' : 0}
          change="Deliverables"
          changeType="positive"
          icon={CheckCircle}
          colorClass="text-gra-green"
        />
        <KPICard
          title="Notifications"
          value={loading ? '...' : unreadNotifications}
          change="Unread"
          changeType="neutral"
          icon={Bell}
          colorClass="text-chart-4"
        />
      </div>

      {/* My Assigned Projects */}
      <div className="glass-hover rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">My Assigned Projects</h3>
        <p className="text-center text-muted-foreground py-8">No projects assigned yet</p>
      </div>

      {/* Pending Deliverables */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Pending Deliverables</h3>
          <Button size="sm">Submit</Button>
        </div>
        <p className="text-center text-muted-foreground py-8">No pending deliverables</p>
      </div>

      {/* Notifications */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Notifications</h3>
          <Link to="/notifications">
            <Button variant="link" className="text-primary">View All →</Button>
          </Link>
        </div>
        {unreadNotifications === 0 ? (
          <p className="text-center text-muted-foreground py-8">No new notifications</p>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            You have {unreadNotifications} unread {unreadNotifications === 1 ? 'notification' : 'notifications'}.{' '}
            <Link to="/notifications" className="text-primary underline">
              View All
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectOfficerDashboard;

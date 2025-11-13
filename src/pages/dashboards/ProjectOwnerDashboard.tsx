import { useState, useEffect } from 'react';
import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ProjectOwnerDashboard = () => {
  const { user } = useAuth();
  const [myProjectsCount, setMyProjectsCount] = useState(0);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [linkedDecisionsCount, setLinkedDecisionsCount] = useState(0);
  const [activeIssuesCount, setActiveIssuesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch my projects (where user is owner)
        const { count: projectsCount, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id);

        if (projectsError) throw projectsError;
        setMyProjectsCount(projectsCount || 0);

        // Fetch pending approvals (decisions pending)
        const { count: approvalsCount, error: approvalsError } = await supabase
          .from('decisions')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)
          .eq('status', 'pending');

        if (approvalsError) throw approvalsError;
        setPendingApprovalsCount(approvalsCount || 0);

        // Fetch linked decisions
        const { count: decisionsCount, error: decisionsError } = await supabase
          .from('decisions')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id);

        if (decisionsError) throw decisionsError;
        setLinkedDecisionsCount(decisionsCount || 0);

        // Fetch active issues
        const { count: issuesCount, error: issuesError } = await supabase
          .from('issues')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'resolved');

        if (issuesError) throw issuesError;
        setActiveIssuesCount(issuesCount || 0);
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
        <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your projects and approvals</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="My Projects"
          value={loading ? '...' : myProjectsCount}
          change="Active projects"
          changeType="neutral"
          icon={FolderKanban}
          colorClass="text-primary"
        />
        <KPICard
          title="Pending Approvals"
          value={loading ? '...' : pendingApprovalsCount}
          change="Require action"
          changeType="neutral"
          icon={Clock}
          colorClass="text-gra-gold"
        />
        <KPICard
          title="Linked Decisions"
          value={loading ? '...' : linkedDecisionsCount}
          change="Total decisions"
          changeType="neutral"
          icon={CheckCircle}
          colorClass="text-gra-green"
        />
        <KPICard
          title="Active Issues"
          value={loading ? '...' : activeIssuesCount}
          change="Require attention"
          changeType="neutral"
          icon={AlertCircle}
          colorClass="text-chart-4"
        />
      </div>

      {/* My Project Portfolio */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">My Project Portfolio</h3>
          <Link to="/portfolio">
            <Button variant="link" className="text-primary">View All →</Button>
          </Link>
        </div>
        {myProjectsCount === 0 ? (
          <p className="text-center text-muted-foreground py-8">No projects assigned yet</p>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            You have {myProjectsCount} active {myProjectsCount === 1 ? 'project' : 'projects'}.{' '}
            <Link to="/portfolio" className="text-primary underline">
              View Portfolio
            </Link>
          </p>
        )}
      </div>

      {/* Pending Approvals */}
      <div className="glass-hover rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Pending Approvals</h3>
        {pendingApprovalsCount === 0 ? (
          <p className="text-center text-muted-foreground py-8">No pending approvals</p>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            You have {pendingApprovalsCount} pending {pendingApprovalsCount === 1 ? 'approval' : 'approvals'}.{' '}
            <Link to="/decisions" className="text-primary underline">
              Review Decisions
            </Link>
          </p>
        )}
      </div>

      {/* Issue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-destructive">Critical</h4>
            <span className="text-2xl font-bold">0</span>
          </div>
          <p className="text-sm text-muted-foreground">Require escalation</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gra-gold">High Priority</h4>
            <span className="text-2xl font-bold">0</span>
          </div>
          <p className="text-sm text-muted-foreground">Needs attention</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gra-green">Resolved</h4>
            <span className="text-2xl font-bold">0</span>
          </div>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>
      </div>
      
      <Link to="/issues">
        <Button variant="outline" className="w-full">View All Issues</Button>
      </Link>
    </div>
  );
};

export default ProjectOwnerDashboard;

import { useState, useEffect } from 'react';
import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Target, CheckSquare, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ProjectManagerDashboard = () => {
  const { user } = useAuth();
  const [activeMilestones, setActiveMilestones] = useState(0);
  const [assignedTasks, setAssignedTasks] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch active milestones
        const { count: milestonesCount, error: milestonesError } = await supabase
          .from('milestones')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'completed');

        if (milestonesError) throw milestonesError;
        setActiveMilestones(milestonesCount || 0);

        // For now, set placeholder values for tasks and meetings
        // These would typically come from dedicated tasks and meetings tables
        setAssignedTasks(0);
        setUpcomingMeetings(0);

        // Fetch upcoming meetings
        const { count: meetingsCount, error: meetingsError } = await supabase
          .from('meetings')
          .select('*', { count: 'exact', head: true })
          .gte('scheduled_at', new Date().toISOString())
          .eq('status', 'scheduled');

        if (meetingsError) throw meetingsError;
        setUpcomingMeetings(meetingsCount || 0);
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
        <h1 className="text-3xl font-bold">Project Management</h1>
        <p className="text-muted-foreground mt-1">Track milestones, tasks, and meetings</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Milestones"
          value={loading ? '...' : activeMilestones}
          change="Being tracked"
          changeType="neutral"
          icon={Target}
          colorClass="text-primary"
        />
        <KPICard
          title="Assigned Tasks"
          value={loading ? '...' : assignedTasks}
          change={`${assignedTasks} pending`}
          changeType="neutral"
          icon={CheckSquare}
          colorClass="text-gra-gold"
        />
        <KPICard
          title="SLA Compliance"
          value="85%"
          change="Target: 80%"
          changeType="positive"
          icon={TrendingUp}
          colorClass="text-gra-green"
        />
        <KPICard
          title="Upcoming Meetings"
          value={loading ? '...' : upcomingMeetings}
          change="This week"
          changeType="neutral"
          icon={Calendar}
          colorClass="text-chart-4"
        />
      </div>

      {/* Milestone Tracking */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Milestone Tracking</h3>
          <Link to="/portfolio">
            <Button variant="link" className="text-primary">View All →</Button>
          </Link>
        </div>
        {activeMilestones === 0 ? (
          <p className="text-center text-muted-foreground py-8">No active milestones</p>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            You have {activeMilestones} active {activeMilestones === 1 ? 'milestone' : 'milestones'}.{' '}
            <Link to="/portfolio" className="text-primary underline">
              View Portfolio
            </Link>
          </p>
        )}
      </div>

      {/* My Assigned Tasks */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">My Assigned Tasks</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <p className="text-center text-muted-foreground py-8">No tasks assigned yet</p>
      </div>

      {/* Upcoming Meetings */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
          <Link to="/meetings">
            <Button variant="link" className="text-primary">View All Meetings →</Button>
          </Link>
        </div>
        {upcomingMeetings === 0 ? (
          <p className="text-center text-muted-foreground py-8">No upcoming meetings</p>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            You have {upcomingMeetings} upcoming {upcomingMeetings === 1 ? 'meeting' : 'meetings'}.{' '}
            <Link to="/meetings" className="text-primary underline">
              View All
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;

import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, CheckSquare, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectManagerDashboard = () => {
  const milestones = [
    { id: 'M-001', name: 'Phase 1 Completion', project: 'Tax Modernization', status: 'On Track', progress: 85, dueDate: '2025-01-20' },
    { id: 'M-002', name: 'UAT Testing', project: 'Digital Services', status: 'At Risk', progress: 60, dueDate: '2025-01-18' },
    { id: 'M-003', name: 'Go-Live Preparation', project: 'Revenue Analytics', status: 'On Track', progress: 75, dueDate: '2025-01-25' },
  ];

  const tasks = [
    { id: 'T-001', title: 'Complete security audit', project: 'Tax Modernization', priority: 'high', status: 'in-progress', dueDate: '2025-01-15' },
    { id: 'T-002', title: 'Update project documentation', project: 'Digital Services', priority: 'medium', status: 'pending', dueDate: '2025-01-16' },
    { id: 'T-003', name: 'Stakeholder presentation', project: 'Revenue Analytics', priority: 'high', status: 'completed', dueDate: '2025-01-12' },
  ];

  const meetings = [
    { id: 'MTG-001', title: 'Weekly Project Review', project: 'Tax Modernization', date: '2025-01-14', time: '10:00 AM', type: 'video' },
    { id: 'MTG-002', title: 'Sprint Planning', project: 'Digital Services', date: '2025-01-16', time: '2:00 PM', type: 'in-person' },
  ];

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
          value={3}
          change="Being tracked"
          changeType="neutral"
          icon={Target}
          colorClass="text-primary"
        />
        <KPICard
          title="Assigned Tasks"
          value={3}
          change="3 pending"
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
          colorClass="text-gra-navy"
        />
        <KPICard
          title="Upcoming Meetings"
          value={2}
          change="This week"
          changeType="neutral"
          icon={Calendar}
          colorClass="text-gra-yellow"
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
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{milestone.name}</h4>
                  <p className="text-sm text-muted-foreground">{milestone.project}</p>
                </div>
                <Badge variant={milestone.status === 'On Track' ? 'default' : 'destructive'}>
                  {milestone.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{milestone.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gra-navy transition-all"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">Due: {milestone.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Assigned Tasks */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">My Assigned Tasks</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-smooth">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{task.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{task.project}</p>
                  <div className="flex gap-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'default'}>
                      {task.priority}
                    </Badge>
                    <Badge variant="outline">{task.status}</Badge>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{task.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
          <Link to="/meetings">
            <Button variant="link" className="text-primary">View All Meetings →</Button>
          </Link>
        </div>
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-smooth">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{meeting.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{meeting.project}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>📅 {meeting.date}</span>
                    <span>🕐 {meeting.time}</span>
                  </div>
                </div>
                <Badge>{meeting.type}</Badge>
              </div>
              {meeting.type === 'video' && (
                <Button size="sm" className="mt-3 w-full">Join Video</Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;

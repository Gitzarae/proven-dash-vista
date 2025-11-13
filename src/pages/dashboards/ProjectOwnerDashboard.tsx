import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectOwnerDashboard = () => {
  const myProjects = [
    { id: 'PRJ-001', name: 'Tax Modernization', status: 'On Track', progress: 75, decisions: 5, issues: 2 },
    { id: 'PRJ-002', name: 'Digital Services Platform', status: 'At Risk', progress: 62, decisions: 3, issues: 5 },
    { id: 'PRJ-003', name: 'Revenue Analytics', status: 'On Track', progress: 88, decisions: 2, issues: 1 },
  ];

  const pendingApprovals = [
    { id: 'DEC-045', title: 'Budget Reallocation for Q2', project: 'Tax Modernization', priority: 'critical', daysRemaining: 2 },
    { id: 'DEC-046', title: 'Vendor Contract Extension', project: 'Digital Services', priority: 'high', daysRemaining: 5 },
  ];

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
          value={3}
          change="Active projects"
          changeType="neutral"
          icon={FolderKanban}
          colorClass="text-primary"
        />
        <KPICard
          title="Pending Approvals"
          value={2}
          change="Require action"
          changeType="neutral"
          icon={Clock}
          colorClass="text-gra-gold"
        />
        <KPICard
          title="Linked Decisions"
          value={10}
          change="Total decisions"
          changeType="neutral"
          icon={CheckCircle}
          colorClass="text-gra-green"
        />
        <KPICard
          title="Active Issues"
          value={8}
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
        <div className="space-y-4">
          {myProjects.map((project) => (
            <div key={project.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.id}</p>
                </div>
                <Badge variant={project.status === 'On Track' ? 'default' : 'destructive'}>
                  {project.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gra-green transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex gap-4 mt-3">
                  <span className="text-sm text-muted-foreground">{project.decisions} decisions</span>
                  <span className="text-sm text-muted-foreground">{project.issues} issues</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="glass-hover rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Pending Approvals</h3>
        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <div key={approval.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-smooth">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{approval.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{approval.project}</p>
                  <div className="flex gap-2">
                    <Badge variant={approval.priority === 'critical' ? 'destructive' : 'default'}>
                      {approval.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{approval.daysRemaining} days remaining</span>
                  </div>
                </div>
                <Link to="/decisions">
                  <Button size="sm">Review & Approve</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-destructive">Critical</h4>
            <span className="text-2xl font-bold">2</span>
          </div>
          <p className="text-sm text-muted-foreground">Require escalation</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gra-gold">High Priority</h4>
            <span className="text-2xl font-bold">4</span>
          </div>
          <p className="text-sm text-muted-foreground">Needs attention</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gra-green">Resolved</h4>
            <span className="text-2xl font-bold">12</span>
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

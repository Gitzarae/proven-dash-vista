import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Clock, CheckCircle, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectOfficerDashboard = () => {
  const assignedProjects = [
    { id: 'PRJ-001', name: 'Tax Modernization', deliverables: 5, completed: 3, progress: 60, dueDate: '2025-01-30' },
    { id: 'PRJ-002', name: 'Digital Services Platform', deliverables: 8, completed: 5, progress: 62, dueDate: '2025-02-15' },
  ];

  const pendingDeliverables = [
    { id: 'DEL-001', title: 'Monthly Status Report', project: 'Tax Modernization', status: 'in-progress', dueDate: '2025-01-15' },
    { id: 'DEL-002', title: 'Risk Assessment Document', project: 'Digital Services', status: 'pending', dueDate: '2025-01-18' },
    { id: 'DEL-003', title: 'Testing Results Summary', project: 'Tax Modernization', status: 'in-progress', dueDate: '2025-01-20' },
  ];

  const notifications = [
    { id: 'N-001', message: 'New task assigned: Complete security audit', date: '2025-01-12', read: false },
    { id: 'N-002', message: 'Deliverable DEL-001 is due in 3 days', date: '2025-01-12', read: false },
    { id: 'N-003', message: 'Meeting scheduled for 2025-01-14 at 10:00 AM', date: '2025-01-11', read: true },
  ];

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
          value={2}
          change="Active assignments"
          changeType="neutral"
          icon={FolderKanban}
          colorClass="text-primary"
        />
        <KPICard
          title="Pending Deliverables"
          value={3}
          change="Require action"
          changeType="neutral"
          icon={Clock}
          colorClass="text-gra-gold"
        />
        <KPICard
          title="Completed"
          value={8}
          change="Deliverables"
          changeType="positive"
          icon={CheckCircle}
          colorClass="text-gra-green"
        />
        <KPICard
          title="Notifications"
          value={1}
          change="Unread"
          changeType="neutral"
          icon={Bell}
          colorClass="text-chart-4"
        />
      </div>

      {/* My Assigned Projects */}
      <div className="glass-hover rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">My Assigned Projects</h3>
        <div className="space-y-4">
          {assignedProjects.map((project) => (
            <div key={project.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.id}</p>
                </div>
                <Badge>
                  {project.deliverables} deliverables
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{project.completed} / {project.deliverables} completed</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gra-green transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">Due: {project.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Deliverables */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Pending Deliverables</h3>
          <Button size="sm">Submit</Button>
        </div>
        <div className="space-y-4">
          {pendingDeliverables.map((deliverable) => (
            <div key={deliverable.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-smooth">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{deliverable.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{deliverable.project}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">{deliverable.status}</Badge>
                    <span className="text-sm text-muted-foreground">Due: {deliverable.dueDate}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">Upload</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Notifications</h3>
          <Link to="/notifications">
            <Button variant="link" className="text-primary">View All →</Button>
          </Link>
        </div>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border rounded-lg transition-smooth ${
                notification.read 
                  ? 'border-border hover:border-primary/50' 
                  : 'border-primary bg-primary/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm mb-1">{notification.message}</p>
                  <span className="text-xs text-muted-foreground">{notification.date}</span>
                </div>
                {!notification.read && (
                  <Badge variant="default" className="ml-2">New</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectOfficerDashboard;

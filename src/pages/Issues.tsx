import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Issues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const issues = [
    {
      id: 'ISS-001',
      title: 'Database Performance Degradation',
      description: 'Query response times increased by 300% in production environment',
      project: 'Tax Modernization',
      owner: 'John Doe',
      assignee: 'IT Support Team',
      severity: 'critical',
      status: 'open',
      age: 3,
      dueDate: '2025-01-14',
      loggedDate: '2025-01-11',
      escalated: true
    },
    {
      id: 'ISS-002',
      title: 'Integration API Timeout',
      description: 'Third-party API integration experiencing intermittent timeouts',
      project: 'Digital Services',
      owner: 'Jane Smith',
      assignee: 'Mike Johnson',
      severity: 'high',
      status: 'in-progress',
      age: 5,
      dueDate: '2025-01-16',
      loggedDate: '2025-01-07',
      escalated: false,
      overdue: false
    },
    {
      id: 'ISS-003',
      title: 'User Interface Alignment Issue',
      description: 'Minor UI elements misaligned on mobile devices',
      project: 'Revenue Analytics',
      owner: 'Mike Johnson',
      assignee: 'Design Team',
      severity: 'medium',
      status: 'open',
      age: 2,
      dueDate: '2025-01-18',
      loggedDate: '2025-01-10',
      escalated: false,
      overdue: false
    },
    {
      id: 'ISS-004',
      title: 'Security Vulnerability',
      description: 'Potential SQL injection vulnerability identified in login module',
      project: 'Tax Modernization',
      owner: 'John Doe',
      assignee: 'Security Team',
      severity: 'critical',
      status: 'open',
      age: 7,
      dueDate: '2025-01-10',
      loggedDate: '2025-01-05',
      escalated: true,
      overdue: true
    },
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertCircle;
      case 'high': return AlertTriangle;
      default: return Info;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-gra-gold';
      default: return 'text-chart-4';
    }
  };

  const stats = {
    critical: issues.filter(i => i.severity === 'critical').length,
    high: issues.filter(i => i.severity === 'high').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    slaAdherence: 82,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Issue & Bottleneck Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor and resolve project blockers and issues</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Log Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Log New Issue</DialogTitle>
              <DialogDescription>Report a project blocker or issue for tracking</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Issue Title" />
              <textarea 
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="Description"
              />
              <Input placeholder="Project" />
              <Input placeholder="Issue Owner" />
              <Input placeholder="Assigned To" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" placeholder="Resolution Due Date" />
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <span className="text-3xl font-bold">{stats.critical}</span>
          </div>
          <h3 className="font-semibold">Critical</h3>
          <p className="text-sm text-muted-foreground">2 escalated</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-gra-gold" />
            <span className="text-3xl font-bold">{stats.high}</span>
          </div>
          <h3 className="font-semibold">High Priority</h3>
          <p className="text-sm text-muted-foreground">Avg age: 5 days</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Info className="w-8 h-8 text-chart-4" />
            <span className="text-3xl font-bold">{stats.inProgress}</span>
          </div>
          <h3 className="font-semibold">In Progress</h3>
          <p className="text-sm text-muted-foreground">Being actively worked</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-gra-green" />
            <span className="text-3xl font-bold">{stats.slaAdherence}%</span>
          </div>
          <h3 className="font-semibold">SLA Adherence</h3>
          <p className="text-sm text-muted-foreground">Target: 80%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by title, project, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select defaultValue="all-severity">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-severity">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Issues Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Issues ({issues.length})</TabsTrigger>
          <TabsTrigger value="critical">Critical ({stats.critical})</TabsTrigger>
          <TabsTrigger value="escalated">Escalated ({issues.filter(i => i.escalated).length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({issues.filter(i => i.overdue).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {issues.map((issue) => {
            const SeverityIcon = getSeverityIcon(issue.severity);
            return (
              <div 
                key={issue.id} 
                className={`glass-hover rounded-xl p-6 ${issue.severity === 'critical' ? 'border-l-4 border-destructive' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <SeverityIcon className={`w-6 h-6 ${getSeverityColor(issue.severity)}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{issue.title}</h3>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {issue.escalated && (
                          <Badge variant="destructive">Escalated</Badge>
                        )}
                        {issue.overdue && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Severity:</span>
                        <Badge variant={issue.severity === 'critical' ? 'destructive' : 'default'} className="ml-2">
                          {issue.severity}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Project:</span>
                        <span className="ml-2 font-medium">{issue.project}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="ml-2 font-medium">{issue.owner}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span className="ml-2 font-medium">{issue.assignee}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Age:</span>
                        <span className="ml-2 font-medium">{issue.age} days</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Due:</span>
                        <span className="ml-2 font-medium">{issue.dueDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <Badge variant="outline">{issue.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Logged: {issue.loggedDate}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {issue.escalated && (
                        <Button variant="destructive" size="sm">Escalate again</Button>
                      )}
                      <Button variant="outline" size="sm">View details</Button>
                      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Update status</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Issue Status</DialogTitle>
                            <DialogDescription>Change the status of {issue.id}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <label className="text-sm font-medium">Current Status</label>
                              <p className="text-sm text-muted-foreground">{issue.status}</p>
                            </div>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="New Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                            <textarea 
                              className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                              placeholder="Notes (optional)"
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
                              <Button onClick={() => setStatusDialogOpen(false)}>Confirm update</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="critical" className="space-y-4 mt-6">
          {issues.filter(i => i.severity === 'critical').map((issue) => (
            <div key={issue.id} className="glass-hover rounded-xl p-6 border-l-4 border-destructive bg-destructive/5">
              <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{issue.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span>Due: {issue.dueDate}</span>
                  <span>Assigned: {issue.assignee}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="destructive" size="sm">Escalate</Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="escalated" className="space-y-4 mt-6">
          {issues.filter(i => i.escalated).map((issue) => (
            <div key={issue.id} className="glass-hover rounded-xl p-6 border-l-4 border-gra-gold">
              <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{issue.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span>Logged: {issue.loggedDate}</span>
                  <span>Assigned: {issue.assignee}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View details</Button>
                  <Button variant="outline" size="sm">Update status</Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4 mt-6">
          {issues.filter(i => i.overdue).map((issue) => (
            <div key={issue.id} className="glass-hover rounded-xl p-6 border-l-4 border-destructive bg-destructive/5">
              <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{issue.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span className="text-destructive">Should have been resolved: {issue.dueDate}</span>
                  <span>Owner: {issue.owner}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View details</Button>
                  <Button variant="destructive" size="sm">Send escalation</Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Issues;

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
import { Search, Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Decisions = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const decisions = [
    {
      id: 'DEC-001',
      title: 'Budget Reallocation for Q2',
      description: 'Request to reallocate budget from Phase 1 to accelerate Phase 2 development',
      project: 'Tax Modernization',
      owner: 'John Doe',
      assignee: 'Jane Smith',
      priority: 'critical',
      dueDate: '2025-01-20',
      status: 'pending',
      decidedDate: null,
      impact: 'Will accelerate delivery by 2 weeks'
    },
    {
      id: 'DEC-002',
      title: 'Vendor Contract Extension',
      description: 'Extend current vendor contract for additional 6 months',
      project: 'Digital Services Platform',
      owner: 'Jane Smith',
      assignee: 'Mike Johnson',
      priority: 'high',
      dueDate: '2025-01-25',
      status: 'approved',
      decidedDate: '2025-01-10',
      impact: 'Ensures continuity of service delivery'
    },
    {
      id: 'DEC-003',
      title: 'Technology Stack Approval',
      description: 'Approve use of new cloud infrastructure',
      project: 'Revenue Analytics',
      owner: 'Mike Johnson',
      assignee: 'John Doe',
      priority: 'medium',
      dueDate: '2025-01-15',
      status: 'overdue',
      decidedDate: null,
      impact: 'Critical for project timeline'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-gra-green';
      case 'pending': return 'text-gra-gold';
      case 'overdue': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const stats = {
    pending: decisions.filter(d => d.status === 'pending').length,
    approved: decisions.filter(d => d.status === 'approved').length,
    overdue: decisions.filter(d => d.status === 'overdue').length,
    closureRate: 74,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Decision Management</h1>
          <p className="text-muted-foreground mt-1">Track decisions, approvals, and follow-up actions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Decision
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Decision</DialogTitle>
              <DialogDescription>Enter decision details for tracking and approval</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Decision Title" />
              <textarea 
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="Context/Description"
              />
              <Input placeholder="Project/Programme" />
              <Input placeholder="Decision Owner" />
              <Input placeholder="Action Owner" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" placeholder="Due Date" />
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
            <Clock className="w-8 h-8 text-gra-gold" />
            <span className="text-3xl font-bold">{stats.pending}</span>
          </div>
          <h3 className="font-semibold">Pending</h3>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-gra-green" />
            <span className="text-3xl font-bold">{stats.approved}</span>
          </div>
          <h3 className="font-semibold">Approved</h3>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-destructive" />
            <span className="text-3xl font-bold">{stats.overdue}</span>
          </div>
          <h3 className="font-semibold">Overdue</h3>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-primary" />
            <span className="text-3xl font-bold">{stats.closureRate}%</span>
          </div>
          <h3 className="font-semibold">Closure Rate</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by title, project, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-priority">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-priority">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Decisions Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Decisions ({decisions.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({stats.overdue})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {decisions.map((decision) => {
            const StatusIcon = getStatusIcon(decision.status);
            return (
              <div key={decision.id} className="glass-hover rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <StatusIcon className={`w-6 h-6 ${getStatusColor(decision.status)}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{decision.title}</h3>
                        <p className="text-sm text-muted-foreground">{decision.description}</p>
                      </div>
                      <Badge variant={decision.priority === 'critical' ? 'destructive' : 'default'}>
                        {decision.priority}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Project:</span>
                        <span className="ml-2 font-medium">{decision.project}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="ml-2 font-medium">{decision.owner}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Assignee:</span>
                        <span className="ml-2 font-medium">{decision.assignee}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Due:</span>
                        <span className="ml-2 font-medium">{decision.dueDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <Badge>{decision.status}</Badge>
                      {decision.decidedDate && (
                        <span className="text-sm text-muted-foreground">
                          Decided: {decision.decidedDate}
                        </span>
                      )}
                    </div>
                    {decision.impact && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm"><strong>Impact:</strong> {decision.impact}</p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">View details</Button>
                      {decision.status === 'pending' && (
                        <Button variant="outline" size="sm">Send reminder</Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {decisions.filter(d => d.status === 'pending').map((decision) => (
            <div key={decision.id} className="glass-hover rounded-xl p-6 border-l-4 border-gra-gold">
              <h3 className="text-lg font-semibold mb-2">{decision.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{decision.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span>Due: {decision.dueDate}</span>
                  <span>Owner: {decision.owner}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View details</Button>
                  <Button variant="outline" size="sm">Send reminder</Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
          {decisions.filter(d => d.status === 'approved').map((decision) => (
            <div key={decision.id} className="glass-hover rounded-xl p-6 border-l-4 border-gra-green">
              <h3 className="text-lg font-semibold mb-2">{decision.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{decision.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span>Decided: {decision.decidedDate}</span>
                  <span>Owner: {decision.owner}</span>
                </div>
                <Button variant="outline" size="sm">View details</Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4 mt-6">
          {decisions.filter(d => d.status === 'overdue').map((decision) => (
            <div key={decision.id} className="glass-hover rounded-xl p-6 border-l-4 border-destructive bg-destructive/5">
              <h3 className="text-lg font-semibold mb-2">{decision.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{decision.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span className="text-destructive">Was due: {decision.dueDate}</span>
                  <span>Owner: {decision.owner}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View details</Button>
                  <Button variant="destructive" size="sm">Escalate</Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Decisions;

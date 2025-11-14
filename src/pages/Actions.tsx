import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
import { Search, Plus, CheckCircle2, Clock, AlertCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Action {
  id: string;
  title: string;
  description: string;
  project_id: string;
  owner_id: string;
  assigned_to: string;
  status: string;
  priority: string;
  due_date: string;
  completed_date: string | null;
  verified_by: string | null;
  evidence_url: string | null;
  notes: string | null;
}

const Actions = () => {
  const { user } = useAuth();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    assigned_to: '',
    priority: 'medium',
    due_date: '',
  });

  useEffect(() => {
    fetchActions();
  }, [user]);

  const fetchActions = async () => {
    try {
      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActions(data || []);
    } catch (error: any) {
      toast.error('Failed to load actions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAction = async () => {
    if (!formData.title || !formData.due_date || !formData.assigned_to) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase.from('actions').insert({
        ...formData,
        owner_id: user?.id,
      });

      if (error) throw error;
      
      toast.success('Action created successfully');
      setDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        project_id: '',
        assigned_to: '',
        priority: 'medium',
        due_date: '',
      });
      fetchActions();
    } catch (error: any) {
      toast.error('Failed to create action');
      console.error(error);
    }
  };

  const handleUpdateStatus = async (actionId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'completed') {
        updateData.completed_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('actions')
        .update(updateData)
        .eq('id', actionId);

      if (error) throw error;
      
      toast.success('Action status updated');
      fetchActions();
    } catch (error: any) {
      toast.error('Failed to update action');
      console.error(error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'verified': return CheckCircle2;
      case 'in-progress': return Clock;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-gra-navy';
      case 'verified': return 'text-chart-4';
      case 'in-progress': return 'text-gra-gold';
      case 'overdue': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: actions.length,
    pending: actions.filter(a => a.status === 'pending').length,
    inProgress: actions.filter(a => a.status === 'in-progress').length,
    completed: actions.filter(a => a.status === 'completed').length,
  };

  const canCreateAction = user?.role === 'project_manager' || 
                          user?.role === 'project_owner' || 
                          user?.role === 'system_admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Action Items</h1>
          <p className="text-muted-foreground mt-1">Track and manage action items across projects</p>
        </div>
        {canCreateAction && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Action
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Action</DialogTitle>
                <DialogDescription>Assign a new action item to track</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input 
                  placeholder="Action Title" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <textarea 
                  className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <Input 
                  type="date" 
                  placeholder="Due Date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
                <Select value={formData.priority} onValueChange={(val) => setFormData({...formData, priority: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Assigned To (User ID)" 
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateAction}>Create Action</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-primary" />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <h3 className="font-semibold">Total Actions</h3>
          <p className="text-sm text-muted-foreground">All action items</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-gra-gold" />
            <span className="text-3xl font-bold">{stats.pending}</span>
          </div>
          <h3 className="font-semibold">Pending</h3>
          <p className="text-sm text-muted-foreground">Not started yet</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-chart-4" />
            <span className="text-3xl font-bold">{stats.inProgress}</span>
          </div>
          <h3 className="font-semibold">In Progress</h3>
          <p className="text-sm text-muted-foreground">Being worked on</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-8 h-8 text-gra-navy" />
            <span className="text-3xl font-bold">{stats.completed}</span>
          </div>
          <h3 className="font-semibold">Completed</h3>
          <p className="text-sm text-muted-foreground">Done</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-hover rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
      </div>

      {/* Actions List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Actions</TabsTrigger>
          <TabsTrigger value="my-actions">My Actions</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading actions...</div>
          ) : filteredActions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No actions found</div>
          ) : (
            filteredActions.map((action) => {
              const StatusIcon = getStatusIcon(action.status);
              const statusColor = getStatusColor(action.status);

              return (
                <div key={action.id} className="glass-hover rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                        <h3 className="text-lg font-semibold">{action.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{action.status}</Badge>
                        <Badge>{action.priority}</Badge>
                        <Badge variant="outline">Due: {new Date(action.due_date).toLocaleDateString()}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {action.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(action.id, 'in-progress')}
                      >
                        Start
                      </Button>
                    )}
                    {action.status === 'in-progress' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(action.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                    {action.status === 'completed' && user?.role !== 'project_officer' && (
                      <Button 
                        size="sm"
                        onClick={() => handleUpdateStatus(action.id, 'verified')}
                      >
                        Verify
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Evidence
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="my-actions" className="space-y-4">
          {filteredActions.filter(a => a.assigned_to === user?.id).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No actions assigned to you</div>
          ) : (
            filteredActions.filter(a => a.assigned_to === user?.id).map((action) => {
              const StatusIcon = getStatusIcon(action.status);
              const statusColor = getStatusColor(action.status);

              return (
                <div key={action.id} className="glass-hover rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                        <h3 className="text-lg font-semibold">{action.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{action.status}</Badge>
                        <Badge>{action.priority}</Badge>
                        <Badge variant="outline">Due: {new Date(action.due_date).toLocaleDateString()}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {filteredActions.filter(a => new Date(a.due_date) < new Date() && a.status !== 'completed' && a.status !== 'verified').length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No overdue actions</div>
          ) : (
            filteredActions.filter(a => new Date(a.due_date) < new Date() && a.status !== 'completed' && a.status !== 'verified').map((action) => (
              <div key={action.id} className="glass-hover rounded-xl p-6 border-l-4 border-destructive">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <h3 className="text-lg font-semibold">{action.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="destructive">OVERDUE</Badge>
                      <Badge>{action.priority}</Badge>
                      <Badge variant="outline">Due: {new Date(action.due_date).toLocaleDateString()}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Actions;

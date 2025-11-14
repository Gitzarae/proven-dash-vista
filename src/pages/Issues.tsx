import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Issues = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', severity: 'medium', due_date: '', assigned_to: '' });

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase.from('issues').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setIssues(data || []);
    } catch (error: any) {
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.due_date || !formData.assigned_to) {
      toast.error('Please fill required fields');
      return;
    }
    try {
      const { error } = await supabase.from('issues').insert({ ...formData, reported_by: user?.id });
      if (error) throw error;
      toast.success('Issue created');
      setDialogOpen(false);
      fetchIssues();
    } catch (error: any) {
      toast.error('Failed to create issue');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Issues & Escalations</h1>
          <p className="text-muted-foreground mt-1">Track and resolve project blockers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" />Log Issue</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Issue</DialogTitle>
              <DialogDescription>Report a project blocker</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <textarea className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <Select value={formData.severity} onValueChange={(val) => setFormData({...formData, severity: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})} />
              <Input placeholder="Assigned To (User ID)" value={formData.assigned_to} onChange={(e) => setFormData({...formData, assigned_to: e.target.value})} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : issues.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No issues found</div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.id} className="glass-hover rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <h3 className="text-lg font-semibold">{issue.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge>{issue.severity}</Badge>
                <Badge variant="outline">{issue.status}</Badge>
                <Badge variant="outline">Due: {new Date(issue.due_date).toLocaleDateString()}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Issues;

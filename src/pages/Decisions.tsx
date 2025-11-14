import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Decisions = () => {
  const { user } = useAuth();
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', due_date: '', owner_id: '' });

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      const { data, error } = await supabase.from('decisions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setDecisions(data || []);
    } catch (error: any) {
      toast.error('Failed to load decisions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.owner_id) {
      toast.error('Please fill required fields');
      return;
    }
    try {
      const { error } = await supabase.from('decisions').insert({ ...formData, created_by: user?.id });
      if (error) throw error;
      toast.success('Decision created');
      setDialogOpen(false);
      setFormData({ title: '', description: '', due_date: '', owner_id: '' });
      fetchDecisions();
    } catch (error: any) {
      toast.error('Failed to create decision');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase.from('decisions').update({ status: 'approved', decision_date: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      toast.success('Decision approved');
      fetchDecisions();
    } catch (error: any) {
      toast.error('Failed to approve');
    }
  };

  const stats = {
    pending: decisions.filter(d => d.status === 'pending').length,
    approved: decisions.filter(d => d.status === 'approved').length,
    total: decisions.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Decision Management</h1>
          <p className="text-muted-foreground mt-1">Track decisions and approvals</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" />New Decision</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Decision</DialogTitle>
              <DialogDescription>Enter decision details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <textarea className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <Input placeholder="Owner ID" value={formData.owner_id} onChange={(e) => setFormData({...formData, owner_id: e.target.value})} />
              <Input type="date" value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-gra-gold" />
            <span className="text-3xl font-bold">{stats.pending}</span>
          </div>
          <h3 className="font-semibold">Pending</h3>
          <p className="text-sm text-muted-foreground">Awaiting approval</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-gra-navy" />
            <span className="text-3xl font-bold">{stats.approved}</span>
          </div>
          <h3 className="font-semibold">Approved</h3>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-primary" />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <h3 className="font-semibold">Total</h3>
          <p className="text-sm text-muted-foreground">All decisions</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : decisions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No decisions found</div>
      ) : (
        <div className="space-y-4">
          {decisions.map((decision) => (
            <div key={decision.id} className="glass-hover rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{decision.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{decision.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={decision.status === 'approved' ? 'default' : 'outline'}>{decision.status}</Badge>
                    {decision.due_date && <Badge variant="outline">Due: {new Date(decision.due_date).toLocaleDateString()}</Badge>}
                  </div>
                </div>
              </div>
              {decision.status === 'pending' && (user?.role === 'top_management' || user?.role === 'project_owner') && (
                <Button size="sm" onClick={() => handleApprove(decision.id)}>Approve</Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Decisions;

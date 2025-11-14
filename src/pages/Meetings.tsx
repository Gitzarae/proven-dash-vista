import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Video } from 'lucide-react';
import { toast } from 'sonner';

const Meetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', scheduled_at: '', meeting_url: '', duration_minutes: 60 });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase.from('meetings').select('*').order('scheduled_at', { ascending: false });
      if (error) throw error;
      setMeetings(data || []);
    } catch (error: any) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.scheduled_at) {
      toast.error('Please fill required fields');
      return;
    }
    try {
      const { error } = await supabase.from('meetings').insert({ ...formData, organizer_id: user?.id });
      if (error) throw error;
      toast.success('Meeting scheduled');
      setDialogOpen(false);
      setFormData({ title: '', description: '', scheduled_at: '', meeting_url: '', duration_minutes: 60 });
      fetchMeetings();
    } catch (error: any) {
      toast.error('Failed to create meeting');
    }
  };

  const stats = {
    scheduled: meetings.filter(m => m.status === 'scheduled').length,
    completed: meetings.filter(m => m.status === 'completed').length,
    total: meetings.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage review meetings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" />Schedule Meeting</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Meeting</DialogTitle>
              <DialogDescription>Create a new meeting</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <textarea className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <Input type="datetime-local" value={formData.scheduled_at} onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})} />
              <Input placeholder="Meeting URL (optional)" value={formData.meeting_url} onChange={(e) => setFormData({...formData, meeting_url: e.target.value})} />
              <Input type="number" placeholder="Duration (minutes)" value={formData.duration_minutes} onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Schedule</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-primary" />
            <span className="text-3xl font-bold">{stats.scheduled}</span>
          </div>
          <h3 className="font-semibold">Scheduled</h3>
          <p className="text-sm text-muted-foreground">Upcoming</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Video className="w-8 h-8 text-chart-4" />
            <span className="text-3xl font-bold">{stats.completed}</span>
          </div>
          <h3 className="font-semibold">Completed</h3>
          <p className="text-sm text-muted-foreground">Past</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-gra-navy" />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <h3 className="font-semibold">Total</h3>
          <p className="text-sm text-muted-foreground">All</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No meetings scheduled</div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="glass-hover rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{meeting.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{meeting.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{meeting.status}</Badge>
                    <Badge variant="outline">{new Date(meeting.scheduled_at).toLocaleString()}</Badge>
                    <Badge variant="outline">{meeting.duration_minutes} min</Badge>
                  </div>
                </div>
              </div>
              {meeting.meeting_url && meeting.status === 'scheduled' && (
                <Button size="sm" className="gap-2" onClick={() => window.open(meeting.meeting_url, '_blank')}>
                  <Video className="w-4 h-4" />Join
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meetings;

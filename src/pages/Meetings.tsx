import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Users, Video, FileText, CheckCircle, Plus } from 'lucide-react';

const Meetings = () => {
  const meetings = [
    {
      id: 'MTG-001',
      title: 'Weekly Project Review',
      project: 'Tax Modernization',
      date: '2025-01-14',
      time: '10:00 AM',
      attendees: 8,
      status: 'scheduled',
      type: 'video',
      agendaReady: true,
      notesCaptured: false,
      videoLink: 'https://meet.example.com/proj-001'
    },
    {
      id: 'MTG-002',
      title: 'Sprint Planning',
      project: 'Digital Services',
      date: '2025-01-16',
      time: '2:00 PM',
      attendees: 12,
      status: 'scheduled',
      type: 'in-person',
      agendaReady: true,
      notesCaptured: false
    },
    {
      id: 'MTG-003',
      title: 'Stakeholder Update',
      project: 'Revenue Analytics',
      date: '2025-01-12',
      time: '9:00 AM',
      attendees: 15,
      status: 'completed',
      type: 'hybrid',
      agendaReady: true,
      notesCaptured: true
    },
  ];

  const stats = {
    scheduled: meetings.filter(m => m.status === 'scheduled').length,
    video: meetings.filter(m => m.type === 'video' || m.type === 'hybrid').length,
    agendas: meetings.filter(m => m.agendaReady).length,
    notes: meetings.filter(m => m.notesCaptured).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage review meetings</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
              <DialogDescription>Create a new project review meeting</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Meeting Title" />
              <Input placeholder="Project" />
              <Input type="date" placeholder="Date" />
              <Input type="time" placeholder="Time" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Meeting Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Conference</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Expected Attendees" />
              <textarea 
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="Agenda notes (optional - will be auto-generated)"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Schedule Meeting</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-primary" />
            <span className="text-3xl font-bold">{stats.scheduled}</span>
          </div>
          <h3 className="font-semibold">Scheduled</h3>
          <p className="text-sm text-muted-foreground">Upcoming meetings</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Video className="w-8 h-8 text-chart-4" />
            <span className="text-3xl font-bold">{stats.video}</span>
          </div>
          <h3 className="font-semibold">Video Meetings</h3>
          <p className="text-sm text-muted-foreground">With video link</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-gra-gold" />
            <span className="text-3xl font-bold">{stats.agendas}</span>
          </div>
          <h3 className="font-semibold">Agendas Generated</h3>
          <p className="text-sm text-muted-foreground">Auto-generated</p>
        </div>
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-gra-yellow" />
            <span className="text-3xl font-bold">{stats.notes}</span>
          </div>
          <h3 className="font-semibold">Notes Captured</h3>
          <p className="text-sm text-muted-foreground">With notes</p>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="glass-hover rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{meeting.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{meeting.attendees} attendees</span>
                  </div>
                  <div>
                    <Badge variant="outline">{meeting.status}</Badge>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{meeting.type}</Badge>
                  {meeting.agendaReady && (
                    <Badge variant="outline" className="border-gra-navy text-gra-navy">
                      Agenda Ready
                    </Badge>
                  )}
                  {meeting.notesCaptured && (
                    <Badge variant="outline" className="border-gra-yellow text-gra-yellow">
                      Notes Captured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Project: {meeting.project}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {(meeting.type === 'video' || meeting.type === 'hybrid') && meeting.status === 'scheduled' && (
                <Button className="gap-2">
                  <Video className="w-4 h-4" />
                  Join Video
                </Button>
              )}
              <Button variant="outline">View Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meetings;

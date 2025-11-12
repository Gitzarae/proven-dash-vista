import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KPICard from '@/components/dashboard/KPICard';
import { Bell, FileText, AlertCircle, Clock, Trash2 } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 'N-001', title: 'Decision Requires Approval', message: 'Budget Reallocation for Q2 requires your approval', category: 'decision', timestamp: '2025-01-12 10:30 AM', read: false, actionUrl: '/decisions' },
    { id: 'N-002', title: 'Issue Escalated', message: 'Database Performance Degradation has been escalated', category: 'issue', timestamp: '2025-01-12 09:15 AM', read: false, actionUrl: '/issues' },
    { id: 'N-003', title: 'Meeting Reminder', message: 'Weekly Project Review starts in 1 hour', category: 'meeting', timestamp: '2025-01-12 09:00 AM', read: true, actionUrl: '/meetings' },
    { id: 'N-004', title: 'Project Update', message: 'Tax Modernization milestone completed', category: 'project', timestamp: '2025-01-11 04:30 PM', read: true, actionUrl: '/portfolio' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">Manage alerts and notification preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Unread" value={unreadCount} change="Require attention" changeType="neutral" icon={Bell} colorClass="text-primary" />
        <KPICard title="Total" value={notifications.length} change="Total notifications" changeType="neutral" icon={FileText} colorClass="text-chart-4" />
        <KPICard title="Alerts" value={2} change="Critical alerts" changeType="neutral" icon={AlertCircle} colorClass="text-destructive" />
        <KPICard title="Reminders" value={1} change="Pending reminders" changeType="neutral" icon={Clock} colorClass="text-gra-gold" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <Button variant="outline" size="sm">Mark All as Read</Button>
          {notifications.map((notif) => (
            <div key={notif.id} className={`glass-hover rounded-xl p-6 ${!notif.read ? 'border-l-4 border-primary' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{notif.title}</h3>
                    <Badge variant="outline">{notif.category}</Badge>
                    {!notif.read && <Badge>New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                  <span className="text-xs text-muted-foreground">{notif.timestamp}</span>
                </div>
                <div className="flex gap-2">
                  {!notif.read && <Button variant="outline" size="sm">Mark as Read</Button>}
                  {notif.actionUrl && <Button variant="outline" size="sm">View Details</Button>}
                  <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 mt-6">
          {notifications.filter(n => !n.read).map((notif) => (
            <div key={notif.id} className="glass-hover rounded-xl p-6 border-l-4 border-primary">
              <h3 className="font-semibold mb-2">{notif.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{notif.timestamp}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Mark as Read</Button>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="glass-hover rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span>Email Notifications</span><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><span>Push Notifications</span><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><span>SMS Notifications</span><Switch /></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span>Decision Alerts</span><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><span>Issue Alerts</span><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><span>Meeting Reminders</span><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><span>Project Updates</span><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><span>System Alerts</span><Switch defaultChecked /></div>
              </div>
            </div>
            <Button>Save Preferences</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;

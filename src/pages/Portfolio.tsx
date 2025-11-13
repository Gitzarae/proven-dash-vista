import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const projects = [
    {
      id: 'PRJ-001',
      name: 'Tax Modernization System',
      owner: 'IT Department',
      manager: 'John Doe',
      status: 'On Track',
      progress: 75,
      budget: { spent: 2.5, total: 4.0 },
      issues: { total: 5, critical: 1 },
      milestone: { name: 'Phase 2 Completion', date: '2025-01-30' }
    },
    {
      id: 'PRJ-002',
      name: 'Digital Services Platform',
      owner: 'Digital Services',
      manager: 'Jane Smith',
      status: 'At Risk',
      progress: 62,
      budget: { spent: 3.2, total: 5.0 },
      issues: { total: 8, critical: 3 },
      milestone: { name: 'UAT Testing', date: '2025-01-25' }
    },
    {
      id: 'PRJ-003',
      name: 'Revenue Analytics Dashboard',
      owner: 'Strategy',
      manager: 'Mike Johnson',
      status: 'On Track',
      progress: 88,
      budget: { spent: 1.8, total: 2.5 },
      issues: { total: 2, critical: 0 },
      milestone: { name: 'Go-Live', date: '2025-02-15' }
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all programmes with quick access to critical actions
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-lg font-bold">GH₵ 11.5M</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Committed Spend</p>
            <p className="text-lg font-bold">GH₵ 7.5M</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Enter project details to create a new programme
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="Project Name" />
                <Input placeholder="Executive Sponsor" />
                <Input placeholder="Delivery Owner" />
                <Input placeholder="Project Manager" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Delivery Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" placeholder="Next Major Milestone" />
                <Input type="number" placeholder="Budget (GH₵)" />
                <textarea 
                  className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                  placeholder="Executive Summary"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, code, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="on-track">On track</SelectItem>
              <SelectItem value="at-risk">At risk</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="progress">Progress (high to low)</SelectItem>
              <SelectItem value="budget">Budget (high to low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass-hover rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold">Project</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Owner</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Progress</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Budget</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Issues</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Next Milestone</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t border-border hover:bg-muted/30 transition-smooth">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold">{project.name}</div>
                      <div className="text-sm text-muted-foreground">{project.id}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm">{project.owner}</div>
                      <div className="text-xs text-muted-foreground">{project.manager}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={project.status === 'On Track' ? 'default' : 'destructive'}>
                      {project.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-32 bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gra-navy transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div>GH₵ {project.budget.spent}M / {project.budget.total}M</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <Badge variant="outline">{project.issues.total} total</Badge>
                      {project.issues.critical > 0 && (
                        <Badge variant="destructive">{project.issues.critical} critical</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div>{project.milestone.name}</div>
                      <div className="text-muted-foreground">{project.milestone.date}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">View summary</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{project.name}</DialogTitle>
                          <DialogDescription>{project.id}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <label className="text-sm font-semibold">Owner</label>
                            <p className="text-sm text-muted-foreground">{project.owner} • {project.manager}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Status</label>
                            <div className="mt-1">
                              <Badge variant={project.status === 'On Track' ? 'default' : 'destructive'}>
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Progress</label>
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gra-navy transition-all"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Next Milestone</label>
                            <p className="text-sm text-muted-foreground">{project.milestone.name} • {project.milestone.date}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Budget Utilization</label>
                            <p className="text-sm text-muted-foreground">
                              {((project.budget.spent / project.budget.total) * 100).toFixed(1)}% utilized
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Issues Summary</label>
                            <p className="text-sm text-muted-foreground">
                              {project.issues.total} total • {project.issues.critical} critical
                            </p>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Link to="/issues" className="flex-1">
                              <Button variant="outline" className="w-full">Log blocker</Button>
                            </Link>
                            <Link to="/decisions" className="flex-1">
                              <Button className="w-full">Raise decision</Button>
                            </Link>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import { Search, Plus, Edit, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  owner: string;
  manager: string;
  status: string;
  progress: number;
  budget: { spent: number; total: number };
  issues: { total: number; critical: number };
  milestone: { name: string; date: string };
}

const Portfolio = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneStartDate, setMilestoneStartDate] = useState('');
  const [milestoneEndDate, setMilestoneEndDate] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);

  const handleCancel = () => {
    setIsDialogOpen(false);
    // Reset form fields
    setMilestoneName('');
    setMilestoneStartDate('');
    setMilestoneEndDate('');
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setEditedProject({ ...project });
    setIsEditMode(false);
    setIsSummaryDialogOpen(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (!editedProject || !selectedProject) return;
    
    // Update the project in the projects array
    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === editedProject.id ? editedProject : p
      )
    );
    
    setSelectedProject(editedProject);
    setIsEditMode(false);
    // You could add a toast notification here for success
  };

  const handleCancelEdit = () => {
    if (selectedProject) {
      setEditedProject({ ...selectedProject });
    }
    setIsEditMode(false);
  };

  const [projects, setProjects] = useState<Project[]>([
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
  ]);

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <div className="space-y-4 py-4 max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" placeholder="Project Name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="executive-sponsor">Executive Sponsor</Label>
                    <Input id="executive-sponsor" placeholder="Executive Sponsor" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-owner">Delivery Owner</Label>
                    <Input id="delivery-owner" placeholder="Delivery Owner" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-manager">Project Manager</Label>
                    <Input id="project-manager" placeholder="Project Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-status">Delivery Status</Label>
                    <Select>
                      <SelectTrigger id="delivery-status">
                        <SelectValue placeholder="Delivery Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-track">On Track</SelectItem>
                        <SelectItem value="at-risk">At Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4 border-t pt-4">
                  <Label className="text-base font-semibold">Milestone</Label>
                  <div className="space-y-2">
                    <Label htmlFor="milestone-name">Milestone Name</Label>
                    <Input 
                      id="milestone-name" 
                      placeholder="Milestone Name" 
                      value={milestoneName}
                      onChange={(e) => setMilestoneName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="milestone-start-date">Start Date</Label>
                      <Input 
                        id="milestone-start-date" 
                        type="date" 
                        value={milestoneStartDate}
                        onChange={(e) => setMilestoneStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="milestone-end-date">End Date</Label>
                      <Input 
                        id="milestone-end-date" 
                        type="date" 
                        value={milestoneEndDate}
                        onChange={(e) => setMilestoneEndDate(e.target.value)}
                        min={milestoneStartDate}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (GH₵)</Label>
                    <Input id="budget" type="number" placeholder="Budget (GH₵)" />
                  </div>
                  <div></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="executive-summary">Executive Summary</Label>
                  <textarea 
                    id="executive-summary"
                    className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                    placeholder="Executive Summary"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
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
                    <div 
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleProjectClick(project)}
                    >
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
                    <div className="flex flex-col gap-2">
                      <Link to="/issues">
                        <Button variant="outline" size="sm" className="w-full">Log blocker</Button>
                      </Link>
                      <Link to="/decisions">
                        <Button size="sm" className="w-full">Raise decisions</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Summary Dialog */}
      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProject?.name || 'Project Summary'}
            </DialogTitle>
            <DialogDescription>
              {selectedProject?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && editedProject && (
            <div className="space-y-4 py-4">
              {!isEditMode ? (
                // View Mode
                <>
                  <div>
                    <Label className="text-sm font-semibold">Project Name</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedProject.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Owner</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedProject.owner}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Project Manager</Label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedProject.manager}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Status</Label>
                    <div className="mt-1">
                      <Badge variant={selectedProject.status === 'On Track' ? 'default' : 'destructive'}>
                        {selectedProject.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Progress</Label>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{selectedProject.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gra-navy transition-all"
                          style={{ width: `${selectedProject.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Budget</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        GH₵ {selectedProject.budget.spent}M / {selectedProject.budget.total}M
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Issues</Label>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{selectedProject.issues.total} total</Badge>
                        {selectedProject.issues.critical > 0 && (
                          <Badge variant="destructive">{selectedProject.issues.critical} critical</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Next Milestone</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedProject.milestone.name} • {selectedProject.milestone.date}
                    </p>
                  </div>
                </>
              ) : (
                // Edit Mode
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-project-name">Project Name</Label>
                    <Input 
                      id="edit-project-name"
                      value={editedProject.name}
                      onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-owner">Owner</Label>
                      <Input 
                        id="edit-owner"
                        value={editedProject.owner}
                        onChange={(e) => setEditedProject({ ...editedProject, owner: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-manager">Project Manager</Label>
                      <Input 
                        id="edit-manager"
                        value={editedProject.manager}
                        onChange={(e) => setEditedProject({ ...editedProject, manager: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editedProject.status.toLowerCase().replace(' ', '-')}
                      onValueChange={(value) => setEditedProject({ ...editedProject, status: value === 'on-track' ? 'On Track' : 'At Risk' })}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-track">On Track</SelectItem>
                        <SelectItem value="at-risk">At Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-progress">Progress (%)</Label>
                    <Input 
                      id="edit-progress"
                      type="number"
                      min="0"
                      max="100"
                      value={editedProject.progress}
                      onChange={(e) => setEditedProject({ ...editedProject, progress: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-budget-spent">Budget Spent (GH₵M)</Label>
                      <Input 
                        id="edit-budget-spent"
                        type="number"
                        step="0.1"
                        value={editedProject.budget.spent}
                        onChange={(e) => setEditedProject({ 
                          ...editedProject, 
                          budget: { ...editedProject.budget, spent: parseFloat(e.target.value) || 0 }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-budget-total">Budget Total (GH₵M)</Label>
                      <Input 
                        id="edit-budget-total"
                        type="number"
                        step="0.1"
                        value={editedProject.budget.total}
                        onChange={(e) => setEditedProject({ 
                          ...editedProject, 
                          budget: { ...editedProject.budget, total: parseFloat(e.target.value) || 0 }
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-issues-total">Issues Total</Label>
                      <Input 
                        id="edit-issues-total"
                        type="number"
                        value={editedProject.issues.total}
                        onChange={(e) => setEditedProject({ 
                          ...editedProject, 
                          issues: { ...editedProject.issues, total: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-issues-critical">Critical Issues</Label>
                      <Input 
                        id="edit-issues-critical"
                        type="number"
                        value={editedProject.issues.critical}
                        onChange={(e) => setEditedProject({ 
                          ...editedProject, 
                          issues: { ...editedProject.issues, critical: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-milestone-name">Milestone Name</Label>
                    <Input 
                      id="edit-milestone-name"
                      value={editedProject.milestone.name}
                      onChange={(e) => setEditedProject({ 
                        ...editedProject, 
                        milestone: { ...editedProject.milestone, name: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-milestone-date">Milestone Date</Label>
                    <Input 
                      id="edit-milestone-date"
                      type="date"
                      value={editedProject.milestone.date}
                      onChange={(e) => setEditedProject({ 
                        ...editedProject, 
                        milestone: { ...editedProject.milestone, date: e.target.value }
                      })}
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                {!isEditMode ? (
                  <>
                    <Button variant="outline" onClick={() => setIsSummaryDialogOpen(false)}>
                      Close
                    </Button>
                    <Button onClick={handleEdit} className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;

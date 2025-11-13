import { MapPin, Calendar, DollarSign, TrendingUp, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  location: string;
  start_date: string;
  end_date: string;
  budget: number;
  completion_percentage: number;
}

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  const { user } = useAuth();

  const statusColors: Record<string, string> = {
    planning: 'bg-blue-500/10 text-blue-500',
    active: 'bg-gra-navy/10 text-gra-navy',
    on_hold: 'bg-gra-gold/10 text-gra-gold',
    completed: 'bg-purple-500/10 text-purple-500',
    cancelled: 'bg-gra-red/10 text-gra-red'
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-gra-gold/10 text-gra-gold',
    high: 'bg-gra-red/10 text-gra-red',
    critical: 'bg-destructive/10 text-destructive'
  };

  const canEdit = user?.role === 'project_owner' || 
                  user?.role === 'project_manager' || 
                  user?.role === 'system_admin';

  return (
    <div className="glass-hover rounded-xl p-6 space-y-4 transition-smooth hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
        {canEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(project)}
            className="ml-2"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        <Badge className={statusColors[project.status] || statusColors.planning}>
          {project.status.replace('_', ' ')}
        </Badge>
        <Badge className={priorityColors[project.priority] || priorityColors.medium}>
          {project.priority}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{project.completion_percentage}%</span>
        </div>
        <Progress value={project.completion_percentage} className="h-2" />
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        {project.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{project.location}</span>
          </div>
        )}
        
        {project.start_date && project.end_date && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
            </span>
          </div>
        )}
        
        {project.budget && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>GH₵ {project.budget.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

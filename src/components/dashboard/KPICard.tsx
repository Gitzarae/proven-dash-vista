import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  colorClass?: string;
}

const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  colorClass = 'text-primary'
}: KPICardProps) => {
  return (
    <div className="glass-hover rounded-xl p-6 transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold mb-2">{value}</p>
          {change && (
            <p className={cn(
              "text-sm font-medium",
              changeType === 'positive' && "text-gra-green",
              changeType === 'negative' && "text-destructive",
              changeType === 'neutral' && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          colorClass.includes('primary') && "bg-primary/10",
          colorClass.includes('gra-gold') && "bg-gra-gold/10",
          colorClass.includes('gra-green') && "bg-gra-green/10",
          colorClass.includes('chart-4') && "bg-chart-4/10"
        )}>
          <Icon className={cn("w-6 h-6", colorClass)} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;

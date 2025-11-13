import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { FolderKanban, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const TopManagementDashboard = () => {
  const projectDistributionData = [
    { region: 'Greater Accra', projects: 8, budget: 4.2 },
    { region: 'Ashanti', projects: 6, budget: 3.1 },
    { region: 'Western', projects: 5, budget: 2.8 },
    { region: 'Eastern', projects: 5, budget: 2.5 },
  ];

  const projectStatusData = [
    { name: 'On Track', value: 18, color: 'hsl(var(--gra-green))' },
    { name: 'At Risk', value: 5, color: 'hsl(var(--gra-gold))' },
    { name: 'Critical', value: 1, color: 'hsl(var(--gra-red))' },
  ];

  const departmentData = [
    { name: 'IT', projects: 8, completion: 85 },
    { name: 'Digital Services', projects: 6, completion: 92 },
    { name: 'Compliance', projects: 5, completion: 78 },
    { name: 'Strategy', projects: 5, completion: 88 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Strategic Overview</h1>
          <p className="text-muted-foreground mt-1">Executive dashboard for top management</p>
        </div>
        <div className="flex gap-2">
          <Link to="/decisions">
            <Button variant="outline">Review Decisions</Button>
          </Link>
          <Link to="/analytics">
            <Button variant="outline">View Analytics</Button>
          </Link>
          <Link to="/portfolio">
            <Button>Project Portfolio</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Projects"
          value={24}
          change="Active across all regions"
          changeType="neutral"
          icon={FolderKanban}
          colorClass="text-primary"
        />
        <KPICard
          title="On Schedule (SPI)"
          value="89%"
          change="Target: 95%"
          changeType="positive"
          icon={TrendingUp}
          colorClass="text-gra-green"
        />
        <KPICard
          title="Decision Closure"
          value="88%"
          change="18 of 21 closed on time"
          changeType="positive"
          icon={CheckCircle}
          colorClass="text-chart-4"
        />
        <KPICard
          title="SLA Compliance"
          value="82%"
          change="Target: 80%"
          changeType="positive"
          icon={AlertCircle}
          colorClass="text-gra-green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* National Project Distribution */}
        <div className="glass-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">National Project Distribution</h3>
            <Button variant="outline" size="sm">Export</Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="region" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
              <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="projects" fill="hsl(var(--gra-green))" name="Projects" />
              <Bar dataKey="budget" fill="hsl(var(--gra-gold))" name="Budget (GH₵M)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status Overview */}
        <div className="glass-hover rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Project Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Performance */}
      <div className="glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Department Performance Analytics</h3>
          <Link to="/analytics">
            <Button variant="link" className="text-primary">Full Analytics →</Button>
          </Link>
        </div>
        <div className="space-y-4">
          {departmentData.map((dept) => (
            <div key={dept.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{dept.name}</span>
                <span className="text-muted-foreground">{dept.projects} projects • {dept.completion}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gra-green transition-all"
                  style={{ width: `${dept.completion}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopManagementDashboard;

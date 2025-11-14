import KPICard from "@/components/dashboard/KPICard";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, FileText, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const performanceData = [
    { month: "Jul", spi: 0.89, cpi: 0.92 },
    { month: "Aug", spi: 0.91, cpi: 0.93 },
    { month: "Sep", spi: 0.9, cpi: 0.94 },
    { month: "Oct", spi: 0.92, cpi: 0.95 },
    { month: "Nov", spi: 0.92, cpi: 0.94 },
  ];

  const issueAgingData = [
    { range: "0-3 days", count: 12 },
    { range: "4-7 days", count: 8 },
    { range: "8-14 days", count: 5 },
    { range: "15+ days", count: 3 },
  ];

  const decisionData = [
    { name: "Approved", value: 156, color: "hsl(var(--primary) / 0.85)" },
    { name: "Pending", value: 42, color: "hsl(var(--primary) / 0.60)" },
    { name: "Rejected", value: 8, color: "hsl(var(--primary) / 0.40)" },
    { name: "Overdue", value: 12, color: "hsl(var(--primary) / 0.25)" },
  ];

  const deptData = [
    { dept: "IT", onTrack: 6, atRisk: 2 },
    { dept: "Digital", onTrack: 5, atRisk: 1 },
    { dept: "Compliance", onTrack: 4, atRisk: 1 },
    { dept: "Strategy", onTrack: 4, atRisk: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Performance insights and exportable reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export PDF</Button>
          <Button variant="outline">Export Excel</Button>
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Schedule Performance"
          value="0.92"
          change="Target: 0.95"
          changeType="neutral"
          icon={TrendingUp}
        />
        <KPICard
          title="Cost Performance"
          value="0.94"
          change="Target: 0.95"
          changeType="neutral"
          icon={BarChart3}
        />
        <KPICard
          title="Decision Closure"
          value="88%"
          change="On-time closure rate"
          changeType="neutral"
          icon={FileText}
        />
        <KPICard
          title="SLA Compliance"
          value="82%"
          change="Issue resolution SLA"
          changeType="neutral"
          icon={Calendar}
        />
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="issues">Issue Analytics</TabsTrigger>
          <TabsTrigger value="decisions">Decision Analytics</TabsTrigger>
          <TabsTrigger value="department">Department Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <div className="glass-hover rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">
              Schedule & Cost Performance Index
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={performanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="spi"
                  stroke="hsl(var(--primary) / 0.85)"
                  strokeWidth={2}
                  name="SPI"
                />
                <Line
                  type="monotone"
                  dataKey="cpi"
                  stroke="hsl(var(--primary) / 0.45)"
                  strokeWidth={2}
                  name="CPI"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="mt-6">
          <div className="glass-hover rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Issue Aging Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={issueAgingData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary) / 0.45)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="mt-6">
          <div className="glass-hover rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">
              Decision Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={decisionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={120}
                  dataKey="value"
                >
                  {decisionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="department" className="mt-6">
          <div className="glass-hover rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">
              Department Performance Comparison
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={deptData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="onTrack"
                  fill="hsl(var(--primary) / 0.55)"
                  name="On Track"
                />
                <Bar
                  dataKey="atRisk"
                  fill="hsl(var(--primary) / 0.30)"
                  name="At Risk"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

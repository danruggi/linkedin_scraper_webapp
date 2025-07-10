import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, TrendingUp, Layers } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface LeadStatsProps {
  stats?: {
    totalLeads: number;
    schoolsOnly: number;
    salesnavOnly: number;
    both: number;
  };
}

export function LeadStats({ stats }: LeadStatsProps) {
  if (!stats) return null;

  const chartData = [
    { name: 'Schools Only', value: stats.schoolsOnly, color: '#10B981' },
    { name: 'Sales Navigator', value: stats.salesnavOnly, color: '#F59E0B' },
    { name: 'Both Sources', value: stats.both, color: '#8B5CF6' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Schools Only</p>
                <p className="text-2xl font-bold text-schools">{stats.schoolsOnly}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-schools" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sales Navigator</p>
                <p className="text-2xl font-bold text-salesnav">{stats.salesnavOnly}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-salesnav" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Both Sources</p>
                <p className="text-2xl font-bold text-both">{stats.both}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Layers className="h-6 w-6 text-both" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

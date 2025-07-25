
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useDashboardDataContext } from '@/contexts/DashboardDataContext';

const chartConfig = {
  HOT: {
    label: "Hot Leads",
    color: "#DC2626"
  },
  WARM: {
    label: "Warm Leads", 
    color: "#F97316"
  },
  COLD: {
    label: "Cold Leads",
    color: "#2563EB"
  },
  PASS: {
    label: "Passed Leads",
    color: "#6B7280"
  },
  KEEP: {
    label: "Keep Leads",
    color: "#059669"
  }
};

export function LeadsPieChart() {
  const { stats, loading } = useDashboardDataContext();

  const data = React.useMemo(() => {
    if (loading || stats.totalLeads === 0) {
      return [];
    }

    const total = stats.totalLeads;
    return [
      { 
        name: 'HOT', 
        value: Math.round((stats.hotDeals / total) * 100), 
        color: '#DC2626', 
        count: stats.hotDeals 
      },
      { 
        name: 'WARM', 
        value: Math.round((stats.warmDeals / total) * 100), 
        color: '#F97316', 
        count: stats.warmDeals 
      },
      { 
        name: 'COLD', 
        value: Math.round((stats.coldDeals / total) * 100), 
        color: '#2563EB', 
        count: stats.coldDeals 
      },
      { 
        name: 'PASS', 
        value: stats.passRate, 
        color: '#6B7280', 
        count: stats.passDeals || 0
      },
      { 
        name: 'KEEP', 
        value: stats.keepRate || 0, 
        color: '#059669', 
        count: stats.keepDeals || 0
      },
    ].filter(item => item.count > 0);
  }, [stats, loading]);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-gray-800">
              Lead Temperature Distribution
            </span>
            <p className="text-sm text-gray-500 font-normal">
              {loading ? 'Loading...' : `${stats.totalLeads} total leads`}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : data.length === 0 || data.every(item => item.count === 0) ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No leads data available</p>
              <p className="text-sm">Add some leads to see the distribution</p>
            </div>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="white"
                        strokeWidth={2}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold text-gray-800">{data.name} Leads</p>
                            <p className="text-sm text-gray-600">Count: {data.count}</p>
                            <p className="text-sm text-gray-600">Percentage: {data.value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="flex justify-center gap-6 mt-6 flex-wrap">
              {data.map((item, index) => (
                <div 
                  key={item.name} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">{item.count}</span> leads ({item.value}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

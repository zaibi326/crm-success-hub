import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import { useDashboardDataContext } from '@/contexts/DashboardDataContext';

const chartConfig = {
  PASS: {
    label: "Passed Leads",
    color: "#EF4444"
  },
  KEEP: {
    label: "Keep Leads",
    color: "#10B981"
  }
};

export function PassKeepRateChart() {
  const { stats, loading } = useDashboardDataContext();

  const data = React.useMemo(() => {
    if (loading || stats.totalLeads === 0) {
      return [];
    }

    const passDeals = stats.passDeals || 0;
    const keepDeals = stats.keepDeals || 0;
    const total = passDeals + keepDeals;

    if (total === 0) return [];

    return [
      { 
        name: 'PASS', 
        value: Math.round((passDeals / total) * 100), 
        color: '#EF4444', 
        count: passDeals 
      },
      { 
        name: 'KEEP', 
        value: Math.round((keepDeals / total) * 100), 
        color: '#10B981', 
        count: keepDeals 
      },
    ].filter(item => item.count > 0);
  }, [stats, loading]);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-gray-800">
              Pass / Keep Rate
            </span>
            <p className="text-sm text-gray-500 font-normal">
              {loading ? 'Loading...' : `${(stats.passDeals || 0) + (stats.keepDeals || 0)} processed leads`}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : data.length === 0 || data.every(item => item.count === 0) ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No processed leads data</p>
              <p className="text-sm">Process some leads to see pass/keep rates</p>
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

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'HOT', value: 35, color: '#DC3545', count: 87 },
  { name: 'WARM', value: 45, color: '#FF7F50', count: 142 },
  { name: 'COLD', value: 20, color: '#2184F7', count: 63 },
];

const chartConfig = {
  HOT: {
    label: "Hot Leads",
    color: "#DC3545"
  },
  WARM: {
    label: "Warm Leads", 
    color: "#FF7F50"
  },
  COLD: {
    label: "Cold Leads",
    color: "#2184F7"
  }
};

export function LeadsPieChart() {
  return (
    <Card className="agile-card animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-agile-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-agile-blue rounded-lg flex items-center justify-center shadow-agile">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-agile-gray-800">
              Lead Temperature Distribution
            </span>
            <p className="text-sm text-agile-gray-500 font-normal">Real-time lead status</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="flex justify-center gap-6 mt-6">
          {data.map((item, index) => (
            <div 
              key={item.name} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-agile-gray-50 transition-all duration-200 animate-slide-in-right"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div 
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-center">
                <div className="text-sm font-semibold text-agile-gray-800">
                  {item.name}
                </div>
                <div className="text-xs text-agile-gray-500">
                  <span className="font-medium">{item.count}</span> leads ({item.value}%)
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <div className="mt-6 space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-agile-gray-600">{item.name} Leads</span>
                <span className="font-semibold text-agile-gray-800">{item.value}%</span>
              </div>
              <div className="w-full bg-agile-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${item.value}%`,
                    backgroundColor: item.color,
                    animationDelay: `${index * 0.3}s`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

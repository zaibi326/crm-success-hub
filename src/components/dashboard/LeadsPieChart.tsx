
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'HOT', value: 35, color: '#EF4444', count: 87 },
  { name: 'WARM', value: 45, color: '#F59E0B', count: 142 },
  { name: 'COLD', value: 20, color: '#3B82F6', count: 63 },
];

const chartConfig = {
  HOT: {
    label: "Hot Leads",
    color: "#EF4444"
  },
  WARM: {
    label: "Warm Leads", 
    color: "#F59E0B"
  },
  COLD: {
    label: "Cold Leads",
    color: "#3B82F6"
  }
};

export function LeadsPieChart() {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-crm-primary/10 to-crm-primary/20 rounded-lg flex items-center justify-center">
            📊
          </div>
          Lead Temperature Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
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
            <div key={item.name} className="flex items-center gap-3 group/legend">
              <div 
                className="w-4 h-4 rounded-full shadow-sm group-hover/legend:scale-110 transition-transform duration-200" 
                style={{ backgroundColor: item.color }}
              />
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">
                  {item.name}
                </div>
                <div className="text-xs text-gray-600">
                  {item.count} leads ({item.value}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

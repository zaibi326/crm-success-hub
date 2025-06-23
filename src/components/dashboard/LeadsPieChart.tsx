
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'HOT', value: 35, color: '#EF4444' },
  { name: 'WARM', value: 45, color: '#F59E0B' },
  { name: 'COLD', value: 20, color: '#3B82F6' },
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Lead Temperature Distribution
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
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="flex justify-center gap-6 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

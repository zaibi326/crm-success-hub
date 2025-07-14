
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'HOT', value: 35, color: '#EF4444', count: 87, gradient: 'from-red-500 to-pink-500' },
  { name: 'WARM', value: 45, color: '#F59E0B', count: 142, gradient: 'from-amber-500 to-orange-500' },
  { name: 'COLD', value: 20, color: '#3B82F6', count: 63, gradient: 'from-blue-500 to-cyan-500' },
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
    <Card className="bright-card-gradient group animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-bright-teal to-bright-blue rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-bright-teal to-bright-blue bg-clip-text text-transparent">
              Lead Temperature Distribution
            </span>
            <p className="text-sm text-slate-500 font-normal">Real-time lead status</p>
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
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={3}
                    className="hover:opacity-80"
                    style={{
                      filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                      transition: 'all 0.3s ease'
                    }}
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
              className="flex items-center gap-3 group/legend p-3 rounded-lg hover:bg-white/50 transition-all duration-300 hover:scale-105 animate-slide-in-right"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div 
                className={`w-5 h-5 rounded-full shadow-lg group-hover/legend:scale-125 transition-transform duration-300 bg-gradient-to-r ${item.gradient}`}
              />
              <div className="text-center">
                <div className="text-sm font-bold text-slate-800">
                  {item.name}
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold">{item.count}</span> leads ({item.value}%)
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
                <span className="font-medium text-slate-600">{item.name} Leads</span>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${item.value}%`,
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

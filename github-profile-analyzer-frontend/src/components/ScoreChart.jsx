import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const ScoreChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-brandDark-500 font-medium bg-brandDark-900/40 rounded-xl border border-brandDark-800 border-dashed">
        No developer score distribution data available.
      </div>
    );
  }

  // Format data: Sort profiles by score ascending to show distribution curve
  const chartData = [...data]
    .sort((a, b) => a.developer_score - b.developer_score)
    .map((profile) => ({
      name: profile.username,
      score: profile.developer_score,
      followers: profile.followers
    }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255, 255, 255, 0.3)" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="rgba(255, 255, 255, 0.3)" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '0.5rem',
            }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#2563EB" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorScore)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const LanguageChart = ({ distribution }) => {
  if (!distribution || Object.keys(distribution).length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-brandDark-500 font-medium bg-brandDark-900/40 rounded-xl border border-brandDark-800 border-dashed">
        No language data available.
      </div>
    );
  }

  // Format language distribution JSON to array suitable for Recharts
  const chartData = Object.entries(distribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Language colors configuration
  const languageColors = {
    javascript: '#F7DF1E',
    typescript: '#3178C6',
    python: '#3776AB',
    java: '#B07219',
    c: '#555555',
    'c++': '#F34B7D',
    'c#': '#178600',
    go: '#00ADD8',
    ruby: '#701516',
    php: '#4F5D95',
    html: '#E34F26',
    css: '#563D7C',
    shell: '#89E051',
    rust: '#DEA584',
    swift: '#F05138'
  };

  const getLanguageColor = (lang, index) => {
    const key = lang.toLowerCase();
    if (languageColors[key]) return languageColors[key];
    
    // Generate HSL tailored colors based on index for fallbacks to avoid generic defaults
    return `hsl(${(index * 75) % 360}, 65%, 50%)`;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getLanguageColor(entry.name, index)} 
                stroke="rgba(3, 7, 18, 0.8)" 
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} Repositories`, 'Frequency']}
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '0.5rem',
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{
              fontSize: '11px',
              fontWeight: 500,
              paddingTop: '10px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LanguageChart;

import { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppContext } from '../context/AppContext';

export default function WorkDistributionChart({ data }) {
  const { theme } = useContext(AppContext);
  const isDark = theme === 'dark';
  const COLORS = ['#00BFFF', '#38bdf8', '#3b82f6', '#6366f1', '#8b5cf6'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false} 
          tickLine={false} 
          width={110} 
          fontSize={11}
          tick={{ fill: isDark ? '#94A3B8' : '#475569', fontWeight: 700 }}
        />
        <Tooltip 
          cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc' }} 
          formatter={(value) => [`${value}%`, 'Work Share']}
          contentStyle={{ 
            backgroundColor: isDark ? '#0C1527' : '#ffffff', 
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0',
            borderRadius: '16px',
            boxShadow: isDark ? '0 8px 32px 0 rgba(0,0,0,0.5)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
            color: isDark ? '#F8FAFC' : '#0F172A',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

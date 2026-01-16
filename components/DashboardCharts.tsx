
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Legend 
} from 'recharts';
import { QuarterlySales, ChartType } from '../types';

interface DashboardChartsProps {
  data: QuarterlySales[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState<ChartType>(ChartType.AREA);

  const renderChart = () => {
    switch (activeChart) {
      case ChartType.BAR:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="quarter" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (Billion $)" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case ChartType.LINE:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="quarter" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px' }}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} name="Revenue Trend" />
          </LineChart>
        );
      case ChartType.AREA:
      default:
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="quarter" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px' }}
            />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" name="Revenue (Billion $)" />
          </AreaChart>
        );
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Revenue Analytics (Quarterly)
        </h3>
        <div className="flex gap-2 bg-slate-900 p-1 rounded-lg">
          {[ChartType.AREA, ChartType.BAR, ChartType.LINE].map((type) => (
            <button
              key={type}
              onClick={() => setActiveChart(type)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeChart === type ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;

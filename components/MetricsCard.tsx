
import React from 'react';

interface MetricsCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl hover:border-blue-500/50 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</span>
        {icon && <div className="text-slate-500 group-hover:text-blue-400 transition-colors">{icon}</div>}
      </div>
      <div className="text-xl font-bold font-mono text-white truncate">
        {value}
      </div>
    </div>
  );
};

export default MetricsCard;

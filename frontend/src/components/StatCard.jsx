import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, color = 'orange', badgeText }) => {
  const colorMap = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    red: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl sm:text-4xl font-black font-sans text-slate-900">{value}</h3>
          {subtext && <p className="text-xs text-slate-500 mt-1.5 font-medium">{subtext}</p>}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-lg border ${colorMap[color] || colorMap.orange}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {badgeText && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">{badgeText}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, color = 'orange', badgeText }) => {
  const colorMap = {
    orange: 'bg-gym-orange/15 text-gym-orange border-gym-orange/30',
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    red: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="bg-gym-card border border-gym-border/80 rounded-2xl p-5 hover:border-gym-border transition-all duration-300 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gym-muted uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-black text-white font-sans">{value}</h3>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.orange}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {badgeText && (
        <div className="mt-3 pt-3 border-t border-gym-border/40 flex items-center justify-between text-xs">
          <span className="text-gym-muted">{badgeText}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

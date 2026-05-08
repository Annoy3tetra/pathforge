import React from "react";

export function ProgressBar({ progress, className = "" }) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50 ${className}`}>
      <div 
        className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-in-out relative overflow-hidden"
        style={{ width: `${normalizedProgress}%` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}

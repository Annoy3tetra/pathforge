export function ProgressBar({ progress, className = "" }) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full bg-slate-100 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div 
        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2.5 rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${normalizedProgress}%` }}
      />
    </div>
  );
}

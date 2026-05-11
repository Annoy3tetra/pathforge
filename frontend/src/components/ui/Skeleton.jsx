export function Skeleton({ className = "", ...props }) {
  return (
    <div 
      className={`animate-pulse rounded-md bg-slate-800/80 ${className}`} 
      {...props} 
    />
  );
}

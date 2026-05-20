export function Skeleton({ className = "", ...props }) {
  return (
    <div 
      className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} 
      {...props} 
    />
  );
}

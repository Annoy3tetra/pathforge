import { cn } from "../../lib/utils";

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false, 
  isLoading = false,
  ...props 
}) {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)]",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
    outline: "bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50",
    danger: "bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600/20",
    success: "bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center font-medium rounded-xl transition-[background-color,border-color,color,transform] duration-150 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group enabled:hover:-translate-y-px active:translate-y-0",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

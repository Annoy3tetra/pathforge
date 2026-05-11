import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(({ className = "", type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-inner",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

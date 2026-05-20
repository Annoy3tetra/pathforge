import { memo } from "react";
import { cn } from "../../lib/utils";

export const Card = memo(function Card({ children, className = "", animate = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/80 card-shadow overflow-hidden transition-all duration-200",
        animate && "hover:-translate-y-0.5 hover:card-shadow-hover",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
});

export const CardHeader = memo(function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={cn("p-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
});

export const CardTitle = memo(function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={cn("text-xl font-bold leading-none tracking-tight text-slate-800", className)} {...props}>
      {children}
    </h3>
  );
});

export const CardDescription = memo(function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={cn("text-sm text-slate-500 mt-2 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
});

export const CardContent = memo(function CardContent({ children, className = "", ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
});

export const CardFooter = memo(function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
});

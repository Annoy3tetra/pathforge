import { memo } from "react";
import { cn } from "../../lib/utils";

export const Card = memo(function Card({ children, className = "", animate = false, ...props }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl overflow-hidden transition-[border-color,background-color,transform] duration-200",
        // CSS hover avoids a Framer Motion instance on every roadmap/milestone card.
        animate && "hover:-translate-y-0.5",
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
    <h3 className={cn("text-xl font-bold leading-none tracking-tight text-slate-100", className)} {...props}>
      {children}
    </h3>
  );
});

export const CardDescription = memo(function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={cn("text-sm text-slate-400 mt-2 leading-relaxed", className)} {...props}>
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

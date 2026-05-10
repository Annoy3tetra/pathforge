import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Card({ children, className = "", animate = false, ...props }) {
  const Component = animate ? motion.div : "div";
  
  return (
    <Component 
      whileHover={animate ? { y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
      className={cn(
        "glass rounded-2xl overflow-hidden transition-all duration-300",
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={cn("p-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={cn("text-xl font-bold leading-none tracking-tight text-slate-100", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={cn("text-sm text-slate-400 mt-2 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

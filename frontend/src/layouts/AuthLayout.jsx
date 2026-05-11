import { Compass } from "lucide-react";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-x-0 top-0 h-48 bg-indigo-950/20 pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center text-indigo-400">
          <Compass className="h-12 w-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/80 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
}

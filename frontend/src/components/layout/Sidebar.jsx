import { memo, useCallback, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Compass, 
  Brain,
  LayoutDashboard, 
  Map, 
  PlusCircle, 
  X, 
  ChevronLeft, 
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";

// Memoized Nav Item to prevent individual rerenders
const NavItem = memo(({ item, isActive, isCollapsed, setIsOpen }) => {
  const Icon = item.icon;
  const closeSidebar = useCallback(() => setIsOpen(false), [setIsOpen]);
  
  return (
    <Link
      to={item.path}
      onClick={closeSidebar}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
        isActive 
          ? "bg-indigo-600/10 text-indigo-400 font-semibold" 
          : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
      )}
    >
      {isActive && (
        <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" />
      )}
      <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive && "text-indigo-400")} />
      {!isCollapsed && (
        <span className="whitespace-nowrap">
          {item.name}
        </span>
      )}
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-slate-700 whitespace-nowrap z-50">
          {item.name}
        </div>
      )}
    </Link>
  );
});

export const Sidebar = memo(({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const closeSidebar = useCallback(() => setIsOpen(false), [setIsOpen]);
  
  const navItems = useMemo(() => [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "ForgeProfile", path: "/forge-profile", icon: Brain },
    { name: "My Roadmaps", path: "/dashboard#roadmaps", icon: Map },
    { name: "Generate", path: "/dashboard#generate", icon: PlusCircle },
  ], []);

  const toggleCollapse = useCallback(() => setIsCollapsed(prev => !prev), []);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar container */}
      <div
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 flex flex-col glass border-r border-white/5 h-screen md:translate-x-0 shrink-0 transition-[width,transform] duration-200 ease-out",
          isCollapsed ? "md:w-20" : "md:w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Compass className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-white tracking-tight"
              >
                PathForge
              </motion.span>
            )}
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white p-1"
            onClick={closeSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex absolute -right-3 top-20 h-6 w-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-all z-50 shadow-xl"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        
        {/* Nav Items */}
        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 mt-2">
              Navigation
            </div>
          )}
          
          {navItems.map((item) => {
            const isHashMatch = item.path.includes("#") && location.hash === item.path.substring(item.path.indexOf("#"));
            const isPathMatch = !item.path.includes("#") && location.pathname.startsWith(item.path) && !location.hash;
            const isActive = isHashMatch || isPathMatch;
            
            return (
              <NavItem 
                key={item.name} 
                item={item} 
                isActive={isActive} 
                isCollapsed={isCollapsed} 
                setIsOpen={setIsOpen} 
              />
            );
          })}
        </div>

        {/* Footer Section - Minimal */}
        <div className="p-4 border-t border-white/5 mt-auto">
          {!isCollapsed && (
            <div className="px-3 py-4 text-center">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">PathForge v1.0</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

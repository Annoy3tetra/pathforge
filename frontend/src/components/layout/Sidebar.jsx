import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  LayoutDashboard, 
  Map, 
  PlusCircle, 
  User, 
  LogOut, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

export function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Roadmaps", path: "/dashboard#roadmaps", icon: Map },
    { name: "Generate", path: "/dashboard#generate", icon: PlusCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar container */}
      <motion.div 
        animate={{ width: isCollapsed ? 80 : 256 }}
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 flex flex-col glass border-r border-white/5 h-screen transition-transform duration-300 md:translate-x-0 shrink-0",
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
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-20 h-6 w-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-all z-50 shadow-xl"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        
        {/* Nav Items */}
        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 mt-2"
            >
              Navigation
            </motion.div>
          )}
          
          {navItems.map((item) => {
            const isHashMatch = item.path.includes("#") && location.hash === item.path.substring(item.path.indexOf("#"));
            const isPathMatch = !item.path.includes("#") && location.pathname.startsWith(item.path) && !location.hash;
            const isActive = isHashMatch || isPathMatch;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-400 font-semibold" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                  />
                )}
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive && "text-indigo-400")} />
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-slate-700 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Section - Minimal */}
        <div className="p-4 border-t border-white/5 mt-auto">
          <div className={cn(
            "px-3 py-4 text-center",
            isCollapsed && "hidden"
          )}>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">PathForge v1.0</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, LayoutDashboard, Map, PlusCircle, User, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Roadmaps", path: "/dashboard#roadmaps", icon: Map },
    { name: "Generate Roadmap", path: "/dashboard#generate", icon: PlusCircle },
    { name: "Profile", path: "/dashboard#profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close sidebar when clicking a link on mobile
  const handleLinkClick = () => {
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-indigo-400">
            <Compass className="h-8 w-8" />
            <span className="text-xl font-bold text-white tracking-tight">PathForge</span>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4 mt-2">
            Navigation
          </div>
          {navItems.map((item) => {
            // For hash links, check if the hash matches. For standard paths, check startsWith.
            const isHashMatch = item.path.includes("#") && location.hash === item.path.substring(item.path.indexOf("#"));
            const isPathMatch = !item.path.includes("#") && location.pathname.startsWith(item.path) && !location.hash;
            const isActive = isHashMatch || isPathMatch;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-400 font-medium" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

import React from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Navbar({ title }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 lg:px-10">
      <h1 className="text-xl font-semibold text-slate-100 hidden md:block">{title}</h1>
      
      {/* Mobile brand (shows when sidebar is hidden) */}
      <h1 className="text-xl font-bold text-white tracking-tight md:hidden">PathForge</h1>

      <div className="flex items-center gap-4 ml-auto">
        <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <User className="h-4 w-4" />
        </div>
        <button 
          onClick={handleLogout}
          className="text-slate-400 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-800"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

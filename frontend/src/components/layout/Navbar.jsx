import { memo, useCallback, useEffect, useRef, useState } from "react";
import { LogOut, User, Menu, ChevronDown, Settings, CreditCard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../../hooks/useProfile";
import { cn } from "../../lib/utils";

export const Navbar = memo(({ title, onMenuClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-[4px] sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-400 hover:text-white p-2 -ml-2 rounded-md hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <h1 className="text-xl font-semibold text-slate-100 hidden md:block">{title}</h1>
        
        {/* Mobile brand (shows when sidebar is hidden) */}
        <h1 className="text-xl font-bold text-white tracking-tight md:hidden">PathForge</h1>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* User Profile Button */}
        <button 
          onClick={toggleDropdown}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-all group"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/10">
            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-indigo-400 overflow-hidden">
              {profile?.profile_image ? (
                <img 
                  src={profile.profile_image.startsWith("http") ? profile.profile_image : `${import.meta.env.VITE_API_URL}${profile.profile_image}`} 
                  alt="Profile" 
                  className="h-full w-full object-cover" 
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
          </div>
          <div className="hidden sm:block text-left mr-1">
            <p className="text-xs font-bold text-slate-200 leading-none mb-1">
              {profile?.display_name || "Account"}
            </p>
            <p className="text-[10px] text-slate-500 font-medium leading-none">
              {profile?.skill_level || "Member"}
            </p>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-slate-500 transition-transform duration-200",
            isDropdownOpen && "rotate-180"
          )} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-56 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-4 border-b border-white/5 bg-white/5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">User Account</p>
                <p className="text-sm font-bold text-white truncate">{profile?.display_name || "Profile"}</p>
              </div>

              <div className="p-2">
                <Link 
                  to="/profile" 
                  onClick={closeDropdown}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-indigo-500/10 transition-colors"
                >
                  <User className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium">My Profile</span>
                </Link>
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                  onClick={closeDropdown}
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                  onClick={closeDropdown}
                >
                  <CreditCard className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">Subscription</span>
                </button>
              </div>

              <div className="p-2 border-t border-white/5">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-bold">Log out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
});

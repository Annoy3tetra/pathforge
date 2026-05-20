import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Brain, LogOut, User, Menu, ChevronDown, Settings, CreditCard } from "lucide-react";
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
    <nav className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-slate-700 p-2 -ml-2 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <h1 className="text-xl font-semibold text-slate-800 hidden md:block">{title}</h1>
        
        {/* Mobile brand */}
        <h1 className="text-xl font-bold text-slate-800 tracking-tight md:hidden">PathForge</h1>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* User Profile Button */}
        <button 
          onClick={toggleDropdown}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all group cursor-pointer"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 p-[2px] shadow-sm">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-indigo-600 overflow-hidden">
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
            <p className="text-xs font-semibold text-slate-700 leading-none mb-1">
              {profile?.display_name || "Account"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium leading-none capitalize">
              {profile?.skill_level || "Member"}
            </p>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
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
              className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-50"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Account</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{profile?.display_name || "Profile"}</p>
              </div>

              <div className="p-2">
                <Link 
                  to="/profile" 
                  onClick={closeDropdown}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                >
                  <User className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">My Profile</span>
                </Link>
                <Link
                  to="/forge-profile"
                  onClick={closeDropdown}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                >
                  <Brain className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">ForgeProfile</span>
                </Link>
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors text-left"
                  onClick={closeDropdown}
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors text-left"
                  onClick={closeDropdown}
                >
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium">Subscription</span>
                </button>
              </div>

              <div className="p-2 border-t border-slate-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-semibold">Log out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
});

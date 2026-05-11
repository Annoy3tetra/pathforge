import { useCallback, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Navbar } from "../components/layout/Navbar";

export function DashboardLayout({ children, title }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);

  return (
    <div className="h-dvh overflow-hidden flex bg-slate-950 text-slate-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden w-full relative">
        <Navbar title={title} onMenuClick={openSidebar} />
        
        <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

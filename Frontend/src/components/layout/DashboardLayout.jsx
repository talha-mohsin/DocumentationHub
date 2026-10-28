import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div
        className={cn(
          "flex-1 transition-all duration-300 min-w-0 pb-24 md:pb-0",
          sidebarCollapsed ? "md:pl-21" : "md:pl-65"
        )}
      >
        <Navbar />
        <main className="max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
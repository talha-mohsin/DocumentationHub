import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Globe,
  Search,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCookies } from 'react-cookie';
import { motion } from 'framer-motion';

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const [cookies] = useCookies(['user', 'token']);
  const role = cookies.user?.role;

  let menuItems;
  if (role === "admin") {
    menuItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: ShieldCheck, label: 'Admin Panel', path: '/admin' },
      { icon: Layers, label: 'Workspaces', path: '/workspaces' },
      { icon: FileText, label: 'All Docs', path: '/all-docs' },
      { icon: Edit3, label: 'My Drafts', path: '/my-drafts' },
      { icon: User, label: 'Profile', path: '/profile' },
    ];
  } else if (role === "viewer") {
    menuItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Layers, label: 'Workspaces', path: '/workspaces' },
      { icon: Globe, label: 'Public Docs', path: '/public-docs' },
      { icon: User, label: 'Profile', path: '/profile' },
    ];
  } else if (role === "editor") {
    menuItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Layers, label: 'Workspaces', path: '/workspaces' },
      { icon: Edit3, label: 'My Drafts', path: '/my-drafts' },
      { icon: Globe, label: 'Public Docs', path: '/public-docs' },
      { icon: User, label: 'Profile', path: '/profile' },
    ];
  } else {
    menuItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
      { icon: Layers, label: 'Workspaces', path: '/workspaces' },
      { icon: FileText, label: 'My Docs', path: '/my-docs' },
      { icon: Globe, label: 'Public Docs', path: '/public-docs' },
      { icon: Search, label: 'Search', path: '/search' },
      { icon: Layers, label: 'Categories', path: '/categories' },
      { icon: User, label: 'Profile', path: '/profile' },
    ];
  }

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 bg-white border-r border-slate-200/60 hidden md:flex flex-col transition-all duration-300 z-50 font-['Manrope']",
          collapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        <div className="h-24 flex items-center px-6 overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="bg-[#5148d7] p-1 rounded-sm">
              <FileText className="text-white w-5 h-5" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="flex items-center gap-2">

                <span className="text-[22px] font-medium tracking-tight text-[#1a1a1a]">DocuHub</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar pt-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => cn(
                "relative flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-indigo-50 text-[#5148d7]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#1e293b]"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-[#5148d7]" : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  {!collapsed && (
                    <span className={cn(
                      "text-[14px] tracking-tight transition-all",
                      isActive ? "font-bold" : "font-semibold"
                    )}>
                      {item.label}
                    </span>
                  )}
                  {/* Active Indicator Pill */}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute right-3 w-1.5 h-1.5 bg-[#5148d7] rounded-full shadow-[0_0_8px_rgba(81,72,215,0.4)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-3 rounded-xl bg-slate-50 text-slate-400 hover:text-[#5148d7] hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
          >
            {collapsed ? (
              <ChevronRight size={18} strokeWidth={2.5} />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft size={16} strokeWidth={2.5} />
              </div>
            )}
          </button>
        </div>
      </aside>

      <nav className="fixed md:hidden bottom-4 left-4 right-4 h-16 bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl flex items-center justify-around z-50">
        {menuItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-12 h-12 transition-all",
              isActive ? "text-[#5148d7] scale-110" : "text-slate-400"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={2.5} />
                {isActive && (
                  <motion.div
                    layoutId="mobileActive"
                    className="w-1 h-1 bg-[#5148d7] rounded-full mt-1"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};
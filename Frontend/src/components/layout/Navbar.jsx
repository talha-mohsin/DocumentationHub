
import { LogOut, Users, ChevronDown, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../components/ToastContainer'
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isLoggedIn = isAuthenticated;
  const image = user?.image;
  const username = user?.username;
  const role = user?.role;
 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      await axios.post("https://documentation-hub-h5zv.vercel.app/user/logout", {}, { withCredentials: true });
      authLogout();
      showToast("success", "Successfully logged out🎉");
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <header className="sticky top-0 z-60 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 px-8 py-3 flex items-center justify-between font-['Manrope']">

      {!isLoggedIn && (
        <div className=" flex items-center px-6 overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="bg-[#5148d7] p-1 rounded-sm">
              <FileText className="text-white w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[22px] font-medium tracking-tight text-[#1a1a1a]">DocuHub</span>
            </div>
          </div>
        </div>
      )}

      <div className="ml-auto flex items-center gap-5 relative">
        {isLoggedIn ? (
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="group flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
            >
              <div className="relative">
                <img
                  src={image || "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[13px] font-extrabold text-[#1e293b] tracking-tight group-hover:text-[#5148d7] transition-colors">
                  {username || 'Anonymous'}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {role || 'Standard User'}
                </span>
              </div>
              <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", showDropdown && "rotate-180")} />
            </button>


            {showDropdown && (
              <div className="absolute right-0 top-[110%] w-56 bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl shadow-indigo-100/50 border border-slate-100 py-2.5 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Account Status</p>
                  <p className="text-xs font-bold text-[#1e293b]">Online and Active</p>
                </div>

                <button
                  onClick={() => { setShowDropdown(false); navigate("/profile"); }}
                  className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-slate-600 hover:text-[#5148d7] hover:bg-indigo-50/50 flex items-center gap-3 transition-all"
                >
                  <Users className="w-4 h-4" strokeWidth={2.5} /> Profile Settings
                </button>

                <div className="my-1.5 border-t border-slate-50 dark:border-slate-800"></div>

                <button
                  onClick={logout}
                  className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-all"
                >
                  <LogOut className="w-4 h-4" strokeWidth={2.5} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 text-[13px] font-bold text-slate-600 hover:text-[#1e293b] transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2.5 text-[13px] font-bold rounded-xl bg-[#5148d7] text-white hover:bg-[#4338ca] shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
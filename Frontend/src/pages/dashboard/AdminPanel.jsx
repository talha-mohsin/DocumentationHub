import { useEffect, useState } from "react";
import axios from "axios";
import { 
  ShieldCheck, Users, Search, Send, Mail, Loader2, 
  CheckCircle2, AlertCircle, ChevronLeft, ChevronRight 
} from "lucide-react";

export const AdminPanel = () => {
  // --- AAPKI EXISTING STATES (UNCHANGED) ---
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [roleChanges, setRoleChanges] = useState({});
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(null);

  // --- AAPKI LOGIC (UNCHANGED) ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://documentation-hub-h5zv.vercel.app/user/all-users", { withCredentials: true });
        setUsers(res.data.users);
        setAllUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUsers) return setUsers(allUsers);
    const filtered = allUsers.filter((u) =>
      u.username.toLowerCase().includes(selectedUsers.toLowerCase())
    );
    setUsers(filtered);
  }, [selectedUsers, allUsers]);

  const handleRoleChange = (userId, newRole) => {
    setEditingUserId(userId);
    setRoleChanges({ ...roleChanges, [userId]: newRole });
  };

  const handleSave = async (user) => {
    try {
      await axios.post("https://documentation-hub-h5zv.vercel.app/user/assign-role",
        { email: user.email, newRole: roleChanges[user._id] },
        { withCredentials: true }
      );
      const updatedUsers = users.map((u) =>
        u._id === user._id ? { ...u, role: roleChanges[user._id] } : u
      );
      setUsers(updatedUsers);
      setAllUsers(updatedUsers);
      setEditingUserId(null);
      setRoleChanges({});
    } catch (err) {
      console.error("Error updating role:", err.message);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      setIsInviting(true);
      const res = await axios.post("https://documentation-hub-h5zv.vercel.app/user/invite", { email: inviteEmail }, { withCredentials: true });
      if (res.data.success) {
        setInviteStatus({ type: 'success', message: "Invitation sent!" });
        setInviteEmail("");
      }
    } catch (err) {
      setInviteStatus({ type: 'error', message: "Failed to send invitation." });
    } finally {
      setIsInviting(false);
      setTimeout(() => setInviteStatus(null), 5000);
    }
  };

  // --- NEW ATELIER UI ---
  return (
    <main className="p-8 md:p-12 bg-[#f7f9fb] min-h-screen font-['Manrope']">
      {/* Header Section */}
      <header className="mb-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#e3dfff] flex items-center justify-center text-[#5148d7]">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-light tracking-tight text-[#2a3439]">Administrative Control</h1>
        </div>
        <p className="text-[#566166] max-w-2xl font-light leading-relaxed">
          Manage users, permissions, and system-wide settings from the Atelier control center.
        </p>
      </header>

      {/* Bento Grid: Stats & Invite */}
      <div className="grid grid-cols-12 gap-6 mb-12 max-w-6xl">
        {/* Total Users Stat */}
        <div className="col-span-12 md:col-span-4 bg-white p-8 rounded-xl shadow-sm border border-[#a9b4b9]/10">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-[#5148d7]">
              <Users size={28} />
            </div>
            <span className="text-[10px] tracking-widest uppercase text-[#717c82] font-semibold">Global Network</span>
          </div>
          <div className="flex flex-col">
            <span className="text-5xl font-light text-[#2a3439] mb-1">{allUsers.length}</span>
            <span className="text-sm text-[#566166] font-light">Total verified users active</span>
          </div>
        </div>

        {/* Quick Invite Form */}
        <div className="col-span-12 md:col-span-5 bg-white p-8 rounded-xl shadow-sm border border-[#a9b4b9]/10">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#2a3439]">Quick Invite</h3>
            <p className="text-xs text-[#566166] font-light">Provision new member access instantly.</p>
          </div>
          <form onSubmit={handleInvite} className="flex gap-3">
            <div className="flex-1 border-b border-[#a9b4b9]/30 focus-within:border-[#5148d7] transition-colors py-1 relative">
              <input 
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-light placeholder:text-[#a9b4b9]"
                placeholder="colleague@docuhub.com"
                required
              />
              {inviteStatus && (
                <span className={`absolute -bottom-5 left-0 text-[10px] ${inviteStatus.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {inviteStatus.message}
                </span>
              )}
            </div>
            <button 
              disabled={isInviting}
              className="bg-[#5148d7] text-white px-5 py-2.5 rounded-md text-xs font-medium tracking-wide transition-all hover:bg-[#4439cb] active:scale-95 disabled:opacity-50"
            >
              {isInviting ? <Loader2 size={16} className="animate-spin" /> : "Send Invite"}
            </button>
          </form>
        </div>

        {/* System Uptime Placeholder */}
        <div className="col-span-12 md:col-span-3 bg-[#f0f4f7] p-8 rounded-xl flex flex-col justify-between border border-[#a9b4b9]/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-emerald-600 tracking-wide uppercase">System Active</span>
          </div>
          <div className="mt-4">
            <span className="block text-2xl font-light text-[#2a3439]">99.9%</span>
            <span className="text-[10px] text-[#566166] font-semibold tracking-widest uppercase">Uptime Performance</span>
          </div>
        </div>
      </div>

      {/* User Management Table Section */}
      <section className="max-w-6xl bg-white rounded-xl shadow-sm overflow-hidden border border-[#a9b4b9]/10">
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#a9b4b9]/5">
          <div>
            <h2 className="text-xl font-medium text-[#2a3439]">User Management</h2>
            <p className="text-xs text-[#566166] font-light mt-1">Directory of all registered entities and their functional roles.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717c82] w-4 h-4" />
            <input 
              type="text"
              onChange={(e) => setSelectedUsers(e.target.value)}
              className="pl-12 pr-6 py-2.5 bg-[#f0f4f7] border-none focus:ring-1 focus:ring-indigo-500/20 rounded-full text-sm font-light w-full md:w-80 transition-all"
              placeholder="Filter Users..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f9fb] text-[#717c82] text-[11px] uppercase tracking-widest font-semibold">
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Current Role</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#a9b4b9]/10">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center text-[#5148d7] font-light tracking-widest">
                    SYNCING DIRECTORY...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="group hover:bg-[#f7f9fb] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#717c82] border border-[#a9b4b9]/10">
                          <Users size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#2a3439]">{u.username}</span>
                          <span className="text-xs text-[#566166] font-light">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="relative w-40">
                        <select 
                          value={roleChanges[u._id] || u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="appearance-none w-full bg-[#f0f4f7] border-none text-xs font-light rounded-md py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-[#5148d7]/20 outline-none"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleSave(u)}
                        disabled={editingUserId !== u._id}
                        className={`text-xs font-medium tracking-wide transition-all ${
                          editingUserId === u._id 
                          ? "text-[#5148d7] hover:underline" 
                          : "text-[#a9b4b9] cursor-not-allowed"
                        }`}
                      >
                        Save Changes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-8 py-6 border-t border-[#a9b4b9]/5 flex justify-between items-center">
          <span className="text-[10px] tracking-widest uppercase text-[#717c82] font-semibold">Directory End</span>
          <div className="flex gap-4 text-[#a9b4b9]">
            <ChevronLeft size={18} />
            <ChevronRight size={18} />
          </div>
        </div>
      </section>
    </main>
  );
};
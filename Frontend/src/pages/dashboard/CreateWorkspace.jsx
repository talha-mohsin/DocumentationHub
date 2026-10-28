import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { 
  Plus, Globe, Lock, Users, Search, 
  ArrowLeft, Check, Loader2 
} from "lucide-react";

export const CreateWorkspace = () => {
  const [cookies] = useCookies(['user', 'token']);
  const navigate = useNavigate();
  const role = cookies.user?.role || "";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "private",
  });
  
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");

  useEffect(() => {
    if (role !== "admin") navigate('/workspaces');
  }, [role, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await axios.get("https://documentation-hub-h5zv.vercel.app/user/all-users", { withCredentials: true });
        setAllUsers(res.data.users || []);
      } catch (err) { 
        console.error("Failed to fetch users:", err.message); 
      } finally { 
        setLoadingUsers(false); 
      }
    };
    fetchUsers();
  }, []);

  const toggleMember = (email) => {
    setSelectedMembers(prev => 
      prev.includes(email) ? prev.filter(m => m !== email) : [...prev, email]
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsCreating(true);
      setProgressMsg("Processing...");
      const res = await axios.post("https://documentation-hub-h5zv.vercel.app/api/workspace/", formData, { withCredentials: true });
      const newWorkspace = res.data.workspace;

      if (selectedMembers.length > 0) {
        setProgressMsg(`Adding ${selectedMembers.length} members...`);
        const memberPromises = selectedMembers.map(email => 
          axios.post("https://documentation-hub-h5zv.vercel.app/api/workspace/add-member", {
            workspaceId: newWorkspace._id, email, role: "editor" 
          }, { withCredentials: true })
        );
        await Promise.allSettled(memberPromises);
      }
      
      setProgressMsg("Workspace Ready!");
      setTimeout(() => navigate(`/workspace/${newWorkspace._id}`), 800);
    } catch (error) {
      setProgressMsg("Action failed");
      setTimeout(() => setIsCreating(false), 2000);
    }
  };

  const isFormValid = formData.name.trim().length > 0;

  return (
    // 'Manrope' family with tight letter spacing for that premium look
    <div className="min-h-screen bg-[#f7f9fb] text-[#2a3439] font-['Manrope'] pb-20 selection:bg-[#e3dfff]/60">
      
      <header className="w-full bg-white px-8 h-16 flex items-center justify-between border-b border-[#a9b4b9]/15 sticky top-0 z-50">
        <button 
          onClick={() => navigate('/workspaces')}
          className="flex items-center space-x-2 text-[#717c82] hover:text-[#5148d7] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-semibold uppercase tracking-widest">Back to Dashboard</span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#e3dfff] rounded-lg flex items-center justify-center text-[#5148d7]">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">New Workspace</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Exact match to your image: font-light and tracking-tighter */}
        <div className="mb-10">
          <h1 className="text-4xl font-light tracking-tighter text-[#2a3439]">Workspace Setup</h1>
          <p className="text-[#566166] mt-1 text-base font-light leading-relaxed">
            Provision a new collaboration environment for your team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[24px] border border-[#a9b4b9]/15 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-[#717c82] uppercase tracking-widest ml-1">Workspace Name</label>
                <input
                  type="text"
                  placeholder="e.g. Design System"
                  className="w-full bg-[#f7f9fb] border border-[#a9b4b9]/20 rounded-xl px-4 py-3.5 outline-none focus:border-[#5148d7]/40 transition-all text-sm font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-[#717c82] uppercase tracking-widest ml-1">Description</label>
                <textarea
                  placeholder="What is this workspace for?"
                  rows="4"
                  className="w-full bg-[#f7f9fb] border border-[#a9b4b9]/20 rounded-xl px-4 py-3.5 outline-none focus:border-[#5148d7]/40 transition-all resize-none text-sm font-light leading-relaxed"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-semibold text-[#717c82] uppercase tracking-widest ml-1">Visibility Status</label>
                <div className="grid grid-cols-3 gap-3">
                  {['private', 'team', 'public'].map((v) => (
                    <button 
                      key={v}
                      type="button"
                      onClick={() => setFormData({...formData, visibility: v})}
                      className={`flex flex-col items-center py-4 rounded-xl border transition-all gap-2 ${
                        formData.visibility === v 
                          ? "bg-[#e3dfff] border-[#d3d0ff] text-[#5148d7] shadow-sm" 
                          : "bg-white border-[#a9b4b9]/15 text-[#717c82] hover:bg-[#f7f9fb]"
                      }`}
                    >
                      {v === 'private' && <Lock className="w-4 h-4" />}
                      {v === 'team' && <Users className="w-4 h-4" />}
                      {v === 'public' && <Globe className="w-4 h-4" />}
                      <span className="text-[10px] font-semibold uppercase tracking-widest">{v}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-[24px] border border-[#a9b4b9]/15 shadow-sm overflow-hidden flex flex-col h-[600px]">
              
              <div className="p-6 border-b border-[#a9b4b9]/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#717c82]">Invite Members</h3>
                  <div className="bg-[#e3dfff] text-[#5148d7] text-[10px] px-3 py-1 rounded-full font-semibold uppercase tracking-widest">
                    {selectedMembers.length} Selected
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a9b4b9] w-4 h-4" />
                  <input 
                    type="text"
                    placeholder="Search directory..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full pl-11 pr-5 py-3.5 bg-[#f7f9fb] border border-[#a9b4b9]/15 rounded-xl text-sm outline-none focus:border-[#5148d7]/40 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loadingUsers ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <Loader2 className="w-6 h-6 animate-spin text-[#5148d7]" />
                  </div>
                ) : (
                  allUsers
                    .filter(u => u.username?.toLowerCase().includes(memberSearch.toLowerCase()) || u.email?.toLowerCase().includes(memberSearch.toLowerCase()))
                    .map((u) => {
                      const isSelected = selectedMembers.includes(u.email);
                      return (
                        <div 
                          key={u._id} 
                          onClick={() => toggleMember(u.email)}
                          className={`flex items-center justify-between p-3 px-5 rounded-2xl cursor-pointer transition-all ${
                            isSelected ? "bg-[#f7f9fb] border-l-4 border-l-[#5148d7]" : "hover:bg-[#f7f9fb] border-l-4 border-l-transparent"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                              isSelected ? "bg-[#5148d7] text-white" : "bg-[#f7f9fb] text-[#717c82] border border-[#a9b4b9]/15"
                            }`}>
                              {u.username?.[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{u.username}</p>
                              <p className="text-[11px] text-[#717c82] font-light italic">{u.email}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isSelected ? "bg-[#5148d7] border-[#5148d7] text-white" : "border-[#a9b4b9]/30"
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>

              <div className="p-6 border-t border-[#a9b4b9]/5 bg-[#f7f9fb]/50">
                <button 
                  onClick={handleCreate} 
                  disabled={isCreating || !isFormValid}
                  className={`w-full py-4 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all active:scale-[0.98] flex items-center justify-center space-x-2 
                    ${isCreating || !isFormValid 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                      : "bg-[#5148d7] hover:bg-[#4439cb] text-white shadow-sm shadow-[#5148d7]/20"
                    }`}
                >
                  {isCreating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>{progressMsg}</span></>
                  ) : (
                    <span>Create Workspace</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
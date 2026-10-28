import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Card, Badge, Button } from "@/components/ui";
import { 
  Plus, 
  Globe, 
  Lock, 
  Users, 
  Search, 
  ArrowLeft, 
  Check, 
  Loader2, 
  Shield, 
  Info,
  Type,
  Layout,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";

export const EditWorkspace = () => {
  const [cookies] = useCookies(['user', 'token']);
  const navigate = useNavigate();
  const { id } = useParams();
  const role = cookies.user?.role || "";

  // Workspace Info State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "private",
  });

  // Members State
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]); // Array of emails
  const [initialMembers, setInitialMembers] = useState([]); // Array of emails for comparison
  const [memberSearch, setMemberSearch] = useState("");
  
  // Loading & Progress State
  const [loadingData, setLoadingData] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");

  // Role Protection
  useEffect(() => {
    if (role !== "admin") {
      navigate('/workspaces');
    }
  }, [role, navigate]);

  // Fetch Workspace Data and All Users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);

        // 1. Fetch all other users
        const usersRes = await axios.get("https://documentation-hub-h5zv.vercel.app/user/all-users", { withCredentials: true });
        let users = usersRes.data.users || [];

        // Inject the logged-in user themselves into the list (backend sometimes excludes them)
        const currentUser = cookies.user;
        if (currentUser && !users.find(u => u.email === currentUser.email)) {
          users = [{ _id: currentUser._id || currentUser.id, username: currentUser.username, email: currentUser.email, role: currentUser.role }, ...users];
        }
        
        setAllUsers(users);

        // 2. Fetch Workspace & Members
        const response = await axios.get(`https://documentation-hub-h5zv.vercel.app/api/workspace/${id}`, { withCredentials: true });
        const { workspace, members } = response.data;

        setFormData({
          name: workspace.name || "",
          description: workspace.description || "",
          visibility: workspace.visibility || "private",
        });

        // 3. Extract Current Members emails from backend
        const currentMemberEmails = (members || []).map(m => m.userId?.email).filter(Boolean);
        console.log("✅ Workspace members from DB:", currentMemberEmails);
        console.log("👥 All users list:", users.map(u => u.email));

        setSelectedMembers(currentMemberEmails);
        setInitialMembers(currentMemberEmails);

      } catch (err) {
        console.error("Error fetching edit data:", err.message);
      } finally {
        setLoadingData(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const toggleMember = (email) => {
    setSelectedMembers(prev => 
      prev.includes(email) ? prev.filter(m => m !== email) : [...prev, email]
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsUpdating(true);
      setProgressMsg("Updating workspace details...");
      
      // 1. Update general info
      await axios.put(
        `https://documentation-hub-h5zv.vercel.app/api/workspace/${id}`,
        formData,
        { withCredentials: true }
      );
      
      // 2. Handle Member Changes
      const membersToAdd = selectedMembers.filter(m => !initialMembers.includes(m));
      const membersToRemove = initialMembers.filter(m => !selectedMembers.includes(m));

      // Add new members
      if (membersToAdd.length > 0) {
        setProgressMsg(`Adding ${membersToAdd.length} new members...`);
        const addPromises = membersToAdd.map(email => 
          axios.post("https://documentation-hub-h5zv.vercel.app/api/workspace/add-member", {
            workspaceId: id,
            email: email,
            role: "editor" 
          }, { withCredentials: true })
        );
        await Promise.allSettled(addPromises);
      }

      // Remove members
      if (membersToRemove.length > 0) {
        setProgressMsg(`Removing ${membersToRemove.length} members...`);
        const removePromises = membersToRemove.map(email => {
            const user = allUsers.find(u => u.email === email);
            if (!user) return Promise.resolve();
            return axios.delete("https://documentation-hub-h5zv.vercel.app/api/workspace/remove-member", {
                data: { workspaceId: id, userId: user._id }, 
                withCredentials: true
            });
        });
        await Promise.allSettled(removePromises);
      }

      setProgressMsg("Successfully updated!");
      setTimeout(() => navigate(`/workspace/${id}`), 1000);
    } catch (error) {
      console.error("Update error:", error.message);
      setProgressMsg("Failed to update. Please try again.");
      setTimeout(() => setIsUpdating(false), 2000);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-slate-500 font-medium">Loading workspace info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-10 space-y-10 bg-slate-50/50 dark:bg-transparent min-h-screen">
      <header className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/workspaces')} 
          className="w-fit gap-2 -ml-3 text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workspaces
        </Button>
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-200 dark:shadow-none">
            <Layout className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Edit Workspace</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Modify details and manage members for this workspace.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Step 1: General Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2">
            <Info className="w-4 h-4" /> 01. Workspace Details
          </div>
          <Card className="p-8 space-y-6 shadow-sm border-slate-100 dark:border-slate-800">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Type className="w-4 h-4 text-slate-400" /> Workspace Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Design System"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  placeholder="Tell your team what this space is about..."
                  rows="4"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none text-sm leading-relaxed"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" /> Privacy & Visibility
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {['private', 'team', 'public'].map((v) => (
                    <div 
                      key={v}
                      onClick={() => setFormData({...formData, visibility: v})}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all uppercase text-[10px] tracking-widest font-black",
                        formData.visibility === v 
                          ? "bg-indigo-50 border-indigo-600 text-indigo-600 dark:bg-indigo-900/40" 
                          : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
                      )}
                    >
                      {v === 'private' && <Lock className="w-4 h-4" />}
                      {v === 'team' && <Users className="w-4 h-4" />}
                      {v === 'public' && <Globe className="w-4 h-4" />}
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Step 2: Member Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2">
            <Users className="w-4 h-4" /> 02. Manage Members ({selectedMembers.length})
          </div>
          <Card className="p-0 border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden max-h-[600px]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 sticky top-0">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search and manage members..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto px-6 py-4 space-y-3 flex-1 bg-white dark:bg-slate-900">
              {allUsers.length > 0 ? (
                allUsers
                  .filter(u => 
                    u.username?.toLowerCase().includes(memberSearch.toLowerCase()) || 
                    u.email?.toLowerCase().includes(memberSearch.toLowerCase())
                  )
                  // Sort: Existing members or selected members come first
                  .sort((a, b) => {
                    const aActive = selectedMembers.includes(a.email) || initialMembers.includes(a.email);
                    const bActive = selectedMembers.includes(b.email) || initialMembers.includes(b.email);
                    if (aActive === bActive) return 0;
                    return aActive ? -1 : 1;
                  })
                  .map((u) => {
                    // Admins are locked to be always selected and assigned
                    const isAdminUser = u.role === "admin";
                    const isSelected = isAdminUser || selectedMembers.includes(u.email);
                    const isInitial = initialMembers.includes(u.email);
                    
                    return (
                      <div 
                        key={u._id} 
                        onClick={() => !isAdminUser && toggleMember(u.email)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl transition-all border-2",
                          isAdminUser
                            ? "bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/20 cursor-default opacity-80"
                            : isSelected 
                              ? "bg-indigo-50 border-indigo-500 dark:bg-indigo-900/40 cursor-pointer" 
                              : isInitial 
                                ? "bg-red-50/50 border-red-200 dark:bg-red-900/10 border-dashed cursor-pointer" // Show red tint if deselected but was a member
                                : "bg-white border-transparent hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors shadow-md",
                            isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                          )}>
                            {u.username?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 dark:text-slate-100">{u.username}</p>
                              {isAdminUser ? (
                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[9px] uppercase px-1.5 py-0 h-4">
                                  Default Access
                                </Badge>
                              ) : isInitial ? (
                                <Badge variant={isSelected ? "success" : "destructive"} className="text-[9px] uppercase px-1.5 py-0 h-4">
                                  {isSelected ? "Already Assigned" : "Will be removed"}
                                </Badge>
                              ) : isSelected ? (
                                <Badge variant="primary" className="text-[9px] uppercase px-1.5 py-0 h-4">Newly Added</Badge>
                              ) : (
                                <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-none text-[9px] uppercase px-1.5 py-0 h-4 shadow-none">Not Assigned</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-slate-500">{u.email}</p>
                              <Badge variant={isAdminUser ? "default" : "secondary"} className="px-1.5 py-0 h-4 text-[9px]">{u.role}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                          isAdminUser 
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-400" 
                            : isSelected 
                              ? "bg-indigo-600 text-white animate-in zoom-in duration-300" 
                              : "bg-slate-100 dark:bg-slate-700 text-slate-300 border border-slate-200"
                        )}>
                          {isAdminUser ? <Lock className="w-4 h-4" /> : isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="py-20 text-center space-y-2">
                   <p className="text-slate-500 font-bold">No users available.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
               <div className="flex items-center justify-between">
                  <div className="text-slate-500 text-sm font-medium">
                     {selectedMembers.length} member{selectedMembers.length !== 1 && 's'} total
                  </div>
                  <Button 
                    onClick={handleUpdate} 
                    disabled={isUpdating || !formData.name}
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 rounded-2xl font-bold shadow-xl shadow-indigo-100 dark:shadow-none transition-all gap-3"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {progressMsg}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Update Workspace
                      </>
                    )}
                  </Button>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Globe,
  Lock,
  Users,
  Edit,
  Trash2,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCookies } from "react-cookie";

// Minimalist Visibility Badge based on Atelier Design
function VisibilityBadge({ visibility }) {
  const config = {
    public: {
      icon: <Globe className="w-3 h-3" />,
      cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    private: {
      icon: <Lock className="w-3 h-3" />,
      cls: "bg-slate-100 text-slate-500 border-slate-200",
    },
    team: {
      icon: <Users className="w-3 h-3" />,
      cls: "bg-[#e3dfff] text-[#5148d7] border-[#d3d0ff]",
    },
  };
  const { icon, cls } = config[visibility] || config.private;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold border uppercase tracking-widest transition-all",
        cls,
      )}
    >
      {icon}
      {visibility}
    </span>
  );
}

// Function to generate unique pastel gradient based on workspace name
const getAvatarGradient = (name) => {
  const gradients = [
    "linear-gradient(135deg, #e3dfff 0%, #fdfbfb 100%)", // Indigo soft
    "linear-gradient(135deg, #e0f2f1 0%, #fdfbfb 100%)", // Teal soft
    "linear-gradient(135deg, #fff3e0 0%, #fdfbfb 100%)", // Orange soft
    "linear-gradient(135deg, #fce4ec 0%, #fdfbfb 100%)", // Pink soft
    "linear-gradient(135deg, #e8f5e9 0%, #fdfbfb 100%)", // Green soft
  ];
  const index = name ? name.length % gradients.length : 0;
  return gradients[index];
};

export const Workspaces = () => {
  const [cookies] = useCookies(["user", "token"]);
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate();
  const role = cookies.user?.role || "";
  const isAdmin = role === "admin";
  const currentUserId = cookies.user?._id || cookies.user?.id || "";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);

        const res = await axios.get("https://documentation-hub-h5zv.vercel.app/api/workspace/", {
          withCredentials: true,
        });
        const all = res.data;

        if (role === "admin") {
          setWorkspaces(all);
          return;
        }

        const memberChecks = await Promise.all(
          all.map((ws) =>
            axios
              .get(`https://documentation-hub-h5zv.vercel.app/api/workspace/${ws._id}`, {
                withCredentials: true,
              })
              .then((r) => {
                const members = r.data.members || [];
                const isMember = members.some(
                  (m) =>
                    (m.userId?._id || m.userId?.toString?.() || m.userId) ===
                    currentUserId,
                );
                return isMember ? ws : null;
              })
              .catch(() => null),
          ),
        );
        setWorkspaces(memberChecks.filter(Boolean));
      } catch (error) {
        console.log("fetchWorkspaces error:", error.message);
      } finally {
        setLoading(false); // stop loading
      }
    };
    if (role) fetchWorkspaces();
  }, [role, currentUserId]);

  const deleteWorkspace = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workspace?"))
      return;
    try {
      await axios.delete(`https://documentation-hub-h5zv.vercel.app/api/workspace/${id}`, {
        withCredentials: true,
      });
      setWorkspaces((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <main className="p-8 md:p-12 bg-[#f7f9fb] min-h-screen font-['Manrope'] selection:bg-[#e3dfff]">
      {/* Header Section */}
      <header className="mb-12 max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-[#e3dfff] flex items-center justify-center text-[#5148d7]">
              <LayoutGrid size={20} />
            </div>
            <h1 className="text-4xl font-light tracking-tight text-[#2a3439]">
              Your Workspaces
            </h1>
          </div>
          <p className="text-[#566166] max-w-md font-light leading-relaxed">
            Manage your documentation collections and team collaborations from
            your central hub.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate("/workspace/create")}
            className="flex items-center gap-2 bg-[#5148d7] hover:bg-[#4439cb] text-white px-6 py-3 rounded-lg text-xs font-medium tracking-wide shadow-sm transition-all active:scale-95"
          >
            <Plus size={16} /> New Workspace
          </button>
        )}
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center w-full py-32">
            <div className="w-10 h-10 border-2 border-[#5148d7] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading &&
          workspaces.map((ws) => (
            <div
              key={ws._id}
              className="group relative flex flex-col rounded-xl bg-white border border-[#a9b4b9]/15 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#5148d7]/30 min-h-[300px]"
            >
              <div
                className="relative p-6 border-b border-[#a9b4b9]/10"
                style={{ background: getAvatarGradient(ws.name) }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-[#a9b4b9]/10 shadow-inner">
                    <span className="text-2xl font-medium text-[#5148d7] uppercase">
                      {ws.name ? ws.name.charAt(0) : "W"}
                    </span>
                  </div>
                  <VisibilityBadge visibility={ws.visibility} />
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-medium text-[#2a3439] line-clamp-1">
                    {ws.name}
                  </h3>

                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => navigate(`/workspace/edit/${ws._id}`)}
                        className="p-1.5 rounded-md hover:bg-indigo-50 text-[#717c82] hover:text-[#5148d7] transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deleteWorkspace(ws._id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-[#a9b4b9] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-[#566166] font-light leading-relaxed line-clamp-2 mb-6 h-10">
                  {ws.description || "No description provided."}
                </p>

                <div className="mt-auto pt-4 border-t border-[#a9b4b9]/5 flex justify-end">
                  <Link to={`/workspace/${ws._id}`} className="w-full">
                    <button className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-[#f7f9fb] hover:bg-[#e3dfff] text-[#5148d7] text-xs font-semibold tracking-wide transition-colors">
                      View Space <ChevronRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
};

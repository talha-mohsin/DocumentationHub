import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { cn } from '@/lib/utils';
import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Layers,
  ArrowUpRight,
  Plus,
  MessageSquare,
  LayoutGrid,
  ChevronRight,
  Loader2
} from 'lucide-react';

export const Dashboard = () => {
  const [cookies] = useCookies(['user', 'token']);
  const navigate = useNavigate();
  const user = cookies.user ? (typeof cookies.user === 'string' ? JSON.parse(cookies.user) : cookies.user) : null;
  const role = user?.role || "";
  const [workspaces, setWorkspaces] = useState([]);
  const [publicDocs, setPublicDocs] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wsRes = await axios.get("https://documentation-hub-h5zv.vercel.app/api/workspace/", { withCredentials: true });
        let filteredWorkspaces = [];

        if (role === 'admin') {
          filteredWorkspaces = wsRes.data || [];
        } else {
          const memberChecks = await Promise.all(
            (wsRes.data || []).map(ws =>
              axios.get(`https://documentation-hub-h5zv.vercel.app/api/workspace/${ws._id}`, { withCredentials: true })
                .then(r => {
                  const members = r.data.members || [];
                  const isMember = members.some(m => (m.userId?._id || m.userId?.toString?.() || m.userId) === user?._id);
                  return isMember ? ws : null;
                })
                .catch(() => null)
            )
          );
          filteredWorkspaces = memberChecks.filter(Boolean);
        }
        setWorkspaces(filteredWorkspaces);

        const docsRes = await axios.get("https://documentation-hub-h5zv.vercel.app/api/documents/public", { withCredentials: true });
        const fetchedDocs = docsRes.data || [];
        setPublicDocs(fetchedDocs);

        if (role === 'admin') {
          const userRes = await axios.get("https://documentation-hub-h5zv.vercel.app/user/all-users", { withCredentials: true });
          setTotalUsers(userRes.data?.users?.length || 0);
        }

        if (fetchedDocs.length > 0) {
          const topDocs = fetchedDocs.slice(0, 10);
          const commentRequests = topDocs.map(d => axios.get(`https://documentation-hub-h5zv.vercel.app/user/get-comments/${d._id}`, { withCredentials: true }));
          const commentResponses = await Promise.all(commentRequests);
          let uniqueDocsCommented = 0;
          commentResponses.forEach(res => {
            const docComments = res.data?.data || [];
            const hasMyComment = docComments.some(c => c.userId?._id === user?._id || c.userId === user?._id);
            if (hasMyComment) uniqueDocsCommented++;
          });
          setTotalComments(uniqueDocsCommented);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (role && user?._id) fetchData();
  }, [role, user?._id]);

  const stats = role === 'admin' ? [
    { label: 'Workspaces', value: workspaces.length, icon: Layers, color: 'text-indigo-600', bg: 'bg-[#e3dfff]' },
    { label: 'Public Docs', value: publicDocs.length, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Unique Comments', value: totalComments, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Members', value: totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ] : [
    { label: 'Workspaces', value: workspaces.length, icon: Layers, color: 'text-indigo-600', bg: 'bg-[#e3dfff]' },
    { label: 'Public Docs', value: publicDocs.length, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Unique Comments', value: totalComments, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <main className="p-8 md:p-12 bg-[#f7f9fb] min-h-screen font-['Manrope'] selection:bg-[#e3dfff]">
      
      {/* Header Section */}
      <header className="mb-12 max-w-7xl space-y-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-[#e3dfff] flex items-center justify-center text-[#5148d7]">
            <LayoutGrid size={20} />
          </div>
          <h1 className="text-4xl font-light tracking-tight text-[#2a3439]">
            Welcome, <span className="font-normal">{user?.username || 'User'}</span>.
          </h1>
        </div>
        <p className="text-[#566166] max-w-md font-light leading-relaxed">
          {loading ? "Initializing your workspace overview..." : `Monitoring ${workspaces.length} active spaces and ${publicDocs.length} shared assets.`}
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mb-16">
        {stats.map((stat, i) => (
          <Link key={i} to={stat.path} className="group">
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 bg-white border border-[#a9b4b9]/15 rounded-xl shadow-sm transition-all hover:shadow-md hover:border-[#5148d7]/20 h-full"
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors", stat.bg)}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="text-3xl font-light text-[#2a3439]">{stat.value}</p>
              <p className="text-[10px] tracking-widest uppercase text-[#717c82] mt-1 font-semibold">{stat.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#5148d7] rounded-full" />
            <h2 className="text-xl font-medium text-[#2a3439]">Recent Public Documents</h2>
          </div>
          <button 
            className="text-[10px] font-bold tracking-widest uppercase text-[#5148d7] hover:underline"
          >
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-20 bg-white border border-[#a9b4b9]/10 animate-pulse rounded-xl" />)
          ) : publicDocs.length > 0 ? (
            publicDocs.slice(0, 3).map((doc, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                onClick={() => navigate(`/doc/${doc._id}`)}
                className="group p-5 bg-white border border-[#a9b4b9]/15 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:shadow-md hover:border-[#5148d7]/30"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-lg bg-[#f7f9fb] group-hover:bg-[#e3dfff] flex items-center justify-center text-[#a9b4b9] group-hover:text-[#5148d7] transition-all">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-medium text-[#2a3439] group-hover:text-[#5148d7] transition-colors line-clamp-1">{doc.title}</h4>
                    <p className="text-[11px] text-[#566166] font-light mt-0.5">
                      Authored by <span className="font-medium text-[#2a3439]">{doc.authorId?.username || 'System'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:flex gap-2">
                    <span className="bg-slate-50 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-100 uppercase tracking-widest">
                      {doc.visibility}
                    </span>
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest",
                      doc.status === 'published' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    )}>
                      {doc.status}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-[#a9b4b9] group-hover:text-[#5148d7] transition-all group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-16 text-center bg-white border border-dashed border-[#a9b4b9]/20 rounded-2xl">
              <p className="text-sm font-light text-[#566166]">No public assets discovered yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
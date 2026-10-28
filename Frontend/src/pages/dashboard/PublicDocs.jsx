import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  MoreVertical,
  Globe,
  Search,
  Loader2,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ShareModal from "../../components/layout/ShareModal";

export const PublicDocs = () => {
  const [publicDocs, setPublicDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // 1. Added Search State
  const [isModel, setIsModel] = useState(false);
  const [docLink, setDocLink] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPublicDocs() {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://documentation-hub-h5zv.vercel.app/api/documents/public",
          {
            withCredentials: true,
          },
        );
        setPublicDocs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch public docs error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicDocs();
  }, []);

  // 2. Logic to filter documents based on search input
  const filteredDocs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return publicDocs;

    return publicDocs.filter((doc) => {
      const title = (doc.title || "").toLowerCase();
      const author = (doc.authorId?.username || "").toLowerCase();
      return title.includes(query) || author.includes(query);
    });
  }, [searchQuery, publicDocs]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getShareLink = async (docId) => {
    try {
      const res = await axios.get(
        `https://documentation-hub-h5zv.vercel.app/api/documents/share/${docId}`,
      );

      console.log("res ====>> ", res.data.data.shareLink);

      return res.data.data.shareLink;
    } catch (err) {
      console.log(err.response?.data);

      throw new Error(err.response?.data?.message || "Failed to generate link");
    }
  };

  const handleShare = async (docId, e) => {
    e.stopPropagation(); // VERY IMPORTANT (prevents row click)

    try {
      const link = await getShareLink(docId);
      setDocLink(link);
      setIsModel(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main className="p-8 md:p-12 bg-[#f7f9fb] min-h-screen font-['Manrope'] selection:bg-[#e3dfff]">
      {/* HEADER SECTION */}
      <header className="mb-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-[#e3dfff] flex items-center justify-center text-[#5148d7]">
              <Globe size={20} />
            </div>
            <h1 className="text-4xl font-light tracking-tight text-[#2a3439]">
              Public Assets
            </h1>
          </div>
          <p className="text-[#566166] max-w-md font-light leading-relaxed">
            Explore and access the global knowledge base shared across all
            organizational workspaces.
          </p>
        </div>

        {/* SEARCH BAR - Now functional */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a9b4b9] group-focus-within:text-[#5148d7] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="pl-10 pr-4 py-3 bg-white border border-[#a9b4b9]/20 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#e3dfff] focus:border-[#5148d7] outline-none transition-all w-full md:w-[280px] shadow-sm"
          />
        </div>
      </header>

      {/* DATA GRID */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#a9b4b9]/15 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f9fb]/50 border-b border-[#a9b4b9]/10">
                  <th className="px-8 py-5 text-[11px] font-bold text-[#717c82] uppercase tracking-widest">
                    Document Name
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#717c82] uppercase tracking-widest">
                    Visibility
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#717c82] uppercase tracking-widest">
                    Author
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#717c82] uppercase tracking-widest">
                    Timestamp
                  </th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <Loader2 className="w-6 h-6 animate-spin text-[#5148d7]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Syncing assets...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => (
                    <motion.tr
                      key={doc._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => navigate(`/doc/${doc._id}`)}
                      className="group hover:bg-[#f7f9fb] transition-all cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#f7f9fb] text-[#a9b4b9] group-hover:bg-[#e3dfff] group-hover:text-[#5148d7] flex items-center justify-center transition-all border border-transparent group-hover:border-[#d3d0ff]">
                            <FileText size={20} />
                          </div>
                          <span className="font-bold text-[#2a3439] text-[15px] group-hover:text-[#5148d7] transition-colors">
                            {doc.title || "Untitled Document"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {doc.status || "Public"}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm font-semibold text-[#566166]">
                        {doc.authorId?.username || "System User"}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-[#a9b4b9] text-xs font-medium">
                          <Clock size={14} />{" "}
                          {formatDate(doc.updatedAt || doc.createdAt)}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(doc._id, e);
                          }}
                          className="p-2 rounded-full hover:bg-[#f1f3f5] transition cursor-pointer"
                        >
                          <Share2 size={16} className="text-[#5148d7]" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-20 text-center text-[#a9b4b9] font-medium text-sm"
                    >
                      No assets found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
                {/* Modal */}
                {isModel && (
                  <ShareModal
                    link={docLink}
                    onClose={() => setIsModel(false)}
                  />
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER LABEL */}
        <p className="mt-8 text-center text-[10px] font-bold text-[#a9b4b9] uppercase tracking-[0.3em]">
          Atelier Enterprise Architecture • {filteredDocs.length} Records Shown
        </p>
      </div>
    </main>
  );
};

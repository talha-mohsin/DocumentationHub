import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Users } from "lucide-react";
import { FiUserPlus, FiX } from "react-icons/fi";
import {
  FileText,
  Search,
  Clock,
  Globe,
  Lock,
  ArrowRight,
  Loader2,
  Filter,
  Layers,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../../components/ui";
import ShareModal from "../../components/layout/ShareModal";
// Minimalist Status Badge - Consistent with your Workspaces design
function StatusBadge({ status }) {
  const config = {
    published: { cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    draft: { cls: "bg-slate-100 text-slate-500 border-slate-200" },
    archived: { cls: "bg-amber-50 text-amber-600 border-amber-100" },
  };
  const { cls } = config[status] || config.draft;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold border uppercase tracking-[0.1em] transition-all",
        cls,
      )}
    >
      {status}
    </span>
  );
}

export const AllDocs = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [isModel, setIsModel] = useState(false);
  const [docLink, setDocLink] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [users, setUsers] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(null);

  useEffect(() => {
    const fetchAllDocs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://documentation-hub-h5zv.vercel.app/api/documents/admin/all",
          { withCredentials: true },
        );
        setDocuments(res.data || []);
      } catch (err) {
        console.error("Error fetching admin docs:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDocs();
  }, []);

  // handling dropdown for sharing
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const openMemberModal = async (docId) => {
    try {
      setSelectedDocId(docId);
      setShowMembersModal(true);
      setLoadingMembers(true);

      const res = await axios.get("https://documentation-hub-h5zv.vercel.app/user/all-users", {
        withCredentials: true,
      });

      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMembers(false);
    }
  };

  // document share for making editor
  const handleAddEditor = async (userId) => {
    try {
      setLoadingUserId(userId);

      const res = await axios.post(
        `https://documentation-hub-h5zv.vercel.app/api/documents/joinshare/${selectedDocId}`,
        { userId },
        { withCredentials: true },
      );

      // ✅ get share link from backend
      const link = res.data?.data?.shareLink;

      if (!link) throw new Error("No link returned");

      // ✅ close members modal
      setShowMembersModal(false);

      // ✅ open SAME Share Modal
      setDocLink(link);
      setIsModel(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUserId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredDocs = documents.filter(
    (doc) =>
      (doc.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.workspaceId?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (doc.authorId?.username || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

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
      console.log(error.message)
    }
  };

  return (
    <main className="p-8 md:p-12 bg-[#f7f9fb] min-h-screen font-['Manrope'] selection:bg-[#e3dfff]">
      {/* Header Section - Same as Workspaces */}
      <header className="mb-12 max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-[#e3dfff] flex items-center justify-center text-[#5148d7]">
              <FileText size={20} />
            </div>
            <h1 className="text-4xl font-light tracking-tight text-[#2a3439]">
              Master Repository
            </h1>
          </div>
          <p className="text-[#566166] max-w-md font-light leading-relaxed">
            Access and manage all documentation assets across the entire
            organizational network.
          </p>
        </div>

        {/* Search Bar - Consistent with Workspace style */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a9b4b9] w-4 h-4 group-focus-within:text-[#5148d7] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full md:w-80 pl-11 pr-4 py-3 bg-white border border-[#a9b4b9]/15 rounded-xl text-sm font-light outline-none focus:border-[#5148d7]/30 transition-all shadow-sm"
          />
        </div>
      </header>

      {/* Content Area */}
      <div className="max-w-7xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#5148d7] opacity-40" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#a9b4b9] font-medium">
              Fetching Records
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#a9b4b9]/15 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fcfdfe] border-b border-[#a9b4b9]/10">
                    <th className="px-6 py-5 text-[10px] font-semibold text-[#a9b4b9] uppercase tracking-[0.15em]">
                      Document Info
                    </th>
                    <th className="px-6 py-5 text-[10px] font-semibold text-[#a9b4b9] uppercase tracking-[0.15em]">
                      Workspace
                    </th>
                    <th className="px-6 py-5 text-[10px] font-semibold text-[#a9b4b9] uppercase tracking-[0.15em]">
                      Author
                    </th>
                    <th className="px-6 py-5 text-[10px] font-semibold text-[#a9b4b9] uppercase tracking-[0.15em]">
                      Status
                    </th>
                    <th className="px-6 py-5 text-[10px] font-semibold text-[#a9b4b9] uppercase tracking-[0.15em]">
                      Date
                    </th>
                    <th className="px-6 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#a9b4b9]/5">
                  <AnimatePresence>
                    {filteredDocs.length > 0 ? (
                      filteredDocs.map((doc) => (
                        <motion.tr
                          key={doc._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => navigate(`/doc/${doc._id}`)}
                          className="group hover:bg-[#f7f9fb] transition-all cursor-pointer"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-lg bg-[#f7f9fb] flex items-center justify-center text-[#a9b4b9] group-hover:bg-[#e3dfff] group-hover:text-[#5148d7] transition-all">
                                <FileText size={16} />
                              </div>
                              <div>
                                <span className="text-[15px] font-medium text-[#2a3439] block group-hover:text-[#5148d7] transition-colors">
                                  {doc.title || "Untitled"}
                                </span>
                                <span className="text-[10px] text-[#a9b4b9] font-light">
                                  #{doc._id.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-[#566166]">
                              <Layers size={14} className="opacity-40" />
                              <span className="text-sm font-light">
                                {doc.workspaceId?.name || "Global"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-[#e3dfff]/40 flex items-center justify-center text-[10px] font-bold text-[#5148d7]">
                                {doc.authorId?.username?.[0] || "S"}
                              </div>
                              <span className="text-sm text-[#566166] font-light">
                                {doc.authorId?.username || "System"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <StatusBadge status={doc.status} />
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-[#a9b4b9]">
                              <Calendar size={13} />
                              <span className="text-[12px] font-light">
                                {formatDate(doc.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="relative">
                              {/* Share Icon */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(
                                    openDropdown === doc._id ? null : doc._id,
                                  );
                                }}
                                className="p-2 rounded-full hover:bg-[#f1f3f5] transition cursor-pointer"
                              >
                                <Share2 size={16} className="text-[#5148d7]" />
                              </button>

                              {/* Dropdown */}
                              {openDropdown === doc._id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 mt-2 w-44 bg-white border border-[#e5e7eb] rounded-lg shadow-lg z-50"
                                >
                                  {/* Option 1: Public Share */}
                                  <button
                                    onClick={(e) => {
                                      handleShare(doc._id, e);
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#f7f9fb]"
                                  >
                                    <span className="flex items-center gap-2">
                                      <Globe size={14} /> Share Public
                                    </span>
                                  </button>

                                  {/* Option 2: Add Editors */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // 👉 open your member modal here
                                      openMemberModal(doc._id);
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#f7f9fb]"
                                  >
                                    <span className="flex items-center gap-2">
                                      <Users size={14} /> Add Editors
                                    </span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-24 text-center">
                          <div className="flex flex-col items-center gap-2 opacity-30">
                            <Filter size={32} />
                            <p className="text-sm font-light text-[#2a3439]">
                              No results found for your query
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                  {/* Modal */}
                  {isModel && (
                    <ShareModal
                      link={docLink}
                      onClose={() => setIsModel(false)}
                    />
                  )}
                </tbody>
              </table>
              {showMembersModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white w-[400px] max-h-[500px] overflow-y-auto rounded-xl p-5">
                    <div className="flex justify-between">
                      <h2 className="text-lg font-semibold mb-4">
                        Add Editors
                      </h2>

                      <FiX
                        onClick={() => setShowMembersModal(false)}
                        size={25}
                        className="text-gray-400 cursor-pointer hover:text-gray-500"
                      />
                    </div>

                    {loadingMembers ? (
                      <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-[#5148d7] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {users?.map((u) => (
                          <div
                            key={u._id}
                            className="flex items-center justify-between border border-gray-300 cursor-pointer p-3 rounded-lg hover:bg-[#f7f9fb]"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {u.username}
                              </p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                            <FiUserPlus
                              size={25}
                              onClick={() => handleAddEditor(u._id)}
                              className="text-blue-700 hover:bg-blue-100 p-1 rounded-2xl"
                            />

                            {/* <button>
                              {loadingUserId === u._id ? "Adding..." : "Add"}
                            </button> */}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!loading && (
        <div className="max-w-7xl mt-6 px-2 flex justify-between items-center">
          <p className="text-[10px] tracking-widest uppercase text-[#a9b4b9] font-medium">
            System Scan: {filteredDocs.length} Entries
          </p>
          <div className="flex items-center gap-2 text-[10px] text-[#a9b4b9] font-medium uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            Live Database
          </div>
        </div>
      )}
    </main>
  );
};

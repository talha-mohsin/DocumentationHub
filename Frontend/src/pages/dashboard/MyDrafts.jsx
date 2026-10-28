import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Search, Clock, Trash2, Loader2,
  Edit3, ChevronRight, AlertCircle, Plus, Edit
} from "lucide-react";

// --- CUSTOM DELETE MODAL COMPONENT (Match Atelier Design) ---
const DeleteModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#2a3439]/20 backdrop-blur-sm"
        />
        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-[#a9b4b9]/20 p-8 font-['Manrope']"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-xl font-medium text-[#2a3439] mb-2">Delete Draft?</h3>
            <p className="text-sm text-[#566166] font-light leading-relaxed mb-8">
              Are you sure you want to remove <span className="font-semibold text-[#2a3439]">"{title}"</span>? This action cannot be undone.
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#a9b4b9]/20 text-[#566166] text-xs font-semibold hover:bg-[#f7f9fb] transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95 uppercase tracking-widest"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const MyDrafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Modal State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, title: "" });

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://documentation-hub-h5zv.vercel.app/api/documents/documents/drafts", { withCredentials: true });
      setDrafts(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);
  

  const openDeleteModal = (id, title) => {
    setDeleteDialog({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://documentation-hub-h5zv.vercel.app/api/documents/${deleteDialog.id}`, { withCredentials: true });
      setDeleteDialog({ isOpen: false, id: null, title: "" });
      fetchDrafts();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const filteredDrafts = drafts.filter(doc => (doc.title || "").toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="p-8 md:p-12 bg-[#f7f9fb] min-h-screen font-['Manrope'] selection:bg-[#e3dfff]">

      {/* Custom Alert Modal */}
      <DeleteModal
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={confirmDelete}
        title={deleteDialog.title}
      />

      {/* Header Section (Atelier Style) */}
      <header className="mb-12 max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-[#e3dfff] flex items-center justify-center text-[#5148d7]">
              <Edit size={20} />
            </div>
            <h1 className="text-4xl font-light tracking-tight text-[#2a3439]">My Drafts</h1>
          </div>
          <p className="text-[#566166] max-w-md font-light leading-relaxed">
            Your unpublished work. Private and ready for final touches.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a9b4b9] w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drafts..."
            className="w-full md:w-80 pl-11 pr-4 py-3 bg-white border border-[#a9b4b9]/15 rounded-xl text-sm font-light outline-none shadow-sm focus:border-[#5148d7]/30 transition-all"
          />
        </div>
      </header>

      {/* Content Grid */}
      <div className="max-w-7xl">
        {loading ? (
          <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-[#5148d7] opacity-40" /></div>
        ) : filteredDrafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredDrafts.map((doc) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="group flex flex-col rounded-xl bg-white border border-[#a9b4b9]/15 shadow-sm hover:shadow-md hover:border-[#5148d7]/30 min-h-[300px] transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header (Matches Workspace Pastel Style) */}
                  <div className="p-6 bg-[#f7f9fb] border-b border-[#a9b4b9]/10 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#a9b4b9]/10 shadow-inner">
                      <FileText size={20} className="text-[#a9b4b9] group-hover:text-[#5148d7] transition-colors" />
                    </div>
                    <button
                      onClick={() => openDeleteModal(doc._id, doc.title)}
                      className="p-2 text-[#a9b4b9] hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-medium text-[#2a3439] mb-2 truncate group-hover:text-[#5148d7] transition-colors">
                      {doc.title || "Untitled Document"}
                    </h3>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="bg-[#e3dfff] text-[#5148d7] text-[10px] font-semibold px-3 py-1 rounded-full border border-[#d3d0ff] uppercase tracking-widest">
                        Draft
                      </span>
                      <div className="flex items-center gap-1.5 text-[#a9b4b9] text-[11px] font-light">
                        <Clock size={12} /> {formatDate(doc.updatedAt)}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-auto pt-4 border-t border-[#a9b4b9]/5 flex items-center justify-between">
                      <span className="text-[11px] text-[#566166] font-light italic truncate pr-4">
                        {doc.workspaceId?.name || "Global Space"}
                      </span>
                      <button
                        onClick={() => navigate(`/docEdit/${doc._id}`)}
                        className="flex items-center gap-2 py-2 px-4 rounded-md bg-[#f7f9fb] hover:bg-[#e3dfff] text-[#5148d7] text-xs font-semibold tracking-wide transition-colors"
                      >
                        Resume <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* --- CLEAN EMPTY STATE (Atelier Style) --- */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 px-6 bg-white border-2 border-dashed border-[#a9b4b9]/20 rounded-2xl text-center"
          >
            <div className="w-16 h-16 bg-[#f7f9fb] rounded-full flex items-center justify-center mb-6 border border-[#a9b4b9]/10 text-[#a9b4b9]">
              <FileText size={28} />
            </div>
            <h2 className="text-xl font-medium text-[#2a3439] mb-2">
              {searchQuery ? "No matching drafts found" : "Your draft folder is empty"}
            </h2>
            <p className="text-[#566166] font-light text-sm max-w-[340px] leading-relaxed mb-8">
              {searchQuery
                ? `Nothing found for "${searchQuery}". Try a different keyword.`
                : "Initialize your next masterpiece. Start writing and your saved drafts will appear here."}
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
};
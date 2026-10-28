import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '@/components/ui';
import {
  ArrowLeft, MessageSquare, ChevronRight, Clock,
  Tag, Loader2, Pencil, Trash2, Download, File,
  ShieldCheck, Image as ImageIcon, Paperclip
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';


export const DocDetail = () => {
  const [cookies] = useCookies(['user']);
  const role = cookies.user?.role || "";
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const userId = cookies.user?._id;

  const [docComments, setDocComments] = useState([]);
  const [homeComments, setHomeComments] = useState([]);
  const allComments = [...docComments, ...homeComments];

  // Logic Constants
  const isAuthor = userId === doc?.authorId?._id;
  const isMember = attachments?.member !== null; 
  // Admin OR Editor/Viewer who is a member of this doc
  const hasFullAccess = role === "admin" || isMember;

  const fetchComments = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`https://documentation-hub-h5zv.vercel.app/user/get-comments/${id}`, { withCredentials: true });
      if (res.data.success) setDocComments(res.data.data);
    } catch (err) { console.log("Fetch comments error:", err); }
  };

  const fetchCommentsHomePage = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`https://documentation-hub-h5zv.vercel.app/user/get-comment-homepage/${id}`, { withCredentials: true });
      if (res.data.success) setHomeComments(res.data.data);
    } catch (err) { console.log("Fetch comments error:", err); }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [docRes, attachRes] = await Promise.all([
          axios.get(`https://documentation-hub-h5zv.vercel.app/api/documents/single/${id}`, { withCredentials: true }),
          axios.get(`https://documentation-hub-h5zv.vercel.app/api/attachments/${id}`, { withCredentials: true })
        ]);
        setDoc(docRes.data);
        setAttachments(attachRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load document");
      } finally {
        setLoading(false);
      }
    }
    if (id) { fetchData(); fetchComments(); fetchCommentsHomePage(); }
  }, [id]);

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post("https://documentation-hub-h5zv.vercel.app/user/send-Comment",
        { text: newComment, documentId: id }, { withCredentials: true });
      if (res.data.success) { setNewComment(""); fetchComments(); }
    } catch (err) { console.log(err.message); }
  };

  const confirmDeleteComment = async () => {
    try {
      const res = await axios.delete(`https://documentation-hub-h5zv.vercel.app/user/delete-comments/${deleteCommentId}`, { withCredentials: true });
      if (res.data.success) { fetchComments(); fetchCommentsHomePage(); }
    } catch (err) { console.log(err); }
    finally { setDeleteCommentId(null); }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://documentation-hub-h5zv.vercel.app/api/documents/${id}`, { withCredentials: true });
      navigate(`/workspace/${doc.workspaceId._id || doc.workspaceId}`);
    } catch (err) { alert("Failed to delete"); }
    finally { setShowDeleteModal(false); }
  };

  const formatRelative = (dateStr) => {
    if (!dateStr) return "—";
    const diffMins = Math.floor((new Date() - new Date(dateStr)) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const handleDownload = async (file) => {
    try {
      const res = await axios.get(file.fileUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) { console.log("Download error:", err); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
    </div>
  );

  if (error || !doc) return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white text-center">
      <div>
        <h2 className="text-lg font-medium mb-4 text-slate-600">{error || "Document not found"}</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans antialiased text-[#1A1A1A]">
      <header className="h-20 bg-white/70 backdrop-blur-md px-10 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-indigo-600 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Spaces
          </button>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>{doc.workspaceId?.name || "Workspace"}</span>
              <ChevronRight size={10} className="text-slate-300" />
              <span className="text-indigo-500">Document</span>
            </div>
            <h2 className="text-sm font-bold text-slate-800">{doc.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {role !== "viewer" && isMember && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/docEdit/${id}`)} className="h-10 px-4 gap-2 rounded-xl text-slate-500 font-bold text-[11px] border border-slate-100 hover:bg-slate-50">
                <Pencil className="w-3.5 h-3.5" /> EDIT
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(true)} className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-10 py-12 grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-12">
        <div className="space-y-12">
          <article className="bg-white rounded-[32px] border border-slate-100/60 shadow-sm overflow-hidden">
            <div className="p-12 md:p-16">
              <header className="mb-12">
                <div className="flex gap-2 mb-8">
                  <Badge className="bg-indigo-50 text-indigo-500 border-none rounded-lg uppercase text-[9px] font-black px-3 py-1">{doc.status}</Badge>
                  <Badge className="bg-slate-50 text-slate-400 border-none rounded-lg uppercase text-[9px] font-black px-3 py-1">{doc.visibility || 'private'}</Badge>
                </div>
                <h1 className="text-4xl font-bold font-black text-slate-900 leading-[1.1] tracking-tight mb-8">{doc.title}</h1>
                {doc.summary && (
                  <p className="text-xl text-slate-500 font-light leading-relaxed border-l-2 border-indigo-100 pl-8 py-2 italic">{doc.summary}</p>
                )}
              </header>
              <div className="tiptap-view" dangerouslySetInnerHTML={{ __html: doc.content }} />
            </div>
          </article>

          {attachments?.attachments?.length > 0 && (
            <section className="space-y-6 px-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                <Paperclip size={14} className="text-indigo-500" /> Files & Assets
              </h3>
              <div className="w-fit">
                {attachments.attachments.map((file, i) => (
                  <div key={i} onClick={() => handleDownload(file)} className="flex cursor-pointer items-center justify-between p-5 border border-slate-100 rounded-2xl group hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all">
                    <div className="flex items-center gap-4 truncate">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
                        {file.fileType?.startsWith("image") ? <ImageIcon size={20} /> : <File size={18} />}
                      </div>
                      <span className="text-xs font-bold text-slate-700 truncate">{file.name}</span>
                    </div>
                    <Download size={14} className="text-slate-200 group-hover:text-indigo-500 ml-4" />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="pt-10 border-t border-slate-100">``
            <div className="px-4 mb-10">
              <h3 className="text-1xl text-slate-900 flex items-center gap-4">
                <MessageSquare size={24} className="text-indigo-500" />
                Feedback
                {/* <span className="text-slate-300 font-medium text-lg">({allComments.length})</span> */}
              </h3>
            </div>

            <div className="space-y-6">
              <Card className="p-8 bg-slate-50/50 border-dashed border-2 border-slate-200 rounded-[32px] shadow-none">
                <form onSubmit={handleSendComment} className="space-y-4">
                  <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a response..." className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-5 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none text-sm min-h-[120px] shadow-sm" />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!newComment.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 font-black text-[10px] tracking-widest h-12 shadow-lg shadow-indigo-100">
                      POST RESPONSE
                    </Button>
                  </div>
                </form>
              </Card>

              <div className="space-y-4">
                {allComments.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center gap-4 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-slate-100 shadow-sm">
                      <MessageSquare className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-slate-500 font-bold text-xl">No one has spoken yet.</p>
                  </div>
                ) : (
                  allComments.map((comment) => {
                    const isOwn = userId === comment.userId?._id;
                    const isGuest = !comment.userId;

                    // Visibility Logic: 
                    // 1. Admin/Member can see everything.
                    // 2. Non-members cannot see Guest comments.
                    const canSee = hasFullAccess || !isGuest;

                    if (!canSee) return null;

                    // Delete Logic:
                    // 1. Admin/Member can delete everything.
                    // 2. Others can only delete their own comments.
                    const canDelete = hasFullAccess || isOwn;

                    return (
                      <div key={comment._id} className="p-6 rounded-2xl bg-white border border-slate-100 flex gap-5 group hover:border-slate-200 transition-colors">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                          {comment.userId?.image ? (
                            <img src={comment.userId.image} alt={comment.userId?.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-black text-indigo-400 text-[10px] uppercase">{comment.userId?.username?.[0] || "?"}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black text-slate-800">{comment.userId?.username || "Guest user"}</span>
                              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{formatRelative(comment.createAt || comment.createdAt)}</span>
                            </div>
                            {canDelete && (
                              <button onClick={() => setDeleteCommentId(comment._id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>

        <aside>
          <Card className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm space-y-10">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <ShieldCheck size={14} className="text-indigo-400" /> Author
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                  {doc.authorId?.image ? <img src={doc.authorId?.image} alt={doc.authorId?.username} className="w-full h-full object-cover" /> : <span className="font-black text-indigo-400 text-[10px] uppercase">{doc.authorId?.username?.[0] || "?"}</span>}
                </div>
                <div className="truncate">
                  <p className="text-xs font-black text-slate-800 truncate">{doc.authorId?.username}</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Creator</p>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-50 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> Date</span>
                <span className="text-[11px] font-bold text-slate-700">{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </aside>
      </main>

      {/* Modals remain exactly same */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/10 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl border border-slate-100">
            <h3 className="text-xl font-black mb-2 text-slate-900">Delete Document</h3>
            <p className="text-slate-400 text-sm mb-10">This will permanently remove the document.</p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 rounded-xl font-bold" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {deleteCommentId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/10 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl border border-slate-100 text-center">
            <h3 className="text-lg font-black mb-8">Remove this response?</h3>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 rounded-xl font-bold text-slate-400" onClick={() => setDeleteCommentId(null)}>Wait, No</Button>
              <Button className="flex-1 bg-slate-900 text-white rounded-xl font-bold" onClick={confirmDeleteComment}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}

         <style dangerouslySetInnerHTML={{
        __html: `
            .tiptap-view { color: #4b5563; line-height: 1.8; font-size: 18px; }
            .tiptap-view h1 { font-size: 2.5rem; font-weight: 900; color: #111827; margin: 2rem 0 1.5rem; }
            .tiptap-view h2 { font-size: 1.8rem; font-weight: 800; color: #111827; margin: 1.5rem 0 1rem; }
            .tiptap-view p { margin-bottom: 1.5rem; }
            .tiptap-view pre {
              background: #1e293b !important; color: #f8fafc !important;
              padding: 2rem !important; border-radius: 1.5rem !important;
              margin: 2rem 0 !important; overflow-x: auto;
              font-family: 'JetBrains Mono', monospace !important;
              border: 1px solid rgba(255,255,255,0.05);
            }
            .tiptap-view pre code { background: transparent !important; font-size: 14px !important; }
            .tiptap-view .hljs-keyword { color: #f472b6; }
            .tiptap-view .hljs-string { color: #7dd3fc; }
            .tiptap-view .hljs-comment { color: #64748b; font-style: italic; }
          `}} /> </div>
  );
};

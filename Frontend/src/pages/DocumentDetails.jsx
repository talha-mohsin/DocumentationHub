import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft, MessageSquare, Loader2,
    Paperclip, Clock, Calendar, Edit2, Check, X, Trash2, Download, ImageIcon, FileText, Tag ,File
} from "lucide-react";
import { Button, Badge } from '@/components/ui';
import { Navbar } from "../components/layout/Navbar";
import { showToast } from "../components/ToastContainer";


const DocumentDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attachments, setAttachments] = useState([]);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        if (doc?._id) {
            const savedComments = localStorage.getItem(`local_comments_${doc._id}`);
            if (savedComments) {
                setComments(JSON.parse(savedComments));
            }
        }
    }, [doc?._id]);

    const syncLocalStorage = (updatedList) => {
        setComments(updatedList);
        localStorage.setItem(`local_comments_${doc?._id}`, JSON.stringify(updatedList));
    };

    useEffect(() => {
        async function fetchData() {
            if (!slug) return;

            try {
                setLoading(true);

                const docRes = await axios.get(`https://documentation-hub-h5zv.vercel.app/api/documents/public/document/${slug}`);
                const documentData = docRes.data;
                setDoc(documentData);

                if (documentData?._id) {
                    const attachRes = await axios.get(`https://documentation-hub-h5zv.vercel.app/api/attachments/homeAttachment/${documentData._id}`, {
                        withCredentials: true
                    });
                    setAttachments(attachRes.data || []);
                }

            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData(); 
    }, [slug]);
 
    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await axios.post("https://documentation-hub-h5zv.vercel.app/user/send-comment-homepage", {
                text: newComment,
                documentId: doc._id
            });

            const savedComment = res.data.data || res.data;

            const newEntry = {
                _id: savedComment._id, 
                text: newComment,
                createdAt: new Date().toISOString(),
                userId: { username: "Guest User" }
            };
            showToast("success", "Comment Added");
            syncLocalStorage([newEntry, ...comments]);
            setNewComment("");
        } catch (err) {
            console.error("Post failed:", err);
            alert("Comment post nahi ho saka. Backend check karein.");
            showToast("error", "Not Added Comment");

        }
    };


    const handleUpdateComment = async (id) => {
        if (!editText.trim()) return;
        try {
            await axios.put(`https://documentation-hub-h5zv.vercel.app/user/update-comment-homepage/${id}`, {
                updateText: editText
            });

            const updated = comments.map(c => c._id === id ? { ...c, text: editText } : c);
            syncLocalStorage(updated);
            setEditingCommentId(null);
            showToast("success", "Your Comment Updated");

        } catch (err) {
            console.error("Update failed:", err);
            showToast("error", "Your Comment Not Updated");

        }
    };

    const handleDeleteComment = async (id) => {
        try {
            await axios.delete(`https://documentation-hub-h5zv.vercel.app/user/delete-UserComment-homepage/${id}`);

            showToast("success", "Your Comment Deleted");

            const filtered = comments.filter(c => c._id !== id);
            syncLocalStorage(filtered);
        } catch (err) {
            console.error("Delete failed:", err);
            showToast("error", "Your Comment Not Deleted");

        }
    };


 const handleDownload = async (file) => {
    try {
      const res = await axios.get(file.fileUrl, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log("Download error:", err);
    }
  };



    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white font-['Outfit']">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500/30" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f7f9fb] text-[#2a3439] font-['Outfit'] antialiased">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 md:px-10 py-10">
                <div className="mb-6 flex justify-start">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-[#5148d7] transition-colors">
                        <ArrowLeft size={16} />
                        <span className="text-[11px] font-extrabold uppercase tracking-widest">Back</span>
                    </button>
                </div>

                <div className="bg-white border border-slate-100 rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden mb-10">
                    <div className="p-10 md:p-20">
                        <header className="mb-12">
                            <div className="flex gap-2 mb-6">
                                <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-lg uppercase text-[10px] font-bold px-3 py-1 tracking-wider shadow-sm">
                                    {doc?.status || 'Published'}
                                </Badge>
                                <Badge className="bg-slate-50 text-slate-400 border-none rounded-lg uppercase text-[10px] font-bold px-3 py-1 tracking-wider">
                                    {doc?.visibility || 'Public'}
                                </Badge>
                            </div>

                            <h1 className="text-4xl font-bold text-[#1a1f23] tracking-tight mb-6 leading-[1.15]">
                                {doc?.title}
                            </h1>

                            <div className="flex items-center gap-6 text-slate-400 mb-8 border-b border-slate-50 pb-8">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-indigo-300" />
                                    <span className="text-[12px] font-medium">{new Date(doc?.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-indigo-300" />
                                    <span className="text-[12px] font-medium">Updated recently</span>
                                </div>
                            </div>


                        </header>

                        <div className="tiptap-view prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: doc?.content }} />
                    </div>
                </div>

                <div className="flex justify-between ">

                    {attachments.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                                        <Paperclip size={12} className="text-indigo-500" />
                                    </div>
                                    Files & Assets
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {attachments.map((file, i) => (
                                    <div
                    key={i}
                    onClick={() => handleDownload(file)}
                    className="flex cursor-pointer items-center justify-between p-5 border border-slate-100 rounded-2xl group hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all"
                  >
                    <div className="flex items-center gap-4 truncate">

                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
                        {file.fileType?.startsWith("image") ? (
                          <ImageIcon size={20} />
                        ) : (
                          <File size={18} />
                        )}
                      </div>

                      <span className="text-xs font-bold text-slate-700 truncate">
                        {file.name}
                      </span>

                    </div>

                    <Download size={14} className="text-slate-200 group-hover:text-indigo-500 ml-4" />
                  </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {doc?.tags?.length > 0 && (
                        <section className="border-t border-slate-100/60">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-3 px-2">
                                <Tag size={14} className="text-indigo-400" />
                                Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2 px-2">
                                {doc.tags.map((tag, i) => (
                                    <Badge
                                        key={i}
                                        className="bg-white text-slate-500 border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 rounded-xl text-[10px] font-bold py-2 px-4 uppercase tracking-wider shadow-sm transition-all cursor-default"
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <section className="mt-20 border-t border-slate-200/60 pt-16">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                            <MessageSquare size={18} />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-400">Discussion</h3>
                            <p className="text-[10px] font-medium text-slate-300 uppercase">{comments.length} Thoughts shared</p>
                        </div>
                    </div>

                    <div className="mb-16">
                        <div className="relative bg-white border border-slate-200 rounded-[32px] p-1.5 transition-all duration-300 focus-within:border-indigo-500/30">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a professional response..."
                                className="w-full bg-transparent border-none rounded-3xl px-7 py-6 outline-none focus:ring-0 text-slate-700 text-[15px] min-h-[160px] placeholder:text-slate-300 resize-none"
                            />
                            <div className="flex justify-end p-4 bg-slate-50/50 rounded-b-[28px] border-t border-slate-50/80">
                                <Button
                                    onClick={handleSendComment}
                                    disabled={!newComment.trim()}
                                    className="bg-[#5148d7] hover:bg-[#4339ca] text-white rounded-[18px] px-10 font-bold text-[11px] tracking-[0.1em] h-12 shadow-xl shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-40"
                                >
                                    POST RESPONSE
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {comments.length > 0 ? comments.map((c) => (
                            <div key={c._id} className="group p-8 rounded-[32px] bg-white border border-slate-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all flex gap-6">
                                <div className="w-14 h-14 bg-slate-50 rounded-[20px] flex items-center justify-center shrink-0 font-bold text-slate-400 text-lg uppercase group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                                    {c.userId?.username?.[0] || 'G'}
                                </div>
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-slate-900 tracking-tight">{c.userId?.username || "Guest User"}</span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingCommentId(c._id); setEditText(c.text); }} className="p-2 text-slate-300 hover:text-indigo-500 transition-colors"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDeleteComment(c._id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </div>

                                    {editingCommentId === c._id ? (
                                        <div className="mt-2">
                                            <textarea className="w-full p-4 border border-indigo-100 rounded-2xl text-[15px] text-slate-600 focus:outline-none focus:border-indigo-500" value={editText} onChange={(e) => setEditText(e.target.value)} />
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => handleUpdateComment(c._id)} className="flex items-center gap-1 text-[10px] font-bold bg-indigo-500 text-white px-3 py-1.5 rounded-lg"><Check size={12} /> SAVE</button>
                                                <button onClick={() => setEditingCommentId(null)} className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-400 px-3 py-1.5 rounded-lg"><X size={12} /> CANCEL</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 text-[15px] leading-relaxed font-medium">{c.text}</p>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-slate-50/30 rounded-[32px] border border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium text-sm italic">No feedback yet. Be the first to start the conversation.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                .tiptap-view { color: #475569; line-height: 1.8; font-size: 17px; }
                .tiptap-view h1, .tiptap-view h2, .tiptap-view h3 { color: #0f172a; font-weight: 800; tracking: -0.02em; margin-top: 2.5rem; margin-bottom: 1.25rem; }
                .tiptap-view pre {
                    background: #1e293b !important;
                    color: #f8fafc !important;
                    padding: 2.5rem !important;
                    border-radius: 20px !important;
                    margin: 2.5rem 0 !important;
                    overflow-x: auto;
                    font-family: 'JetBrains Mono', monospace !important;
                    font-size: 14px !important;
                    line-height: 1.7;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .tiptap-view code { 
                    background: #f1f5f9; 
                    color: #5148d7; 
                    padding: 0.2rem 0.5rem; 
                    border-radius: 8px; 
                    font-size: 0.85em; 
                    font-weight: 700;
                }
                .tiptap-view pre code { background: transparent !important; color: inherit !important; padding: 0 !important; font-weight: 400; }
                .tiptap-view ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.75rem; }
                .tiptap-view li { margin-bottom: 0.5rem; }
            `}} />
        </div>
    );
};

export default DocumentDetails;
import {
  Bold, Italic, Underline, List, Undo, Redo, AlignLeft, Code,
  Paperclip, X, File, Loader2, Plus, Check, Hash, Globe, Lock,
  ChevronRight, ChevronDown, Cloud, Type
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { EditorContent, useEditor } from '@tiptap/react';
import { Button } from "@/components/ui";

import StarterKit from '@tiptap/starter-kit';
import TiptapUnderline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// --- REUSABLE CUSTOM SELECT COMPONENT ---
function CustomSelect({ value, onChange, options, icon: Icon, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedOption = options.find(opt => opt._id === value || opt.value === value);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:border-indigo-300 transition-all active:scale-95 shadow-sm"
      >
        <Icon size={13} className="text-[#5148d7] shrink-0" strokeWidth={2.5} />
        <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-600 min-w-[70px] text-left">
          {selectedOption ? (selectedOption.name || selectedOption.label) : label}
        </span>
        <ChevronDown size={14} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-0 mt-2 w-48 bg-white border border-slate-100 rounded-[20px] shadow-2xl z-50 p-2"
          >
            {options.map((opt) => (
              <button
                key={opt._id || opt.value}
                onClick={() => { onChange(opt._id || opt.value); setIsOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-indigo-50/50 rounded-xl transition-colors group"
              >
                <span className={`text-[11px] font-bold ${(opt._id === value || opt.value === value) ? 'text-[#5148d7]' : 'text-slate-500'}`}>
                  {opt.name || opt.label}
                </span>
                {(opt._id === value || opt.value === value) && <Check size={12} className="text-[#5148d7]" strokeWidth={3} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DocumentCreate() {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [visibility, setVisibility] = useState("private");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [disable, setDisable] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [documentId, setDocumentId] = useState(null);

  const navigate = useNavigate();
  const { id: workspaceId } = useParams();

  // Tags reference for Auto-save to always get latest state
  const tagsRef = useRef([]);
  useEffect(() => { tagsRef.current = tags; }, [tags]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapUnderline.extend({ name: 'underline' }),
      Image, Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Deep dive into your thoughts...' }),
    ],
    content: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`https://documentation-hub-h5zv.vercel.app/api/categories/${workspaceId}`, { withCredentials: true });
        setCategories(res.data);
      } catch (error) { console.error(error); }
    };
    fetchCategories();
  }, [workspaceId]);

  // FIXED: Auto-Save Draft logic with correct tag sync
  useEffect(() => {
    if (!title.trim() || saveStatus === "saving") return;

    const timer = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const payload = {
          workspaceId,
          title,
          content: editor?.getHTML() || "",
          categoryId: categoryId || null,
          tags: tagsRef.current, // Using Ref to avoid stale closure
          status: 'draft',
          visibility
        };

        let res;
        if (documentId) {
          res = await axios.put(`https://documentation-hub-h5zv.vercel.app/api/documents/${documentId}`, payload, { withCredentials: true });
        } else {
          res = await axios.post("https://documentation-hub-h5zv.vercel.app/api/documents/", payload, { withCredentials: true });
          if (res.data.doc?._id) setDocumentId(res.data.doc._id);
        }
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        setSaveStatus("idle");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, tags, categoryId, visibility, workspaceId, documentId, editor]);

  const submit = async () => {
    try {
      setDisable(true);
      const formData = new FormData();
      formData.append('workspaceId', workspaceId);
      formData.append('title', title || "Untitled Document");
      formData.append('content', editor.getHTML());
      formData.append('categoryId', categoryId || "");
      
      // ✅ FIX: Tags should be appended individually for Multer/Backend arrays
      if (tags && tags.length > 0) {
        tags.forEach(tag => formData.append('tags', tag));
      }
      
      formData.append('status', 'published');
      formData.append('visibility', visibility);
      attachments.forEach((att) => att.file && formData.append('attachments', att.file));

      if (documentId) {
        await axios.put(`https://documentation-hub-h5zv.vercel.app/api/documents/${documentId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
        });
      } else {
        await axios.post("https://documentation-hub-h5zv.vercel.app/api/documents/", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
        });
      }
      navigate(-1);
    } catch (error) { setDisable(false); }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachments([...attachments, { file, name: file.name }]);
  };

  if (!editor) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full min-h-screen bg-[#F8FAFC] pb-24 font-['Manrope']">

      {/* REFINED TOOLBAR */}
      <div className="sticky top-[80px] z-40 w-full flex justify-center px-4 mb-10">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl shadow-slate-200/50 rounded-[24px] px-5 py-2.5 flex items-center gap-6">
          <div className="flex items-center gap-1.5 border-r border-slate-100 pr-4">
            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()}><Undo size={16} /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()}><Redo size={16} /></ToolbarBtn>
          </div>
          <div className="flex items-center gap-1.5 border-r border-slate-100 pr-4">
            <ToolbarBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ToolbarBtn>
            <ToolbarBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolbarBtn>
            <ToolbarBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline size={16} /></ToolbarBtn>
          </div>
          <div className="flex items-center gap-1.5 border-r border-slate-100 pr-4">
            <ToolbarBtn active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft size={16} /></ToolbarBtn>
            <ToolbarBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></ToolbarBtn>
          </div>

          <div className="flex items-center gap-5">
            <div className="w-[80px] flex justify-end">
              <AnimatePresence mode="wait">
                {saveStatus === "saving" ? (
                  <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-black text-[#5148d7] uppercase tracking-[0.15em] flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" /> Syncing
                  </motion.div>
                ) : saveStatus === "saved" ? (
                  <motion.div key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                    <Check size={12} strokeWidth={3} /> Saved
                  </motion.div>
                ) : (
                  <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                    <Cloud size={12} /> Idle
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button disabled={disable} onClick={submit} className="bg-[#5148d7] hover:bg-[#4338ca] text-white text-[11px] font-black uppercase tracking-widest h-10 px-8 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95">
              {disable ? "Processing" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-6">
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-200/60 p-16 md:p-24 min-h-[1000px] relative">
          
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <CustomSelect label="Category" icon={Hash} value={categoryId} onChange={setCategoryId} options={categories} />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-1" />
            <CustomSelect label="Visibility" icon={visibility === 'public' ? Globe : Lock} value={visibility} onChange={setVisibility} options={[{ value: 'private', label: 'Private' }, { value: 'public', label: 'Public' }]} />
          </div>

          <textarea
            className="w-full text-4xl font-bold text-[#1e293b] bg-transparent outline-none mb-6 resize-none leading-[1.15] placeholder:text-slate-100 tracking-tight"
            placeholder="Untitled Project"
            rows="1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* TAGS SECTION */}
          <div className="flex flex-wrap gap-2.5 mb-14 border-b border-slate-50 pb-10">
            {tags.map((tag, index) => (
              <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-100 group">
                #{tag}
                <X size={12} className="cursor-pointer text-slate-300 group-hover:text-red-500 transition-colors" onClick={() => setTags(tags.filter((_, i) => i !== index))} />
              </span>
            ))}
            <div className="flex items-center gap-2 px-2">
              <Plus size={14} className="text-[#5148d7]" />
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = tagInput.trim().replace(/^#/, '');
                    if (val && !tags.includes(val)) {
                        setTags([...tags, val]);
                        setTagInput('');
                    }
                  }
                }}
                placeholder="ADD TAG"
                className="outline-none text-[11px] font-black text-slate-300 focus:text-[#5148d7] bg-transparent uppercase tracking-widest w-24 transition-colors"
              />
            </div>
          </div>

          <div className="prose prose-slate prose-lg max-w-none 
            prose-p:text-slate-600 prose-p:leading-[1.8] 
            prose-headings:text-[#1e293b] prose-headings:font-extrabold 
            min-h-[600px] selection:bg-indigo-100">
            <EditorContent editor={editor} />
          </div>

          <div className="mt-32 border-t border-slate-100 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#1e293b] flex items-center gap-3">
                <Paperclip size={16} className="text-[#5148d7]" strokeWidth={2.5} /> Supporting Assets
              </h3>
              <label className="cursor-pointer group flex items-center gap-2 text-[11px] font-black text-[#5148d7] border border-indigo-100 px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-all active:scale-95 shadow-sm shadow-indigo-50">
                <input type="file" className="hidden" onChange={handleFileUpload} />
                <Plus size={16} strokeWidth={3} /> ATTACH FILE
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-[20px] group hover:border-indigo-200 transition-all shadow-sm">
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-[#5148d7] transition-colors">
                      <File size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-[13px] font-bold text-slate-600 truncate">{file.name}</span>
                  </div>
                  <button onClick={() => setAttachments(attachments.filter((_, i) => i !== index))} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

function ToolbarBtn({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={`p-2.5 rounded-xl transition-all active:scale-90 ${active ? 'bg-[#5148d7] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
      {children}
    </button>
  );
}
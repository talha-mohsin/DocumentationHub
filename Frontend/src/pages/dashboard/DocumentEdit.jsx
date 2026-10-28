// ✅ FULL ORIGINAL CODE — LOGIC PATCHED (UI UNTOUCHED)

import {
  Bold, Italic, Underline, List, Undo, Redo, AlignLeft, Code,
  Paperclip, X, File, Loader2, Plus, Check, Hash, Globe, Lock,
  ChevronRight, ChevronDown, Cloud
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
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const lowlight = createLowlight(common);

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
        className="flex items-center gap-2 bg-gray-50/50 border border-gray-100 px-3 py-1.5 rounded-xl hover:bg-white hover:border-indigo-200 transition-all active:scale-95"
      >
        <Icon size={13} className="text-indigo-500 shrink-0" />
        <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 min-w-[70px] text-left truncate">
          {selectedOption ? (selectedOption.name || selectedOption.label) : label}
        </span>
        <ChevronDown size={14} className={`text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden p-1.5"
          >
            {options.map((opt) => (
              <button
                key={opt._id || opt.value}
                onClick={() => { onChange(opt._id || opt.value); setIsOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-indigo-50 rounded-lg transition-colors group"
              >
                <span className={`text-[10px] font-bold uppercase tracking-wide ${(opt._id === value || opt.value === value) ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {opt.name || opt.label}
                </span>
                {(opt._id === value || opt.value === value) && <Check size={12} className="text-indigo-600" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DocumentEdit() {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disable, setDisable] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [visibility, setVisibility] = useState("private");

  const navigate = useNavigate();
  const { id } = useParams();

  const autoSaveTimerRef = useRef(null);
  const savedIndicatorTimer = useRef(null);
  const titleRef = useRef('');
  const tagsRef = useRef([]);
  const categoryIdRef = useRef('');
  const visibilityRef = useRef('private');

  useEffect(() => {
    titleRef.current = title;
    tagsRef.current = tags;
    categoryIdRef.current = categoryId;
    visibilityRef.current = visibility;
  }, [title, tags, categoryId, visibility]);

  const triggerAutoSave = useCallback((contentHTML) => {
    if (!id) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (savedIndicatorTimer.current) clearTimeout(savedIndicatorTimer.current);

    setSaveStatus("saving");

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        await axios.put(`https://documentation-hub-h5zv.vercel.app/api/documents/${id}`, {
          title: titleRef.current,
          content: contentHTML,
          categoryId: categoryIdRef.current || null,
          tags: tagsRef.current,
          visibility: visibilityRef.current,
          status: "draft"
        }, { withCredentials: true });

        setSaveStatus("saved");
        savedIndicatorTimer.current = setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        setSaveStatus("error");
      }
    }, 1500);
  }, [id]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      TiptapUnderline, Image, Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing something amazing...' }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'plaintext' }),
    ],
    content: '',
    onUpdate: ({ editor }) => triggerAutoSave(editor.getHTML()),
  });

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id || !editor) return;
      try {
        const res = await axios.get(`https://documentation-hub-h5zv.vercel.app/api/documents/single/${id}`, { withCredentials: true });
        const doc = res.data;
        setTitle(doc.title || "");
        setTags(doc.tags || []);
        setCategoryId(doc.categoryId || "");
        setVisibility(doc.visibility || "private");
        
        if (editor && !editor.isDestroyed) {
            editor.commands.setContent(doc.content || "");
        }

        const attachRes = await axios.get(`https://documentation-hub-h5zv.vercel.app/api/attachments/${id}`, { withCredentials: true });
        // ✅ BUG FIXED: Ensuring array structure
        const attachData = attachRes.data?.attachments || attachRes.data || [];
        setAttachments(Array.isArray(attachData) ? attachData : []);

        if (doc.workspaceId) {
          const catRes = await axios.get(`https://documentation-hub-h5zv.vercel.app/api/categories/${doc.workspaceId}`, { withCredentials: true });
          setCategories(catRes.data || []);
        }
      } catch (error) { 
          console.error(error); 
      } finally { 
          setLoading(false); 
      }
    };
    fetchDocument();
  }, [id, editor]);

  const submit = async () => {
    try {
      setDisable(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', editor.getHTML());
      formData.append('categoryId', categoryId || "");
      formData.append('visibility', visibility);
      formData.append('status', 'published');

      // ✅ BUG FIXED: Tags loop for FormData
      if (tags && tags.length > 0) {
        tags.forEach(tag => formData.append('tags', tag));
      }

      attachments.forEach((att) => {
        if (att.isNew && att.file) formData.append('attachments', att.file);
      });

      await axios.put(`https://documentation-hub-h5zv.vercel.app/api/documents/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
      });
      
      navigate(-1);
    } catch (error) { 
        console.error(error);
        setDisable(false); 
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachments([...attachments, { file, url: URL.createObjectURL(file), name: file.name, isNew: true }]);
  };

  const removeAttachment = async (index) => {
    const fileToRemove = attachments[index];
    try {
      if (fileToRemove._id) {
          await axios.delete(`https://documentation-hub-h5zv.vercel.app/api/attachments/${fileToRemove._id}`, { withCredentials: true });
      }
      setAttachments(attachments.filter((_, i) => i !== index));
    } catch (error) { 
        console.error(error); 
    }
  };

  if (!editor || loading) return (
      <div className="flex items-center justify-center h-screen bg-[#F3F5F7]">
          <Loader2 className="animate-spin text-indigo-500" />
      </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full min-h-screen bg-[#F3F5F7] pb-20">

      {/* TOOLBAR */}
      <div className="sticky top-0 z-40 w-full flex justify-center px-4 py-4 bg-[#F3F5F7]/80 backdrop-blur-sm">
        <div className="bg-white/95 backdrop-blur border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-1 border-r border-gray-100 pr-3">
            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()}><Undo size={17} /></ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()}><Redo size={17} /></ToolbarBtn>
          </div>
          <div className="flex items-center gap-1 border-r border-gray-100 pr-3">
            <ToolbarBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={17} /></ToolbarBtn>
            <ToolbarBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={17} /></ToolbarBtn>
            <ToolbarBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline size={17} /></ToolbarBtn>
          </div>
          <div className="flex items-center gap-1 border-r border-gray-100 pr-3">
            <ToolbarBtn active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft size={17} /></ToolbarBtn>
            <ToolbarBtn active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={17} /></ToolbarBtn>
          </div>

          <div className="flex items-center gap-4 pl-2">
            <div className="w-[100px] flex justify-end overflow-hidden">
              <AnimatePresence mode="wait">
                {saveStatus === "saving" ? (
                  <motion.div key="s" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    <Loader2 size={10} className="animate-spin" /> Syncing
                  </motion.div>
                ) : saveStatus === "saved" ? (
                  <motion.div key="v" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <Check size={11} strokeWidth={3} /> Saved
                  </motion.div>
                ) : (
                  <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Cloud size={10} /> Auto-save
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button disabled={disable} onClick={submit} className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[10px] font-black uppercase tracking-widest h-9 px-8 rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-100">
              {disable ? <Loader2 size={14} className="animate-spin" /> : "Update"}
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-6 mt-8">
        <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] rounded-xl min-h-[900px] p-12 md:p-20 relative border border-gray-100">

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <CustomSelect label="Category" icon={Hash} value={categoryId} onChange={setCategoryId} options={categories} />
            <ChevronRight size={14} className="text-gray-300" />
            <CustomSelect label="Visibility" icon={visibility === 'public' ? Globe : Lock} value={visibility} onChange={setVisibility} options={[{ value: 'private', label: 'Private' }, { value: 'public', label: 'Public' }]} />
          </div>

          <textarea className="w-full text-4xl font-bold text-[#1A1A1A] bg-transparent outline-none mb-4 resize-none leading-tight tracking-tight placeholder:text-gray-100" placeholder="Untitled Document" rows="1" value={title} onChange={(e) => setTitle(e.target.value)} />

          <div className="flex flex-wrap gap-2 mb-12 border-b border-gray-50 pb-8">
            {tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50/50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-md border border-indigo-100/50 group">
                #{tag} <X size={12} className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} />
              </span>
            ))}
            <input
              value={tagInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                  setTagInput('');
                }
              }}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="+ Add Tag..."
              className="outline-none text-[10px] font-bold text-gray-300 bg-transparent uppercase tracking-widest ml-2 placeholder:text-gray-200"
            />
          </div>

          <div className="prose prose-slate prose-xl max-w-none prose-p:text-[#374151] prose-p:leading-[1.9] min-h-[500px]">
            <EditorContent editor={editor} />
          </div>

          <div className="mt-20 border-t border-gray-50 pt-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2"><Paperclip size={14} className="text-indigo-500" /> Attachments</h3>
              <label className="cursor-pointer group flex items-center gap-2 text-[10px] font-black text-indigo-600 border border-indigo-100 px-4 py-2 rounded-xl hover:bg-indigo-50 transition">
                <input type="file" className="hidden" onChange={handleFileUpload} />
                <Plus size={14} /> UPLOAD
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* ✅ BUG FIXED: mapping directly over attachments array */}
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl transition hover:border-indigo-200">
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-2 bg-white rounded-lg shadow-sm"><File size={16} className="text-gray-400" /></div>
                    <span className="text-[12px] font-bold text-gray-700 truncate">{file.name}</span>
                  </div>
                  <X size={14} className="text-gray-300 hover:text-red-500 cursor-pointer" onClick={() => removeAttachment(i)} />
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
    <button onClick={onClick} className={`p-2 rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}>
      {children}
    </button>
  );
}
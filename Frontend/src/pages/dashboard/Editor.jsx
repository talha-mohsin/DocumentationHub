import { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { 
  Save, 
  Eye, 
  Share2, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code,
  ChevronLeft,
  Settings,
  History,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Editor = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('# Brand Guidelines v2.4\n\n## Introduction\nThis document outlines the core visual identity for The Atelier. It is essential that these guidelines are followed strictly to maintain brand consistency across all platforms.\n\n## Core Colors\n- **Primary Indigo**: #6366f1\n- **Deep Slate**: #0f172a\n- **Vibrant Emerald**: #10b981\n\n## Typography\nWe use **Inter** for all UI elements and **Space Grotesk** for display headings.');

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Editor Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100">Brand Guidelines v2.4</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">In Workspace: Design Systems</p>
          </div>
          <Badge variant="primary">Draft</Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950" alt="" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950" alt="" />
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-500">+2</div>
          </div>
          <Button variant="outline" size="sm" className="gap-2"><Eye className="w-4 h-4" /> Preview</Button>
          <Button variant="outline" size="sm" className="gap-2"><Share2 className="w-4 h-4" /> Share</Button>
          <Button size="sm" className="gap-2"><Save className="w-4 h-4" /> Publish</Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbar */}
        <aside className="w-16 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 gap-4 shrink-0">
          <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"><Bold className="w-5 h-5" /></button>
          <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"><Italic className="w-5 h-5" /></button>
          <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"><List className="w-5 h-5" /></button>
          <div className="w-8 h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
          <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"><LinkIcon className="w-5 h-5" /></button>
          <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"><ImageIcon className="w-5 h-5" /></button>
          <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"><Code className="w-5 h-5" /></button>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 overflow-y-auto p-12 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="max-w-3xl mx-auto">
            <textarea 
              className="w-full min-h-[80vh] bg-transparent border-none outline-none text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-mono resize-none placeholder:text-slate-300"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your documentation..."
            ></textarea>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1">Details</Button>
            <Button variant="ghost" size="sm" className="flex-1">Comments</Button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Document Info</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Created</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Mar 12, 2024</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Reading Time</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">4 mins</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Words</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">1,248</span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">History</h4>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 items-start group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                      <History className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Version 2.{4-i}</p>
                      <p className="text-[10px] text-slate-500">Saved {i} hour{i > 1 ? 's' : ''} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Settings</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                  <div className="flex items-center gap-3"><Settings className="w-4 h-4" /> Page Setup</div>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                  <div className="flex items-center gap-3"><MessageSquare className="w-4 h-4" /> Notifications</div>
                </button>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
};

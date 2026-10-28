import { Card, Badge, Button } from '@/components/ui';
import { 
  Tag, 
  Folder, 
  Plus, 
  Search, 
  MoreVertical, 
  FileText, 
  ChevronRight,
  Hash
} from 'lucide-react';

export const Categories = () => {
  const categories = [
    { name: 'Design Systems', count: 24, color: 'bg-indigo-500' },
    { name: 'Engineering', count: 156, color: 'bg-emerald-500' },
    { name: 'Marketing', count: 42, color: 'bg-amber-500' },
    { name: 'Product Strategy', count: 89, color: 'bg-purple-500' },
    { name: 'HR & Culture', count: 12, color: 'bg-rose-500' },
    { name: 'Legal', count: 5, color: 'bg-slate-500' },
  ];

  const tags = ['React', 'Tailwind', 'v2.0', 'Draft', 'Master', 'Q3-2024', 'Urgent', 'Review', 'Archive', 'Internal', 'External', 'Public'];

  return (
    <div className="w-full px-8 py-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Categories & Tags</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organize your documentation with a structured taxonomy.</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> New Category</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Folder className="w-5 h-5 text-indigo-600" /> All Categories
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="Search categories..." className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <Card key={i} className="p-5 hover:translate-y-[-2px] transition-transform cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg", cat.color)}>
                    <Folder className="w-5 h-5" />
                  </div>
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {cat.count} Documents</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600" /> Popular Tags
          </h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="px-3 py-1.5 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <Hash className="w-3 h-3" /> {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" /> Manage Tags</Button>
            </div>
          </Card>

          <Card className="p-6 bg-indigo-600 text-white">
            <h4 className="font-bold text-lg mb-2">Need help organizing?</h4>
            <p className="text-indigo-100 text-sm mb-6">Our AI can automatically suggest categories and tags for your documents based on their content.</p>
            <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50">Try Auto-Tagging</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';

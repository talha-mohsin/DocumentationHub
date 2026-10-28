import { Card, Badge, Button, Input } from '@/components/ui';
import { FileText, Search, Filter, MoreVertical, Calendar, Eye, MessageSquare } from 'lucide-react';

export const MyDocs = () => {
  const myDocs = [
    { title: 'Personal Portfolio Plan', workspace: 'Private', views: 42, comments: 0, date: 'Mar 24, 2024' },
    { title: 'Tech Stack Proposal', workspace: 'Engineering', views: 156, comments: 12, date: 'Mar 21, 2024' },
    { title: 'Meeting Notes - Sprint 4', workspace: 'Product', views: 8, comments: 2, date: 'Mar 19, 2024' },
    { title: 'User Interview Synthesis', workspace: 'Design', views: 89, comments: 5, date: 'Mar 15, 2024' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Documents</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all documents you've created or are currently editing.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export All</Button>
          <Button>New Document</Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input placeholder="Search my documents..." className="bg-white dark:bg-slate-900" />
        </div>
        <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" /> All Workspaces</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myDocs.map((doc, i) => (
          <Card key={i} className="p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{doc.title}</h3>
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="secondary">{doc.workspace}</Badge>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {doc.date}
              </span>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Eye className="w-4 h-4" /> <span className="text-xs font-bold">{doc.views}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MessageSquare className="w-4 h-4" /> <span className="text-xs font-bold">{doc.comments}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600">Edit Document</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

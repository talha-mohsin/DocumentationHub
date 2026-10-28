import { useState } from 'react';
import { Card, Input, Badge, Button } from '@/components/ui';
import { Search as SearchIcon, Filter, FileText, Globe, Users, Clock, ArrowRight } from 'lucide-react';

export const Search = () => {
  const [query, setQuery] = useState('');
  
  const results = [
    { type: 'doc', title: 'Onboarding Guide for New Hires', workspace: 'HR & Culture', excerpt: 'Welcome to the team! This guide covers everything from setting up your workstation to...', updated: '2 days ago' },
    { type: 'workspace', title: 'Engineering Design Patterns', members: 12, description: 'A collection of standard architectural patterns used across our microservices.', isPublic: false },
    { type: 'doc', title: 'API Authentication Flow', workspace: 'Technical Docs', excerpt: 'We use OAuth 2.0 for all external API calls. To get started, you need to register your app...', updated: '1 week ago' },
    { type: 'user', title: 'Sarah Jenkins', role: 'Senior Product Designer', department: 'Design', avatar: 'https://images.unsplash.com/photo-1438733002994-d8316c278586?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Global Search</h1>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search across documents, workspaces, and members..." 
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-lg shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button className="px-8 rounded-2xl">Search</Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Badge variant="primary" className="cursor-pointer px-4 py-1.5">All Results</Badge>
          <Badge variant="secondary" className="cursor-pointer px-4 py-1.5">Documents</Badge>
          <Badge variant="secondary" className="cursor-pointer px-4 py-1.5">Workspaces</Badge>
          <Badge variant="secondary" className="cursor-pointer px-4 py-1.5">Members</Badge>
          <Badge variant="secondary" className="cursor-pointer px-4 py-1.5">Assets</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500 font-medium px-2">
          <span>Showing 4 results for "{query || 'recent'}"</span>
          <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"><Filter className="w-4 h-4" /> Advanced Filters</button>
        </div>

        <div className="space-y-4">
          {results.map((res, i) => (
            <Card key={i} className="p-6 hover:translate-x-1 transition-transform cursor-pointer group">
              <div className="flex gap-5">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                  res.type === 'doc' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20" :
                  res.type === 'workspace' ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20" :
                  "bg-slate-100 text-slate-600 dark:bg-slate-800"
                )}>
                  {res.type === 'doc' && <FileText className="w-7 h-7" />}
                  {res.type === 'workspace' && <Globe className="w-7 h-7" />}
                  {res.type === 'user' && <img src={res.avatar} className="w-full h-full object-cover rounded-2xl" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{res.title}</h3>
                    <Badge variant="secondary">{res.type}</Badge>
                  </div>
                  
                  {res.type === 'doc' && (
                    <>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{res.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {res.workspace}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {res.updated}</span>
                      </div>
                    </>
                  )}

                  {res.type === 'workspace' && (
                    <>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{res.description}</p>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {res.members} Members</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Active now</span>
                      </div>
                    </>
                  )}

                  {res.type === 'user' && (
                    <>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{res.role} • {res.department}</p>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </>
                  )}
                </div>
                <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';

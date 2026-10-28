import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Card, Badge, Button } from '@/components/ui';
import { 
  FileText, 
  MessageSquare, 
  ArrowLeft, 
  Loader2,
  ChevronRight,
  User
} from 'lucide-react';

export const CommentedDocs = () => {
  const [cookies] = useCookies(['user']);
  const navigate = useNavigate();
  const user = cookies.user ? (typeof cookies.user === 'string' ? JSON.parse(cookies.user) : cookies.user) : null;
  const [commentedDocs, setCommentedDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommentedData = async () => {
      try {
        setLoading(true);
        // 1. Fetch recent public documents
        const docsRes = await axios.get("https://documentation-hub-h5zv.vercel.app/api/documents/public", { withCredentials: true });
        const allDocs = (docsRes.data || []).slice(0, 20); // Limit to top 20 for performance

        // 2. For each doc, fetch its comments and check if user participated
        const docPromises = allDocs.map(async (doc) => {
          try {
            const commRes = await axios.get(`https://documentation-hub-h5zv.vercel.app/user/get-comment/${doc._id}`, { withCredentials: true });
            const docComments = commRes.data?.data || [];
            const userCommented = docComments.some(c => c.userId?._id === user?._id || c.userId === user?._id);
            
            if (userCommented) {
              return { ...doc, commentCount: docComments.length };
            }
          } catch (e) {
            console.error(`Error fetching comments for doc ${doc._id}:`, e);
          }
          return null;
        });

        const results = await Promise.all(docPromises);
        setCommentedDocs(results.filter(d => d !== null));
      } catch (err) {
        console.error("Fetch commented docs error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchCommentedData();
    }
  }, [user?._id]);

  return (
    <div className="w-full px-8 py-10 space-y-8">
      <header className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)} 
          className="w-fit gap-2 -ml-3 text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">My Participations</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Documents you have commented on.</p>
          </div>
        </div>
      </header>

      <div className="space-y-4 max-w-4xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-slate-500 font-medium">Scanning documents for your comments...</p>
          </div>
        ) : commentedDocs.length > 0 ? (
          commentedDocs.map((doc) => (
            <Link key={doc._id} to={`/doc/${doc._id}`} className="block group">
              <Card className="p-6 flex items-center gap-6 transition-all group-hover:shadow-lg group-hover:border-indigo-500/30">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">{doc.title}</h3>
                    <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px]">{doc.visibility}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{doc.authorId?.username || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{doc.commentCount} {doc.commentCount === 1 ? 'Comment' : 'Comments'}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </Card>
            </Link>
          ))
        ) : (
          <Card className="py-20 flex flex-col items-center justify-center border-dashed text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300 mb-2">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">No Participations Yet</h2>
            <p className="text-slate-500 max-w-sm">You haven't commented on any documents. Join the conversation on the public documents page!</p>
            <Button variant="outline" onClick={() => navigate('/public-docs')}>Browse Public Docs</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

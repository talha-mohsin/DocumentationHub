import { Link, useParams } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import { BadgeCheck, ArrowRight } from 'lucide-react';

export const SentEmail = () => {
  const { email } = useParams();
  

  return (
    <Card className="p-8 text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping opacity-25"></div>
        <div className="relative w-full h-full bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
          <BadgeCheck className="w-12 h-12 text-indigo-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Verify Email</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-3 mb-10 leading-relaxed">
        A verification email has been sent to <strong>{email}</strong>. Please check your inbox and click the verification link.
      </p>

      <Button as={Link} to="/login" className="gap-2">
        Go to Login <ArrowRight className="w-4 h-4" />
      </Button>
    </Card>
  );
};
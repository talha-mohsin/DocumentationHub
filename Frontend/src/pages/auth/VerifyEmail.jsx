import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button } from '@/components/ui';
import { BadgeCheck, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { showToast } from '../../components/ToastContainer';

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);


  const checkIsverified = async () => {
    try {
      const verifiedChek = await axios.post("https://documentation-hub-h5zv.vercel.app/user/verification", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      )
      setSuccess(true)
      showToast("success", "Verified Successfully");
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      setSuccess(false)
      setError(error.response?.data?.message)
    }
  }
  useEffect(() => {
    checkIsverified()
  }, []);

  return (
    <Card className="p-8 text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping opacity-25"></div>
        <div className="relative w-full h-full bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
          <BadgeCheck className="w-12 h-12 text-indigo-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {success ? "Email Verified!" : error}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mt-3 mb-10 leading-relaxed">
        {success ? "Your account has been successfully verified. You now have full access." : "Unable to verify your email."}
      </p>
    </Card>
  );
};
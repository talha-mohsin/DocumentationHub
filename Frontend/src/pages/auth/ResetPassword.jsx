import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, FileText } from 'lucide-react';
import axios from 'axios';
import { showToast } from '../../components/ToastContainer';

export const ResetPassword = () => {
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { email } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`https://documentation-hub-h5zv.vercel.app/user/changePassword/${email}`, {
        newPassword,
        confirmPassword
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      showToast("success", "Your Password Has Been Changed Successfully 🎉");
      setLoading(false);
      navigate('/login');
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Your password was not changed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md fade-and-slide">
      <div className="bg-white p-10 md:p-12 shadow-[0_40px_80px_-15px_rgba(42,52,57,0.06)] rounded-xl border border-[#eeeeee] relative overflow-hidden">

        <div className="mb-10 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="bg-[#5148d7] p-1 rounded-sm">
              <FileText className="text-white w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="text-[22px] font-medium tracking-tight text-[#1a1a1a]">DocuHub</span>
          </div>
          <h1 className="text-3xl font-light text-[#1a1a1a] tracking-tight mb-2">Set New Password</h1>
          <p className="text-[#566166] font-light text-sm tracking-wide">Please choose a secure password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group">
            <div className="flex items-center gap-3 border-b border-[#e0e0e0] py-3 transition-all duration-300 focus-within:border-[#5148d7]">
              <Lock className="w-4 h-4 text-[#717c82] group-focus-within:text-[#5148d7] transition-colors" />
              <input
                className="bg-transparent border-none focus:ring-0 w-full p-0 text-[#2a3439] placeholder:text-[#717c82]/60 font-light tracking-wide text-sm outline-none"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setnewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-3 border-b border-[#e0e0e0] py-3 transition-all duration-300 focus-within:border-[#5148d7]">
              <Lock className="w-4 h-4 text-[#717c82] group-focus-within:text-[#5148d7] transition-colors" />
              <input
                className="bg-transparent border-none focus:ring-0 w-full p-0 text-[#2a3439] placeholder:text-[#717c82]/60 font-light tracking-wide text-sm outline-none"
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5148d7] text-white py-4 rounded-md font-normal tracking-wider text-sm transition-all duration-300 hover:bg-[#4439cb] hover:shadow-lg hover:shadow-[#5148d7]/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <Link
            to="/login"
            className="text-xs text-[#566166] font-light tracking-[0.05em] hover:text-[#5148d7] transition-colors uppercase"
          >
            Back to Login
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center px-4">
        <div className="flex justify-center gap-4 text-[10px] text-[#717c82] uppercase tracking-[0.2em] font-light">
          <span>Encrypted</span>
          <span>•</span>
          <span>Secure Session</span>
          <span>•</span>
          <span>DocuHub Auth</span>
        </div>
      </div>
    </div>
  );
};
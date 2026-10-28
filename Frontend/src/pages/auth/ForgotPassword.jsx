import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, FileText } from 'lucide-react';
import axios from 'axios';
import { showToast } from '../../components/ToastContainer';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("https://documentation-hub-h5zv.vercel.app/user/forgetPassword",
        { email },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      showToast("success", "Otp has been sent on your email 🎉");
      setLoading(false);
      navigate(`/otp/${email}`);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white rounded-xl p-12 shadow-[0_24px_40px_rgba(42,52,57,0.04)] border border-[#eeeeee] flex flex-col gap-8">
      
      {/* Header Section */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#5148d7] p-1 rounded-sm">
            <FileText className="text-white w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="text-[22px] font-medium tracking-tight text-[#1a1a1a]">DocuHub</span>
        </div>
        <h1 className="text-[28px] font-light text-[#1a1a1a] mb-1">Reset Password</h1>
        <p className="text-[#8e8e8e] font-light text-[14px]">Enter your email to receive a password reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9e9e9e] ml-0.5" htmlFor="email">Email Address</label>
          <div className="relative group">
            <Mail className={`absolute left-0 bottom-2.5 w-[18px] h-[18px] transition-colors ${errors.email ? 'text-red-400' : 'text-[#9e9e9e] group-focus-within:text-[#5148d7]'}`} />
            <input 
              className={`w-full bg-transparent border-t-0 border-x-0 border-b px-7 py-2 font-light text-[#333] transition-all duration-300 outline-none focus:ring-0 text-[15px] ${errors.email ? 'border-red-300' : 'border-[#e0e0e0] focus:border-[#5148d7]'}`}
              id="email" 
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: '' });
              }}
            />
          </div>
          {errors.email && <span className="text-[10px] text-red-500 mt-1 uppercase tracking-wider font-medium">{errors.email}</span>}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#5248e2] text-white py-4 rounded-md font-normal text-[16px] shadow-sm hover:bg-[#4338ca] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Sending link..." : "Send Recovery Link"}
        </button>
      </form>

      <div className="text-center pt-4">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-[14px] font-normal text-[#5148d7] hover:text-[#4338ca] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
};
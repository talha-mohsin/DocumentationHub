import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { showToast } from "../../components/ToastContainer";
import { Eye, EyeOff, Mail, Lock, FileText } from 'lucide-react'; 

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!email) newErrors.email = 'Email address is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://documentation-hub-h5zv.vercel.app/user/login",
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      
      login(res.data.user);
      showToast("success", "Login Successful");
      navigate("/workspaces");
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white rounded-xl p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-[#eeeeee] flex flex-col gap-8">
      
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#5148d7] p-1 rounded-sm">
            <FileText className="text-white w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="text-[22px] font-medium tracking-tight text-[#1a1a1a]">DocuHub</span>
        </div>
        <h1 className="text-[28px] font-light text-[#1a1a1a] mb-1">Welcome back</h1>
        <p className="text-[#8e8e8e] font-light text-[14px]">Enter your details to access your atelier.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9e9e9e] ml-0.5">Email Address</label>
          <div className="relative group">
            <Mail className={`absolute left-0 bottom-2.5 w-[18px] h-[18px] transition-colors ${errors.email ? 'text-red-400' : 'text-[#9e9e9e] group-focus-within:text-[#5148d7]'}`} />
            <input 
              className={`w-full bg-transparent border-t-0 border-x-0 border-b px-7 py-2 font-light text-[#333] transition-all outline-none focus:ring-0 text-[15px] ${errors.email ? 'border-red-300' : 'border-[#e0e0e0] focus:border-[#5148d7]'}`}
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: '' }); // Clearing error on change
              }}
            />
          </div>
          {errors.email && <span className="text-[10px] text-red-500 mt-1 uppercase tracking-wider font-medium">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9e9e9e] ml-0.5">Password</label>
          <div className="relative group">
            <Lock className={`absolute left-0 bottom-2.5 w-[18px] h-[18px] transition-colors ${errors.password ? 'text-red-400' : 'text-[#9e9e9e] group-focus-within:text-[#5148d7]'}`} />
            <input 
              className={`w-full bg-transparent border-t-0 border-x-0 border-b px-7 py-2 font-light text-[#333] transition-all outline-none focus:ring-0 text-[15px] ${errors.password ? 'border-red-300' : 'border-[#e0e0e0] focus:border-[#5148d7]'}`}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: '' }); // Clearing error on change
              }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-2.5 text-[#9e9e9e] hover:text-[#5148d7]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="text-[10px] text-red-500 mt-1 uppercase tracking-wider font-medium">{errors.password}</span>}
        </div>

        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="h-4 w-4 rounded border-[#d1d1d1] text-[#5148d7] focus:ring-0 cursor-pointer" />
            <span className="text-[14px] font-light text-[#666] group-hover:text-[#1a1a1a] transition-colors">Remember Me</span>
          </label>
          <Link to="/forgot-password" strokeWidth={1} className="text-[14px] font-normal text-[#5148d7] hover:opacity-80 transition-opacity">
            Forgot Password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#5248e2] text-white py-4 rounded-md font-normal text-[16px] shadow-sm hover:bg-[#4338ca] transition-all duration-300 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-[14px] font-light text-[#666]">
          Don't have an account? 
          <Link to="/signup" className="text-[#5148d7] font-normal hover:underline ml-1 underline-offset-4 transition-all">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
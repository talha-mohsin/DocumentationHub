import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { showToast } from '../../components/ToastContainer';
import { Eye, EyeOff, Mail, Lock, User, FileText } from 'lucide-react';

export const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("https://documentation-hub-h5zv.vercel.app/user/register", {
        username: formData.name,
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });

      if (res.data.message === "Signup successfully!") {
        showToast("success", "Signup Successful 🎉");
        navigate(`/sent-email/${formData.email}`);
      } else {
        showToast("Warning", res.data.message);
      }

      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] bg-white rounded-xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-[#eeeeee] flex flex-col gap-8 my-8">
      
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#5148d7] p-1 rounded-sm">
            <FileText className="text-white w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="text-[22px] font-medium tracking-tight text-[#1a1a1a]">DocuHub</span>
        </div>
        <h1 className="text-[28px] font-light text-[#1a1a1a] mb-1">Create Account</h1>
        <p className="text-[#8e8e8e] font-light text-[14px]">Start building your knowledge hub today.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9e9e9e] ml-0.5">Full Name</label>
          <div className="relative group">
            <User className={`absolute left-0 bottom-2.5 w-[18px] h-[18px] transition-colors ${errors.name ? 'text-red-400' : 'text-[#9e9e9e] group-focus-within:text-[#5148d7]'}`} />
            <input 
              name="name"
              className={`w-full bg-transparent border-t-0 border-x-0 border-b px-7 py-2 font-light text-[#333] transition-all outline-none focus:ring-0 text-[15px] ${errors.name ? 'border-red-300' : 'border-[#e0e0e0] focus:border-[#5148d7]'}`}
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && <span className="text-[10px] text-red-500 mt-1 uppercase tracking-wider font-medium">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9e9e9e] ml-0.5">Email Address</label>
          <div className="relative group">
            <Mail className={`absolute left-0 bottom-2.5 w-[18px] h-[18px] transition-colors ${errors.email ? 'text-red-400' : 'text-[#9e9e9e] group-focus-within:text-[#5148d7]'}`} />
            <input 
              name="email"
              type="email"
              className={`w-full bg-transparent border-t-0 border-x-0 border-b px-7 py-2 font-light text-[#333] transition-all outline-none focus:ring-0 text-[15px] ${errors.email ? 'border-red-300' : 'border-[#e0e0e0] focus:border-[#5148d7]'}`}
              placeholder="john@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <span className="text-[10px] text-red-500 mt-1 uppercase tracking-wider font-medium">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9e9e9e] ml-0.5">Password</label>
          <div className="relative group">
            <Lock className={`absolute left-0 bottom-2.5 w-[18px] h-[18px] transition-colors ${errors.password ? 'text-red-400' : 'text-[#717c82] group-focus-within:text-[#5148d7]'}`} />
            <input 
              name="password"
              className={`w-full bg-transparent border-t-0 border-x-0 border-b px-7 py-2 font-light text-[#333] transition-all outline-none focus:ring-0 text-[15px] ${errors.password ? 'border-red-300' : 'border-[#e0e0e0] focus:border-[#5148d7]'}`}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-2.5 text-[#9e9e9e] hover:text-[#5148d7]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="text-[10px] text-red-500 mt-1 uppercase tracking-wider font-medium">{errors.password}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9e9e9e] ml-0.5">Confirm Password</label>
          <div className="relative group">
            <Lock className={`absolute left-0 bottom-2.5 w-[18px] h-[18px] transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-[#717c82] group-focus-within:text-[#5148d7]'}`} />
            <input 
              name="confirmPassword"
              className={`w-full bg-transparent border-t-0 border-x-0 border-b px-7 py-2 font-light text-[#333] transition-all outline-none focus:ring-0 text-[15px] ${errors.confirmPassword ? 'border-red-300' : 'border-[#e0e0e0] focus:border-[#5148d7]'}`}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 bottom-2.5 text-[#9e9e9e] hover:text-[#5148d7]">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="text-[10px] text-red-500 mt-1 uppercase tracking-wider font-medium">{errors.confirmPassword}</span>}
        </div>

        <label className="flex items-start gap-3 cursor-pointer mt-1">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#d1d1d1] text-[#5148d7] focus:ring-0 cursor-pointer" required />
          <span className="text-[13px] font-light text-[#666] leading-snug">
            By creating an account, you agree to our <Link to="/terms" className="text-[#5148d7] font-normal hover:underline">Terms</Link> and <Link to="/privacy" className="text-[#5148d7] font-normal hover:underline">Privacy Policy</Link>.
          </span>
        </label>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#5248e2] text-white py-4 rounded-md font-normal text-[16px] shadow-sm hover:bg-[#4338ca] transition-all duration-300 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-[14px] font-light text-[#666]">
          Already have an account? 
          <Link to="/login" className="text-[#5148d7] font-normal hover:underline ml-1 underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
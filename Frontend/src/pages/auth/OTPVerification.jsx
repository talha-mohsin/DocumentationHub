import { useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import axios from 'axios';
import { showToast } from '../../components/ToastContainer';

export const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const { email } = useParams();
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
     
    try {
      const res = await axios.post("https://documentation-hub-h5zv.vercel.app/user/forgetPassword",
        { email, otp: otp.join('') }, 
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      
      showToast("success", "OTP is verified 🎉");
      setLoading(false);
      navigate(`/reset-password/${email}`);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white p-12 rounded-xl shadow-[0_24px_40px_rgba(42,52,57,0.04)] border border-[#eeeeee] flex flex-col items-center text-center">
      
      {/* Brand Mark */}
      <div className="mb-10 flex items-center gap-2">
        <div className="bg-[#5148d7] p-1 rounded-sm">
          <FileText className="text-white w-5 h-5" strokeWidth={2.5} />
        </div>
        <span className="text-[22px] font-medium tracking-tight text-[#1a1a1a]">DocuHub</span>
      </div>

      <div className="space-y-3 mb-10">
        <h1 className="text-3xl font-light tracking-tight text-[#1a1a1a]">Verify your email</h1>
        <p className="text-[#8e8e8e] font-light leading-relaxed text-[15px]">
          We've sent a 6-digit code to <span className="text-[#1a1a1a] font-medium">{email}</span>. <br/>
          Please enter it below to secure your atelier.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-12">
        <div className="flex justify-between gap-3 md:gap-4 max-w-md mx-auto">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              placeholder="0"
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-16 text-2xl text-center bg-[#f8f9fb] border-t-0 border-x-0 border-b-2 border-[#e0e0e0] focus:border-[#5148d7] focus:bg-[#faf6ff] focus:ring-0 transition-all duration-300 font-light outline-none"
            />
          ))}
        </div>

        <div className="space-y-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[#5148d7] text-white rounded-md font-normal tracking-wide hover:bg-[#4338ca] transition-all duration-300 shadow-sm disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="flex flex-col gap-4">
                        
            <Link 
              to="/login" 
              className="text-[#8e8e8e] font-light text-xs flex items-center justify-center gap-1 hover:text-[#1a1a1a] transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
              Back to sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
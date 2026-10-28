import { Card, Button, Input } from '@/components/ui';
import axios from 'axios';
import { User, Mail, Shield, Camera, Trash2, CheckCircle, Settings, Globe, Info, Save,Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { showToast } from "../../components/ToastContainer";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Profile = () => {
  const [cookies, setCookie] = useCookies(['user', 'token']);
  const [newName, setNewName] = useState("");
  const fileInputRef = useRef(null);
  const [btnDisable, setDisable] = useState(false);

  const username = cookies.user?.username || "";
  const email = cookies.user?.email || "";
  const role = cookies.user?.role || "";
  const bio = cookies.user?.bio || "";
  const image = cookies.user?.image || "";

  const [newBio, setBio] = useState(bio);
  const [newImage, setNewImage] = useState(image);
  const [preview, setPreview] = useState(image);

  const handleClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewImage(file);
  };

  useEffect(() => {
    if (newImage instanceof File) {
      const objectUrl = URL.createObjectURL(newImage);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(newImage);
    }
  }, [newImage]);

  const updateData = async () => {
    setDisable(true);
    try {
      const formData = new FormData();
      formData.append("username", newName || username);
      formData.append("bio", newBio || bio);
      if (newImage instanceof File) formData.append("image", newImage);

      const res = await axios.put(
        "https://documentation-hub-h5zv.vercel.app/user/update-profile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );

      setCookie('user', JSON.stringify(res.data.updateData), { path: '/' });
      setNewImage(res.data.updateData.image);
      showToast("success", "Profile updated successfully!");
    } catch (error) {
      showToast("error", error.response?.data?.message || "Profile update failed");
    } finally {
      setDisable(false);
    }
  };

  return (
    <main className="p-8 md:p-12 bg-[#f7f9fb] min-h-screen font-['Manrope'] selection:bg-[#e3dfff]">

      {/* Header Section (Indigo Consistent) */}
      <header className="mb-12 max-w-6xl space-y-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-[#e3dfff] flex items-center justify-center text-[#5148d7]">
            <Settings size={20} />
          </div>
          <h1 className="text-4xl font-light tracking-tight text-[#2a3439]">Account Settings</h1>
        </div>
        <p className="text-[#566166] max-w-md font-light leading-relaxed">
          Customize your profile, update your bio, and manage your digital presence across spaces.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl">

        {/* Left Sidebar: Profile Card */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#a9b4b9]/15 rounded-[32px] p-8 shadow-sm text-center"
          >
            <div className="relative w-40 h-40 mx-auto mb-6 group">
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-[#5148d7]/20 to-transparent animate-pulse" />
              <img
                src={preview || "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"}
                alt="Avatar"
                className="relative w-full h-full rounded-[40px] object-cover border-4 border-white shadow-xl"
              />
              <button
                onClick={handleClick}
                className="absolute inset-0 bg-[#5148d7]/40 rounded-[40px] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]"
              >
                <Camera className="w-8 h-8" />
              </button>
            </div>

            <h3 className="text-xl font-medium text-[#2a3439]">{username}</h3>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#717c82] font-bold mt-1 mb-6">{role}</p>

            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">
                <CheckCircle size={10} /> Verified
              </span>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            <div className="space-y-3 pt-6 border-t border-[#a9b4b9]/10">
              <button
                onClick={handleClick}
                className="w-full py-3 bg-[#f7f9fb] text-[#5148d7] text-xs font-semibold rounded-2xl hover:bg-[#e3dfff] transition-all tracking-wide"
              >
                Update Photo
              </button>
              <button className="w-full py-3 text-red-400 text-xs font-medium hover:text-red-600 transition-colors opacity-40 cursor-not-allowed uppercase tracking-widest">
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Content: Settings Form */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-[#a9b4b9]/15 rounded-[32px] p-10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-10 border-b border-[#a9b4b9]/10 pb-6">
              <div className="p-2 bg-[#e3dfff] text-[#5148d7] rounded-lg">
                <User size={18} />
              </div>
              <h3 className="text-lg font-medium text-[#2a3439]">Personal Details</h3>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#717c82] ml-1">Username</label>
                <input
                  defaultValue={username}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[#f7f9fb] border border-transparent rounded-2xl text-sm font-light focus:ring-2 focus:ring-[#5148d7]/10 focus:border-[#5148d7]/20 transition-all outline-none"
                />
              </div>

              {/* Email & Role (ReadOnly Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 opacity-70">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#717c82] ml-1">Email Address</label>
                  <div className="px-5 py-3.5 bg-[#f7f9fb]/50 border border-[#a9b4b9]/10 rounded-2xl text-sm font-light flex items-center gap-3 text-[#566166]">
                    <Mail size={14} className="text-[#a9b4b9]" /> {email}
                  </div>
                </div>
                <div className="space-y-1.5 opacity-70">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#717c82] ml-1">Account Role</label>
                  <div className="px-5 py-3.5 bg-[#f7f9fb]/50 border border-[#a9b4b9]/10 rounded-2xl text-sm font-light flex items-center gap-3 text-[#566166]">
                    <Shield size={14} className="text-[#a9b4b9]" /> {role}
                  </div>
                </div>
              </div>

              {/* Bio Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#717c82] ml-1">Short Bio</label>
                <textarea
                  className="w-full px-5 py-4 bg-[#f7f9fb] border border-transparent rounded-2xl text-sm font-light focus:ring-2 focus:ring-[#5148d7]/10 focus:border-[#5148d7]/20 transition-all outline-none min-h-[140px] resize-none"
                  defaultValue={bio}
                  placeholder="Tell us about yourself..."
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[#a9b4b9]/10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-[#a9b4b9] text-[11px] font-light italic">
                <Info size={14} /> Only your public profile is visible to others.
              </div>
              <button
                onClick={updateData}
                disabled={btnDisable}
                className={cn(
                  "w-full md:w-auto px-10 py-3.5 bg-[#5148d7] text-white rounded-2xl text-xs font-semibold tracking-widest uppercase shadow-lg shadow-[#5148d7]/20 hover:bg-[#4439cb] transition-all active:scale-95 flex items-center justify-center gap-2",
                  btnDisable && "opacity-50 cursor-not-allowed"
                )}
              >
                {btnDisable ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {btnDisable ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};
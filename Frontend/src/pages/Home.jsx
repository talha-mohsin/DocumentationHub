import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiExternalLink } from "react-icons/fi";
import { FileText } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [publicDocuments, setPublicDocuments] = useState([]);
  const sliderRef = useRef();

  useEffect(() => {
    const link1 = document.createElement("link");
    link1.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap";
    link1.rel = "stylesheet";
    const link2 = document.createElement("link");
    link2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    link2.rel = "stylesheet";
    document.head.appendChild(link1);
    document.head.appendChild(link2);
    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://documentation-hub-h5zv.vercel.app/api/documents/public/documents");
        setPublicDocuments(res.data);
      } catch (error) {
        console.log("error ============>>", error.message);
      }
    })();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const scrollLeft = () => { sliderRef.current.scrollBy({ left: -340, behavior: "smooth" }); };
  const scrollRight = () => { sliderRef.current.scrollBy({ left: 340, behavior: "smooth" }); };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#2a3439] font-['Outfit'] antialiased">
      <Navbar />

      <main className="pt-20">
        {/* HERO SECTION */}
        <section className="pt-15 pb-20 text-center px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5148d7]/5 border border-[#5148d7]/10 text-[#5148d7] text-[10px] font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5148d7] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5148d7]"></span>
              </span>
              v1.0 Interface Live
            </div>
            <h1 className="text-5xl md:text-7xl font-light leading-[1.1] tracking-tight text-[#2a3439]">
              The quiet sanctuary for <br />
              <span className="text-[#5148d7] italic">refined</span> documentation.
            </h1>
            <p className="text-xl text-[#566166] font-light max-w-2xl mx-auto leading-relaxed">
              Atelier brings editorial precision to your technical workspace.
              Built for those who value clarity over clutter.
            </p>
            <div className="flex items-center justify-center gap-6 pt-4">
              <button className="bg-[#5148d7] text-white px-8 py-4 rounded-xl font-medium shadow-xl shadow-[#5148d7]/20 hover:bg-[#4439cb] transition-all hover:-translate-y-1 active:scale-95">
                Explore The DocHub
              </button>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white border-y border-[#a9b4b9]/15 px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div className="space-y-3">
                <h2 className="text-4xl font-light tracking-tight text-[#2a3439]">
                  Public Archives
                </h2>
                <div className="h-1 w-12 bg-[#5148d7] rounded-full"></div>
              </div>
              <div className="flex gap-4">
                <button onClick={scrollLeft} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#f7f9fb] text-[#a9b4b9] hover:text-[#5148d7] transition-all"><FiArrowLeft size={18} /></button>
                <button onClick={scrollRight} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#f7f9fb] text-[#a9b4b9] hover:text-[#5148d7] transition-all"><FiArrowRight size={18} /></button>
              </div>
            </div>

            <div className="relative">
              <div
                ref={sliderRef}
                className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar py-8 px-2"
              >
                {publicDocuments.map((doc, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/documentDetail/${doc.slug}`)}
                    className="group relative flex-shrink-0 w-[340px] bg-white p-8 rounded-[24px] border border-[#a9b4b9]/15 hover:border-[#5148d7]/40 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(81,72,215,0.08)] transition-all duration-500 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiExternalLink className="text-[#5148d7]" size={18} />
                    </div>

                    <div className="mb-12 flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#f7f9fb] group-hover:bg-[#5148d7]/5 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-[#a9b4b9] group-hover:text-[#5148d7] text-2xl">
                          description
                        </span>
                      </div>
                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#a9b4b9] bg-[#f7f9fb] px-3 py-1 rounded-full border border-[#a9b4b9]/5">
                        {doc?.workspaceId?.name || "Global"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-medium leading-[1.3] text-[#2a3439] group-hover:text-[#5148d7] transition-colors line-clamp-2 h-[52px]">
                        {doc?.title || doc?.slug}
                      </h4>
                      <p className="text-sm text-[#566166] font-light line-clamp-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        Explore the internal documentation and architectural logs of this workspace node.
                      </p>
                    </div>

                    <div className="mt-10 pt-6 border-t border-[#a9b4b9]/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e3dfff] to-[#f7f9fb] flex items-center justify-center text-[10px] text-[#5148d7] font-bold border border-[#5148d7]/10">
                          {doc?.authorId?.username?.[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#2a3439]">{doc?.authorId?.username?.split("@")[0]}</span>
                          <span className="text-[9px] text-[#a9b4b9] uppercase tracking-wider">{formatDate(doc?.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        <section className="py-32 bg-[#f7f9fb]">
          <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-12">
            <Feature icon="auto_awesome" title="Curation Engine" text="Automated organizational logic that understands the semantic value of your information." />
            <Feature icon="history_edu" title="Editorial Craft" text="Write with a focus-first interface designed to eliminate distractions." />
            <Feature icon="grid_view" title="Tonal Layouts" text="Switch between atmospheric themes that adjust to your time of day." />
          </div>
        </section>
      </main>

      <footer className="border-t border-[#a9b4b9]/10 py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">

            <div className=" flex items-center px-6 overflow-hidden">
              <div className="flex items-center gap-3.5">
                <div className="bg-[#5148d7] p-1 rounded-sm">
                  <FileText className="text-white w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[22px] font-medium tracking-tight text-[#1a1a1a]">DocuHub</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#566166]">
            <a className="hover:text-[#5148d7] transition-colors">Framework</a>
            <a className="hover:text-[#5148d7] transition-colors">Archive</a>
            <a className="hover:text-[#5148d7] transition-colors">Privacy</a>
            <a className="hover:text-[#5148d7] transition-colors">Identity</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Feature = ({ icon, title, text }) => (
  <div className="p-10 rounded-[32px] bg-white border border-[#a9b4b9]/10 hover:border-[#5148d7]/20 transition-all group shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
    <div className="w-14 h-14 rounded-2xl bg-[#f0f4f7] group-hover:bg-[#5148d7] flex items-center justify-center mb-8 transition-all duration-500 group-hover:rotate-6">
      <span className="material-symbols-outlined text-[#5148d7] group-hover:text-white transition-colors text-3xl">
        {icon}
      </span>
    </div>
    <h3 className="text-2xl font-light text-[#2a3439] mb-4 tracking-tight">{title}</h3>
    <p className="text-[#566166] font-light leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity">{text}</p>
  </div>
);

export default Home;
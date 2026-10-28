import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    
    <div className="min-h-screen flex flex-col bg-[#f8f9fb] font-['Outfit'] antialiased relative">
      
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(81,72,215,0.04)_0%,_rgba(248,249,251,1)_100%)] pointer-events-none"></div>

      
      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <Outlet />
      </main>

      
      <footer className="w-full py-10 px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[#9e9e9e] text-[13px] font-light border-t border-[#f0f0f0] bg-white/50 backdrop-blur-sm relative z-20">
        <div>© 2024 DocuHub. The Digital Atelier for Documents.</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#5148d7] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#5148d7] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#5148d7] transition-colors">Security Architecture</a>
          <a href="#" className="hover:text-[#5148d7] transition-colors">Status</a>
        </div>
      </footer>
    </div>
  );
};

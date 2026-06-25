import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#080808] text-white pt-24 pb-8 px-6 md:px-12 lg:px-24 overflow-hidden relative border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24 relative z-10">

        {/* Column 1: Brand & Info */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <Link to="/" className="inline-block">
            {/* Using inline filter to ensure pure white logo */}
            <img src="/logo.svg" alt="Memoir Logo" className="h-6" style={{ filter: 'brightness(0) invert(1)' }} />
          </Link>
          <p className="text-[13px] text-[#888] leading-[1.6]">
            The ultimate knowledge graph for your organization. Memoir connects your decisions, discussions, and documents into a unified, intelligent ledger.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-3 text-[13px] text-[#ccc]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              <a href="mailto:hello@memoir.inc" className="hover:text-white transition-colors">hello@memoir.inc</a>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-[30px] h-[30px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors text-white/80 hover:text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </a>
            <a href="#" className="w-[30px] h-[30px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors text-white/80 hover:text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.77 24h20.46c.978 0 1.77-.773 1.77-1.729V1.729C24 .774 23.208 0 22.23 0zM7.12 20.452H3.558V9h3.562v11.452zM5.34 7.434c-1.138 0-2.06-.927-2.06-2.065 0-1.139.922-2.066 2.06-2.066 1.14 0 2.062.927 2.062 2.066 0 1.138-.922 2.065-2.062 2.065zm15.112 13.018h-3.562v-5.594c0-1.334-.025-3.05-1.859-3.05-1.861 0-2.146 1.453-2.146 2.953v5.691h-3.56V9h3.418v1.561h.049c.476-.9 1.637-1.85 3.367-1.85 3.605 0 4.271 2.372 4.271 5.455v6.286z" /></svg>
            </a>
            <a href="#" className="w-[30px] h-[30px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors text-white/80 hover:text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="lg:col-span-2 lg:ml-4">
          <h4 className="text-[11px] font-bold text-white tracking-[0.15em] uppercase mb-6 opacity-90">Quick Links</h4>
          <ul className="flex flex-col gap-[14px] text-[13px] text-[#888]">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
            <li><Link to="/use-cases" className="hover:text-white transition-colors">Use cases</Link></li>
            <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="lg:col-span-2">
          <h4 className="text-[11px] font-bold text-white tracking-[0.15em] uppercase mb-6 opacity-90">Resources</h4>
          <ul className="flex flex-col gap-[14px] text-[13px] text-[#888]">
            <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
          </ul>
        </div>

        {/* Column 4: Company */}
        <div className="lg:col-span-2">
          <h4 className="text-[11px] font-bold text-white tracking-[0.15em] uppercase mb-6 opacity-90">Company</h4>
          <ul className="flex flex-col gap-[14px] text-[13px] text-[#888]">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Column 5: Newsletter */}
        <div className="lg:col-span-3">
          <h4 className="text-[11px] font-bold text-white tracking-[0.15em] uppercase mb-6 opacity-90">Subscribe to Newsletter</h4>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="bg-[#111] border border-[#222] rounded-md px-3 py-2 text-[13px] text-white placeholder-[#666] focus:outline-none focus:border-[#444] transition-colors w-full h-[36px]"
            />
            <button
              type="submit"
              className="bg-[#222] hover:bg-[#333] border border-[#333] text-white text-[13px] font-medium py-2 px-4 rounded-md transition-all duration-200 whitespace-nowrap h-[36px] flex items-center"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[11px] text-[#555] mt-3">
            Get the latest updates on Memoir directly to your inbox. No spam, ever.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <p className="text-[12px] text-[#555]">© {new Date().getFullYear()} Memoir Inc. All rights reserved.</p>
        <div className="flex gap-6 text-[12px] text-[#555]">
          <a href="#" className="hover:text-white transition-colors">System Status</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
        </div>
      </div>

      {/* Giant Background Logo */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none z-0 translate-y-[20%] px-6">
        <img
          src="/memoir.svg"
          alt=""
          className="w-full max-w-7xl opacity-[0.5]"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>
    </footer>
  );
}

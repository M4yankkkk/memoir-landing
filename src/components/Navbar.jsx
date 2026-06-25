import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const navbarRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (navbarRef.current) navbarRef.current.classList.add('in');
    }, 100);
  }, []);

  return (
    <nav ref={navbarRef} className="fixed top-0 inset-x-0 z-[1000] flex items-center justify-between px-6 md:px-12 h-[60px] bg-white/95 backdrop-blur-md border-b border-black/5 opacity-0 -translate-y-[14px] transition-all duration-[550ms] ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
      <Link to="/" className="flex items-center gap-2 font-bold text-[15px] tracking-[-0.3px] text-inherit no-underline">
        <img src="/logo.svg" alt="Memoir Logo" style={{ height: '16px' }} />
      </Link>
      <ul className="hidden md:flex gap-7 list-none">
        <li><Link to="/" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">Product</Link></li>
        <li><Link to="/how-it-works" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">How it works</Link></li>
        <li><Link to="/use-cases" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">Use cases</Link></li>
        <li><Link to="/security" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">Security</Link></li>
        <li><Link to="/docs" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">Docs</Link></li>
        <li><Link to="/pricing" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">Pricing</Link></li>
      </ul>
      <a href="#" className="bg-white border-[1.5px] border-black text-black text-[13px] font-medium py-[7px] px-4 rounded-md cursor-pointer flex items-center gap-[6px] no-underline transition-all duration-200 hover:bg-black hover:text-white hover:-translate-y-[1px]">Request a Demo ↗</a>
    </nav>
  );
}

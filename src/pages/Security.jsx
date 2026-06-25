import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../components/SplitText';

gsap.registerPlugin(ScrollTrigger);

export default function Security() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const revealEls = gsap.utils.toArray('.reveal');
      revealEls.forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add('in'),
          once: true
        });
      });
      
      setTimeout(() => {
        const firstEls = document.querySelectorAll('.reveal-first');
        firstEls.forEach(el => el.classList.add('in'));
      }, 100);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-[100px] px-6 md:px-12 lg:px-24 pb-24">
      <div className="max-w-4xl mx-auto text-center mb-20 reveal-first opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <div className="inline-block bg-[var(--lime)] text-black text-xs font-bold py-1 px-3 rounded mb-6">Security</div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
          <SplitText text="Enterprise-grade protection, built in." delay={40} />
        </h1>
        <p className="text-lg text-[#555] leading-relaxed">
          Your organization's knowledge is your most valuable asset. Memoir is built from the ground up with strict data isolation, read-only guarantees, and advanced permission models.
        </p>
      </div>

      <div className="max-w-6xl mx-auto reveal opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full bg-[var(--gray-light)] rounded-[20px] p-8 md:p-12 border border-black/5 flex flex-col items-start shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shrink-0 mb-8">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 normal-case tracking-normal">Read-Only by Default</h3>
            <p className="text-[#555] leading-relaxed normal-case text-base tracking-normal">
              Memoir requires only read-only access to your source systems (GitHub, Slack, Notion). We ingest data to build the knowledge graph but will <strong>never</strong> write back, modify, or delete your source data.
            </p>
          </div>

          <div className="w-full bg-black text-white rounded-[20px] p-8 md:p-12 border border-white/10 flex flex-col items-start shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-[var(--lime)] rounded-full flex items-center justify-center shrink-0 mb-8">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 normal-case tracking-normal">Strict Data Isolation</h3>
            <p className="text-[#ccc] leading-relaxed normal-case text-base tracking-normal">
              Every node and relationship in the Neo4j graph, and every vector in the Qdrant DB, is strictly partitioned using a unique <code>tenant_id</code>. There is zero crossover risk between client companies. Your context is yours alone.
            </p>
          </div>

          <div className="w-full bg-[var(--gray-light)] rounded-[20px] p-8 md:p-12 border border-black/5 flex flex-col items-start shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shrink-0 mb-8">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 normal-case tracking-normal">Agent IAM & Permissions</h3>
            <p className="text-[#555] leading-relaxed normal-case text-base tracking-normal">
              Our Context API respects the permissions of the querying user. An engineer will only receive insights synthesized from PRs, issues, and channels they actually have access to in the underlying systems.
            </p>
          </div>

          <div className="w-full bg-[#1A1A18] text-white rounded-[20px] p-8 md:p-12 border border-white/5 flex flex-col items-start shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-[var(--lime)] rounded-full flex items-center justify-center shrink-0 mb-8">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 normal-case tracking-normal">Enterprise Deployments</h3>
            <p className="text-[#ccc] leading-relaxed normal-case text-base tracking-normal">
              For large organizations with strict compliance requirements, Memoir offers complete On-Prem / VPC deployments. Keep the entire tri-store architecture and LLM processing within your own cloud perimeter, complete with SSO integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../components/SplitText';
import TiltedCard from '../components/ui/TiltedCard';

gsap.registerPlugin(ScrollTrigger);

export default function Docs() {
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
      <div className="max-w-4xl mx-auto text-center mb-16 reveal-first opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <div className="inline-block bg-[var(--lime)] text-black text-xs font-bold py-1 px-3 rounded mb-6">Documentation</div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
          <SplitText text="The Context API." delay={40} />
        </h1>
        <p className="text-lg text-[#555] leading-relaxed">
          Integrate Memoir directly into your internal tooling. Our REST API allows you to query your organization's knowledge graph programmatically.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-16">
        <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="bg-[var(--lime)] text-black text-xs px-2 py-1 rounded">POST</span>
            /query
          </h2>
          <p className="text-[#555] mb-6">Run a Graph RAG query against the synthesized memory of your organization.</p>
          
          <TiltedCard
            containerHeight="auto"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={4}
            scaleOnHover={1.02}
            showTooltip={false}
          >
            <div className="w-full text-left bg-[#111] rounded-xl border border-black/10 shadow-xl overflow-hidden">
              <div className="bg-[#222] px-4 py-2 border-b border-white/5 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="p-6">
                <pre className="text-sm font-mono text-white/90 leading-relaxed overflow-x-auto whitespace-pre-wrap">
<span className="text-[#b7f250]">curl</span> -X POST https://api.memoir.dev/v1/query \
  -H <span className="text-[#a6e22e]">"X-API-Key: YOUR_KEY"</span> \
  -H <span className="text-[#a6e22e]">"Content-Type: application/json"</span> \
  -d <span className="text-[#e6db74]">'{'{'}
    "question": "Why does the payments service use Redis for caching?",
    "repo": "acme/payments"
  {'}'}'</span>
                </pre>
              </div>
              <div className="bg-[var(--gray-dark)] p-6 border-t border-black/20">
                <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-[#777]">Response</h4>
                <pre className="text-sm font-mono text-white/80 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`{
  "question": "Why does the payments service use Redis for caching?",
  "answer": {
    "summary": "The decision was made in PR #892 by @m.tiwari due to rate limit issues with the previous Memcached setup...",
    "confidence": 0.94
  },
  "decision_trail": [
    {
      "type": "pull_request",
      "id": "PR_892",
      "actor": "m.tiwari",
      "timestamp": "2023-11-12T14:20Z",
      "source_url": "https://github.com/acme/payments/pull/892"
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </TiltedCard>
        </div>

        <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="bg-[#27c93f] text-black text-xs px-2 py-1 rounded">GET</span>
            /stats
          </h2>
          <p className="text-[#555] mb-6">Retrieve live statistics on your knowledge graph's size and resolution metrics.</p>
          
          <TiltedCard
            containerHeight="auto"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={4}
            scaleOnHover={1.02}
            showTooltip={false}
          >
            <div className="w-full text-left bg-[var(--gray-light)] p-6 rounded-xl border border-black/5 shadow-lg">
              <pre className="text-sm font-mono text-black leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`{
  "repos_indexed": 4,
  "total_events": 142050,
  "total_persons": 184,
  "total_links": 34502,
  "graph_nodes": 142234,
  "embeddings_count": 142050
}`}
              </pre>
            </div>
          </TiltedCard>
        </div>

        <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="bg-[var(--lime)] text-black text-xs px-2 py-1 rounded">POST</span>
            /ingest
          </h2>
          <p className="text-[#555] mb-6">Trigger a manual backfill job for a specific integration.</p>
          
          <TiltedCard
            containerHeight="auto"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={4}
            scaleOnHover={1.02}
            showTooltip={false}
          >
            <div className="w-full text-left bg-[var(--gray-light)] p-6 rounded-xl border border-black/5 shadow-lg">
              <pre className="text-sm font-mono text-black leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`// Request
{
  "repo": "acme/frontend",
  "since_days": 365
}

// Response 202 Accepted
{
  "job_id": "job_94a2b1",
  "status": "queued",
  "estimated_events": 4500
}`}
              </pre>
            </div>
          </TiltedCard>
        </div>
      </div>
    </div>
  );
}

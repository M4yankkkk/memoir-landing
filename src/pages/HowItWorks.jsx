import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../components/SplitText';
import ShinyText from '../components/ShinyText';
import MagicBento from '../components/ui/MagicBento';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
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
      
      // Auto-trigger the first items
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
        <div className="inline-block bg-[var(--lime)] text-black text-xs font-bold py-1 px-3 rounded mb-6">Architecture</div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
          <SplitText text="The Tri-Store Database Architecture." delay={40} />
        </h1>
        <p className="text-lg text-[#555] leading-relaxed">
          Memoir orchestrates a robust pipeline using three distinct databases, each serving a specific purpose in building the ultimate knowledge graph.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mb-24 reveal opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <MagicBento 
          cards={[
            {
              color: '#120F17',
              label: '01 / Architecture',
              title: 'Postgres (The Ledger)',
              description: 'Stores the raw, unmodified data fetched from APIs (GitHub, Slack, Notion). Guarantees seamless replayability.'
            },
            {
              color: '#1a1a18',
              label: '02 / Architecture',
              title: 'Neo4j (The Relationships)',
              description: 'Stores Nodes and Edges. This enables complex traversals like "Find concepts related to the author of this message".'
            },
            {
              color: '#120F17',
              label: '03 / Architecture',
              title: 'Qdrant (Semantic Engine)',
              description: 'Stores high-dimensional numerical arrays (embeddings) to enable fuzzy, semantic search across decisions.'
            },
            {
              color: '#120F17',
              label: '04 / Pipeline',
              title: 'Ingestion Layer',
              description: 'Continuous sync from GitHub (PRs, Issues, Commits), Slack, and Notion via custom connectors.'
            },
            {
              color: '#120F17',
              label: '05 / Pipeline',
              title: 'Resolution Worker',
              description: 'Performs Identity Resolution, unifying entities like "Mayank" on Slack and "m.tiwari" on Notion.'
            },
            {
              color: '#120F17',
              label: '06 / Pipeline',
              title: 'Graph RAG API',
              description: 'Searches Qdrant, traverses Neo4j, and packages context into a prompt for the LLM to synthesize an answer.'
            }
          ]}
          glowColor="183, 242, 80"
          textAutoHide={false}
        />
      </div>
    </div>
  );
}

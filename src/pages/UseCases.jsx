import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../components/SplitText';
import SpotlightCard from '../components/SpotlightCard';
import Stack from '../components/ui/Stack';

gsap.registerPlugin(ScrollTrigger);

export default function UseCases() {
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
        <div className="inline-block bg-[var(--lime)] text-black text-xs font-bold py-1 px-3 rounded mb-6">Use Cases</div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
          <SplitText text="Empower your engineering organization." delay={40} />
        </h1>
        <p className="text-lg text-[#555] leading-relaxed">
          From speeding up onboarding to resolving support tickets, see how Memoir transforms your institutional memory into actionable outcomes.
        </p>
      </div>

      <div className="max-w-2xl mx-auto h-[450px] relative reveal opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <Stack 
          randomRotation={true}
          sensitivity={180}
          sendToBackOnClick={false}
          cards={[
            (
              <SpotlightCard className="w-full h-full rounded-2xl p-10 bg-black text-white border border-white/10 flex flex-col justify-center">
                <div className="mb-6 inline-block bg-[var(--lime)] text-black text-xs font-bold py-1 px-2 rounded self-start">01 / Onboarding</div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Accelerate New Engineer Onboarding</h3>
                <p className="text-[#ccc] leading-relaxed mb-6">
                  When a new engineer asks "why is the payments service designed this way?", they no longer need to dig through PR descriptions from 2022, closed GitHub issues, and deleted branches. Memoir provides instant, sourced context.
                </p>
                <div className="text-sm font-medium text-[var(--lime)]">Impact: Cut onboarding time by 40%</div>
              </SpotlightCard>
            ),
            (
              <SpotlightCard className="w-full h-full rounded-2xl p-10 bg-[#120F17] text-white border border-white/5 flex flex-col justify-center">
                <div className="mb-6 inline-block bg-white text-black text-xs font-bold py-1 px-2 rounded self-start">02 / Architecture</div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Trace Architecture Decision Trails</h3>
                <p className="text-[#ccc] leading-relaxed mb-6">
                  Engineering leads can see the full decision trail behind any architectural choice, including exactly who made the call, when it happened, and what alternatives were considered—all sourced directly from GitHub and Slack.
                </p>
                <div className="text-sm font-bold text-white">Impact: Eliminate lost organizational context</div>
              </SpotlightCard>
            ),
            (
              <SpotlightCard className="w-full h-full rounded-2xl p-10 bg-[var(--gray-light)] text-black border border-black/5 flex flex-col justify-center">
                <div className="mb-6 inline-block bg-black text-white text-xs font-bold py-1 px-2 rounded self-start">03 / Support</div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Resolve Support Tickets Faster</h3>
                <p className="text-[#555] leading-relaxed mb-6">
                  By unifying client contexts across Notion, Jira, and internal discussions, dev agencies and support teams can instantly query the graph for related bugs and historical fixes without interrupting core engineering time.
                </p>
                <div className="text-sm font-bold text-black">Impact: Resolve tickets 2x faster</div>
              </SpotlightCard>
            ),
            (
              <SpotlightCard className="w-full h-full rounded-2xl p-10 bg-black text-white border border-white/10 flex flex-col justify-center">
                <div className="mb-6 inline-block bg-[var(--lime)] text-black text-xs font-bold py-1 px-2 rounded self-start">04 / Productivity</div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Eliminate "Who Knows What" Pings</h3>
                <p className="text-[#ccc] leading-relaxed mb-6">
                  Stop relying on the mental memory of senior engineers. Your team can query the autonomous context API directly instead of sending Slack pings to find out who owns a specific microservice.
                </p>
                <div className="text-sm font-medium text-[var(--lime)]">Impact: Save 15 hours/week of interruption</div>
              </SpotlightCard>
            )
          ]} 
        />
      </div>
    </div>
  );
}

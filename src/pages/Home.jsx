import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardSwap, { Card } from '../components/CardSwap';
import LogoLoop from '../components/LogoLoop';
import BorderGlow from '../components/BorderGlow/BorderGlow';
import AnimatedTerminal from '../components/AnimatedTerminal';
import SpotlightCard from '../components/SpotlightCard';
import SplitText from '../components/SplitText';
import ShinyText from '../components/ShinyText';

gsap.registerPlugin(ScrollTrigger);

const techLogos = [
  { node: <img src="https://api.iconify.design/mdi/slack.svg" alt="Slack" className="h-6 w-auto mx-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />, title: "Slack" },
  { node: <img src="https://cdn.simpleicons.org/github/000000" alt="GitHub" className="h-6 w-auto mx-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />, title: "GitHub" },
  { node: <img src="https://cdn.simpleicons.org/linear/000000" alt="Linear" className="h-6 w-auto mx-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />, title: "Linear" },
  { node: <img src="https://cdn.simpleicons.org/notion/000000" alt="Notion" className="h-6 w-auto mx-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />, title: "Notion" },
  { node: <img src="https://cdn.simpleicons.org/confluence/000000" alt="Confluence" className="h-6 w-auto mx-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />, title: "Confluence" },
  { node: <img src="https://cdn.simpleicons.org/jira/000000" alt="Jira" className="h-6 w-auto mx-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />, title: "Jira" },
  { node: <img src="https://cdn.simpleicons.org/googledrive/000000" alt="Google Drive" className="h-6 w-auto mx-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />, title: "Google Drive" },
  { node: <img src="https://cdn.simpleicons.org/figma/000000" alt="Figma" className="h-6 w-auto mx-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />, title: "Figma" },
  { node: <img src="https://cdn.simpleicons.org/asana/000000" alt="Asana" className="h-6 w-auto mx-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />, title: "Asana" },
  { node: <img src="https://cdn.simpleicons.org/discord/000000" alt="Discord" className="h-6 w-auto mx-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />, title: "Discord" }
];

export default function Home() {
  const containerRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroSvgSlotRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      setTimeout(() => {
        if (heroTextRef.current) heroTextRef.current.classList.add('in');
        if (heroSvgSlotRef.current) heroSvgSlotRef.current.classList.add('show');
      }, 100);

      // Init scroll triggers for page sections
      const revealEls = ['logos', 'what', 'grid', 'mid-cta', 'pricing', 'cases'];
      revealEls.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            onEnter: () => el.classList.add('in'),
            once: true
          });
        }
      });

      // Mouse Parallax for Hero
      const onMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(".hero-svg-slot", {
          rotationY: x * 8,
          rotationX: -y * 8,
          x: x * 15,
          y: y * 15,
          ease: "power3.out",
          duration: 1.5
        });
      };

      window.addEventListener('mousemove', onMouseMove);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-[60px]">
      <section id="hero" className="min-h-[calc(100vh-60px)] pt-20 px-6 md:px-12 lg:px-16 xl:px-24 pb-20 flex items-start relative overflow-hidden perspective-[1000px]">
        <div className="max-w-[460px] pt-8 opacity-0 translate-y-6 transition-all duration-700 ease-out z-10 [&.in]:opacity-100 [&.in]:translate-y-0" id="hero-text" ref={heroTextRef}>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            <SplitText text="Turn your" delay={40} /><br />
            <SplitText text="institutional" delay={40} /><br />
            <SplitText text="memory into" delay={40} /><br />
            <ShinyText text="intelligence." className="text-[var(--lime-dark)]" speed={3} />
          </h1>
          <p className="text-base leading-relaxed text-[#444] max-w-[390px] mb-8">Memoir is an autonomous knowledge graph that continuously ingests your engineering org's communication and code history, resolves entities across every tool, and exposes a permissioned context API that turns years of fragmented institutional memory into structured, queryable intelligence.</p>
          <div className="flex items-center gap-[22px]">
            <a href="https://app.memoir.systems/login" className="bg-black text-white px-[22px] py-[12px] rounded-md text-[14px] font-medium flex items-center gap-[8px] transition-all duration-200 hover:bg-[#333] hover:-translate-y-[1px] no-underline">Get started ↗</a>
            <a href="#" className="flex items-center gap-[8px] text-[14px] text-black opacity-65 hover:opacity-100 transition-opacity duration-200 no-underline">
              <span className="w-[30px] h-[30px] rounded-full border-[1.5px] border-current flex items-center justify-center relative after:content-[''] after:border-l-[9px] after:border-l-current after:border-y-[5.5px] after:border-y-transparent after:ml-[2px]"></span>
              Watch overview
            </a>
          </div>
        </div>

        <div className="absolute right-0 md:right-6 lg:right-12 xl:right-16 top-[60px] w-[55%] max-w-[680px] h-[calc(100vh-60px)] flex items-center opacity-0 transition-opacity duration-[10ms] transform-style-3d [&.show]:opacity-100 hero-svg-slot" id="hero-svg-slot" ref={heroSvgSlotRef}>
          <svg className="w-full h-auto overflow-visible drop-shadow-[0_20px_40px_rgba(183,242,80,0.15)]" viewBox="0 0 625 394" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M56.5 85.5C84.5 78 176.298 47.3413 231.498 93.3413C286.698 139.341 299.07 135.841 352.57 135.841" stroke="black" strokeWidth="2.5" fill="none" />
            <path d="M52.5 120.378C82 120.378 160.727 57.2948 217.498 101.341C275.498 146.341 288.998 135.841 342.498 135.841" stroke="black" strokeWidth="2.5" fill="none" />
            <path d="M34 167.5C65 159.5 104.3 182.3 125.5 167.5C152 149 166 71.5 206.5 71.5C251.249 71.5 245 138 337 135.5" stroke="black" strokeWidth="2.5" fill="none" />
            <path d="M349.086 135.842C295.586 135.842 234.922 159.496 164.998 140.341C119.498 127.877 68.5 143.5 40.5 151" stroke="black" strokeWidth="2" opacity=".7" fill="none" />
            <path d="M352.57 135.841C299.07 135.841 228.698 139.341 173.498 93.3413C118.298 47.3413 51.5 44.5 23.5 52" stroke="black" strokeWidth="2" opacity=".65" fill="none" />
            <path d="M352.57 135.841C299.07 135.841 228.711 112.379 173.511 66.379C118.311 20.379 56.5 11 29.5 14.5001" stroke="black" strokeWidth="2" opacity=".55" fill="none" />
            <path d="M47.2748 272.815C73.3693 280.306 123.024 266.823 174.467 220.878C225.911 174.934 285.829 135.954 335.688 135.954" stroke="black" strokeWidth="2.5" fill="none" />
            <path d="M56.5943 212.361C90.1443 207.37 121.56 246.866 174.467 202.873C228.52 157.928 276.442 135.954 326.301 135.954" stroke="black" strokeWidth="2.5" fill="none" />
            <path d="M30.4971 232.335C56.5915 239.826 147.459 207.395 184.713 163.921C222.379 119.967 276.442 135.954 326.301 135.954" stroke="black" strokeWidth="2" opacity=".7" fill="none" />
            <path d="M332.441 135.953C282.582 135.953 214.556 111.485 167.959 163.921C121.777 215.89 63.5839 199.375 37.4894 191.884" stroke="black" strokeWidth="2" opacity=".7" fill="none" />
            <path d="M30.4971 302.779C56.5915 310.27 130.029 226.843 181.472 180.899C232.916 134.955 285.829 135.954 335.688 135.954" stroke="black" strokeWidth="2" opacity=".6" fill="none" />
            <path d="M335.688 135.954H598.497" stroke="black" strokeWidth="3" fill="none" />
            <path d="M299.497 137.422C315.798 133 324.647 123.664 333.496 123.664C350.834 123.664 345.605 163.955 372.151 139.387C396.369 116.975 406.044 116.785 423.382 137.422C442.728 160.45 443.472 141.889 461.572 126.612C474.147 115.999 483.351 134.613 492.776 142.827C503.488 152.163 511.05 142.758 524.911 128.578C540.281 112.855 552.228 140.245 564.964 145.284C573.813 148.784 578.936 139.94 598.497 140.431" stroke="black" strokeWidth="2" fill="none" />
            <path d="M309.497 135.518C325.838 139.94 334.242 146.838 343.113 146.838C360.494 146.838 355.252 106.547 381.864 131.115C406.142 153.527 415.84 153.717 433.221 133.08C452.615 110.053 453.36 128.614 471.505 143.89C484.111 154.503 493.338 135.889 502.786 127.675C513.525 118.34 521.106 127.744 535.001 141.924C550.408 157.648 563.481 135.046 574.219 126.201C578.992 122.27 585.424 123.234 598.497 123.234" stroke="black" strokeWidth="2" fill="none" />
            <path d="M308.497 134.717C324.815 139.206 341.134 143.695 356.053 143.695C368.586 143.695 374.237 113.268 393.352 129.249C418.764 150.495 427.282 152.195 444.639 131.245C464.006 107.867 464.75 126.71 482.87 142.219C495.458 152.993 504.673 134.097 514.108 125.758C524.831 116.28 532.402 125.827 546.278 140.223C561.664 156.185 566.327 141.201 577.05 132.223C581.816 128.232 584.51 129.23 598.497 129.23" stroke="black" strokeWidth="2" fill="none" />
            <path d="M323.497 137.569C339.811 133.207 348.667 123.998 357.522 123.998C374.874 123.998 369.641 163.742 396.209 139.508C420.446 117.4 430.128 117.213 447.48 137.569C466.842 160.284 467.586 141.975 485.7 126.906C498.285 116.438 507.497 134.798 516.929 142.901C527.65 152.11 535.218 142.833 549.09 128.845C564.472 113.336 566.802 128.905 577.523 137.629C582.287 141.507 582.184 146.838 598.497 146.838" stroke="#B7F250" strokeWidth="2.5" fill="none" />
            <circle cx="607.5" cy="135.029" r="16" fill="#B7F250" stroke="black" strokeWidth="2" />
            <g transform="translate(599.5, 127.029)">
              <rect width="4" height="4" fill="#111111" />
              <rect x="6" width="4" height="4" fill="#111111" />
              <rect x="12" width="4" height="4" fill="#111111" />
              <rect y="6" width="4" height="4" fill="#111111" />
              <rect x="6" y="6" width="4" height="4" fill="#111111" />
              <rect y="12" width="4" height="4" fill="#111111" />
              <rect x="6" y="12" width="4" height="4" fill="#111111" />
              <rect x="12" y="12" width="4" height="4" fill="#111111" />
              <rect x="12" y="6" width="4" height="4" fill="#111111" />
            </g>
            <circle cx="47" cy="272.529" r="3" fill="#B7F250" stroke="black" />
            <circle cx="59.5" cy="213.5" r="3" fill="#B7F250" stroke="black" />
            <circle cx="38.5" cy="192.5" r="3" fill="#B7F250" stroke="black" />
            <circle cx="42.5" cy="150.5" r="3" fill="#B7F250" stroke="black" />
            <circle cx="52.5" cy="120.5" r="3" fill="#B7F250" stroke="black" />
            <circle cx="23.5" cy="120.5" r="3" fill="#B7F250" stroke="black" />
            <circle cx="23.5" cy="52.5" r="3" fill="#B7F250" stroke="black" />
            <circle cx="30" cy="169" r="16" fill="#B7F250" stroke="black" strokeWidth="2" />
            <circle cx="42" cy="83" r="16" fill="#B7F250" stroke="black" strokeWidth="2" />
            <circle cx="36" cy="236" r="16" fill="#B7F250" stroke="black" strokeWidth="2" />
            <circle cx="17" cy="17" r="16" fill="#B7F250" stroke="black" strokeWidth="2" />
            <path d="M13.9376 11.2601C14.4516 11.4374 14.9405 11.6833 15.3915 11.9916C16.0289 11.8248 16.6843 11.7412 17.3422 11.7426C18.0216 11.7426 18.6771 11.8293 19.2915 11.9909C19.7423 11.6829 20.2309 11.4372 20.7447 11.2601C21.2216 11.0943 21.901 10.8258 22.3047 11.2825C22.5784 11.5929 22.6468 12.1132 22.6954 12.5104C22.7501 12.9538 22.7631 13.5314 22.6194 14.1049C23.1688 14.83 23.5 15.6951 23.5 16.6377C23.5 18.0657 22.7433 19.3056 21.6232 20.1643C21.0839 20.572 20.4862 20.8919 19.8511 21.1126C19.9976 21.4553 20.079 21.8343 20.079 22.2322V24.3301C20.079 24.5156 20.0069 24.6935 19.8786 24.8246C19.7503 24.9557 19.5762 25.0294 19.3948 25.0294H15.2896C15.1081 25.0294 14.9341 24.9557 14.8058 24.8246C14.6775 24.6935 14.6054 24.5156 14.6054 24.3301V23.6371C13.952 23.7189 13.4039 23.6462 12.938 23.4441C12.4508 23.2329 12.1115 22.9056 11.8562 22.5923C11.614 22.2958 11.3499 21.6273 10.9682 21.4972C10.8829 21.4682 10.804 21.4223 10.7361 21.3621C10.6682 21.302 10.6126 21.2287 10.5723 21.1466C10.4911 20.9807 10.4777 20.7886 10.5351 20.6126C10.5924 20.4366 10.7158 20.2911 10.8781 20.2081C11.0404 20.125 11.2284 20.1113 11.4006 20.1699C11.8562 20.3252 12.1532 20.6609 12.3564 20.9308C12.6848 21.3644 12.9517 21.9308 13.4716 22.1567C13.6858 22.2497 13.9999 22.3105 14.4911 22.242L14.6054 22.2182C14.6069 21.8377 14.6845 21.4615 14.8332 21.1126C14.1982 20.8919 13.6004 20.572 13.0611 20.1643C11.9411 19.3056 11.1844 18.0664 11.1844 16.6377C11.1844 15.6965 11.5148 14.8321 12.0629 14.1077C11.9192 13.5342 11.9315 12.9552 11.9862 12.5111L11.9897 12.4846C12.0396 12.0776 12.0978 11.5985 12.3769 11.2825C12.7806 10.8258 13.4607 11.095 13.9369 11.2608L13.9376 11.2601Z" fill="black" />
            <path d="M22.5 283.029C31.3366 283.029 38.5 290.193 38.5 299.029C38.5 307.866 31.3366 315.029 22.5 315.029C13.6634 315.029 6.5 307.866 6.5 299.029C6.5 290.193 13.6634 283.029 22.5 283.029Z" fill="#B7F250" stroke="black" strokeWidth="2" />
            <image href="https://api.iconify.design/mdi/slack.svg" x="33" y="74" width="18" height="18" />
            <image href="https://cdn.simpleicons.org/notion/000000" x="21" y="160" width="18" height="18" />
            <image href="https://cdn.simpleicons.org/linear/000000" x="27" y="227" width="18" height="18" />
            <image href="https://cdn.simpleicons.org/discord/000000" x="13.5" y="290.029" width="18" height="18" />
          </svg>
        </div>
      </section>

      <section id="logos" className="py-24 px-6 md:px-12 border-t border-[var(--gray-mid)] opacity-0 translate-y-5 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-[var(--gray-text)] mb-14">Ingests from every tool — Resolves across everything</p>
        <div className="h-20 relative overflow-hidden">
          <LogoLoop
            logos={techLogos}
            speed={40}
            direction="left"
            logoHeight={24}
            gap={0}
            hoverSpeed={0}
            fadeOut
            fadeOutColor="#ffffff"
          />
        </div>
      </section>

      <section id="what" className="pt-20 pl-6 pr-6 md:pr-12 md:pl-16 lg:pl-24 xl:pl-32 pb-14 opacity-0 translate-y-5 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-12">
          <div><div className="inline-block bg-[var(--lime)] text-black text-xs font-bold py-1 px-3 rounded mb-4 md:mb-0">What we do</div></div>
          <p className="text-base leading-relaxed text-[#444] max-w-[400px]">Memoir connects fragmented knowledge across tools and people—so your team always has the right context at their fingertips.</p>
        </div>
      </section>

      <section id="grid" className="pl-6 pr-6 md:pr-12 md:pl-16 lg:pl-24 xl:pl-32 pb-32 pt-10 opacity-0 translate-y-5 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
        <div className="lg:w-1/2 max-w-[500px]">
          <div className="inline-block bg-[var(--lime)] text-black text-xs font-bold py-1 px-3 rounded mb-6">Capabilities</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-6"><SplitText text="Everything you need to unify your org." delay={30} /></h2>
          <p className="text-base text-[#555] leading-relaxed mb-8">Memoir seamlessly bridges the gap between disparate tools, providing an autonomous graph that automatically resolves identities and builds your context API on the fly.</p>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-black"></div> Continuous ingestion</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-black"></div> Real-time graph resolutions</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-black"></div> Permission-aware querying</li>
          </ul>
        </div>

        <div className="lg:w-1/2 flex lg:justify-start justify-center relative lg:-translate-x-40 lg:mt-40 mt-16 perspective-[1200px] w-full">
          <CardSwap pauseOnHover={true} width={480} height={420} delay={3000}>
            <Card className="bg-black text-white rounded-2xl p-8 flex flex-col justify-between shadow-xl border border-white/10">
              <div className="relative z-10">
                <p className="text-2xl font-extrabold leading-normal tracking-tight inline box-decoration-clone bg-[var(--lime)] text-black px-2 py-1 rounded">Autonomous<br />knowledge graph</p>
                <p className="text-sm leading-relaxed mt-4 opacity-80">Memoir connects Slack, Notion, GitHub, and Discord, dynamically mapping concepts and generating relationships automatically.</p>
              </div>
              <a href="#" className="flex items-center gap-2 text-sm text-white no-underline mt-5 w-fit font-medium"><span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs">↗</span></a>
            </Card>

            <Card className="bg-black text-white rounded-2xl p-8 flex flex-col justify-between shadow-xl border border-white/10">
              <div className="relative z-10">
                <p className="text-2xl font-extrabold leading-normal tracking-tight inline box-decoration-clone bg-white text-black px-2 py-1 rounded">Identity Resolution<br />across tools</p>
                <p className="text-sm leading-relaxed mt-4 opacity-80">We automatically map disparate identities—unifying 'm.tiwari' on Notion with 'Mayank' on Discord into a single entity.</p>
              </div>
              <a href="#" className="flex items-center gap-2 text-sm text-white no-underline mt-5 w-fit font-medium"><span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs">↗</span></a>
            </Card>

            <Card className="bg-black text-white rounded-2xl p-8 flex flex-col justify-between shadow-xl border border-white/10">
              <div className="relative z-10">
                <p className="text-2xl font-extrabold leading-normal tracking-tight inline box-decoration-clone bg-[var(--lime)] text-black px-2 py-1 rounded">Context API for<br />your workflows</p>
                <p className="text-sm leading-relaxed mt-4 opacity-80">Bring intelligence to your internal tools. We expose a strict, permissioned Context API over your engineering organization.</p>
              </div>
              <a href="#" className="flex items-center gap-2 text-sm text-white no-underline mt-5 w-fit font-medium"><span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs">↗</span></a>
            </Card>

            <Card className="bg-black text-white rounded-2xl p-8 flex flex-col justify-between shadow-xl border border-white/10">
              <div className="relative z-10">
                <p className="text-2xl font-extrabold leading-normal tracking-tight inline box-decoration-clone bg-white text-black px-2 py-1 rounded">Query anything.<br />Get answers.</p>
                <p className="text-sm leading-relaxed mt-4 opacity-80">Ask plain-English questions. Memoir runs RAG across our tri-store (Vector + Graph + Postgres) to synthesize exact citations.</p>
              </div>
              <a href="#" className="flex items-center gap-2 text-sm text-white no-underline mt-5 w-fit font-medium"><span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs">↗</span></a>
            </Card>
          </CardSwap>
        </div>
      </section>


      <div id="mid-cta" className="mx-6 md:mx-12 mb-24 bg-[var(--gray-light)] rounded-3xl py-16 px-8 md:px-14 flex flex-col md:flex-row-reverse items-center justify-between text-center md:text-left gap-10 opacity-0 translate-y-5 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4"><SplitText text="Make years of knowledge instantly useful." delay={30} /></h2>
          <p className="text-base text-[#555] leading-relaxed max-w-[380px] mx-auto md:mx-0 mb-8">Memoir transforms scattered conversations, docs, and code into structured, queryable intelligence—so your team moves faster.</p>
          <a href="https://app.memoir.systems/login" className="bg-black text-white px-6 py-3 rounded-md text-sm font-medium inline-flex items-center gap-2 transition-all duration-200 hover:bg-[#333] hover:-translate-y-0.5 no-underline">Get started ↗</a>
        </div>
        <AnimatedTerminal />
      </div>

      <section id="pricing" className="px-6 md:px-12 pb-24 opacity-0 translate-y-5 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex justify-center"><div className="inline-block bg-[var(--lime)] text-black text-xs font-bold py-1 px-3 rounded">Pricing</div></div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mt-5"><SplitText text="Simple, transparent pricing." delay={40} /></h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

          <SpotlightCard className="rounded-2xl p-8 min-h-[560px] flex flex-col relative bg-[var(--gray-light)] text-black border border-black/5 group">
            <div>
              <p className="text-xl font-extrabold leading-tight tracking-tight">Startup</p>
              <p className="text-4xl font-black mt-4">$299<span className="text-base text-[#666] font-medium">/mo</span></p>
              <p className="text-sm text-[#555] mt-3">Essential context for growing teams.</p>
            </div>
            <ul className="mt-8 space-y-4 text-sm text-[#444] flex-1">
              <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Up to 3 Integrations</li>
              <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>500k ingested items</li>
              <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Up to 5 Team Members</li>
              <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Shared Knowledge Graph</li>
              <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Standard Email Support</li>
            </ul>
            <a href="https://app.memoir.systems/login" className="w-full flex items-center justify-center gap-2 text-sm font-medium text-black bg-white border border-black/10 py-3 rounded-md hover:bg-black hover:text-white transition-colors mt-8 no-underline">Get Started</a>
          </SpotlightCard>

          <BorderGlow
            className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_var(--lime)]"
            backgroundColor="#1a1a18"
            glowColor="82 86 63"
            colors={['#b7f250', '#8ec800', '#d4f796']}
            borderRadius={16}
            glowRadius={40}
            glowIntensity={1.2}
            animated={true}
          >
            <div className="relative w-full h-full bg-[var(--gray-dark)] rounded-[14px] p-8 min-h-[560px] flex flex-col z-10">
              <div>
                <p className="text-xl font-extrabold leading-tight tracking-tight inline bg-[var(--lime)] text-black px-2 py-0.5 rounded">Growth</p>
                <p className="text-4xl font-black mt-4 text-white">$899<span className="text-base text-[#aaa] font-medium">/mo</span></p>
                <p className="text-sm text-[#aaa] mt-3">Advanced capabilities for scale.</p>
              </div>
              <ul className="mt-8 space-y-4 text-sm text-[#ddd] flex-1">
                <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--lime)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Unlimited Integrations</li>
                <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--lime)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>5M ingested items</li>
                <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--lime)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Up to 25 Team Members</li>
                <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--lime)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Advanced Graph Analytics</li>
                <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--lime)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Custom Roles & Permissions</li>
                <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--lime)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Priority Slack Support</li>
              </ul>
              <a href="https://app.memoir.systems/login" className="w-full bg-[var(--lime)] text-black px-6 py-3 rounded-md text-sm font-bold flex items-center justify-center transition-all duration-200 hover:bg-[#a6de45] mt-8 no-underline">Start Free Trial</a>
            </div>
          </BorderGlow>

          <SpotlightCard className="rounded-2xl p-8 min-h-[560px] flex flex-col relative bg-[var(--gray-light)] text-black border border-black/5 group">
            <div>
              <p className="text-xl font-extrabold leading-tight tracking-tight">Enterprise</p>
              <p className="text-4xl font-black mt-4">Custom</p>
              <p className="text-sm text-[#555] mt-3">Bespoke deployment for large orgs.</p>
            </div>
            <ul className="mt-8 space-y-4 text-sm text-[#444] flex-1">
              <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Unlimited Everything</li>
              <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>On-Prem/VPC Deployment</li>
              <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Custom Fine-tuning</li>
              <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Dedicated Success Manager</li>
              <li className="flex items-start"><svg className="w-4 h-4 mr-3 mt-0.5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>SSO & Advanced Security</li>
            </ul>
            <a href="#" className="w-full flex items-center justify-center gap-2 text-sm font-medium text-black bg-white border border-black/10 py-3 rounded-md hover:bg-black hover:text-white transition-colors mt-8 no-underline">Contact Sales</a>
          </SpotlightCard>
        </div>
      </section>

      <section id="cases" className="px-6 md:px-12 pb-24 opacity-0 translate-y-5 transition-all duration-700 ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-10 px-0 md:px-5 mb-8">
          <div><div className="inline-block bg-[var(--lime)] text-black text-xs font-bold py-1 px-3 rounded">Case studies</div></div>
          <p className="text-sm text-[#555] max-w-[300px] leading-relaxed">See how engineering teams turn institutional memory into real impact.</p>
        </div>
        <div className="bg-[var(--gray-dark)] rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_1px_1fr_1px_1fr] gap-8 md:gap-10">
          <div>
            <p className="text-[#ccc] text-sm leading-relaxed mb-6">A Series B fintech used Memoir to index 2M+ Slack messages and GitHub PRs, cutting engineer onboarding time by 40%.</p>
            <a href="#" className="flex items-center gap-2 text-sm font-medium text-white no-underline hover:text-[var(--lime)] transition-colors">Read more ↗</a>
          </div>
          <div className="hidden md:block bg-white/10"></div>
          <div>
            <p className="text-[#ccc] text-sm leading-relaxed mb-6">A remote-first dev agency deployed our Graph RAG to unify client contexts across Notion and Jira, resolving support tickets 2x faster.</p>
            <a href="#" className="flex items-center gap-2 text-sm font-medium text-white no-underline hover:text-[var(--lime)] transition-colors">Read more ↗</a>
          </div>
          <div className="hidden md:block bg-white/10"></div>
          <div>
            <p className="text-[#ccc] text-sm leading-relaxed mb-6">An enterprise engineering team eliminated 15 hours/week of "who knows what" Slack pings by querying our autonomous context API.</p>
            <a href="#" className="flex items-center gap-2 text-sm font-medium text-white no-underline hover:text-[var(--lime)] transition-colors">Read more ↗</a>
          </div>
        </div>
      </section>
    </div>
  );
}

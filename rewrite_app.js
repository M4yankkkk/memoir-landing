const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// NAVBAR
content = content.replace(
  /<nav id="navbar" ref={navbarRef}>([\s\S]*?)<\/nav>/,
  `<nav id="navbar" ref={navbarRef} className="fixed top-0 inset-x-0 z-[1000] flex items-center justify-between px-6 md:px-12 h-[60px] bg-white/95 backdrop-blur-md border-b border-black/5 opacity-0 -translate-y-[14px] transition-all duration-[550ms] ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
        <a href="#" className="flex items-center gap-2 font-bold text-[15px] tracking-[-0.3px] text-inherit no-underline">
          <img src="/logo.svg" alt="Memoir Logo" className="h-4" />
        </a>
        <ul className="hidden md:flex gap-7 list-none">
          <li><a href="#" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">Product</a></li>
          <li><a href="#" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">How it works</a></li>
          <li><a href="#" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">Use cases</a></li>
          <li><a href="#" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">Security</a></li>
          <li><a href="#" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">Docs</a></li>
          <li><a href="#" className="text-[13.5px] text-black no-underline opacity-70 hover:opacity-100 transition-opacity duration-200">Pricing</a></li>
        </ul>
        <a href="#" className="bg-white border-[1.5px] border-black text-black text-[13px] font-medium py-[7px] px-4 rounded-md cursor-pointer flex items-center gap-[6px] no-underline transition-all duration-200 hover:bg-black hover:text-white hover:-translate-y-[1px]">Request a Demo ↗</a>
      </nav>`
);

// HERO
content = content.replace(
  /<section id="hero">([\s\S]*?)<div className="hero-svg-slot"/,
  `<section id="hero" className="min-h-screen pt-[100px] px-6 md:px-12 pb-[80px] flex items-start relative overflow-hidden perspective-[1000px]">
          <div className="max-w-[460px] pt-[30px] opacity-0 translate-y-[22px] transition-all duration-[650ms] ease-out z-10 [&.in]:opacity-100 [&.in]:translate-y-0" id="hero-text" ref={heroTextRef}>
            <h1 className="text-[clamp(40px,4.8vw,64px)] font-black leading-[1.06] tracking-[-2.5px] mb-[18px]">
              Turn your<br/>
              institutional<br/>
              memory into<br/>
              <span className="text-lime-dark">intelligence.</span>
            </h1>
            <p className="text-[14.5px] leading-[1.68] text-[#444] max-w-[390px] mb-[36px]">Memoir is an autonomous knowledge graph that continuously ingests your engineering org's communication and code history, resolves entities across every tool, and exposes a permissioned context API that turns years of fragmented institutional memory into structured, queryable intelligence.</p>
            <div className="flex items-center gap-[22px]">
              <a href="#" className="bg-black text-white px-[22px] py-[12px] rounded-md text-[14px] font-medium flex items-center gap-[8px] transition-all duration-200 hover:bg-[#333] hover:-translate-y-[1px]">Request a demo ↗</a>
              <a href="#" className="flex items-center gap-[8px] text-[14px] text-black opacity-65 hover:opacity-100 transition-opacity duration-200">
                <span className="w-[30px] h-[30px] rounded-full border-[1.5px] border-current flex items-center justify-center relative after:content-[''] after:border-l-[9px] after:border-l-current after:border-y-[5.5px] after:border-y-transparent after:ml-[2px]"></span>
                Watch overview
              </a>
            </div>
          </div>

          <div className="hero-svg-slot absolute right-0 top-[60px] w-[55%] max-w-[680px] h-[calc(100vh-60px)] flex items-center opacity-0 transition-opacity duration-10 transform-style-3d [&.show]:opacity-100 drop-shadow-[0_20px_40px_rgba(183,242,80,0.15)]"`
);

// LOGOS
content = content.replace(
  /<section id="logos">([\s\S]*?)<\/section>/,
  `<section id="logos" className="py-[44px] px-6 md:px-12 border-t border-gray-mid opacity-0 translate-y-[20px] transition-all duration-[600ms] ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
          <p className="text-center text-[13px] text-gray-text mb-[22px]">Ingests from every tool. <em className="not-italic font-italic text-black">Resolves across everything.</em></p>
          <div className="h-[80px] relative overflow-hidden mt-[30px]">
            <LogoLoop
              logos={techLogos}
              speed={50}
              direction="left"
              logoHeight={24}
              gap={0}
              hoverSpeed={0}
              fadeOut
              fadeOutColor="#ffffff"
            />
          </div>
        </section>`
);

// WHAT
content = content.replace(
  /<section id="what">([\s\S]*?)<\/section>/,
  `<section id="what" className="pt-[72px] px-6 md:px-12 pb-[56px] opacity-0 translate-y-[20px] transition-all duration-[600ms] ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
          <div className="flex flex-col md:flex-row items-start gap-[16px] md:gap-[48px]">
            <div><div className="inline-block bg-lime text-black text-[12px] font-bold py-[4px] px-[12px] rounded-[4px] mb-[16px]">What we do</div></div>
            <p className="text-[15px] leading-[1.68] text-[#444] max-w-[400px]">Memoir connects fragmented knowledge across tools and people—so your team always has the right context at their fingertips.</p>
          </div>
        </section>`
);

// MID CTA
content = content.replace(
  /<div id="mid-cta">([\s\S]*?)<\/div>\s*<\/div>/,
  `<div id="mid-cta" className="mx-5 md:mx-10 mb-[80px] bg-gray-light rounded-[20px] py-[60px] px-8 md:px-[56px] flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-[40px] opacity-0 translate-y-[20px] transition-all duration-[600ms] ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
          <div>
            <h2 className="text-[clamp(28px,3vw,42px)] font-black tracking-[-1.2px] leading-[1.08] mb-[14px]">Make years of knowledge instantly useful.</h2>
            <p className="text-[14px] text-[#555] leading-[1.65] max-w-[380px] mx-auto md:mx-0 mb-[28px]">Memoir transforms scattered conversations, docs, and code into structured, queryable intelligence—so your team moves faster.</p>
            <a href="#" className="bg-black text-white px-[22px] py-[12px] rounded-md text-[14px] font-medium inline-flex items-center gap-[8px] transition-all duration-200 hover:bg-[#333] hover:-translate-y-[1px]">Request a demo ↗</a>
          </div>
          <div className="flex flex-col items-center gap-[18px] shrink-0">
            <div className="w-[14px] h-[14px] bg-lime border-[2px] border-black rounded-full"></div>
            <div className="w-[58px] h-[58px] bg-black rounded-full flex items-center justify-center text-white text-[20px] tracking-[2px]">···</div>
            <div className="w-[14px] h-[14px] bg-lime border-[2px] border-black rounded-full transform rotate-[45deg] scale-[1.6]"></div>
          </div>
        </div>`
);

// CASES
content = content.replace(
  /<section id="cases">([\s\S]*?)<\/section>/,
  `<section id="cases" className="px-5 md:px-10 pb-[80px] opacity-0 translate-y-[20px] transition-all duration-[600ms] ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
          <div className="flex flex-col md:flex-row items-start gap-[16px] md:gap-[36px] px-0 md:px-[20px] mb-[20px]">
            <div><div className="inline-block bg-lime text-black text-[12px] font-bold py-[4px] px-[12px] rounded-[4px]">Case studies</div></div>
            <p className="text-[14px] text-[#555] max-w-[300px] leading-[1.55]">See how engineering teams turn institutional memory into real impact.</p>
          </div>
          <div className="bg-gray-dark rounded-[16px] p-6 md:p-[40px] grid grid-cols-1 md:grid-cols-[1fr_1px_1fr_1px_1fr] gap-[24px] md:gap-[36px]">
            <div>
              <p className="text-[#ccc] text-[13.5px] leading-[1.7] mb-[20px]">A Series B fintech used Memoir to index 2M+ Slack messages and GitHub PRs, cutting engineer onboarding time by 40%.</p>
              <a href="#" className="flex items-center gap-[6px] text-[13px] font-medium text-white no-underline hover:text-lime transition-colors">Read more ↗</a>
            </div>
            <div className="hidden md:block bg-white/10"></div>
            <div>
              <p className="text-[#ccc] text-[13.5px] leading-[1.7] mb-[20px]">A remote-first dev agency deployed our Graph RAG to unify client contexts across Notion and Jira, resolving support tickets 2x faster.</p>
              <a href="#" className="flex items-center gap-[6px] text-[13px] font-medium text-white no-underline hover:text-lime transition-colors">Read more ↗</a>
            </div>
            <div className="hidden md:block bg-white/10"></div>
            <div>
              <p className="text-[#ccc] text-[13.5px] leading-[1.7] mb-[20px]">An enterprise engineering team eliminated 15 hours/week of "who knows what" Slack pings by querying our autonomous context API.</p>
              <a href="#" className="flex items-center gap-[6px] text-[13px] font-medium text-white no-underline hover:text-lime transition-colors">Read more ↗</a>
            </div>
          </div>
        </section>`
);

// PRICING (just updating classes inside it as well)
content = content.replace(
  /<section id="pricing">([\s\S]*?)<\/section>/,
  `<section id="pricing" className="px-5 md:px-10 pb-[80px] opacity-0 translate-y-[20px] transition-all duration-[600ms] ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
          <div className="flex flex-col items-center text-center mb-[40px]">
            <div className="flex justify-center"><div className="inline-block bg-lime text-black text-[12px] font-bold py-[4px] px-[12px] rounded-[4px]">Pricing</div></div>
            <h2 className="text-[clamp(28px,3vw,42px)] font-black tracking-[-1.2px] leading-[1.08] mt-[16px]">Simple, transparent pricing.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] p-0">
            <div className="rounded-[16px] p-[30px] min-h-[320px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] bg-gray-light text-black">
              <div>
                <p className="text-[20px] font-extrabold leading-[1.2] tracking-[-0.5px]">Startup</p>
                <p className="text-[36px] font-black mt-[12px]">$299<span className="text-[16px] text-[#666] font-medium">/mo</span></p>
                <p className="text-[14px] text-[#555] mt-[16px] leading-[1.6]">Up to 3 integrations and 500k ingested documents/messages.</p>
              </div>
              <a href="#" className="flex items-center justify-center gap-2 text-[14px] font-medium text-black opacity-65 hover:opacity-100 transition-opacity mt-[24px]">Get Started ↗</a>
            </div>
            <div className="rounded-[16px] p-[30px] min-h-[320px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] bg-gray-dark text-white">
              <div>
                <p className="text-[20px] font-extrabold leading-[1.2] tracking-[-0.5px] inline bg-lime text-black px-2 py-0.5 rounded-[3px]">Growth</p>
                <p className="text-[36px] font-black mt-[12px] text-white">$899<span className="text-[16px] text-[#aaa] font-medium">/mo</span></p>
                <p className="text-[14px] text-[#ccc] mt-[16px] leading-[1.6]">Unlimited integrations, 5M documents/messages, and advanced graph analytics.</p>
              </div>
              <a href="#" className="bg-lime text-black px-[22px] py-[12px] rounded-md text-[14px] font-medium flex items-center justify-center gap-[8px] transition-all duration-200 hover:-translate-y-[1px] mt-[24px]">Start Free Trial ↗</a>
            </div>
            <div className="rounded-[16px] p-[30px] min-h-[320px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] bg-gray-light text-black">
              <div>
                <p className="text-[20px] font-extrabold leading-[1.2] tracking-[-0.5px]">Enterprise</p>
                <p className="text-[36px] font-black mt-[12px]">Custom</p>
                <p className="text-[14px] text-[#555] mt-[16px] leading-[1.6]">VPC deployment, SLA, custom integrations, and unlimited data.</p>
              </div>
              <a href="#" className="flex items-center justify-center gap-2 text-[14px] font-medium text-black opacity-65 hover:opacity-100 transition-opacity mt-[24px]">Contact Sales ↗</a>
            </div>
          </div>
        </section>`
);

// GRID
content = content.replace(
  /<section id="grid" style={{ display: 'block', height: '500px', position: 'relative' }}>([\s\S]*?)<\/section>/,
  `<section id="grid" className="block h-[500px] relative px-5 md:px-10 pb-[80px] opacity-0 translate-y-[20px] transition-all duration-[600ms] ease-out [&.in]:opacity-100 [&.in]:translate-y-0">
          <CardSwap
            width={400}
            height={300}
            cardDistance={60}
            verticalDistance={70}
            delay={3000}
            pauseOnHover={false}
          >
            <Card customClass="bg-gray-light text-black rounded-[16px] p-[30px] min-h-[240px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] group">
              <div>
                <p className="text-[22px] font-extrabold leading-[1.2] tracking-[-0.5px] inline bg-lime text-black px-1.5 py-[1px] rounded-[3px] box-decoration-clone">Autonomous<br/>knowledge graph</p>
                <p className="text-[15px] leading-[1.5] mt-4 opacity-80">Memoir connects Slack, Notion, GitHub, and Discord, dynamically mapping concepts and generating relationships automatically.</p>
              </div>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-[130px] h-[130px] opacity-15" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="55" stroke="#000" strokeWidth="1"/><circle cx="60" cy="60" r="36" stroke="#000" strokeWidth="1"/><circle cx="60" cy="60" r="18" stroke="#000" strokeWidth="1"/></svg>
              <a href="#" className="flex items-center gap-2 text-[13px] no-underline mt-5 w-fit transition-transform duration-200 group-hover:translate-x-1 text-black"><span className="w-7 h-7 rounded-full border-[1.5px] border-current flex items-center justify-center text-[12px]">↗</span> Learn more</a>
            </Card>
            <Card customClass="bg-gray-dark text-white rounded-[16px] p-[30px] min-h-[240px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] group">
              <div>
                <p className="text-[22px] font-extrabold leading-[1.2] tracking-[-0.5px] inline bg-lime text-black px-1.5 py-[1px] rounded-[3px] box-decoration-clone">Identity Resolution<br/>across tools</p>
                <p className="text-[15px] leading-[1.5] mt-4 opacity-80">We automatically map disparate identities—unifying 'm.tiwari' on Notion with 'Mayank' on Discord into a single entity.</p>
              </div>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-[130px] h-[130px] opacity-15" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="55" stroke="#fff" strokeWidth="1"/><circle cx="60" cy="60" r="36" stroke="#fff" strokeWidth="1"/><circle cx="60" cy="60" r="18" stroke="#fff" strokeWidth="1"/></svg>
              <a href="#" className="flex items-center gap-2 text-[13px] no-underline mt-5 w-fit transition-transform duration-200 group-hover:translate-x-1 text-white"><span className="w-7 h-7 rounded-full border-[1.5px] border-current flex items-center justify-center text-[12px]">↗</span> Learn more</a>
            </Card>
            <Card customClass="bg-gray-dark text-white rounded-[16px] p-[30px] min-h-[240px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] group">
              <div>
                <p className="text-[22px] font-extrabold leading-[1.2] tracking-[-0.5px] inline bg-lime text-black px-1.5 py-[1px] rounded-[3px] box-decoration-clone">Context API for<br/>your workflows</p>
                <p className="text-[15px] leading-[1.5] mt-4 opacity-80">Bring intelligence to your internal tools. We expose a strict, permissioned Context API over your engineering organization.</p>
              </div>
              <a href="#" className="flex items-center gap-2 text-[13px] no-underline mt-5 w-fit transition-transform duration-200 group-hover:translate-x-1 text-white"><span className="w-7 h-7 rounded-full border-[1.5px] border-current flex items-center justify-center text-[12px]">↗</span> Learn more</a>
            </Card>
            <Card customClass="bg-gray-light text-black rounded-[16px] p-[30px] min-h-[240px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] group">
              <div>
                <p className="text-[22px] font-extrabold leading-[1.2] tracking-[-0.5px] inline bg-lime text-black px-1.5 py-[1px] rounded-[3px] box-decoration-clone">Query anything.<br/>Get answers.</p>
                <p className="text-[15px] leading-[1.5] mt-4 opacity-80">Ask plain-English questions. Memoir runs RAG across our tri-store (Vector + Graph + Postgres) to synthesize exact citations.</p>
              </div>
              <a href="#" className="flex items-center gap-2 text-[13px] no-underline mt-5 w-fit transition-transform duration-200 group-hover:translate-x-1 text-black"><span className="w-7 h-7 rounded-full border-[1.5px] border-current flex items-center justify-center text-[12px]">↗</span> Learn more</a>
            </Card>
          </CardSwap>
        </section>`
);

fs.writeFileSync('src/App.jsx', content);

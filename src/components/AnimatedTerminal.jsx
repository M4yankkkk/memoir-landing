import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, delay = 40, onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  
  useEffect(() => {
    let i = 0;
    setCurrentText('');
    const intervalId = setInterval(() => {
      setCurrentText(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, delay);
    return () => clearInterval(intervalId);
  }, [text, delay, onComplete]);

  return <span>{currentText}</span>;
};

const AnimatedTerminal = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence timing
    const sequence = [
      { step: 1, delay: 1000 }, // start typing ingest command
      { step: 2, delay: 3000 }, // show connecting
      { step: 3, delay: 3800 }, // show indexing
      { step: 4, delay: 4800 }, // show synced
      { step: 5, delay: 6000 }, // start typing query
      { step: 6, delay: 8500 }, // show json response
      { step: 0, delay: 13000 } // reset loop
    ];

    let timeouts = [];
    
    const runSequence = () => {
      setStep(0);
      timeouts = sequence.map(s => setTimeout(() => setStep(s.step), s.delay));
    };

    runSequence();

    const loop = setInterval(() => {
      runSequence();
    }, 13500);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, []);

  return (
    <div className="w-full md:w-[450px] lg:w-[500px] shrink-0 bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl border border-black/10">
      {/* Mac Title Bar */}
      <div className="bg-[#1a1a18] px-4 py-3 flex items-center gap-2 border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-white/20"></div>
        <div className="w-3 h-3 rounded-full bg-white/20"></div>
        <div className="w-3 h-3 rounded-full bg-[var(--lime)]"></div>
        <div className="flex-1 text-center text-xs text-gray-500 font-mono tracking-widest mr-8">memoir-cli</div>
      </div>
      
      {/* Terminal Content */}
      <div className="p-6 font-mono text-xs md:text-sm leading-relaxed text-[#ccc] overflow-hidden text-left h-[340px]">
        
        {/* Step 0/1: Ingest Command */}
        <div className="text-[var(--lime)]">
          <span className="text-white mr-2">~</span>$ {step >= 1 ? <Typewriter text="memoir ingest --source all" /> : null}
          {step < 2 && <span className="inline-block w-2 h-4 bg-[var(--lime)] animate-pulse align-middle ml-1"></span>}
        </div>
        
        {step >= 2 && (
          <div className="text-gray-500 mt-1">→ Connecting to Slack, Notion, GitHub...</div>
        )}
        
        {step >= 3 && (
          <div className="text-gray-500">→ Indexing 14,204 items...</div>
        )}
        
        {step >= 4 && (
          <div className="text-[#a6de45] mb-5">✓ Synced. Identity resolution applied.</div>
        )}
        
        {/* Step 4+: Query Command */}
        {step >= 4 && (
          <div className="text-[var(--lime)]">
            <span className="text-white mr-2">~</span>$ {step >= 5 ? <Typewriter text='memoir query "Who worked on Stripe API?"' /> : null}
            {step >= 4 && step < 6 && <span className="inline-block w-2 h-4 bg-[var(--lime)] animate-pulse align-middle ml-1"></span>}
          </div>
        )}
        
        {/* Step 6+: JSON Response */}
        {step >= 6 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mt-2 text-white">&#123;</div>
            <div className="pl-4">
              <span className="text-gray-500">"entities":</span> ["<span className="text-white">m.tiwari</span>", "<span className="text-white">j.doe</span>"],
            </div>
            <div className="pl-4">
              <span className="text-gray-500">"sources":</span> ["<span className="text-white">Notion / PRD</span>", "<span className="text-white">Slack / #backend</span>"],
            </div>
            <div className="pl-4">
              <span className="text-gray-500">"answer":</span> "<span className="text-white">Mayank and John led the migration in Q3.</span>"
            </div>
            <div className="text-white">
              &#125;<span className="inline-block w-2 h-4 bg-[var(--lime)] ml-1 animate-pulse align-middle"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedTerminal;

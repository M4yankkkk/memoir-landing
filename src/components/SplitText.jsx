import React, { useEffect, useState, useRef } from 'react';

const SplitText = ({ text, className = '', delay = 30 }) => {
  const words = text.split(' ');
  const [startAnimation, setStartAnimation] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartAnimation(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`inline-block opacity-0 translate-y-4 ${startAnimation ? 'animate-split-text' : ''}`}
          style={{ 
            animationDelay: `${i * delay}ms`, 
            animationFillMode: 'forwards' 
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </span>
  );
};

export default SplitText;

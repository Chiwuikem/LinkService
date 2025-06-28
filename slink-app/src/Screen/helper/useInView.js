// src/hooks/useInView.js
import { useState, useEffect } from 'react';

export default function useInView(ref, options = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, options]);

  return inView;
}

import { useRef, useState, useEffect } from "react";

export function useReveal(thresh = 0.13) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); ob.disconnect(); } },
      { threshold: thresh }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [thresh]);

  return [ref, on];
}
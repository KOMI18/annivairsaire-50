import { useRef, useState, useEffect, useCallback } from "react";

export function useAudio(src) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready,   setReady]   = useState(false);

  useEffect(() => {
    const a = new Audio(src);
    a.loop = true;
    a.volume = 0;
    a.preload = "auto";
    audioRef.current = a;
    return () => { a.pause(); a.src = ""; };
  }, [src]);

  const fadeIn = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    a.play().catch(() => {});
    let v = 0;
    const t = setInterval(() => {
      v = Math.min(v + 0.012, 0.52);
      a.volume = v;
      if (v >= 0.52) clearInterval(t);
    }, 55);
  }, []);

  const fadeOut = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    let v = a.volume;
    const t = setInterval(() => {
      v = Math.max(v - 0.022, 0);
      a.volume = v;
      if (v <= 0) { clearInterval(t); a.pause(); }
    }, 40);
  }, []);

  const start = useCallback(() => {
    setReady(true);
    setPlaying(true);
    fadeIn();
  }, [fadeIn]);

  const toggle = useCallback(() => {
    if (!ready) { start(); return; }
    if (playing) { fadeOut(); setPlaying(false); }
    else         { fadeIn();  setPlaying(true);  }
  }, [ready, playing, start, fadeIn, fadeOut]);

  return { playing, ready, start, toggle };
}
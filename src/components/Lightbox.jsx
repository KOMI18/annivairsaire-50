import { useState, useEffect, useCallback, useRef } from "react";
import { T, sans, serif } from "../constants/theme";

const AUTOPLAY_DELAY = 5000; // ms entre chaque photo

export default function Lightbox({ images, index, onClose }) {
  const [cur,      setCur]      = useState(index);
  const [playing,  setPlaying]  = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef  = useRef(null);
  const progressRef  = useRef(null);
  const startTimeRef = useRef(null);

  const prev = useCallback(() => setCur(c => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCur(c => (c + 1) % images.length),                 [images.length]);

  // ── Avance au suivant et remet la barre à zéro ──────────────────────────
  const goNext = useCallback(() => {
    setCur(c => (c + 1) % images.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [images.length]);

  // ── Barre de progression fluide ─────────────────────────────────────────
  const startProgressBar = useCallback(() => {
    cancelAnimationFrame(progressRef.current);
    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct     = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        progressRef.current = requestAnimationFrame(tick);
      }
    };
    progressRef.current = requestAnimationFrame(tick);
  }, []);

  const stopProgressBar = useCallback(() => {
    cancelAnimationFrame(progressRef.current);
  }, []);

  // ── Autoplay ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) {
      clearInterval(intervalRef.current);
      stopProgressBar();
      return;
    }
    setProgress(0);
    startProgressBar();
    intervalRef.current = setInterval(goNext, AUTOPLAY_DELAY);
    return () => {
      clearInterval(intervalRef.current);
      stopProgressBar();
    };
  }, [playing, cur, goNext, startProgressBar, stopProgressBar]);

  // ── Clavier ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   { prev(); setProgress(0); }
      if (e.key === "ArrowRight")  { next(); setProgress(0); }
      if (e.key === " ")           { e.preventDefault(); setPlaying(p => !p); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, prev, next]);

  // ── Pause au hover ────────────────────────────────────────────────────────
  const pause = () => {
    setPlaying(false);
    stopProgressBar();
  };
  const resume = () => {
    setPlaying(true);
    setProgress(0);
  };

  const img = images[cur];

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(10,22,40,0.97)",
        zIndex: 1000,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        animation: "lbIn .25s ease both",
      }}
      onClick={onClose}
    >
      {/* ── BARRE DE PROGRESSION ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: "2px",
        background: "rgba(255,255,255,0.08)",
        zIndex: 10,
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: T.pale,
          transition: playing ? "none" : "none",
        }}/>
      </div>

      {/* ── INDICATEURS POINTS ── */}
      <div style={{
        position: "fixed", top: "18px", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: "6px", zIndex: 10,
      }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); setCur(i); setProgress(0); }}
            style={{
              width:  i === cur ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === cur ? T.pale : "rgba(255,255,255,0.2)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width .35s ease, background .35s ease",
            }}
          />
        ))}
      </div>

      {/* ── BOUTON FERMER ── */}
      <button
        onClick={onClose}
        style={{
          position: "fixed", top: "14px", right: "24px", zIndex: 10,
          background: "none", border: "none",
          color: "rgba(255,255,255,0.45)", fontSize: "24px",
          cursor: "pointer", lineHeight: 1, transition: "color .2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#fff"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
      >
        &#x2715;
      </button>

      {/* ── NAVIGATION GAUCHE ── */}
      <button
        onClick={e => { e.stopPropagation(); prev(); setProgress(0); }}
        style={{
          position: "fixed", left: "20px", top: "50%",
          transform: "translateY(-50%)", zIndex: 10,
          background: "none",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.5)",
          width: "44px", height: "44px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: "20px",
          transition: "border-color .2s, color .2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
      >
        &#x2039;
      </button>

      {/* ── NAVIGATION DROITE ── */}
      <button
        onClick={e => { e.stopPropagation(); next(); setProgress(0); }}
        style={{
          position: "fixed", right: "20px", top: "50%",
          transform: "translateY(-50%)", zIndex: 10,
          background: "none",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.5)",
          width: "44px", height: "44px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: "20px",
          transition: "border-color .2s, color .2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
      >
        &#x203a;
      </button>

      {/* ── IMAGE ── */}
      <div
        onClick={e => e.stopPropagation()}
        onMouseEnter={pause}
        onMouseLeave={resume}
        style={{
          position: "relative",
          maxWidth: "90vw", maxHeight: "82vh",
          animation: "lbIn .3s .05s ease both",
        }}
      >
        {img.src ? (
          <img
            key={cur}
            src={img.src}
            alt={img.alt}
            style={{
              maxWidth: "90vw", maxHeight: "82vh",
              objectFit: "contain", display: "block",
              animation: "lbIn .4s ease both",
            }}
          />
        ) : (
          <div
            key={cur}
            style={{
              width: "min(600px, 88vw)", height: "min(480px, 60vh)",
              background: T.mid,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "14px",
              color: "rgba(255,255,255,0.28)",
              fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
              animation: "lbIn .4s ease both",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.2)" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="1"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            {img.alt}
          </div>
        )}

        {/* badge pause */}
        {!playing && (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "52px", height: "52px", borderRadius: "50%",
            background: "rgba(10,22,40,0.65)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(6px)",
            animation: "lbIn .2s ease both",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          </div>
        )}
      </div>

      {/* ── LÉGENDE + COMPTEUR ── */}
      <div style={{
        position: "fixed", bottom: "24px", left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center", zIndex: 10,
        animation: "lbIn .4s .1s ease both",
      }}>
        <p style={{
          ...sans, fontSize: "11px", letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
          marginBottom: "6px",
        }}>
          {img.alt}
        </p>
        <p style={{
          ...sans, fontSize: "10px", letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.22)",
        }}>
          {cur + 1} / {images.length}
          <span style={{ margin: "0 12px", opacity: 0.4 }}>·</span>
          {playing
            ? <span>Survoler pour mettre en pause</span>
            : <span style={{ color: T.pale }}>En pause — Espace pour reprendre</span>
          }
        </p>
      </div>

      {/* ── BOUTON PLAY/PAUSE bas droite ── */}
      <button
        onClick={e => { e.stopPropagation(); setPlaying(p => !p); }}
        style={{
          position: "fixed", bottom: "24px", right: "28px", zIndex: 10,
          background: "none",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.45)",
          width: "36px", height: "36px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          transition: "border-color .2s, color .2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
      >
        {playing ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        )}
      </button>

    </div>
  );
}
import { useState, useEffect, useCallback } from "react";
import { T } from "../constants/theme";

export default function Lightbox({ images, index, onClose }) {
  const [cur, setCur] = useState(index);
  const prev = useCallback(() => setCur(c => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCur(c => (c + 1) % images.length),                 [images.length]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, prev, next]);

  const img = images[cur];
  return (
    <div className="lb-bg" onClick={onClose}>
      <button className="lb-close" onClick={onClose}>&#x2715;</button>
      <button className="lb-nav lb-prev" onClick={e => { e.stopPropagation(); prev(); }}>&#x2039;</button>
      <button className="lb-nav lb-next" onClick={e => { e.stopPropagation(); next(); }}>&#x203a;</button>
      <div className="lb-inner" onClick={e => e.stopPropagation()}>
        {img.src
          ? <img src={img.src} alt={img.alt} />
          : <div className="lb-ph" style={{
              background: T.mid, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "14px", color: "rgba(255,255,255,0.28)",
              fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.25)" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="1"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              {img.alt}
            </div>
        }
      </div>
      <p className="lb-caption">{cur + 1} / {images.length} — {img.alt}</p>
    </div>
  );
}
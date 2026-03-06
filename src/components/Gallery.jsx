import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import Lightbox from "./Lightbox";
import { T, RATIO } from "../constants/theme";

export default function Gallery({ images, dark = true }) {
  const [lb, setLb] = useState(null);
  const [ref, on]   = useReveal(0.06);

  return (
    <>
      <div ref={ref} className="masonry">
        {images.map((img, i) => (
          <div
            key={i}
            className={`m-item rv ${["", "d1", "d2", "d3"][i]} ${on ? "on" : ""}`}
            style={{ transitionDelay: `${i * 0.11}s` }}
            onClick={() => setLb(i)}
          >
            {img.src
              ? <img src={img.src} alt={img.alt}
                  style={{ aspectRatio: RATIO[img.ratio] || "4/3", objectFit: "cover" }} />
              : <div className="m-ph" style={{
                  aspectRatio: RATIO[img.ratio] || "4/3",
                  background: dark ? "rgba(255,255,255,0.05)" : "rgba(10,22,40,0.07)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "10px",
                  color: dark ? "rgba(255,255,255,0.22)" : T.muted,
                  fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="1"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  {img.alt}
                </div>
            }
            <div className="m-overlay">
              <p className="m-caption">{img.alt}</p>
            </div>
          </div>
        ))}
      </div>
      {lb !== null && (
        <Lightbox images={images} index={lb} onClose={() => setLb(null)} />
      )}
    </>
  );
}
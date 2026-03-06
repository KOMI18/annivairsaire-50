import { useState, useRef, useEffect } from "react";
import Lightbox from "../components/Lightbox";
import { T, serif, sans, LBL } from "../constants/theme";

// ─── 20 photos — remplace les src: null par tes vrais chemins ────────────────
// Place tes images dans /public/gallery/
// ex: src: "/gallery/scene-01.jpg"
export const LIFE_PHOTOS = [
  { src: "/memorie/1.jpeg", alt: "Un dimanche en famille",         ratio: "paysage"  },
  { src: "/memorie/2.jpeg", alt: "Le sourire de toujours",          ratio: "portrait" },
  { src: "/memorie/3.jpeg", alt: "Une soirée mémorable",            ratio: "carre"    },
  { src: "/memorie/4.jpeg", alt: "Les mains qui construisent",      ratio: "portrait" },
  { src: "/memorie/5.jpeg", alt: "Voyage inoubliable",              ratio: "paysage"  },
  { src: "/memorie/6.jpeg", alt: "Entre frères et sœurs",           ratio: "paysage"  },
  { src: "/memorie/7.jpeg", alt: "Un regard complice",              ratio: "portrait" },
  { src: "/memorie-1/1.jpeg", alt: "Fête et éclats de rire",          ratio: "carre"    },
  { src: "/memorie-1/2.jpeg", alt: "Le calme du matin",               ratio: "portrait" },
  { src: "/memorie-1/3.jpeg", alt: "Sur la route",                    ratio: "paysage"  },
  { src: "/memorie-1/4.jpeg", alt: "Moment suspendu",                 ratio: "portrait" },
  { src: "/memorie-1/5.jpeg", alt: "La table du bonheur",             ratio: "paysage"  },
  { src: "/memorie-1/6.jpeg", alt: "Enfants qui grandissent",         ratio: "carre"    },
  { src: "/memorie-1/7.jpeg", alt: "Les yeux qui brillent",           ratio: "portrait" },
  { src: "/memorie-1/8.jpeg", alt: "Une accolade",                    ratio: "paysage"  },
  { src: null, alt: "Le temps d'un repas",             ratio: "carre"    },
  { src: null, alt: "Lumière d'été",                   ratio: "portrait" },
  { src: null, alt: "Confidences entre amis",          ratio: "paysage"  },
  { src: null, alt: "Les petits bonheurs",             ratio: "portrait" },
  { src: null, alt: "Cinquante ans de vie",            ratio: "paysage"  },
];

const RATIO_MAP = { portrait: "2/3", paysage: "4/3", carre: "1/1" };

function useReveal(thresh = 0.05) {
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

function Brick({ photo, index, onClick, revealed }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={() => onClick(index)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        breakInside: "avoid",
        marginBottom: "10px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .75s ease ${index * 0.04}s, transform .75s ease ${index * 0.04}s`,
      }}
    >
      {photo.src ? (
        <img
          src={photo.src}
          alt={photo.alt}
          style={{
            display: "block",
            width: "100%",
            aspectRatio: RATIO_MAP[photo.ratio] || "4/3",
            objectFit: "cover",
            transform: hov ? "scale(1.05)" : "scale(1)",
            transition: "transform .65s cubic-bezier(.25,.46,.45,.94)",
          }}
        />
      ) : (
        <div style={{
          aspectRatio: RATIO_MAP[photo.ratio] || "4/3",
          background: hov ? "rgba(10,22,40,0.09)" : "rgba(10,22,40,0.05)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "10px",
          transition: "background .3s",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            border: "1px solid rgba(10,22,40,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hov ? 0.55 : 0.3, transition: "opacity .3s",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke={T.deep} strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="1"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
          <span style={{
            ...sans, fontSize: "9px", letterSpacing: "0.13em",
            textTransform: "uppercase", color: "rgba(10,22,40,0.28)",
            textAlign: "center", padding: "0 12px",
          }}>
            {photo.alt}
          </span>
        </div>
      )}

      {/* overlay hover */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(10,22,40,0.72) 0%, rgba(10,22,40,0.1) 55%, transparent 100%)",
        opacity: hov ? 1 : 0,
        transition: "opacity .35s ease",
        display: "flex", alignItems: "flex-end", padding: "14px 16px",
        pointerEvents: "none",
      }}>
        <p style={{
          ...sans, fontSize: "10px", letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.9)", lineHeight: 1.4,
          transform: hov ? "translateY(0)" : "translateY(6px)",
          transition: "transform .35s ease",
        }}>
          {photo.alt}
        </p>
      </div>
    </div>
  );
}

export default function LifeGallery() {
  const [lb, setLb] = useState(null);
  const [gridRef, revealed] = useReveal(0.04);

  return (
    <>
      {/* ── EN-TÊTE DARK ─────────────────────────────────────────────────── */}
      <div style={{
        background: T.deep,
        padding: "110px 40px 88px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* halo décoratif */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 65% 65% at 50% 50%, #1a3a6b, transparent 70%)",
          pointerEvents: "none",
        }}/>

        {/* filigrane numéro */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(160px, 26vw, 320px)",
          fontWeight: 300,
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.04)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
        }}>50</div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ ...LBL, color: T.pale, marginBottom: "18px" }}>
            Scènes de vie
          </p>
          <h2 style={{
            ...serif,
            fontSize: "clamp(38px,5.5vw,68px)",
            fontWeight: 300,
            color: T.white,
            lineHeight: 1.2,
            marginBottom: "22px",
          }}>
            Cinquante ans<br />en images
          </h2>
          <p style={{
            ...sans,
            fontSize: "13px", fontWeight: 300,
            color: "rgba(255,255,255,0.36)",
            letterSpacing: "0.06em",
            maxWidth: "380px",
            margin: "0 auto",
            lineHeight: 1.9,
          }}>
            Une vie qui se raconte aussi par les instants volés,<br />
            les éclats de rire, les regards.
          </p>

          {/* ligne drop */}
          <div style={{
            width: "1px", height: "52px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)",
            margin: "44px auto 0",
          }}/>
        </div>
      </div>

      {/* ── GRILLE MASONRY BLANCHE ────────────────────────────────────────── */}
      <div style={{ background: T.white }}>

        {/* sous-titre compteur */}
        <div style={{ textAlign: "center", padding: "36px 40px 20px" }}>
          <span style={{
            ...sans, fontSize: "10px", letterSpacing: "0.35em",
            textTransform: "uppercase", color: T.muted,
          }}>
            {LIFE_PHOTOS.length} moments
          </span>
        </div>

        {/* grille */}
        <div
          ref={gridRef}
          style={{
            columns: "2",
            columnGap: "10px",
            padding: "8px 32px 0",
            maxWidth: "1300px",
            margin: "0 auto",
          }}
          className="life-masonry"
        >
          {LIFE_PHOTOS.map((photo, i) => (
            <Brick
              key={i}
              photo={photo}
              index={i}
              onClick={setLb}
              revealed={revealed}
            />
          ))}
        </div>

        {/* hint clavier */}
        <p style={{
          ...sans,
          textAlign: "center",
          fontSize: "10px",
          letterSpacing: "0.22em",
          color: "rgba(10,22,40,0.2)",
          textTransform: "uppercase",
          padding: "20px 0 72px",
        }}>
          Cliquez pour agrandir · ← → pour naviguer · Échap pour fermer
        </p>
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
      {lb !== null && (
        <Lightbox
          images={LIFE_PHOTOS}
          index={lb}
          onClose={() => setLb(null)}
        />
      )}

      {/* ── RESPONSIVE CSS ───────────────────────────────────────────────── */}
      <style>{`
        @media (min-width: 540px)  { .life-masonry { columns: 3 !important; } }
        @media (min-width: 860px)  { .life-masonry { columns: 4 !important; column-gap: 12px !important; } }
        @media (min-width: 1100px) { .life-masonry { columns: 5 !important; column-gap: 13px !important; } }
        @media (max-width: 440px)  { .life-masonry { padding: 8px 16px 0 !important; } }
      `}</style>
    </>
  );
}
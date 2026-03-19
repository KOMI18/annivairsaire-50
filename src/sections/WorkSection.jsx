import { useState, useRef, useEffect } from "react";
import Lightbox from "../components/Lightbox";
import { T, serif, sans, LBL } from "../constants/theme";

// ─── Photos de travail — remplace les src: null ───────────────────────────────
// Place tes images dans /public/work/
export const WORK_PHOTOS = [
  { src: "/memorie-2/5.jpeg", alt: "",          ratio: "paysage"  },
  { src: "/memorie-2/10.jpeg", alt: "Les main sale pour manger du pain blanc 😁😁😁",                ratio: "portrait" },
  { src: "/memorie-2/6.jpeg", alt: "En réunion",                    ratio: "carre"    },
  { src: "/jeune-6.jpeg", alt: "Les mains à l'ouvrage",         ratio: "portrait" },
  { src: "/memorie-2/11.jpeg", alt: "Les main sale pour manger du pain blanc",     ratio: "paysage"  },
  { src: "/memorie-2/4.jpeg", alt: "La fierté du travail accompli", ratio: "carre"    },
];

const RATIO_MAP = { portrait: "2/3", paysage: "4/3", carre: "1/1" };

function useReveal(thresh = 0.1) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); ob.disconnect(); } },
      { threshold: thresh }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [thresh]);
  return [ref, on];
}

function useRevealSingle(thresh = 0.15) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); ob.disconnect(); } },
      { threshold: thresh }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [thresh]);
  return [ref, on];
}

// ─── STAT (chiffres clés) ─────────────────────────────────────────────────────
function Stat({ number, label, delay }) {
  const [ref, on] = useRevealSingle();
  const [count, setCount] = useState(0);
  const target = parseInt(number);

  useEffect(() => {
    if (!on) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const t = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(t);
  }, [on, target]);

  return (
    <div
      ref={ref}
      style={{
        // textAlign: "center",
        opacity:   on ? 1 : 0,
        transform: on ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`,
      }}
    >
      <p style={{
        ...serif, fontSize: "clamp(48px, 6vw, 80px)",
        fontWeight: 300, color: T.white, lineHeight: 1,
        marginBottom: "12px",
      }}>
        {count}<span style={{ fontSize: "0.5em", color: T.pale }}>+</span>
      </p>
      <p style={{
        ...sans, fontSize: "10px", letterSpacing: "0.3em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
        lineHeight: 1.6,
      }}>
        {label}
      </p>
    </div>
  );
}

// ─── BRIQUE PHOTO ─────────────────────────────────────────────────────────────
function Brick({ photo, index, onClick, revealed }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(index)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        breakInside: "avoid", marginBottom: "10px",
        cursor: "pointer", position: "relative", overflow: "hidden",
        opacity:   revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .7s ease ${index * 0.08}s, transform .7s ease ${index * 0.08}s`,
      }}
    >
      {photo.src ? (
        <img src={photo.src} alt={photo.alt} style={{
          display: "block", width: "100%",
          aspectRatio: RATIO_MAP[photo.ratio] || "4/3",
          objectFit: "cover",
          transform: hov ? "scale(1.05)" : "scale(1)",
          transition: "transform .65s cubic-bezier(.25,.46,.45,.94)",
          filter: hov ? "brightness(0.85)" : "brightness(1)",
        }}/>
      ) : (
        <div style={{
          aspectRatio: RATIO_MAP[photo.ratio] || "4/3",
          background: hov ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "10px", transition: "background .3s",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hov ? 0.7 : 0.3, transition: "opacity .3s",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.8)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="1"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
          <span style={{
            ...sans, fontSize: "9px", letterSpacing: "0.13em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
            textAlign: "center", padding: "0 12px",
          }}>
            {photo.alt}
          </span>
        </div>
      )}

      {/* overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(10,22,40,0.8) 0%, transparent 60%)",
        opacity: hov ? 1 : 0, transition: "opacity .35s ease",
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

// ─── SECTION PRINCIPALE ───────────────────────────────────────────────────────
export default function WorkSection() {
  const [lb, setLb]       = useState(null);
  const [gridRef, revealed] = useReveal(0.04);

  return (
    <>
      {/* ── BLOC ENTIER SUR FOND DARK ──────────────────────────────────── */}
      <div style={{ background: T.deep, position: "relative", overflow: "hidden" }}>

        {/* halo */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 55% at 50% 30%, #1a3a6b, transparent 70%)",
          pointerEvents: "none",
        }}/>

        {/* ── EN-TÊTE ── */}
        <div style={{ padding: "110px 40px 72px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <p style={{ ...LBL, color: T.pale, marginBottom: "18px" }}>
            L'homme derrière les accomplissements
          </p>
          <h2 style={{
            ...serif, fontSize: "clamp(36px, 5.5vw, 68px)",
            fontWeight: 300, color: T.white,
            lineHeight: 1.2, marginBottom: "24px",
          }}>
            Un travailleur<br />acharné
          </h2>
          <p style={{
            ...sans, fontSize: "14px", fontWeight: 300,
            color: "rgba(255,255,255,0.38)",
            maxWidth: "480px", margin: "0 auto",
            lineHeight: 1.9, letterSpacing: "0.04em",
          }}>
            Cinquante ans de vie, dont la moitié passée à construire,
            à créer, à bâtir avec ses mains et son esprit.
            La réussite ne lui a jamais été offerte — il l'a méritée.
          </p>
        </div>

        {/* ── CHIFFRES CLÉS ── */}
       <div style={{
            position: "relative", zIndex: 1,
            maxWidth: "300px", margin: "0 auto",
            padding: "0 40px 80px",
            }}>
            <Stat number="25" label={"Années\nd'expérience"} delay={0} />
            </div>

        {/* ── CITATION ── */}
        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: "640px", margin: "0 auto",
          padding: "0 40px 80px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "56px",
        }}>
          <div style={{
            ...serif, fontSize: "clamp(13px,1.5vw,16px)",
            color: "rgba(255,255,255,0.2)",
            marginBottom: "20px", letterSpacing: "0.1em",
          }}>
            ❝
          </div>
          <p style={{
            ...serif, fontStyle: "italic",
            fontSize: "clamp(18px, 2.5vw, 26px)",
            fontWeight: 300, color: "rgba(255,255,255,0.65)",
            lineHeight: 1.75,
          }}>
            Le travail n'est pas ce qu'il fait —<br />
            c'est ce qu'il est.
          </p>
        </div>

        {/* ── GRILLE PHOTOS ── */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", padding: "0 40px 24px" }}>
            <span style={{
              ...sans, fontSize: "10px", letterSpacing: "0.35em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
            }}>
              {WORK_PHOTOS.length} scènes de travail
            </span>
          </div>

          <div
            ref={gridRef}
            style={{
              columns: "2", columnGap: "8px",
              padding: "0 32px",
              maxWidth: "1100px", margin: "0 auto",
            }}
            className="work-masonry"
          >
            {WORK_PHOTOS.map((photo, i) => (
              <Brick
                key={i}
                photo={photo}
                index={i}
                onClick={setLb}
                revealed={revealed}
              />
            ))}
          </div>

          <p style={{
            ...sans, textAlign: "center", fontSize: "10px",
            letterSpacing: "0.2em", color: "rgba(255,255,255,0.15)",
            textTransform: "uppercase", padding: "20px 0 80px",
          }}>
            Cliquez pour agrandir
          </p>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lb !== null && (
        <Lightbox
          images={WORK_PHOTOS}
          index={lb}
          onClose={() => setLb(null)}
        />
      )}

      {/* ── RESPONSIVE ── */}
      <style>{`
        @media (min-width: 600px)  { .work-masonry { columns: 3 !important; } }
        @media (min-width: 900px)  { .work-masonry { columns: 4 !important; } }
        @media (max-width: 440px)  { .work-masonry { padding: 0 16px !important; } }
        @media (max-width: 500px)  { .work-stats   { grid-template-columns: 1fr !important; gap: 28px !important; } }
      `}</style>
    </>
  );
}
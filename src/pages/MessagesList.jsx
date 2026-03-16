
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { T, serif, sans, LBL } from "../constants/theme";
import { db } from "../firebase-config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
const SECRET = "joyeux50";

// ─── ÉCRAN MOT DE PASSE ───────────────────────────────────────────────────────
function PasswordScreen({ onUnlock }) {
  const [pwd,      setPwd]      = useState("");
  const [error,    setError]    = useState(false);
  const [hov,      setHov]      = useState(false);
  const [focused,  setFocused]  = useState(false);

  function attempt() {
    if (pwd.trim() === SECRET) { onUnlock(); }
    else { setError(true); setPwd(""); }
  }

  return (
    <div style={{ ...sans, background: T.deep, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, #1a3a6b, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "380px", textAlign: "center" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <p style={{ ...LBL, color: T.pale, marginBottom: "14px" }}>Accès réservé</p>
        <h1 style={{ ...serif, fontSize: "clamp(28px,4vw,42px)", fontWeight: 300, color: T.white, marginBottom: "10px" }}>
          Messages privés
        </h1>
        <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.3)", marginBottom: "40px", lineHeight: 1.8 }}>
          Réservé au jour de la réception.
        </p>

        <input
          type="password"
          value={pwd}
          onChange={e => { setPwd(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Mot de passe"
          style={{ ...sans, width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${error ? "#e05555" : focused ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)"}`, padding: "14px 20px", fontSize: "14px", fontWeight: 300, color: T.white, outline: "none", letterSpacing: "0.15em", textAlign: "center", transition: "border-color .25s", marginBottom: "8px" }}
        />
        {error && <p style={{ ...sans, fontSize: "11px", color: "#e05555", letterSpacing: "0.1em", marginBottom: "8px" }}>Mot de passe incorrect.</p>}

        <button
          onClick={attempt}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{ ...sans, width: "100%", marginTop: "12px", padding: "14px", background: hov ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.18)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s" }}>
          Accéder aux messages
        </button>

        <div style={{ marginTop: "36px" }}>
          <Link to="/" style={{ ...sans, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", textDecoration: "none", transition: "color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.22)"}>
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── CARTE MESSAGE ────────────────────────────────────────────────────────────
function MessageCard({ msg, index, visible }) {
  const isVideo = msg.type === "video_upload" ||
                  msg.type === "video_url"    ||
                  msg.type === "video_drive";

  // Construit l'URL d'embed selon le type
  function embedUrl() {
    // Google Drive
    if (msg.videoType === "drive" && msg.driveId) {
      return `https://drive.google.com/file/d/${msg.driveId}/preview`;
    }
    // YouTube
    if (msg.videoType === "youtube" && msg.videoUrl) {
      const id = msg.videoUrl.match(/(?:youtu\.be\/|v=|\/embed\/)([^?&]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
    }
    // Vimeo
    if (msg.videoType === "vimeo" && msg.videoUrl) {
      const id = msg.videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    // Firebase Storage (si tu passes au plan payant un jour)
    if (msg.videoType === "upload" && msg.videoUrl) {
      return null; // géré par <video> natif plus bas
    }
    return null;
  }

  const embed = isVideo ? embedUrl() : null;

  return (
    <div style={{
      position:   "absolute", inset: 0,
      display:    "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding:    "24px 40px",
      opacity:    visible ? 1 : 0,
      transform:  visible
        ? "translateY(0) scale(1)"
        : "translateY(32px) scale(0.98)",
      transition: "opacity .55s cubic-bezier(.25,.46,.45,.94), transform .55s cubic-bezier(.25,.46,.45,.94)",
      pointerEvents: visible ? "auto" : "none",
    }}>
      <div style={{
        width:     "100%",
        maxWidth:  isVideo ? "780px" : "680px",
        background: T.white,
        border:    "1px solid rgba(10,22,40,0.1)",
        boxShadow: "0 24px 80px rgba(10,22,40,0.12)",
        display:   "flex", flexDirection: "column",
        maxHeight: "calc(100vh - 226px)",
        overflow:  "hidden",
      }}>

        {/* ── EN-TÊTE FIXE — toujours visible ───────────────────────── */}
        <div style={{
          flexShrink:   0,
          padding:      "22px 32px 18px",
          borderBottom: "1px solid rgba(10,22,40,0.07)",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

            {/* badge vidéo */}
            {isVideo && (
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "rgba(46,95,163,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke={T.accent} strokeWidth="1.8" strokeLinecap="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2"/>
                </svg>
              </div>
            )}

            <div>
              <p style={{
                ...sans, fontSize: "12px", letterSpacing: "0.22em",
                textTransform: "uppercase", color: T.accent, marginBottom: "3px",
              }}>
                {msg.name}
              </p>
              {msg.relation && (
                <span style={{
                  ...sans, fontSize: "10px",
                  letterSpacing: "0.12em", color: T.muted,
                }}>
                  {msg.relation}
                </span>
              )}
            </div>
          </div>

          {/* numéro + type badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            {isVideo && (
              <span style={{
                ...sans, fontSize: "9px", letterSpacing: "0.2em",
                textTransform: "uppercase", color: T.accent,
                background: "rgba(46,95,163,0.07)",
                padding: "3px 8px",
              }}>
                Vidéo
              </span>
            )}
            <span style={{
              ...sans, fontSize: "11px",
              color: "rgba(10,22,40,0.15)", letterSpacing: "0.1em",
            }}>
              #{String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* ── CORPS SCROLLABLE ──────────────────────────────────────── */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "24px 32px 28px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(10,22,40,0.1) transparent",
        }}>

          {/* ── LECTEUR VIDÉO : iframe (Drive / YouTube / Vimeo) ── */}
          {isVideo && embed && (
            <div style={{
              position:      "relative",
              paddingBottom: "56.25%",  // ratio 16/9
              height:        0,
              marginBottom:  msg.message ? "20px" : "0",
              background:    T.deep,
              overflow:      "hidden",
            }}>
              <iframe
                src={embed}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  border: "none",
                }}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title={`Vidéo de ${msg.name}`}
              />
            </div>
          )}

          {/* ── LECTEUR VIDÉO : fichier direct (Storage) ── */}
          {isVideo && !embed && msg.videoUrl && (
            <video
              controls
              style={{
                width: "100%", display: "block",
                marginBottom: msg.message ? "20px" : "0",
                background: "#000",
              }}
            >
              <source src={msg.videoUrl} />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          )}

          {/* ── MESSAGE TEXTE ── */}
          {msg.message && (
            <p style={{
              ...serif,
              fontSize:   isVideo ? "16px" : "clamp(19px, 2.8vw, 26px)",
              fontWeight: 300,
              lineHeight: 1.85,
              color:      T.deep,
              fontStyle:  "italic",
            }}>
              {msg.message}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}


// ── Indicateur discret "↓ Défiler" qui disparaît après scroll ────────────────
function ScrollHint({ message }) {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const bodyRef = useRef(null);

  // Apparaît seulement si le texte dépasse
  useEffect(() => {
    setShow(false);
    setGone(false);
    // Délai pour laisser le DOM se rendre
    const t = setTimeout(() => {
      const el = bodyRef.current;
      if (el && el.scrollHeight > el.clientHeight + 8) setShow(true);
    }, 100);
    return () => clearTimeout(t);
  }, [message]);

  if (!show || gone) return null;

  return (
    <div style={{
      flexShrink: 0,
      borderTop: "1px solid rgba(10,22,40,0.06)",
      padding: "10px 40px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
      background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 40%)",
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke={T.muted} strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
      <span style={{
        ...sans, fontSize: "9px", letterSpacing: "0.25em",
        textTransform: "uppercase", color: T.muted,
      }}>
        Défiler
      </span>
    </div>
  );
}

// ─── CARROUSEL ────────────────────────────────────────────────────────────────
function Carousel({ msgs }) {
  const [cur, setCur] = useState(0);
  const [started, setStarted] = useState(false);

  const prev = useCallback(() => setCur(c => Math.max(c - 1, 0)),              []);
  const next = useCallback(() => setCur(c => Math.min(c + 1, msgs.length - 1)),[msgs.length]);

  // clavier
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown")  next();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")    prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next]);

  const isFirst = cur === 0;
  const isLast  = cur === msgs.length - 1;

  // ── ÉCRAN DE DÉMARRAGE ──────────────────────────────────────────────────────
  if (!started) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 45% at 50% 40%, #1a3a6b, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* grand nombre */}
          <div style={{ ...serif, fontSize: "clamp(80px,18vw,180px)", fontWeight: 300, color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.1)", lineHeight: 1, marginBottom: "32px", userSelect: "none" }}>
            {msgs.length}
          </div>

          <p style={{ ...LBL, color: T.pale, marginBottom: "16px" }}>
            message{msgs.length > 1 ? "s" : ""} reçu{msgs.length > 1 ? "s" : ""}
          </p>
          <h2 style={{ ...serif, fontSize: "clamp(28px,4vw,48px)", fontWeight: 300, color: T.white, marginBottom: "16px", lineHeight: 1.3 }}>
            Avec tout l'amour<br />de ses proches
          </h2>
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.35)", marginBottom: "56px", lineHeight: 1.8 }}>
            Naviguez message par message<br />avec les flèches ou le clavier.
          </p>

          <button
            onClick={() => setStarted(true)}
            style={{ ...sans, padding: "16px 56px", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.75)", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", cursor: "pointer", transition: "border-color .25s, color .25s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
          >
            Commencer la lecture
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

      {/* ── BARRE DE PROGRESSION ── */}
      <div style={{ padding: "20px 32px 0", display: "flex", gap: "4px", flexShrink: 0 }}>
        {msgs.map((_, i) => (
          <div
            key={i}
            onClick={() => setCur(i)}
            style={{
              flex: 1, height: "2px", cursor: "pointer",
              background: i <= cur ? T.pale : "rgba(255,255,255,0.12)",
              transition: "background .3s ease",
              borderRadius: "1px",
            }}
          />
        ))}
      </div>

      {/* ── ZONE CARTE (relative pour les cartes absolues) ── */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {msgs.map((m, i) => (
          <MessageCard
            key={m.id}
            msg={m}
            index={i}
            total={msgs.length}
            visible={i === cur}
          />
        ))}
      </div>

      {/* ── CONTRÔLES NAVIGATION ── */}
      <div style={{ flexShrink: 0, padding: "16px 32px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* précédent */}
        <button
          onClick={prev}
          disabled={isFirst}
          style={{ ...sans, display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", color: isFirst ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.55)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", cursor: isFirst ? "default" : "pointer", transition: "color .2s", padding: 0 }}
          onMouseEnter={e => { if (!isFirst) e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.color = isFirst ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.55)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Précédent
        </button>

        {/* compteur central */}
        <div style={{ textAlign: "center" }}>
          <span style={{ ...serif, fontStyle: "italic", fontSize: "22px", fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>
            {cur + 1}
          </span>
          <span style={{ ...sans, fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: "0 8px" }}>/</span>
          <span style={{ ...sans, fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
            {msgs.length}
          </span>
        </div>

        {/* suivant / fin */}
        {!isLast ? (
          <button
            onClick={next}
            style={{ ...sans, display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer", transition: "color .2s", padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
          >
            Suivant
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        ) : (
          // dernier message — bouton fin
          <button
            onClick={() => setCur(0)}
            style={{ ...sans, display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", color: T.pale, fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer", transition: "color .2s", padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = T.pale}
          >
            Recommencer
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function MessagesList() {
  const [unlocked, setUnlocked] = useState(false);
  const [msgs,     setMsgs]     = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!unlocked) return;
    const q = query(collection(db, "voeux"), orderBy("timestamp", "asc")); // asc = ordre d'envoi
    return onSnapshot(q, snap => {
      setMsgs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [unlocked]);

  // ── MOT DE PASSE ────────────────────────────────────────────────────────────
  if (!unlocked) return <PasswordScreen onUnlock={() => setUnlocked(true)} />;

  // ── CHARGEMENT ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ ...sans, background: T.deep, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)", margin: "0 auto 24px", animation: "pulse 1.5s infinite" }} />
          <p style={{ ...sans, fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
            Chargement
          </p>
        </div>
      </div>
    );
  }

  // ── PAS DE MESSAGES ─────────────────────────────────────────────────────────
  if (msgs.length === 0) {
    return (
      <div style={{ ...sans, background: T.deep, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px" }}>
        <p style={{ ...LBL, color: T.pale, marginBottom: "16px" }}>Livre d'or</p>
        <h2 style={{ ...serif, fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: T.white, marginBottom: "16px" }}>
          Aucun message pour le moment
        </h2>
        <Link to="/" style={{ ...sans, marginTop: "32px", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
          ← Retour au site
        </Link>
      </div>
    );
  }

  // ── CARROUSEL PLEIN ÉCRAN ───────────────────────────────────────────────────
  return (
    <div style={{ ...sans, background: T.deep, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

      {/* halo fond */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 40%, #1a3a6b, transparent 70%)", pointerEvents: "none" }} />

      {/* header */}
      <header style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }}>
        <Link to="/"
          style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "rgba(255,255,255,0.4)", ...sans, fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", transition: "color .2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.75)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour
        </Link>

        <span style={{ ...serif, fontStyle: "italic", fontSize: "17px", color: "rgba(255,255,255,0.4)" }}>
          Messages privés
        </span>

        {/* hint clavier */}
        <span style={{ ...sans, fontSize: "9px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
          ← → Clavier
        </span>
      </header>

      {/* carrousel */}
      <Carousel msgs={msgs} />
    </div>
  );
}
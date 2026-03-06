import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { T, serif, sans, LBL } from "../constants/theme";
import { db } from "../firebase-config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// ── Mot de passe pour le jour J ───────────────────────────────────────────────
// Change cette valeur avant le jour de la réception
const SECRET = "joyeux50";

export default function MessagesList() {
  const [unlocked,  setUnlocked]  = useState(false);
  const [pwd,       setPwd]       = useState("");
  const [pwdError,  setPwdError]  = useState(false);
  const [msgs,      setMsgs]      = useState([]);
  const [pwdHov,    setPwdHov]    = useState(false);
  const [fc,        setFc]        = useState(false);

  // Charge les messages seulement si déverrouillé
  useEffect(() => {
    if (!unlocked) return;
    const q = query(collection(db, "voeux"), orderBy("timestamp", "desc"));
    return onSnapshot(q, snap =>
      setMsgs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, [unlocked]);

  function unlock() {
    if (pwd.trim() === SECRET) {
      setUnlocked(true);
      setPwdError(false);
    } else {
      setPwdError(true);
      setPwd("");
    }
  }

  // ── ÉCRAN MOT DE PASSE ───────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div style={{ ...sans, background: T.deep, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, #1a3a6b, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px", textAlign: "center" }}>
          {/* icône cadenas */}
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          <p style={{ ...LBL, color: T.pale, marginBottom: "16px" }}>Accès réservé</p>
          <h1 style={{ ...serif, fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: T.white, marginBottom: "12px" }}>
            Messages privés
          </h1>
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.35)", marginBottom: "40px", lineHeight: 1.8 }}>
            Cette page est réservée au jour de la réception.<br />
            Entrez le mot de passe pour accéder aux messages.
          </p>

          {/* Champ mot de passe */}
          <div style={{ position: "relative", marginBottom: "8px" }}>
            <input
              type="password"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setPwdError(false); }}
              onKeyDown={e => e.key === "Enter" && unlock()}
              onFocus={() => setFc(true)}
              onBlur={() => setFc(false)}
              placeholder="Mot de passe"
              style={{
                ...sans,
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${pwdError ? "#e05555" : fc ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)"}`,
                padding: "14px 20px",
                fontSize: "14px",
                fontWeight: 300,
                color: T.white,
                outline: "none",
                letterSpacing: "0.15em",
                textAlign: "center",
                transition: "border-color .25s",
              }}
            />
            {pwdError && (
              <p style={{ ...sans, fontSize: "11px", color: "#e05555", marginTop: "10px", letterSpacing: "0.1em" }}>
                Mot de passe incorrect.
              </p>
            )}
          </div>

          <button
            onClick={unlock}
            onMouseEnter={() => setPwdHov(true)}
            onMouseLeave={() => setPwdHov(false)}
            style={{ ...sans, width: "100%", marginTop: "16px", padding: "14px", background: pwdHov ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.18)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer", transition: "background .25s, color .25s" }}>
            Accéder aux messages
          </button>

          <div style={{ marginTop: "40px" }}>
            <Link to="/"
              style={{ ...sans, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── LISTE DES MESSAGES (déverrouillée) ───────────────────────────────────
  return (
    <div style={{ ...sans, background: T.white, minHeight: "100vh", color: T.deep }}>

      {/* HEADER */}
      <header style={{ background: T.deep, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px", position: "sticky", top: 0, zIndex: 100 }}>
        <Link to="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "rgba(255,255,255,0.55)", ...sans, fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", transition: "color .2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour au site
        </Link>

        <span style={{ ...serif, fontStyle: "italic", fontSize: "18px", color: "rgba(255,255,255,0.5)" }}>
          Messages privés
        </span>

        <span style={{ ...sans, fontSize: "11px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }}>
          {msgs.length} message{msgs.length > 1 ? "s" : ""}
        </span>
      </header>

      {/* HERO */}
      <div style={{ background: T.deep, padding: "72px 40px 96px", textAlign: "center" }}>
        <p style={{ ...LBL, color: T.pale, marginBottom: "16px" }}>Le jour J</p>
        <h1 style={{ ...serif, fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: T.white, marginBottom: "16px" }}>
          {msgs.length} message{msgs.length > 1 ? "s" : ""} reçu{msgs.length > 1 ? "s" : ""}
        </h1>
        <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
          Avec tout l'amour de ses proches.
        </p>
      </div>

      {/* MESSAGES */}
      <div style={{ maxWidth: "760px", margin: "-48px auto 0", padding: "0 24px 100px" }}>

        {msgs.length === 0 ? (
          <div style={{ background: T.white, border: "1px solid rgba(10,22,40,0.08)", padding: "64px", textAlign: "center", color: T.muted, fontSize: "13px", letterSpacing: "0.1em" }}>
            Aucun message pour le moment.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(10,22,40,0.07)", border: "1px solid rgba(10,22,40,0.07)" }}>
            {msgs.map((m, i) => (
              <Reveal key={m.id} delay={["", "d1", "d2", "d3"][i % 4]}>
                <div style={{ background: T.white, padding: "40px 44px", transition: "background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.off}
                  onMouseLeave={e => e.currentTarget.style.background = T.white}>

                  {/* numéro + auteur */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div>
                      <p style={{ ...sans, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: T.accent, marginBottom: "4px" }}>
                        {m.name}
                      </p>
                      {m.relation && (
                        <span style={{ ...sans, fontSize: "10px", letterSpacing: "0.12em", color: T.muted }}>
                          {m.relation}
                        </span>
                      )}
                    </div>
                    <span style={{ ...sans, fontSize: "11px", color: "rgba(10,22,40,0.18)", letterSpacing: "0.1em" }}>
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* message */}
                  <p style={{ ...serif, fontSize: "22px", fontWeight: 300, lineHeight: 1.8, color: T.deep, fontStyle: "italic" }}>
                    {m.message}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* retour */}
        <div style={{ textAlign: "center", marginTop: "72px" }}>
          <Link to="/"
            style={{ ...sans, display: "inline-block", padding: "14px 48px", border: `1px solid ${T.deep}`, color: T.deep, fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none", transition: "background .3s, color .3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.deep; e.currentTarget.style.color = T.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.deep; }}>
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { T, serif, sans, LBL } from "../constants/theme";
import { db } from "../firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Messages() {
  const [name,   setName]   = useState("");
  const [rel,    setRel]    = useState("");
  const [msg,    setMsg]    = useState("");
  const [status, setStatus] = useState("");
  const [sent,   setSent]   = useState(false);
  const [bh,     setBh]     = useState(false);
  const [fc,     setFc]     = useState({});
  const sf = (k, v) => setFc(p => ({ ...p, [k]: v }));

  const inp = (k) => ({
    ...sans, border: "none",
    borderBottom: `1px solid ${fc[k] ? T.accent : "rgba(10,22,40,0.15)"}`,
    padding: "12px 0", fontSize: "14px", fontWeight: 300, color: T.deep,
    background: "transparent", outline: "none", width: "100%",
    transition: "border-color .3s",
  });

  async function send() {
    if (!name.trim() || !msg.trim()) {
      setStatus("Veuillez renseigner votre prénom et votre message.");
      return;
    }
    // if (msg.length > 600) {
    //   setStatus("Message trop long (600 car. max).");
    //   return;
    // }
    try {
      setStatus("Envoi en cours…");
      await addDoc(collection(db, "voeux"), {
        name:      name.trim(),
        relation:  rel.trim(),
        message:   msg.trim(),
        timestamp: serverTimestamp(),
      });
      setSent(true);   // affiche l'écran de confirmation
    } catch (err) {
      console.error(err);
      setStatus("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  // ── ÉCRAN DE CONFIRMATION ─────────────────────────────────────────────────
  if (sent) {
    return (
      <div style={{ ...sans, background: T.deep, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px", color: T.white }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, #1a3a6b, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "500px" }}>
          {/* icône check */}
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <p style={{ ...LBL, color: T.pale, marginBottom: "20px" }}>Message envoyé</p>

          <h2 style={{ ...serif, fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, lineHeight: 1.3, marginBottom: "24px" }}>
            Merci {name},<br />votre message a été reçu.
          </h2>

          <p style={{ ...sans, fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: "48px" }}>
            Il sera lu à voix haute lors de la réception.<br />
            Votre présence, en mots ou en personne, compte énormément.
          </p>

          <Link to="/"
            style={{ ...sans, display: "inline-block", padding: "14px 48px", border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.7)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none", transition: "border-color .25s, color .25s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
            Retour au site
          </Link>
        </div>
      </div>
    );
  }

  // ── FORMULAIRE ────────────────────────────────────────────────────────────
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
          Livre d'or
        </span>
        <div style={{ width: "120px" }} /> {/* spacer */}
      </header>

      {/* HERO */}
      <div style={{ background: T.deep, padding: "80px 40px 100px", textAlign: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, #1a3a6b, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ ...LBL, color: T.pale, marginBottom: "16px" }}>Pour lui</p>
            <h1 style={{ ...serif, fontSize: "clamp(40px,6vw,72px)", fontWeight: 300, color: T.white, marginBottom: "16px" }}>
              Laissez un message
            </h1>
            <p style={{ ...sans, fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", maxWidth: "420px", margin: "0 auto", lineHeight: 1.8 }}>
              Votre message sera lu lors de la réception.<br />
              Il ne sera pas visible par les autres invités.
            </p>
          </div>
        </div>
      </div>

      {/* FORMULAIRE */}
      <div style={{ maxWidth: "680px", margin: "-48px auto 0", padding: "0 24px 100px" }}>
        <Reveal>
          <div className="fb" style={{ background: T.white, border: "1px solid rgba(10,22,40,0.11)", padding: "48px", boxShadow: "0 8px 48px rgba(10,22,40,0.08)" }}>
            <p style={{ ...LBL, marginBottom: "32px" }}>Votre message</p>

            <div className="fr" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={LBL}>Prénom</label>
                <input style={inp("n")} value={name} onChange={e => setName(e.target.value)}
                  onFocus={() => sf("n", 1)} onBlur={() => sf("n", 0)}
                  placeholder="Votre prénom" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={LBL}>Votre lien</label>
                <input style={inp("r")} value={rel} onChange={e => setRel(e.target.value)}
                  onFocus={() => sf("r", 1)} onBlur={() => sf("r", 0)}
                  placeholder="ex. Ami d'enfance, collègue…" />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" }}>
              <label style={LBL}>Votre message</label>
              <textarea
                style={{ ...inp("m"), minHeight: "140px", resize: "none" }}
                value={msg} onChange={e => setMsg(e.target.value)}
                onFocus={() => sf("m", 1)} onBlur={() => sf("m", 0)}
                placeholder="Votre vœu, votre souvenir, votre mot du cœur…"
              />
              <p style={{ ...sans, fontSize: "10px", color: T.muted, textAlign: "right", marginTop: "4px" }}>
                {msg.length} / 600
              </p>
            </div>

            <button
              onClick={send}
              onMouseEnter={() => setBh(true)}
              onMouseLeave={() => setBh(false)}
              style={{ ...sans, marginTop: "32px", padding: "14px 48px", background: bh ? "transparent" : T.deep, color: bh ? T.deep : T.white, border: `1px solid ${T.deep}`, fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer", transition: "background .3s, color .3s" }}>
              Envoyer mon message
            </button>

            {status && (
              <p style={{ ...sans, marginTop: "16px", fontSize: "13px", color: T.accent, fontStyle: "italic" }}>
                {status}
              </p>
            )}

            {/* note de confidentialité */}
            <p style={{ ...sans, fontSize: "10px", color: "rgba(10,22,40,0.3)", letterSpacing: "0.1em", marginTop: "28px", lineHeight: 1.7, borderTop: "1px solid rgba(10,22,40,0.07)", paddingTop: "20px" }}>
              Votre message est privé — il ne sera visible que le jour de la réception.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
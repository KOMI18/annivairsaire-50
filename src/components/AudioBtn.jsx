import { useState } from "react";
import { T } from "../constants/theme";

export default function AudioBtn({ playing, onToggle }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      className="audio-btn"
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={playing ? "Couper la musique" : "Remettre la musique"}
      style={{
        position: "fixed", bottom: "28px", right: "28px", zIndex: 999,
        width: "42px", height: "42px", borderRadius: "50%",
        background:   hov ? "rgba(10,22,40,0.95)" : "rgba(10,22,40,0.72)",
        border:      `1px solid ${hov ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)"}`,
        color: T.white, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(10px)",
        transition: "background .25s, border-color .25s",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      {playing && <span className="audio-ripple" />}
      {playing ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.5)" strokeWidth="1.7" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      )}
    </button>
  );
}
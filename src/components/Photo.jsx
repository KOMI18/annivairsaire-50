import { T } from "../constants/theme";

export default function Photo({ text, dark = true, portrait = false }) {
  return (
    <div style={{
      aspectRatio:  portrait ? "3/4" : "4/3",
      background:   dark ? T.mid : T.pale,
      border:      `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(10,22,40,0.09)"}`,
      display:      "flex", flexDirection: "column",
      alignItems:   "center", justifyContent: "center",
      gap:          "14px",
      color:        dark ? "rgba(255,255,255,0.28)" : T.muted,
      fontSize:     "10px", letterSpacing: "0.16em", textTransform: "uppercase",
    }}>
      <div style={{
        width: "46px", height: "46px", borderRadius: "50%",
        border: `1px solid ${dark ? "rgba(255,255,255,0.2)" : "rgba(46,95,163,0.25)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke={dark ? "rgba(255,255,255,0.3)" : T.muted} strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="1"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
      {text}
    </div>
  );
}
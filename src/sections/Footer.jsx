import { Link } from "react-router-dom";
import { T, serif, sans } from "../constants/theme";

export default function Footer() {
  return (
    <footer style={{ background:T.deep, color:"rgba(255,255,255,0.28)", textAlign:"center", padding:"56px 40px", fontSize:"11px", letterSpacing:"0.2em" }}>
      <span style={{ ...serif, fontStyle:"italic", fontSize:"22px", color:"rgba(255,255,255,0.6)", display:"block", marginBottom:"20px" }}>
        Joyeux 50e anniversaire
      </span>
      <Link
        to="/messages"
        style={{
          ...sans,
          display: "inline-block",
          marginBottom: "24px",
          padding: "12px 36px",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "rgba(255,255,255,0.65)",
          fontSize: "10px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "border-color .25s, color .25s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.6)"; e.currentTarget.style.color="#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"; e.currentTarget.style.color="rgba(255,255,255,0.65)"; }}
      >
        Messages
      </Link>
      <p> Made with <span style={{color:"#ff69b4"}}>&hearts;</span> by <a href="https://komi.invity.site" style={{color:"#ff69b4"}}>Parfait Kom</a></p>
    </footer>
  );
}
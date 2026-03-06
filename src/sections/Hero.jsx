import { useRef, useEffect } from "react";
import { T, serif, LBL } from "../constants/theme";

export default function Hero() {
  const nb = useRef();
  useEffect(() => {
    const f = () => {
      if (nb.current && window.scrollY < window.innerHeight)
        nb.current.style.transform = `translate(-50%, calc(-52% + ${window.scrollY * 0.28}px))`;
    };
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <section style={{ height:"100vh", background:T.deep, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 65% 55% at 50% 40%,#1a3a6b,transparent 70%)" }} />
      <div ref={nb} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-52%)", ...serif, fontSize:"clamp(130px,22vw,280px)", fontWeight:300, color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,0.09)", lineHeight:1, userSelect:"none" }}>
        50
      </div>
      <div style={{ position:"relative", zIndex:2, textAlign:"center", color:T.white }}>
        <p className="h1" style={{ ...LBL, color:T.pale }}>Une vie célébrée</p>
                <h1 className="h2" style={{...serif,fontSize:"clamp(48px,8vw,96px)",fontWeight:300,letterSpacing:"0.05em",margin:"16px 0 8px"}}> Hubert Tchuente</h1>

        <p className="h3" style={{ ...serif, fontStyle:"italic", fontSize:"clamp(18px,2.5vw,28px)", fontWeight:300, color:T.pale }}>
          {/* 1975 — 2025 */}
        </p>
      </div>
      <div className="h4" style={{ position:"absolute", bottom:"40px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase" }}>
        <div className="sb" style={{ width:"1px", height:"52px", background:"linear-gradient(to bottom,rgba(255,255,255,0.4),transparent)" }} />
        Défiler
      </div>
    </section>
  );
}
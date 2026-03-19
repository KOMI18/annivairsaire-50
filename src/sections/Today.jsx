import Reveal  from "../components/Reveal";
import Gallery from "../components/Gallery";
import { GALLERIES } from "../data/galleries";
import { T, serif, LBL } from "../constants/theme";

export default function Today() {
  return (
    <>
      <section style={{ background: T.deep, padding: "140px 40px 64px", textAlign: "center" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <Reveal>
            <p style={{ ...LBL, marginBottom: "12px" }}>Aujourd'hui</p>
            <h2 style={{ ...serif, fontSize:"clamp(38px,6vw,70px)", fontWeight:300, color:T.white, marginBottom:"56px" }}>
              50 ans, et le plus beau<br />reste à venir
            </h2>
          </Reveal>
          <Reveal delay="d1">
   
             
            <img src='/now-0.jpeg' alt="..." style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </Reveal>
          <Reveal delay="d2">
            <p style={{ ...serif, fontStyle:"italic", fontSize:"clamp(20px,3vw,34px)", fontWeight:300, lineHeight:1.65, color:T.pale }}>
              « Cinquante ans, c'est la somme de tout ce qu'on a vécu —<br />
              et la promesse de tout ce qui reste encore à vivre. »
            </p>
          </Reveal>
        </div>
      </section>

      <div style={{ background: T.deep, paddingTop: "32px" }}>
        <Gallery images={GALLERIES.aujourd_hui} dark />
      </div>
      {/* <div style={{ height:"1px", background:"rgba(255,255,255,0.06)", margin:"0 40px" }} /> */}
    </>
  );
}
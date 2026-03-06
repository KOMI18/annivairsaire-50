import Reveal   from "../components/Reveal";
import Photo    from "../components/Photo";
import Gallery  from "../components/Gallery";
import { T, serif, sans, LBL } from "../constants/theme";

export default function Chapter({ dark=true, rev=false, era, title, desc, img, portrait=false, gallery }) {
  return (
    <>
      <section style={{ background: dark ? T.deep : T.off, padding: "120px 40px 64px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="cg" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center", direction: rev ? "rtl" : "ltr" }}>
            <Reveal delay="d1"><img src={img} alt="..." style={{width:"100%",height:"100%",objectFit:"cover"}}/></Reveal>
            <Reveal delay="d2">
              <div style={{ direction: "ltr" }}>
                <p style={{ ...LBL, marginBottom: "14px" }}>{era}</p>
                <h2 style={{ ...serif, fontSize:"clamp(28px,3.5vw,44px)", fontWeight:300, lineHeight:1.3, color: dark ? T.white : T.deep, marginBottom:"20px", whiteSpace:"pre-line" }}>
                  {title}
                </h2>
                <p style={{ ...sans, fontSize:"14px", lineHeight:1.9, fontWeight:300, color: dark ? "rgba(255,255,255,0.52)" : "#3a5a8a" }}>
                  {desc}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div style={{ background: dark ? T.deep : T.off, paddingTop: "32px" }}>
        <Gallery images={gallery} dark={dark} />
      </div>
      <div style={{ height:"1px", background: dark ? "rgba(255,255,255,0.06)" : "rgba(10,22,40,0.08)", margin:"0 40px" }} />
    </>
  );
}
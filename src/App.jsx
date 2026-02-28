// App.jsx — Site Anniversaire 50 ans
// React + Firebase + Galerie Masonry Pinterest

import { useState, useEffect, useRef, useCallback } from "react";


import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import {db} from './firebase-config'
const MOCK_MSGS = [
  { id:1, name:"Sophie",  relation:"Sœur",          message:"50 ans et toujours aussi incroyable. Tellement fière de toi." },
  { id:2, name:"Marc",    relation:"Ami d'enfance",  message:"Trente ans d'amitié et pas une ride. Enfin, sur l'amitié." },
  { id:3, name:"Isabelle",relation:"Collègue",       message:"Travailler à tes côtés a été une chance. Joyeux anniversaire !" },
];

// ─── Données galeries par chapitre ──────────────────────────────────────────
// Chaque image a: src (placeholder), alt, ratio (portrait/paysage/carré)
const GALLERIES = {
  enfance: [
    { src:"baby-1.jpeg", alt:"Bébé dans les bras de maman",     ratio:"portrait" },
    { src:null, alt:"Premier jour d'école",             ratio:"paysage"  },
    { src:null, alt:"Noël en famille",                  ratio:"carre"    },
    { src:null, alt:"Vacances d'été",                   ratio:"portrait" },
  ],
  jeunesse: [
    { src:"/jeune-2.jpeg", alt:"Avec les amis du lycée",           ratio:"paysage"  },
    { src:"/jeune-3.jpeg", alt:"Voyage scolaire",                  ratio:"portrait" },
    { src:"/jeune-4.jpeg", alt:"Soirée mémorable",                 ratio:"carre"    },
    { src:"/jeune-5.jpeg", alt:"Sport et passion",                 ratio:"paysage"  },
  ],
  femme: [
    { src:"/femme-1.jpeg", alt:"Les fiançailles",                  ratio:"portrait" },
    { src:"/femme-2.jpeg", alt:"Le grand jour",                    ratio:"paysage"  },
    { src:"/femme-3.jpeg", alt:"Voyage de noces",                  ratio:"carre"    },
    { src:"/femme-4.jpeg", alt:"Une soirée à deux",                ratio:"portrait" },
  ],
  enfants: [
    { src:"/kids-1.jpeg", alt:"À la naissance",                   ratio:"carre"    },
    { src:"/kids-2.jpeg", alt:"Premiers pas",                     ratio:"portrait" },
    { src:"/kids-3.jpeg", alt:"Vacances en famille",              ratio:"paysage"  },
    { src:"/kids-4.jpeg", alt:"Noël ensemble",                    ratio:"portrait" },
  ],
  aujourd_hui: [
    { src:"/now-2.jpeg", alt:"Portrait aujourd'hui",             ratio:"portrait" },
    { src:"/now-3.jpeg", alt:"En famille réunie",                ratio:"paysage"  },
    { src:"/now-4.jpeg", alt:"Entre amis",                       ratio:"carre"    },
    { src:"/now-1.jpeg", alt:"Le regard vers demain",            ratio:"portrait" },
  ],
};

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;} body{overflow-x:hidden;}

@keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:.3;transform:scaleY(1)}50%{opacity:1;transform:scaleY(.6)}}
@keyframes lbIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}

.h1{animation:fadeUp 1s .3s both} .h2{animation:fadeUp 1s .65s both}
.h3{animation:fadeUp 1s .95s both} .h4{animation:fadeUp 1s 1.45s both}
.sb{animation:pulse 2.2s infinite}
.rv{opacity:0;transform:translateY(32px);transition:opacity .85s ease,transform .85s ease}
.rv.d1{transition-delay:.12s} .rv.d2{transition-delay:.26s} .rv.d3{transition-delay:.4s}
.rv.on{opacity:1;transform:translateY(0)}

/* Masonry grid */
.masonry{columns:2;column-gap:10px;padding:0 40px 80px;max-width:1100px;margin:0 auto;}
@media(min-width:900px){.masonry{columns:4;column-gap:12px;}}
@media(max-width:520px){.masonry{columns:2;column-gap:8px;padding:0 20px 60px;}}

.m-item{
  break-inside:avoid;margin-bottom:10px;overflow:hidden;
  cursor:pointer;position:relative;
  background:rgba(255,255,255,0.04);
}
@media(min-width:900px){.m-item{margin-bottom:12px;}}

.m-item img,.m-item .m-ph{display:block;width:100%;transition:transform .55s cubic-bezier(.25,.46,.45,.94);}
.m-item:hover img,.m-item:hover .m-ph{transform:scale(1.04);}

.m-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(10,22,40,.72) 0%,transparent 50%);
  opacity:0;transition:opacity .35s ease;
  display:flex;align-items:flex-end;padding:16px;
}
.m-item:hover .m-overlay{opacity:1;}
.m-caption{color:rgba(255,255,255,.88);font-size:11px;letter-spacing:.12em;line-height:1.4;font-family:'Montserrat',sans-serif;font-weight:300;}

/* Lightbox */
.lb-bg{
  position:fixed;inset:0;background:rgba(10,22,40,.95);
  z-index:1000;display:flex;align-items:center;justify-content:center;
  animation:lbIn .25s ease both;
}
.lb-inner{position:relative;max-width:90vw;max-height:88vh;animation:lbIn .3s .05s ease both;}
.lb-inner img,.lb-inner .lb-ph{max-width:90vw;max-height:88vh;object-fit:contain;display:block;}
.lb-inner .lb-ph{width:min(600px,88vw);height:min(500px,60vh);}
.lb-close{
  position:fixed;top:24px;right:28px;background:none;border:none;
  color:rgba(255,255,255,.55);font-size:28px;cursor:pointer;
  line-height:1;transition:color .2s;
}
.lb-close:hover{color:#fff;}
.lb-nav{
  position:fixed;top:50%;transform:translateY(-50%);
  background:none;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.6);
  width:44px;height:44px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:border-color .2s,color .2s;font-size:18px;
}
.lb-nav:hover{border-color:rgba(255,255,255,.6);color:#fff;}
.lb-prev{left:20px;} .lb-next{right:20px;}
.lb-caption{
  position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
  color:rgba(255,255,255,.5);font-size:11px;letter-spacing:.2em;
  font-family:'Montserrat',sans-serif;font-weight:300;text-transform:uppercase;
  white-space:nowrap;
}

/* Form & misc */
.mc:hover{background:#f5f8ff!important}
.btn:hover{background:transparent!important;color:#0a1628!important}
@media(max-width:700px){
  .cg{grid-template-columns:1fr!important;direction:ltr!important}
  .fr{grid-template-columns:1fr!important}
  .fb{padding:28px 18px!important}
}
`;

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const T = {
  deep:"#0a1628", mid:"#1a3a6b", accent:"#2e5fa3",
  pale:"#d4e3f7", off:"#f5f8ff", muted:"#6b8ab5", white:"#ffffff",
};
const serif = { fontFamily:"'Cormorant Garamond',serif" };
const sans  = { fontFamily:"'Montserrat',sans-serif" };
const LBL   = { ...sans, fontSize:"10px", letterSpacing:"0.38em", textTransform:"uppercase", color:T.muted };

// ratio → aspect-ratio CSS
const RATIO = { portrait:"2/3", paysage:"4/3", carre:"1/1" };

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useReveal(thresh=0.13){
  const ref=useRef(); const [on,setOn]=useState(false);
  useEffect(()=>{
    const el=ref.current; if(!el)return;
    const ob=new IntersectionObserver(([e])=>{ if(e.isIntersecting){setOn(true);ob.disconnect();} },{threshold:thresh});
    ob.observe(el); return()=>ob.disconnect();
  },[thresh]);
  return [ref,on];
}
function R({c,d=""}){ const [r,on]=useReveal(); return <div ref={r} className={`rv ${d} ${on?"on":""}`}>{c}</div>; }

// ─── PHOTO PLACEHOLDER (section hero) ────────────────────────────────────────
function Img({text,dark=true,portrait=false}){
  return(
    <div style={{aspectRatio:portrait?"3/4":"4/3",background:dark?T.mid:T.pale,border:`1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(10,22,40,0.09)"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"14px",color:dark?"rgba(255,255,255,0.28)":T.muted,fontSize:"10px",letterSpacing:"0.16em",textTransform:"uppercase"}}>
      <div style={{width:"46px",height:"46px",borderRadius:"50%",border:`1px solid ${dark?"rgba(255,255,255,0.2)":"rgba(46,95,163,0.25)"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dark?"rgba(255,255,255,0.3)":T.muted} strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
      {text}
    </div>
  );
}

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }){
  const [cur,setCur]=useState(index);
  const img=images[cur];

  const prev=useCallback(()=>setCur(c=>(c-1+images.length)%images.length),[images.length]);
  const next=useCallback(()=>setCur(c=>(c+1)%images.length),[images.length]);

  useEffect(()=>{
    const h=(e)=>{ if(e.key==="Escape")onClose(); if(e.key==="ArrowLeft")prev(); if(e.key==="ArrowRight")next(); };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[onClose,prev,next]);

  return(
    <div className="lb-bg" onClick={onClose}>
      <button className="lb-close" onClick={onClose}>&#x2715;</button>
      <button className="lb-nav lb-prev" onClick={e=>{e.stopPropagation();prev();}}>&#x2039;</button>
      <button className="lb-nav lb-next" onClick={e=>{e.stopPropagation();next();}}>&#x203a;</button>

      <div className="lb-inner" onClick={e=>e.stopPropagation()}>
        {img.src
          ? <img src={img.src} alt={img.alt}/>
          : <div className="lb-ph" style={{
              background:T.mid,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              gap:"14px",color:"rgba(255,255,255,0.28)",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
              </svg>
              {img.alt}
            </div>
        }
      </div>

      <p className="lb-caption">{cur+1} / {images.length} — {img.alt}</p>
    </div>
  );
}

// ─── GALERIE MASONRY ─────────────────────────────────────────────────────────
function Gallery({ images, dark=true }){
  const [lb,setLb]=useState(null);
  const [ref,on]=useReveal(0.08);

  // Stagger chaque item
  return(
    <>
      <div ref={ref} className="masonry" style={{paddingTop:"0"}}>
        {images.map((img,i)=>(
          <div
            key={i}
            className={`m-item rv ${["","d1","d2","d3"][i]} ${on?"on":""}`}
            style={{transitionDelay:`${i*0.1}s`}}
            onClick={()=>setLb(i)}
          >
            {img.src
              ? <img src={img.src} alt={img.alt} style={{aspectRatio:RATIO[img.ratio]||"4/3",objectFit:"cover"}}/>
              : <div className="m-ph" style={{
                  aspectRatio:RATIO[img.ratio]||"4/3",
                  background:dark?"rgba(255,255,255,0.05)":"rgba(10,22,40,0.07)",
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  gap:"10px",color:dark?"rgba(255,255,255,0.22)":T.muted,
                  fontSize:"9px",letterSpacing:"0.12em",textTransform:"uppercase",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                  </svg>
                  {img.alt}
                </div>
            }
            <div className="m-overlay">
              <p className="m-caption">{img.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {lb!==null && <Lightbox images={images} index={lb} onClose={()=>setLb(null)}/>}
    </>
  );
}

// ─── SECTION DIVIDER ─────────────────────────────────────────────────────────
function Divider({dark=true}){
  return(
    <div style={{
      height:"1px",
      background:dark?"rgba(255,255,255,0.06)":"rgba(10,22,40,0.08)",
      margin:"0 40px",
    }}/>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero(){
  const nb=useRef();
  useEffect(()=>{
    const f=()=>{ if(nb.current&&window.scrollY<window.innerHeight) nb.current.style.transform=`translate(-50%,calc(-52% + ${window.scrollY*.28}px))`; };
    window.addEventListener("scroll",f,{passive:true}); return()=>window.removeEventListener("scroll",f);
  },[]);
  return(
    <section style={{height:"100vh",background:T.deep,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 65% 55% at 50% 40%,#1a3a6b,transparent 70%)"}}/>
      <div ref={nb} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-52%)",...serif,fontSize:"clamp(150px,30vw,300px)",fontWeight:300,color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.09)",lineHeight:1,userSelect:"none",letterSpacing:"-0.02em"}}>50</div>
      <div style={{position:"relative",zIndex:2,textAlign:"center",color:T.white}}>
        <p className="h1" style={{...LBL,color:T.pale}}>Une vie célébrée</p>
        <h1 className="h2" style={{...serif,fontSize:"clamp(48px,8vw,96px)",fontWeight:300,letterSpacing:"0.05em",margin:"16px 0 8px"}}> Hubert Tchuente</h1>
        {/* <p className="h3" style={{...serif,fontStyle:"italic",fontSize:"clamp(18px,2.5vw,28px)",fontWeight:300,color:T.pale}}>1975 — 2025</p> */}
      </div>
      <div className="h4" style={{position:"absolute",bottom:"40px",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",color:"rgba(255,255,255,0.3)",fontSize:"9px",letterSpacing:"0.25em",textTransform:"uppercase"}}>
        <div className="sb" style={{width:"1px",height:"52px",background:"linear-gradient(to bottom,rgba(255,255,255,0.4),transparent)"}}/>
        Défiler
      </div>
    </section>
  );
}

// ─── CHAPTER ─────────────────────────────────────────────────────────────────
function Chap({dark=true,rev=false,era,title,desc,img,portrait=false,gallery}){
  return(
    <>
      <section style={{background:dark?T.deep:T.off,padding:"120px 40px 64px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <div className="cg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"center",direction:rev?"rtl":"ltr"}}>
            <R d="d1" c={<img src={img} alt="..." style={{width:"100%",height:"100%",objectFit:"cover"}}/>}/>
            <R d="d2" c={
              <div style={{direction:"ltr"}}>
                <p style={{...LBL,marginBottom:"14px"}}>{era}</p>
                <h2 style={{...serif,fontSize:"clamp(28px,3.5vw,44px)",fontWeight:300,lineHeight:1.3,color:dark?T.white:T.deep,marginBottom:"20px",whiteSpace:"pre-line"}}>{title}</h2>
                <p style={{...sans,fontSize:"14px",lineHeight:1.9,fontWeight:300,color:dark?"rgba(255,255,255,0.52)":"#3a5a8a"}}>{desc}</p>
              </div>
            }/>
          </div>
        </div>
      </section>

      {/* ── GALERIE MASONRY ── */}
      <div style={{background:dark?T.deep:T.off,paddingTop:"32px"}}>
        <Gallery images={gallery} dark={dark}/>
      </div>

      <Divider dark={dark}/>
    </>
  );
}

// ─── TODAY ────────────────────────────────────────────────────────────────────
function Today(){
  return(
    <>
      <section style={{background:T.deep,padding:"140px 40px 64px",textAlign:"center"}}>
        <div style={{maxWidth:"760px",margin:"0 auto"}}>
          <R c={<>
            <p style={{...LBL,marginBottom:"12px"}}>Aujourd'hui</p>
            <h2 style={{...serif,fontSize:"clamp(38px,6vw,70px)",fontWeight:300,color:T.white,marginBottom:"56px"}}>50 ans, et le plus beau<br/>reste à venir</h2>
          </>}/>
          <img src='/now-1.jpeg' alt="..." style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <R d="d2" c={
            <p style={{...serif,fontStyle:"italic",fontSize:"clamp(20px,3vw,34px)",fontWeight:300,lineHeight:1.65,color:T.pale}}>
              « Cinquante ans, c'est la somme de tout ce qu'on a vécu —<br/>et la promesse de tout ce qui reste encore à vivre. »
            </p>
          }/>
        </div>
      </section>

      <div style={{background:T.deep,paddingTop:"32px"}}>
        <Gallery images={GALLERIES.aujourd_hui} dark={true}/>
      </div>
      <Divider dark={true}/>
    </>
  );
}

// ─── VOEUX ────────────────────────────────────────────────────────────────────
function Voeux(){
  const [name, setName] = useState(""); 
  const [rel, setRel] = useState(""); 
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(""); 
  const [msgs, setMsgs] = useState([]);
  const [bh,setBh]=useState(false); const [fc,setFc]=useState({});
  const sf=(k,v)=>setFc(p=>({...p,[k]:v}));
  const inp=(k)=>({...sans,border:"none",borderBottom:`1px solid ${fc[k]?T.accent:"rgba(10,22,40,0.15)"}`,padding:"12px 0",fontSize:"14px",fontWeight:300,color:T.deep,background:"transparent",outline:"none",width:"100%",transition:"border-color .3s"});
  useEffect(() => {
    const q = query(collection(db, "voeux"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMsgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMsgs(loadedMsgs);
    });
    return () => unsubscribe(); // Nettoyage du listener
  }, []);
  async function send() {
    if (!name.trim() || !msg.trim()) {
      setStatus("Veuillez renseigner votre prénom et votre message.");
      return;
    }
    
    try {
      // 3. ENVOI À FIREBASE
      await addDoc(collection(db, "voeux"), {
        name: name.trim(),
        relation: rel.trim(),
        message: msg.trim(),
        timestamp: serverTimestamp()
      });

      setStatus("Votre message a bien été envoyé. Merci !");
      setName(""); setRel(""); setMsg("");
      setTimeout(() => setStatus(""), 4000);
    } catch (e) {
      console.error("Erreur Firebase:", e);
      setStatus("Une erreur est survenue lors de l'envoi.");
    }
  }
  return(
    <section style={{background:T.white,padding:"120px 40px"}}>
      <div style={{maxWidth:"900px",margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"64px"}}>
          <R c={<><p style={{...LBL,marginBottom:"12px"}}>À ceux qui l'aiment</p><h2 style={{...serif,fontSize:"clamp(36px,5vw,54px)",fontWeight:300,color:T.deep}}>Livre d'or</h2></>}/>
        </div>
        <R c={
          <div className="fb" style={{border:"1px solid rgba(10,22,40,0.11)",padding:"48px",marginBottom:"64px"}}>
            <div className="fr" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px",marginBottom:"24px"}}>
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                <label style={LBL}>Votre prénom</label>
                <input style={inp("n")} value={name} onChange={e=>setName(e.target.value)} onFocus={()=>sf("n",1)} onBlur={()=>sf("n",0)} placeholder="Votre prénom"/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                <label style={LBL}>Votre lien</label>
                <input style={inp("r")} value={rel} onChange={e=>setRel(e.target.value)} onFocus={()=>sf("r",1)} onBlur={()=>sf("r",0)} placeholder="ex. Ami d'enfance, collègue…"/>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"8px"}}>
              <label style={LBL}>Votre message</label>
              <textarea style={{...inp("m"),minHeight:"110px",resize:"none"}} value={msg} onChange={e=>setMsg(e.target.value)} onFocus={()=>sf("m",1)} onBlur={()=>sf("m",0)} placeholder="Votre vœu, votre souvenir, votre mot du cœur…"/>
            </div>
            <button className="btn" onClick={send} onMouseEnter={()=>setBh(1)} onMouseLeave={()=>setBh(0)}
              style={{...sans,marginTop:"32px",padding:"14px 48px",background:bh?"transparent":T.deep,color:bh?T.deep:T.white,border:`1px solid ${T.deep}`,fontSize:"10px",letterSpacing:"0.25em",textTransform:"uppercase",cursor:"pointer",transition:"background .3s,color .3s"}}>
              Envoyer mon message
            </button>
            {status&&<p style={{...sans,marginTop:"16px",fontSize:"13px",color:T.accent,fontStyle:"italic"}}>{status}</p>}
          </div>
        } d="d1"/>
        <R c={
          msgs.length===0
            ?<p style={{textAlign:"center",padding:"64px",color:T.muted,fontSize:"13px"}}>Les messages apparaîtront ici.</p>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"1px",background:"rgba(10,22,40,0.08)",border:"1px solid rgba(10,22,40,0.08)"}}>
              {msgs.map(m=>(
                <div key={m.id} className="mc" style={{background:T.white,padding:"32px 28px",transition:"background .2s"}}>
                  <p style={{...sans,fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",color:T.accent,marginBottom:"4px"}}>{m.name}</p>
                  {m.relation&&<span style={{...sans,fontSize:"10px",letterSpacing:"0.12em",color:T.muted,display:"block",marginBottom:"12px"}}>{m.relation}</span>}
                  <p style={{...serif,fontSize:"18px",fontWeight:300,lineHeight:1.75,color:T.deep,fontStyle:"italic"}}>{m.message}</p>
                </div>
              ))}
            </div>
        } d="d2"/>
      </div>
    </section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App(){
  useEffect(()=>{
    const s=document.createElement("style"); s.textContent=CSS; document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);

  return(
    <div style={{...sans,color:T.deep,background:T.white,overflowX:"hidden"}}>
      <Hero/>
      
      <Chap dark era="Les premières années · 1976 – 1986"
        title={"L'enfance,\nlà où tout commence"}
        desc="<<<<Quelques lignes ici pour raconter les premières années — l'endroit où il a grandi, ses premiers souvenirs, sa famille, ce qui le rendait unique dès le plus jeune âge.>>>>"
        img="/photo-bebe.jpeg"
        gallery={GALLERIES.enfance}
      />

      <Chap dark={false} rev era="La jeunesse · 1986 – 1995"
        title={"Les années de\nconstruction"}
        desc="L'adolescence, les amis, les passions qui se dessinent. Ces années qui forgent le caractère et les convictions. Les premières grandes aventures de la vie."
        img="/jeune-1.jpeg"
        gallery={GALLERIES.jeunesse}
      />

      <Chap dark era="L'amour · ~2000"
        title={"La rencontre\nqui a tout changé"}
        desc="L'histoire d'une rencontre, d'un coup de cœur devenu une vie partagée.  Aujourd'hui sa femme, sa complice, son roc."
        img="/femme-0.jpeg"
        portrait
        gallery={GALLERIES.femme}
      />

      <Chap dark={false} rev era="La famille · 2000s"
        title={"La plus belle\ndes aventures"}
        desc="Devenir père un tournant, une responsabilité, une fierté infinie. Ses enfants, son héritage vivant, la preuve que l'amour se multiplie sans jamais se diviser."
        img="/kids-1.jpeg"
        gallery={GALLERIES.enfants}
      />

      <Today/>
      <Voeux/>

      <footer style={{background:T.deep,color:"rgba(255,255,255,0.28)",textAlign:"center",padding:"56px 40px",fontSize:"11px",letterSpacing:"0.2em"}}>
        <span style={{...serif,fontStyle:"italic",fontSize:"22px",color:"rgba(255,255,255,0.6)",display:"block",marginBottom:"12px"}}>Joyeux 50e anniversaire PAPA HUBERT</span>
        Avec tout notre amour
        <br/>
        
         
        Made with <span style={{color:"#ff69b4"}}>&hearts;</span> by <a href="https://komi.invity.site" style={{color:"#ff69b4"}}>Parfait Kom</a>
      </footer>
    </div>
  );
}
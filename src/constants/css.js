export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400&display=swap');
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html { scroll-behavior:smooth; } body { overflow-x:hidden; }

@keyframes fadeUp   { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
@keyframes pulse    { 0%,100%{opacity:.3;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(.6)} }
@keyframes lbIn     { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
@keyframes ripple   { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
@keyframes appear   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

.h1{animation:fadeUp 1s .3s  both} .h2{animation:fadeUp 1s .65s both}
.h3{animation:fadeUp 1s .95s both} .h4{animation:fadeUp 1s 1.45s both}
.sb{animation:pulse 2.2s infinite}

.rv{opacity:0;transform:translateY(32px);transition:opacity .85s ease,transform .85s ease}
.rv.d1{transition-delay:.12s} .rv.d2{transition-delay:.26s} .rv.d3{transition-delay:.4s}
.rv.on{opacity:1;transform:translateY(0)}

.masonry{columns:2;column-gap:10px;padding:0 40px 80px;max-width:1100px;margin:0 auto;}
@media(min-width:900px){.masonry{columns:4;column-gap:12px;}}
@media(max-width:520px){.masonry{columns:2;column-gap:8px;padding:0 20px 60px;}}

.m-item{break-inside:avoid;margin-bottom:10px;overflow:hidden;cursor:pointer;position:relative;}
@media(min-width:900px){.m-item{margin-bottom:12px;}}
.m-item img,.m-item .m-ph{display:block;width:100%;transition:transform .6s cubic-bezier(.25,.46,.45,.94);}
.m-item:hover img,.m-item:hover .m-ph{transform:scale(1.05);}
.m-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,22,40,.75) 0%,transparent 55%);opacity:0;transition:opacity .35s;display:flex;align-items:flex-end;padding:14px;}
.m-item:hover .m-overlay{opacity:1;}
.m-caption{color:rgba(255,255,255,.88);font-size:10px;letter-spacing:.12em;line-height:1.4;font-family:'Montserrat',sans-serif;font-weight:300;}

.lb-bg{position:fixed;inset:0;background:rgba(10,22,40,.96);z-index:1000;display:flex;align-items:center;justify-content:center;animation:lbIn .25s ease both;}
.lb-inner{position:relative;max-width:90vw;max-height:88vh;animation:lbIn .3s .05s ease both;}
.lb-inner img,.lb-inner .lb-ph{max-width:90vw;max-height:88vh;object-fit:contain;display:block;}
.lb-inner .lb-ph{width:min(600px,88vw);height:min(500px,60vh);}
.lb-close{position:fixed;top:24px;right:28px;background:none;border:none;color:rgba(255,255,255,.5);font-size:26px;cursor:pointer;line-height:1;transition:color .2s;}
.lb-close:hover{color:#fff;}
.lb-nav{position:fixed;top:50%;transform:translateY(-50%);background:none;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.55);width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color .2s,color .2s;font-size:20px;}
.lb-nav:hover{border-color:rgba(255,255,255,.6);color:#fff;}
.lb-prev{left:20px;} .lb-next{right:20px;}
.lb-caption{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.45);font-size:10px;letter-spacing:.2em;font-family:'Montserrat',sans-serif;font-weight:300;text-transform:uppercase;white-space:nowrap;}

.audio-btn{animation:appear .6s ease both;}
.audio-ripple{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(255,255,255,0.4);animation:ripple 1.8s ease-out infinite;}

.mc:hover{background:#f5f8ff!important}
.btn-send:hover{background:transparent!important;color:#0a1628!important}
.btn-back:hover{background:#0a1628!important;color:#fff!important}

@media(max-width:700px){
  .cg{grid-template-columns:1fr!important;direction:ltr!important}
  .fr{grid-template-columns:1fr!important}
  .fb{padding:28px 18px!important}
}
`;
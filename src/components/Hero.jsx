import { useEffect, useRef } from "react";

const Hero = () => {
  const heroNumRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (heroNumRef.current && scrolled < window.innerHeight) {
        heroNumRef.current.style.transform =
          `translate(-50%, calc(-52% + ${scrolled * 0.3}px))`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero">
      <div ref={heroNumRef} className="hero-number">50</div>

      <div className="hero-content">
        <p className="hero-subtitle">Une vie célébrée</p>
        <h1 className="hero-name">Hubert Tchuente</h1>
        <p className="hero-years">1975 — 2025</p>
      </div>

      <div className="hero-scroll">
        <div className="scroll-line"></div>
        Défiler
      </div>
    </section>
  );
};

export default Hero;
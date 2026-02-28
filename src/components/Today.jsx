const Today = () => {
  return (
    <section id="today">
      <div className="today-inner">
        <div className="reveal">
          <p className="section-label">Aujourd'hui</p>
          <h2 className="today-title">
            50 ans, et le plus beau reste à venir
          </h2>
        </div>

        <div className="today-photo-frame reveal reveal-delay-1">
          Photo aujourd'hui
        </div>

        <p className="today-quote reveal reveal-delay-2">
          « Cinquante ans, c'est la somme de tout ce qu'on a vécu —
          et la promesse de tout ce qui reste encore à vivre. »
        </p>
      </div>
    </section>
  );
};

export default Today;
const Timeline = () => {
  return (
    <section id="timeline">
      <div className="timeline-header reveal">
        <p className="section-label">Le voyage</p>
        <h2>Une vie en chapitres</h2>
      </div>

      <div className="timeline-track">
        <div className="timeline-spine"></div>

        {/* Chapitre 1 */}
        <div className="chapter">
          <div className="chapter-photo">
            <div className="ph">
              Photo — Bébé / Enfance
            </div>
          </div>
          <div className="chapter-dot">
            <div className="dot-year">1975</div>
            <div className="dot-circle"></div>
          </div>
          <div className="chapter-text">
            <p className="chapter-era">Les premières années · 1975 – 1985</p>
            <h3 className="chapter-title">L'enfance,<br/>là où tout commence</h3>
            <p className="chapter-desc">
              Les premiers sourires, la famille, les bases d'une grande vie.
            </p>
          </div>
        </div>

        {/* Chapitre 2 */}
        <div className="chapter">
          <div className="chapter-text">
            <p className="chapter-era">La jeunesse · 1985 – 1995</p>
            <h3 className="chapter-title">Les années de construction</h3>
            <p className="chapter-desc">
              Les rêves, les ambitions, les premières grandes décisions.
            </p>
          </div>
          <div className="chapter-dot">
            <div className="dot-year">1990</div>
            <div className="dot-circle"></div>
          </div>
          <div className="chapter-photo">
            <div className="ph">Photo — Jeunesse</div>
          </div>
        </div>

        {/* Chapitre 3 */}
        <div className="chapter">
          <div className="chapter-photo">
            <div className="ph">Photo — Avec Rachel</div>
          </div>
          <div className="chapter-dot">
            <div className="dot-year">2000</div>
            <div className="dot-circle"></div>
          </div>
          <div className="chapter-text">
            <p className="chapter-era">L'amour</p>
            <h3 className="chapter-title">La rencontre avec Rachel</h3>
            <p className="chapter-desc">
              Une rencontre devenue une vie entière partagée.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Timeline;
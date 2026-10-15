export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-16 pt-32 overflow-hidden bg-background">
      <div className="hero-grid-overlay absolute inset-0 opacity-10" />
      <div className="hero-glow absolute top-1/4 right-0 max-w-200 max-h-200 rounded-full bg-primary/5 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-5 w-full">
        <p className="text-primary text-xs tracking-widest-3xl font-medium mb-6">COLLECTION 2026 — VALENS STUDIOS</p>
        <h1 className="font-display font-black text-hero tracking-tight text-white uppercase mb-8">
          STRONG<br /><span className="text-primary">BY HIS</span><br />SPIRIT
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-10">
          <a href="#collection" className="inline-flex items-center gap-3 bg-primary text-white text-xs tracking-widest-xl font-semibold px-8 py-4 hover:bg-accent transition-colors">
            VOIR LA COLLECTION
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <span className="text-faint text-xs tracking-widest">JEUNES PRODIGES · 1 JEAN 2:14</span>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const marqueeText = "VALENS — STRONG BY HIS SPIRIT — JEUNES PRODIGES — 1 JEAN 2:14 — MADE IN 2026 — VALENS STUDIOS — ";
  return (
    <div className="bg-primary py-3 overflow-hidden border-y border-accent">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, i) => (
          <span key={i} className="font-display font-bold text-sm tracking-widest-xl text-white">{marqueeText.repeat(3)}</span>
        ))}
      </div>
    </div>
  );
}

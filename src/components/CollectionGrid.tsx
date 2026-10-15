import { useState } from "react";
import type { ColorKey, Currency, Motif } from "@/types";
import { fmt } from "@/lib/currency";
import { MOTIFS } from "@/data/motifs";

export function CollectionGrid({ currency, onSelectMotif }: {
  currency: Currency;
  onSelectMotif: (motif: Motif) => void;
}) {
  const [colorFilter, setColorFilter] = useState<"all" | ColorKey>("all");

  const filtered = MOTIFS.filter(m =>
    colorFilter === "all" ? true : m.variants.some(v => v.color === colorFilter)
  );

  return (
    <section id="collection" className="py-24 px-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
        <div>
          <p className="text-primary text-xs tracking-widest-3xl mb-3">NOUVELLE COLLECTION</p>
          <h2 className="font-display font-black text-5xl md:text-7xl tracking-tight uppercase">Les Pièces</h2>
        </div>
        <div className="flex gap-2">
          {(["all","white","black"] as const).map(f => (
            <button key={f} onClick={() => setColorFilter(f)}
              className={`px-4 py-2 text-xs tracking-widest-md border transition-colors ${colorFilter === f ? "bg-white text-black border-white" : "bg-transparent text-dim border-border hover:border-faint hover:text-white"}`}>
              {f === "all" ? "TOUT" : f === "white" ? "BLANC" : "NOIR"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {filtered.map(motif => {
          const defaultVariant = colorFilter !== "all"
            ? motif.variants.find(v => v.color === colorFilter) ?? motif.variants[0]
            : motif.variants[0];
          return (
            <div key={motif.id} className="product-card group cursor-pointer" onClick={() => onSelectMotif(motif)}>
              <div className="relative overflow-hidden bg-card aspect-3/4 mb-4">
                <img src={defaultVariant.img} alt={motif.name} className="product-img-front absolute inset-0 w-full h-full object-cover object-top" />
                {motif.variants.length > 1 && (
                  <img src={motif.variants[1].img} alt={`${motif.name} variant`} className="product-img-back absolute inset-0 w-full h-full object-cover object-top" />
                )}
                {motif.tag && (
                  <span className={`absolute top-3 left-3 text-2xs font-bold tracking-widest-md px-2 py-1 ${motif.tag === "EXCLUSIF" ? "bg-white text-black" : "bg-primary text-white"}`}>
                    {motif.tag}
                  </span>
                )}
                {motif.variants.length > 1 && (
                  <div className="absolute bottom-3 right-3 flex gap-1.5">
                    {motif.variants.map(v => (
                      <span key={v.color} className={`w-3 h-3 rounded-full border border-white/40 ${v.color === "white" ? "bg-white" : "bg-black"}`} />
                    ))}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs tracking-widest font-medium">COMMANDER →</span>
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg tracking-wide uppercase leading-tight">{motif.name}</h3>
                <p className="text-dim text-xs tracking-wide mt-0.5 mb-2">{motif.subtitle}</p>
                <p className="text-white font-semibold text-sm">{fmt(currency)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

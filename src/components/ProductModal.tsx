import { useState } from "react";
import type { CartItem, ColorKey, Currency, Motif } from "@/types";
import { fmt } from "@/lib/currency";
import { Label } from "@/components/common";

export function ProductModal({
  motif,
  currency,
  onClose,
  onAddToCart,
}: {
  motif: Motif;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}) {
  const [selColor, setSelColor] = useState<ColorKey>(motif.variants[0].color);
  const [selSize, setSelSize] = useState("");
  const [selQty, setSelQty] = useState(1);

  const currentImg =
    motif.variants.find((v) => v.color === selColor)?.img ??
    motif.variants[0].img;

  function handleAddToCart() {
    if (!selSize) return;
    onAddToCart({
      motifId: motif.id,
      motifName: motif.name,
      subtitle: motif.subtitle,
      color: selColor,
      img: currentImg,
      size: selSize,
      qty: selQty,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card max-h-modal w-full md:max-w-3xl overflow-y-auto animate-fade-up">
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="bg-surface aspect-square md:aspect-auto md:min-h-125 overflow-hidden">
            <img
              src={currentImg}
              alt={motif.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Options */}
          <div className="p-8 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                {motif.tag && (
                  <span className="inline-block bg-primary text-white text-2xs tracking-widest-md font-bold px-2 py-1 mb-3">
                    {motif.tag}
                  </span>
                )}
                <h2 className="font-display font-black text-3xl uppercase tracking-wide leading-tight">
                  {motif.name}
                </h2>
                <p className="text-dim text-xs tracking-wide mt-1">
                  {motif.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-faint hover:text-white text-xs tracking-widest mt-1"
              >
                ✕
              </button>
            </div>

            <p className="text-2xl font-semibold">{fmt(currency)}</p>

            {/* Motif display */}
            <div>
              <Label>MOTIF</Label>
              <p className="text-sm text-white bg-secondary px-4 py-2.5 border border-border mt-2">
                {motif.name}
              </p>
            </div>

            {/* Color */}
            <div>
              <Label>COULEUR</Label>
              <div className="flex gap-3 mt-2">
                {motif.variants.map((v) => (
                  <button
                    key={v.color}
                    onClick={() => setSelColor(v.color)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest border transition-all ${selColor === v.color ? "border-white text-white" : "border-border text-dim hover:border-faint"}`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border ${v.color === "white" ? "bg-white border-white/60" : "bg-black border-white/30"}`}
                    />
                    {v.color === "white" ? "BLANC" : "NOIR"}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <Label>TAILLE</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {motif.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelSize(s)}
                    className={`w-12 h-12 text-sm font-medium border transition-all ${selSize === s ? "bg-white text-black border-white" : "bg-transparent text-dim border-border hover:border-white hover:text-white"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Label>QUANTITÉ</Label>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => setSelQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 border border-border text-white hover:border-white transition-colors flex items-center justify-center text-lg"
                >
                  −
                </button>
                <span className="font-display font-bold text-xl w-6 text-center">
                  {selQty}
                </span>
                <button
                  onClick={() => setSelQty((q) => Math.min(10, q + 1))}
                  className="w-10 h-10 border border-border text-white hover:border-white transition-colors flex items-center justify-center text-lg"
                >
                  +
                </button>
                <span className="text-faint text-xs ml-2">
                  {fmt(currency, selQty)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selSize}
              className={`w-full py-4 text-sm tracking-widest-xl font-semibold transition-all mt-auto ${selSize ? "bg-primary text-white hover:bg-accent" : "bg-secondary text-ghost cursor-not-allowed"}`}
            >
              {selSize ? "AJOUTER AU PANIER" : "SÉLECTIONNER UNE TAILLE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

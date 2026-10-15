import type { Currency } from "@/types";
import { CartIcon } from "@/components/common";

export function Nav({ currency, cartTotal, navOpen, onToggleNav, onOpenCart }: {
  currency: Currency;
  cartTotal: number;
  navOpen: boolean;
  onToggleNav: () => void;
  onOpenCart: () => void;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-divider">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={onToggleNav}>
          <span className="w-6 h-0.5 bg-white block" />
          <span className="w-4 h-0.5 bg-white block" />
          <span className="w-6 h-0.5 bg-white block" />
        </button>
        <div className="hidden md:flex items-center gap-8 text-xs tracking-widest-lg font-medium text-muted-foreground">
          <a href="#collection" className="hover:text-white transition-colors">COLLECTION</a>
          <a href="#about"      className="hover:text-white transition-colors">À PROPOS</a>
          <a href="#contact"    className="hover:text-white transition-colors">CONTACT</a>
        </div>
        <a href="#" className="font-display text-2xl font-black tracking-widest-sm text-white">VALENS</a>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-2xs tracking-widest-md text-ghost border border-divider px-2 py-1">{currency.code}</span>
          <button onClick={onOpenCart} className="relative flex items-center gap-2 text-xs tracking-widest text-muted-foreground hover:text-white transition-colors">
            <CartIcon />
            {cartTotal > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-2xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartTotal}
              </span>
            )}
          </button>
        </div>
      </div>
      {navOpen && (
        <div className="md:hidden border-t border-divider bg-background px-5 py-4 flex flex-col gap-4 text-xs tracking-widest-lg text-muted-foreground">
          <a href="#collection" onClick={onToggleNav} className="hover:text-white">COLLECTION</a>
          <a href="#about"      onClick={onToggleNav} className="hover:text-white">À PROPOS</a>
          <a href="#contact"    onClick={onToggleNav} className="hover:text-white">CONTACT</a>
        </div>
      )}
    </nav>
  );
}

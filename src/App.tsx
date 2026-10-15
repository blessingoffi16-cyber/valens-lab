import { useEffect, useState } from "react";
import type { Currency, Motif } from "@/types";
import { detectCurrency } from "@/lib/currency";
import { useCart } from "@/hooks/useCart";
import { Nav } from "@/components/Nav";
import { Hero, Marquee } from "@/components/Hero";
import { CollectionGrid } from "@/components/CollectionGrid";
import { About } from "@/components/About";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";
import { ProductModal } from "@/components/ProductModal";
import { CartSidebar } from "@/components/CartSidebar";

export default function App() {
  const [currency, setCurrency] = useState<Currency>({
    code: "XOF",
    symbol: "F",
    amount: 12000,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    fetch("https://ipapi.co/json/", { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d?.country_code) setCurrency(detectCurrency(d.country_code));
      })
      .catch(() => {})
      .finally(() => clearTimeout(t));
  }, []);

  const [navOpen, setNavOpen] = useState(false);
  const [activeMotif, setActiveMotif] = useState<Motif | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { cart, addItem, removeItem, updateQty, clearCart, totalQty } =
    useCart();

  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      <Nav
        currency={currency}
        cartTotal={totalQty}
        navOpen={navOpen}
        onToggleNav={() => setNavOpen((o) => !o)}
        onOpenCart={() => setCartOpen(true)}
      />

      <Hero />
      <Marquee />

      <CollectionGrid currency={currency} onSelectMotif={setActiveMotif} />

      <About />
      <Manifesto />
      <Footer />

      {activeMotif && (
        <ProductModal
          motif={activeMotif}
          currency={currency}
          onClose={() => setActiveMotif(null)}
          onAddToCart={(item) => {
            addItem(item);
            setActiveMotif(null);
            setCartOpen(true);
          }}
        />
      )}

      <CartSidebar
        open={cartOpen}
        cart={cart}
        currency={currency}
        onClose={() => setCartOpen(false)}
        onRemoveItem={removeItem}
        onUpdateQty={updateQty}
        onClearCart={clearCart}
      />
    </div>
  );
}

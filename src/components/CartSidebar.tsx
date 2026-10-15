import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import type { CartItem, CheckoutStep, Currency, OrderForm } from "@/types";
import { fmt } from "@/lib/currency";
import { EJS_SERVICE, EJS_T_BRAND, EJS_T_CLIENT, EJS_PUBLIC_KEY, EMAILJS_CONFIGURED } from "@/lib/emailjs";
import { Field, SidebarHeader, EmptyCart } from "@/components/common";

const EMPTY_FORM: OrderForm = {
  firstName: "", lastName: "", address: "",
  city: "", country: "", whatsapp: "", email: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s()-]{7,}$/;

export function CartSidebar({ open, cart, currency, onClose, onRemoveItem, onUpdateQty, onClearCart }: {
  open: boolean;
  cart: CartItem[];
  currency: Currency;
  onClose: () => void;
  onRemoveItem: (idx: number) => void;
  onUpdateQty: (idx: number, delta: number) => void;
  onClearCart: () => void;
}) {
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (open) setStep("cart");
  }, [open]);

  function setField(k: keyof OrderForm, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function formValid() {
    return Boolean(
      form.firstName.trim() && form.lastName.trim() && form.address.trim() && form.city.trim()
        && EMAIL_RE.test(form.email.trim()) && PHONE_RE.test(form.whatsapp.trim()),
    );
  }

  async function submitOrder() {
    setSending(true);
    setSendError("");

    const itemsText = cart.map(i =>
      `• ${i.motifName} | ${i.color === "white" ? "Blanc" : "Noir"} | Taille ${i.size} | Qté ${i.qty} | ${fmt(currency, i.qty)}`
    ).join("\n");

    const params = {
      client_name:    `${form.firstName} ${form.lastName}`,
      client_email:   form.email,
      client_whatsapp: form.whatsapp,
      client_address: `${form.address}, ${form.city}${form.country ? ", " + form.country : ""}`,
      order_items:    itemsText,
      order_total:    fmt(currency, cart.reduce((s, i) => s + i.qty, 0)),
      order_currency: currency.code,
      to_email:       "valensbrand214@gmail.com",
    };

    try {
      if (!EMAILJS_CONFIGURED) {
        throw new Error("EmailJS configuration is incomplete");
      }

      await Promise.all([
        emailjs.send(EJS_SERVICE, EJS_T_BRAND, params, EJS_PUBLIC_KEY),
        emailjs.send(
          EJS_SERVICE,
          EJS_T_CLIENT,
          { ...params, to_email: form.email, email: form.email.trim() },
          EJS_PUBLIC_KEY,
        ),
      ]);
      setStep("success");
      onClearCart();
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error("EmailJS order send failed", error);
      const message = error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "text" in error
          ? String(error.text)
          : String(error);
      setSendError(
        message.includes("Origin is disallowed")
          ? "Le domaine du site n'est pas autorisé dans EmailJS. Ajoutez l'adresse de cette page aux domaines autorisés dans votre compte EmailJS."
          : "L'envoi des e-mails a échoué. Vérifiez le service et les modèles EmailJS, puis réessayez.",
      );
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-card w-full max-w-md h-full flex flex-col animate-slide-in overflow-hidden">

        {/* ── STEP: CART ── */}
        {step === "cart" && (
          <>
            <SidebarHeader title="PANIER" onClose={onClose} />
            {cart.length === 0 ? (
              <EmptyCart onClose={onClose} />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-5 border-b border-secondary">
                      <div className="w-20 h-24 bg-surface shrink-0 overflow-hidden">
                        <img src={item.img} alt={item.motifName} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-sm uppercase tracking-wide leading-tight">{item.motifName}</h4>
                        <p className="text-faint text-xs mt-1">{item.color === "white" ? "Blanc" : "Noir"} · Taille {item.size}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => onUpdateQty(idx, -1)} className="w-6 h-6 border border-line text-white text-xs hover:border-white flex items-center justify-center">−</button>
                          <span className="text-sm font-semibold">{item.qty}</span>
                          <button onClick={() => onUpdateQty(idx, +1)} className="w-6 h-6 border border-line text-white text-xs hover:border-white flex items-center justify-center">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => onRemoveItem(idx)} className="text-ghost hover:text-primary text-xs transition-colors">✕</button>
                        <p className="text-white text-sm font-semibold">{fmt(currency, item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-divider">
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-xs tracking-widest text-dim">TOTAL</span>
                    <span className="font-display font-black text-2xl">{fmt(currency, cart.reduce((s,i) => s + i.qty, 0))}</span>
                  </div>
                  <button onClick={() => setStep("form")} className="w-full bg-primary text-white py-4 text-sm tracking-widest-xl font-semibold hover:bg-accent transition-colors">
                    PASSER LA COMMANDE →
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── STEP: FORM ── */}
        {step === "form" && (
          <>
            <SidebarHeader title="LIVRAISON" onClose={onClose} onBack={() => setStep("cart")} />
            <form
              onSubmit={e => { e.preventDefault(); if (formValid()) setStep("recap"); }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <p className="text-faint text-xs tracking-wide mb-2">Renseignez vos informations de livraison</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field name="firstName" label="Prénom" value={form.firstName} onChange={v => setField("firstName", v)} autoComplete="given-name" required />
                  <Field name="lastName"  label="Nom"    value={form.lastName}  onChange={v => setField("lastName", v)}  autoComplete="family-name" required />
                </div>
                <Field name="address" label="Adresse complète" value={form.address} onChange={v => setField("address", v)} autoComplete="street-address" required />
                <div className="grid grid-cols-2 gap-3">
                  <Field name="city"    label="Ville" value={form.city}    onChange={v => setField("city", v)}    autoComplete="address-level2" required />
                  <Field name="country" label="Pays"  value={form.country} onChange={v => setField("country", v)} autoComplete="country-name" placeholder="Optionnel" />
                </div>
                <Field name="whatsapp" label="Numéro WhatsApp" value={form.whatsapp} onChange={v => setField("whatsapp", v)}
                  placeholder="+225 XX XX XX XX" type="tel" autoComplete="tel" inputMode="tel" pattern="\+?[0-9\s\(\)\-]{7,}" required />
                <Field name="email" label="Adresse e-mail" value={form.email} onChange={v => setField("email", v)}
                  placeholder="vous@email.com" type="email" autoComplete="email" inputMode="email" required />
                <p className="text-ghost text-xs leading-relaxed pt-2">
                  Un e-mail de confirmation vous sera envoyé et la marque vous contactera via WhatsApp pour confirmer votre commande.
                </p>
              </div>
              <div className="p-6 border-t border-divider">
                <button type="submit" disabled={!formValid()}
                  className={`w-full py-4 text-sm tracking-widest-xl font-semibold transition-all ${formValid() ? "bg-primary text-white hover:bg-accent" : "bg-secondary text-ghost cursor-not-allowed"}`}>
                  VOIR LE RÉCAPITULATIF →
                </button>
              </div>
            </form>
          </>
        )}

        {/* ── STEP: RECAP ── */}
        {step === "recap" && (
          <>
            <SidebarHeader title="RÉCAPITULATIF" onClose={onClose} onBack={() => setStep("form")} />
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Order items */}
              <div>
                <p className="text-xs tracking-widest-xl text-faint mb-3">ARTICLES</p>
                <div className="space-y-3">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start border-b border-secondary pb-3">
                      <div>
                        <p className="font-display font-bold text-sm uppercase">{item.motifName}</p>
                        <p className="text-faint text-xs mt-0.5">
                          {item.color === "white" ? "Blanc" : "Noir"} · Taille {item.size} · Qté {item.qty}
                        </p>
                      </div>
                      <p className="text-white text-sm font-semibold shrink-0 ml-4">{fmt(currency, item.qty)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="font-display font-bold text-sm uppercase tracking-wide">Total</span>
                  <span className="font-display font-black text-xl text-primary">{fmt(currency, cart.reduce((s,i) => s+i.qty, 0))}</span>
                </div>
              </div>

              {/* Delivery info */}
              <div>
                <p className="text-xs tracking-widest-xl text-faint mb-3">LIVRAISON</p>
                <div className="bg-surface p-4 space-y-1.5 text-sm">
                  <p className="text-white">{form.firstName} {form.lastName}</p>
                  <p className="text-muted-foreground">{form.address}</p>
                  <p className="text-muted-foreground">{form.city}{form.country ? `, ${form.country}` : ""}</p>
                  <p className="text-muted-foreground mt-2">WhatsApp : {form.whatsapp}</p>
                  <p className="text-muted-foreground">Email : {form.email}</p>
                </div>
              </div>

              {sendError && <p className="text-primary text-xs border border-primary/30 p-3">{sendError}</p>}

              {!EMAILJS_CONFIGURED && (
                <div className="bg-yellow-950/40 border border-yellow-900/40 p-4 text-xs text-yellow-600/80 leading-relaxed">
                  <strong className="text-yellow-500 block mb-1">⚠ Configuration EmailJS requise</strong>
                  Configurez les variables <code>VITE_EJS_*</code> dans <code>.env</code> pour activer l'envoi d'e-mails.
                </div>
              )}
            </div>
            <div className="p-6 border-t border-divider">
              <button onClick={submitOrder} disabled={sending}
                className={`w-full py-4 text-sm tracking-widest-xl font-semibold transition-all ${sending ? "bg-secondary text-faint" : "bg-primary text-white hover:bg-accent"}`}>
                {sending ? "ENVOI EN COURS…" : "CONFIRMER LA COMMANDE"}
              </button>
            </div>
          </>
        )}

        {/* ── STEP: SUCCESS ── */}
        {step === "success" && (
          <>
            <SidebarHeader title="" onClose={() => { onClose(); setStep("cart"); }} />
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="font-display font-black text-3xl uppercase mb-3">Commande envoyée !</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-2">
                Un e-mail de confirmation a été envoyé à <span className="text-white">{form.email || "votre adresse"}</span>.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-8">
                L'équipe VALENS vous contactera sur WhatsApp pour confirmer votre livraison.
              </p>
              <button onClick={() => { onClose(); setStep("cart"); }}
                className="bg-primary text-white text-xs tracking-widest-xl font-semibold px-8 py-4 hover:bg-accent transition-colors">
                RETOUR À LA COLLECTION
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

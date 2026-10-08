import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import img2 from "@/imports/2.png";
import img3 from "@/imports/3.png";
import img4 from "@/imports/4.png";
import img6 from "@/imports/6.png";
import img7 from "@/imports/7.png";
import img8 from "@/imports/8.png";
import img9 from "@/imports/9.png";
import img10 from "@/imports/10.png";
import img11 from "@/imports/11.png";
import img12 from "@/imports/12.png";

/* ─── EmailJS config ─────────────────────────────────────────────────────────
   Créez un compte sur emailjs.com, puis remplacez ces valeurs.
   SERVICE_ID  : l'ID du service email lié à valensbrand214@gmail.com
   TEMPLATE_BRAND : template envoyé à la marque (to_email = valensbrand214@gmail.com)
   TEMPLATE_CLIENT : template envoyé au client (to_email = {{client_email}})
   PUBLIC_KEY  : votre clé publique EmailJS
──────────────────────────────────────────────────────────────────────────── */
// EmailJS identifiers are public in a Vite client bundle. Environment
// variables can still override these defaults for another EmailJS account.
const EJS_SERVICE = import.meta.env.VITE_EJS_SERVICE || "service_su87zz9";
const EJS_T_BRAND = import.meta.env.VITE_EJS_T_BRAND || "template_88v1zdi";
const EJS_T_CLIENT = import.meta.env.VITE_EJS_T_CLIENT || "template_ojjcfee";
const EJS_PUBLIC_KEY = import.meta.env.VITE_EJS_PUBLIC_KEY || "dpUaaj__EfalQvpfL";
const EMAILJS_CONFIGURED = Boolean(
  EJS_SERVICE && EJS_T_BRAND && EJS_T_CLIENT && EJS_PUBLIC_KEY,
);

/* ─── Types ──────────────────────────────────────────────────────────────── */
type CurrencyCode = "XOF" | "EUR" | "USD";
type Currency = { code: CurrencyCode; symbol: string; amount: number };

type ColorKey = "white" | "black";
type Variant  = { color: ColorKey; img: string };

type Motif = {
  id: string;
  name: string;
  subtitle: string;
  tag?: string;
  sizes: string[];
  variants: Variant[];
};

type CartItem = {
  motifId: string;
  motifName: string;
  subtitle: string;
  color: ColorKey;
  img: string;
  size: string;
  qty: number;
};

type OrderForm = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  whatsapp: string;
  email: string;
};

type CheckoutStep = "cart" | "form" | "recap" | "success";

/* ─── Currency helpers ───────────────────────────────────────────────────── */
const EUROPE = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","GB","NO","CH","IS","LI","AL","BA","ME","MK","RS","MD","UA","BY","RU"];
const AMERICA = ["US","CA","MX","BR","AR","CL","CO","PE","VE","EC","BO","PY","UY","GY","SR","GT","BZ","HN","SV","NI","CR","PA","CU","DO","HT","JM","TT","BB","LC","VC"];

function detectCurrency(cc: string): Currency {
  if (EUROPE.includes(cc))  return { code: "EUR", symbol: "€",  amount: 45 };
  if (AMERICA.includes(cc)) return { code: "USD", symbol: "$",  amount: 50 };
  return                           { code: "XOF", symbol: "F",  amount: 12000 };
}

function fmt(c: Currency, qty = 1): string {
  const total = c.amount * qty;
  if (c.code === "XOF") return `${total.toLocaleString("fr-FR")} F`;
  if (c.code === "EUR") return `${total}€`;
  return `$${total}`;
}

/* ─── Catalogue ──────────────────────────────────────────────────────────── */
const MOTIFS: Motif[] = [
  {
    id: "badge",
    name: "VALENS Badge Tee",
    subtitle: "Strong by His Spirit",
    tag: "NEW",
    sizes: ["S","M","L","XL","XXL"],
    variants: [
      { color: "white", img: img2 },
      { color: "black", img: img8 },
    ],
  },
  {
    id: "vs-boxing",
    name: "VS Boxing Tee",
    subtitle: "L'Énergie des Invaincus",
    tag: "EXCLUSIF",
    sizes: ["S","M","L","XL"],
    variants: [
      { color: "white", img: img7 },
      { color: "black", img: img11 },
    ],
  },
  {
    id: "varsity",
    name: "Varsity 1 Jean 2:14",
    subtitle: "La Parole demeure en vous",
    tag: "NEW",
    sizes: ["S","M","L","XL","XXL"],
    variants: [
      { color: "white", img: img3 },
      { color: "black", img: img9 },
    ],
  },
  {
    id: "racing",
    name: "1JN214 Racing Tee",
    subtitle: "Valens Racing Edition",
    tag: "EXCLUSIF",
    sizes: ["S","M","L","XL"],
    variants: [
      { color: "white", img: img4 },
      { color: "black", img: img10 },
    ],
  },
  {
    id: "jp",
    name: "Jeunes Prodiges Tee",
    subtitle: "La Parole de Dieu",
    tag: "LIMITED",
    sizes: ["S","M","L","XL"],
    variants: [{ color: "black", img: img12 }],
  },
  {
    id: "yp-badge",
    name: "YP Badge Tee",
    subtitle: "Designed by Young Prodigies",
    sizes: ["S","M","L","XL","XXL"],
    variants: [{ color: "white", img: img6 }],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  /* currency */
  const [currency, setCurrency] = useState<Currency>({ code: "XOF", symbol: "F", amount: 12000 });

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    fetch("https://ipapi.co/json/", { signal: ctrl.signal })
      .then(r => r.json())
      .then(d => { if (d?.country_code) setCurrency(detectCurrency(d.country_code)); })
      .catch(() => {})
      .finally(() => clearTimeout(t));
  }, []);

  /* ui */
  const [colorFilter, setColorFilter] = useState<"all" | ColorKey>("all");
  const [navOpen, setNavOpen]         = useState(false);

  /* product modal */
  const [activMotif, setActiveMotif]   = useState<Motif | null>(null);
  const [selColor,   setSelColor]      = useState<ColorKey>("white");
  const [selSize,    setSelSize]       = useState("");
  const [selQty,     setSelQty]        = useState(1);

  /* cart */
  const [cart, setCart]         = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  /* checkout */
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState<OrderForm>({
    firstName: "", lastName: "", address: "",
    city: "", country: "", whatsapp: "", email: "",
  });
  const [sending, setSending]   = useState(false);
  const [sendError, setSendError] = useState("");

  /* derived */
  const cartTotal = cart.reduce((s, i) => s + i.qty, 0);
  const cartPrice = cart.reduce((s, i) => s + currency.amount * i.qty, 0);

  const filtered = MOTIFS.filter(m =>
    colorFilter === "all" ? true : m.variants.some(v => v.color === colorFilter)
  );

  /* open motif modal */
  function openMotif(m: Motif) {
    setActiveMotif(m);
    setSelColor(m.variants[0].color);
    setSelSize("");
    setSelQty(1);
  }

  function currentImg(): string {
    if (!activMotif) return "";
    return activMotif.variants.find(v => v.color === selColor)?.img
        ?? activMotif.variants[0].img;
  }

  /* add to cart */
  function addToCart() {
    if (!activMotif || !selSize) return;
    const img = currentImg();
    setCart(prev => {
      const key = prev.findIndex(
        i => i.motifId === activMotif.id && i.color === selColor && i.size === selSize
      );
      if (key >= 0) {
        const next = [...prev];
        next[key] = { ...next[key], qty: next[key].qty + selQty };
        return next;
      }
      return [...prev, {
        motifId:   activMotif.id,
        motifName: activMotif.name,
        subtitle:  activMotif.subtitle,
        color:     selColor,
        img,
        size:      selSize,
        qty:       selQty,
      }];
    });
    setActiveMotif(null);
    setCartOpen(true);
    setStep("cart");
  }

  function removeItem(idx: number) {
    setCart(prev => prev.filter((_, i) => i !== idx));
  }

  function updateQty(idx: number, delta: number) {
    setCart(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const q = Math.max(1, item.qty + delta);
      return { ...item, qty: q };
    }));
  }

  /* form helpers */
  function setField(k: keyof OrderForm, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function formValid() {
    return form.firstName && form.lastName && form.address
        && form.city && form.whatsapp && form.email;
  }

  /* send order */
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
          { ...params, to_email: form.email },
          EJS_PUBLIC_KEY,
        ),
      ]);
      setStep("success");
      setCart([]);
      setForm({ firstName:"",lastName:"",address:"",city:"",country:"",whatsapp:"",email:"" });
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

  const marqueeText = "VALENS — STRONG BY HIS SPIRIT — JEUNES PRODIGES — 1 JEAN 2:14 — MADE IN 2026 — VALENS STUDIOS — ";

  /* ──────────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setNavOpen(!navOpen)}>
            <span className="w-6 h-0.5 bg-white block" />
            <span className="w-4 h-0.5 bg-white block" />
            <span className="w-6 h-0.5 bg-white block" />
          </button>
          <div className="hidden md:flex items-center gap-8 text-xs tracking-[0.18em] font-medium text-[#999]">
            <a href="#collection" className="hover:text-white transition-colors">COLLECTION</a>
            <a href="#about"      className="hover:text-white transition-colors">À PROPOS</a>
            <a href="#contact"    className="hover:text-white transition-colors">CONTACT</a>
          </div>
          <a href="#" className="font-display text-2xl font-black tracking-[0.12em] text-white">VALENS</a>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-[10px] tracking-[0.15em] text-[#444] border border-[#1f1f1f] px-2 py-1">{currency.code}</span>
            <button onClick={() => { setCartOpen(true); setStep("cart"); }} className="relative flex items-center gap-2 text-xs tracking-widest text-[#999] hover:text-white transition-colors">
              <CartIcon />
              {cartTotal > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#cc1111] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartTotal}
                </span>
              )}
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden border-t border-[#1f1f1f] bg-[#0a0a0a] px-5 py-4 flex flex-col gap-4 text-xs tracking-[0.18em] text-[#999]">
            <a href="#collection" onClick={() => setNavOpen(false)} className="hover:text-white">COLLECTION</a>
            <a href="#about"      onClick={() => setNavOpen(false)} className="hover:text-white">À PROPOS</a>
            <a href="#contact"    onClick={() => setNavOpen(false)} className="hover:text-white">CONTACT</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-end pb-16 pt-32 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 48px,#ffffff08 48px,#ffffff08 49px),repeating-linear-gradient(90deg,transparent,transparent 48px,#ffffff08 48px,#ffffff08 49px)" }} />
        <div className="absolute top-1/4 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-[#cc1111]/5 blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 w-full">
          <p className="text-[#cc1111] text-xs tracking-[0.3em] font-medium mb-6">COLLECTION 2026 — VALENS STUDIOS</p>
          <h1 className="font-display font-black text-[clamp(64px,13vw,200px)] leading-[0.88] tracking-tight text-white uppercase mb-8">
            STRONG<br /><span className="text-[#cc1111]">BY HIS</span><br />SPIRIT
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-10">
            <a href="#collection" className="inline-flex items-center gap-3 bg-[#cc1111] text-white text-xs tracking-[0.2em] font-semibold px-8 py-4 hover:bg-[#e01010] transition-colors">
              VOIR LA COLLECTION
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <span className="text-[#555] text-xs tracking-widest">JEUNES PRODIGES · 1 JEAN 2:14</span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#cc1111] py-3 overflow-hidden border-y border-[#e01010]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="font-display font-bold text-sm tracking-[0.2em] text-white">{marqueeText.repeat(3)}</span>
          ))}
        </div>
      </div>

      {/* COLLECTION */}
      <section id="collection" className="py-24 px-5 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[#cc1111] text-xs tracking-[0.3em] mb-3">NOUVELLE COLLECTION</p>
            <h2 className="font-display font-black text-5xl md:text-7xl tracking-tight uppercase">Les Pièces</h2>
          </div>
          <div className="flex gap-2">
            {(["all","white","black"] as const).map(f => (
              <button key={f} onClick={() => setColorFilter(f)}
                className={`px-4 py-2 text-xs tracking-[0.15em] border transition-colors ${colorFilter === f ? "bg-white text-black border-white" : "bg-transparent text-[#666] border-[#2a2a2a] hover:border-[#555] hover:text-white"}`}>
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
              <div key={motif.id} className="product-card group cursor-pointer" onClick={() => openMotif(motif)}>
                <div className="relative overflow-hidden bg-[#111] aspect-[3/4] mb-4">
                  <img src={defaultVariant.img} alt={motif.name} className="product-img-front absolute inset-0 w-full h-full object-cover object-top" />
                  {motif.variants.length > 1 && (
                    <img src={motif.variants[1].img} alt={`${motif.name} variant`} className="product-img-back absolute inset-0 w-full h-full object-cover object-top" />
                  )}
                  {motif.tag && (
                    <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-[0.15em] px-2 py-1 ${motif.tag === "LIMITED" ? "bg-[#cc1111] text-white" : motif.tag === "EXCLUSIF" ? "bg-white text-black" : "bg-[#cc1111] text-white"}`}>
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
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs tracking-widest font-medium">COMMANDER →</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg tracking-wide uppercase leading-tight">{motif.name}</h3>
                  <p className="text-[#666] text-xs tracking-wide mt-0.5 mb-2">{motif.subtitle}</p>
                  <p className="text-white font-semibold text-sm">{fmt(currency)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 border-t border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[#cc1111] text-xs tracking-[0.3em] mb-4">L'ÉNERGIE DES INVAINCUS</p>
            <h2 className="font-display font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight mb-10">
              NÉS POUR<br /><span className="text-[#cc1111]">PRÉVALOIR</span>
            </h2>
            <p className="text-[#aaa] text-sm leading-relaxed mb-5 max-w-md">
              Né du latin <em className="text-white not-italic font-medium">Valere</em> — être fort, prévaloir, impacter —, VALENS est un vestiaire streetwear conçu pour une génération qui refuse de plier face au bruit du monde.
            </p>
            <blockquote className="border-l-2 border-[#cc1111] pl-5 mb-5">
              <p className="text-white text-sm leading-relaxed italic">« Je vous ai écrit, jeunes gens, parce que vous êtes forts, que la parole demeure en vous, et que vous avez vaincu le mauvais. »</p>
              <cite className="text-[#cc1111] text-xs tracking-[0.2em] not-italic mt-2 block">— 1 JEAN 2:14</cite>
            </blockquote>
            <p className="text-[#aaa] text-sm leading-relaxed mb-5 max-w-md">
              Nous ne créons pas de simples vêtements : nous façonnons des <span className="text-white font-medium">armures urbaines</span>. Coupes structurées, matières lourdes et détails millimétrés — chaque pièce incarne la discipline, l'ancrage intérieur et le triomphe de la lumière sur l'obscurité.
            </p>
            <p className="text-[#aaa] text-sm leading-relaxed mb-10 max-w-md">
              Porter VALENS, c'est affirmer sa force. Demeurer <span className="text-white font-medium">inébranlable</span>.
            </p>
            <div className="grid grid-cols-3 gap-0 border border-[#1f1f1f]">
              {[{ val:"2026", label:"Fondé" },{ val:"10+", label:"Pièces" },{ val:"∞", label:"Force" }].map(({ val, label }, i) => (
                <div key={label} className={`px-5 py-6 ${i < 2 ? "border-r border-[#1f1f1f]" : ""}`}>
                  <p className="font-display font-black text-4xl text-[#cc1111]">{val}</p>
                  <p className="text-[#555] text-xs tracking-widest mt-1 uppercase">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 h-[520px]">
            <div className="bg-[#111] overflow-hidden row-span-2">
              <img src={img8} alt="VALENS black tee" className="w-full h-full object-cover object-top" />
            </div>
            <div className="bg-[#111] overflow-hidden">
              <img src={img2} alt="VALENS white tee" className="w-full h-full object-cover object-top" />
            </div>
            <div className="bg-[#111] overflow-hidden">
              <img src={img12} alt="VALENS Jeunes Prodiges tee" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="bg-[#cc1111] py-20 px-5 text-center">
        <p className="font-display font-black text-[clamp(36px,7vw,96px)] uppercase leading-tight text-white tracking-tight">
          "LA PAROLE DE DIEU<br />TE REND PLUS FORT"
        </p>
        <p className="text-white/60 text-xs tracking-[0.25em] mt-6">1 JEAN 2:14 — VALENS STUDIOS — STRONG BY HIS SPIRIT</p>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="border-t border-[#1a1a1a] py-16 px-5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="mb-5">
              <p className="font-display font-black text-3xl tracking-[0.1em]">VALENS</p>
              <p className="text-[#555] text-xs tracking-widest mt-1">STRONG BY HIS SPIRIT</p>
            </div>
            <p className="text-[#444] text-xs leading-relaxed max-w-xs">© 2026 Valens Studios. Designed by Young Prodigies. All rights reserved.</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-[#666] mb-5">NAVIGATION</p>
            <ul className="space-y-3 text-sm text-[#444]">
              {["Collection","À Propos","Contact","Livraisons"].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-[#666] mb-5">CONTACT</p>
            <ul className="space-y-3 text-sm text-[#444]">
              <li>valensbrand214@gmail.com</li>
              <li className="flex gap-4 mt-4">
                {["Instagram","TikTok"].map(s => (
                  <a key={s} href="#" className="text-xs tracking-widest hover:text-[#cc1111] transition-colors">{s.toUpperCase()}</a>
                ))}
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* ── PRODUCT MODAL ─────────────────────────────────────────────────── */}
      {activMotif && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setActiveMotif(null); }}>
          <div className="bg-[#111] w-full md:max-w-3xl max-h-[92vh] overflow-y-auto animate-fade-up">
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="bg-[#0d0d0d] aspect-square md:aspect-auto md:min-h-[500px] overflow-hidden">
                <img src={currentImg()} alt={activMotif.name} className="w-full h-full object-cover object-top" />
              </div>
              {/* Options */}
              <div className="p-8 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    {activMotif.tag && (
                      <span className="inline-block bg-[#cc1111] text-white text-[10px] tracking-[0.15em] font-bold px-2 py-1 mb-3">{activMotif.tag}</span>
                    )}
                    <h2 className="font-display font-black text-3xl uppercase tracking-wide leading-tight">{activMotif.name}</h2>
                    <p className="text-[#666] text-xs tracking-wide mt-1">{activMotif.subtitle}</p>
                  </div>
                  <button onClick={() => setActiveMotif(null)} className="text-[#555] hover:text-white text-xs tracking-widest mt-1">✕</button>
                </div>

                <p className="text-2xl font-semibold">{fmt(currency)}</p>

                {/* Motif display */}
                <div>
                  <Label>MOTIF</Label>
                  <p className="text-sm text-white bg-[#1a1a1a] px-4 py-2.5 border border-[#2a2a2a] mt-2">{activMotif.name}</p>
                </div>

                {/* Color */}
                <div>
                  <Label>COULEUR</Label>
                  <div className="flex gap-3 mt-2">
                    {activMotif.variants.map(v => (
                      <button key={v.color} onClick={() => setSelColor(v.color)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest border transition-all ${selColor === v.color ? "border-white text-white" : "border-[#2a2a2a] text-[#666] hover:border-[#555]"}`}>
                        <span className={`w-3 h-3 rounded-full border ${v.color === "white" ? "bg-white border-white/60" : "bg-black border-white/30"}`} />
                        {v.color === "white" ? "BLANC" : "NOIR"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <Label>TAILLE</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activMotif.sizes.map(s => (
                      <button key={s} onClick={() => setSelSize(s)}
                        className={`w-12 h-12 text-sm font-medium border transition-all ${selSize === s ? "bg-white text-black border-white" : "bg-transparent text-[#666] border-[#2a2a2a] hover:border-white hover:text-white"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <Label>QUANTITÉ</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <button onClick={() => setSelQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 border border-[#2a2a2a] text-white hover:border-white transition-colors flex items-center justify-center text-lg">−</button>
                    <span className="font-display font-bold text-xl w-6 text-center">{selQty}</span>
                    <button onClick={() => setSelQty(q => Math.min(10, q + 1))}
                      className="w-10 h-10 border border-[#2a2a2a] text-white hover:border-white transition-colors flex items-center justify-center text-lg">+</button>
                    <span className="text-[#555] text-xs ml-2">{fmt(currency, selQty)}</span>
                  </div>
                </div>

                <button onClick={addToCart} disabled={!selSize}
                  className={`w-full py-4 text-sm tracking-[0.2em] font-semibold transition-all mt-auto ${selSize ? "bg-[#cc1111] text-white hover:bg-[#e01010]" : "bg-[#1a1a1a] text-[#444] cursor-not-allowed"}`}>
                  {selSize ? "AJOUTER AU PANIER" : "SÉLECTIONNER UNE TAILLE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CART / CHECKOUT SIDEBAR ───────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setCartOpen(false); }}>
          <div className="bg-[#111] w-full max-w-md h-full flex flex-col animate-slide-in overflow-hidden">

            {/* ── STEP: CART ── */}
            {step === "cart" && (
              <>
                <SidebarHeader title="PANIER" onClose={() => setCartOpen(false)} />
                {cart.length === 0 ? (
                  <EmptyCart onClose={() => setCartOpen(false)} />
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-5 border-b border-[#1a1a1a]">
                          <div className="w-20 h-24 bg-[#0d0d0d] flex-shrink-0 overflow-hidden">
                            <img src={item.img} alt={item.motifName} className="w-full h-full object-cover object-top" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display font-bold text-sm uppercase tracking-wide leading-tight">{item.motifName}</h4>
                            <p className="text-[#555] text-xs mt-1">{item.color === "white" ? "Blanc" : "Noir"} · Taille {item.size}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button onClick={() => updateQty(idx, -1)} className="w-6 h-6 border border-[#333] text-white text-xs hover:border-white flex items-center justify-center">−</button>
                              <span className="text-sm font-semibold">{item.qty}</span>
                              <button onClick={() => updateQty(idx, +1)} className="w-6 h-6 border border-[#333] text-white text-xs hover:border-white flex items-center justify-center">+</button>
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            <button onClick={() => removeItem(idx)} className="text-[#444] hover:text-[#cc1111] text-xs transition-colors">✕</button>
                            <p className="text-white text-sm font-semibold">{fmt(currency, item.qty)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 border-t border-[#1f1f1f]">
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-xs tracking-widest text-[#666]">TOTAL</span>
                        <span className="font-display font-black text-2xl">{fmt(currency, cart.reduce((s,i) => s + i.qty, 0))}</span>
                      </div>
                      <button onClick={() => setStep("form")} className="w-full bg-[#cc1111] text-white py-4 text-sm tracking-[0.2em] font-semibold hover:bg-[#e01010] transition-colors">
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
                <SidebarHeader title="LIVRAISON" onClose={() => setCartOpen(false)} onBack={() => setStep("cart")} />
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <p className="text-[#555] text-xs tracking-wide mb-2">Renseignez vos informations de livraison</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Prénom" value={form.firstName}   onChange={v => setField("firstName", v)} />
                    <Field label="Nom"    value={form.lastName}    onChange={v => setField("lastName", v)} />
                  </div>
                  <Field label="Adresse complète"  value={form.address} onChange={v => setField("address", v)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Ville"  value={form.city}    onChange={v => setField("city", v)} />
                    <Field label="Pays"   value={form.country} onChange={v => setField("country", v)} placeholder="Optionnel" />
                  </div>
                  <Field label="Numéro WhatsApp" value={form.whatsapp} onChange={v => setField("whatsapp", v)} placeholder="+225 XX XX XX XX" type="tel" />
                  <Field label="Adresse e-mail"  value={form.email}    onChange={v => setField("email", v)}    placeholder="vous@email.com" type="email" />
                  <p className="text-[#444] text-xs leading-relaxed pt-2">
                    Un e-mail de confirmation vous sera envoyé et la marque vous contactera via WhatsApp pour confirmer votre commande.
                  </p>
                </div>
                <div className="p-6 border-t border-[#1f1f1f]">
                  <button onClick={() => setStep("recap")} disabled={!formValid()}
                    className={`w-full py-4 text-sm tracking-[0.2em] font-semibold transition-all ${formValid() ? "bg-[#cc1111] text-white hover:bg-[#e01010]" : "bg-[#1a1a1a] text-[#444] cursor-not-allowed"}`}>
                    VOIR LE RÉCAPITULATIF →
                  </button>
                </div>
              </>
            )}

            {/* ── STEP: RECAP ── */}
            {step === "recap" && (
              <>
                <SidebarHeader title="RÉCAPITULATIF" onClose={() => setCartOpen(false)} onBack={() => setStep("form")} />
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Order items */}
                  <div>
                    <p className="text-xs tracking-[0.2em] text-[#555] mb-3">ARTICLES</p>
                    <div className="space-y-3">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start border-b border-[#1a1a1a] pb-3">
                          <div>
                            <p className="font-display font-bold text-sm uppercase">{item.motifName}</p>
                            <p className="text-[#555] text-xs mt-0.5">
                              {item.color === "white" ? "Blanc" : "Noir"} · Taille {item.size} · Qté {item.qty}
                            </p>
                          </div>
                          <p className="text-white text-sm font-semibold flex-shrink-0 ml-4">{fmt(currency, item.qty)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="font-display font-bold text-sm uppercase tracking-wide">Total</span>
                      <span className="font-display font-black text-xl text-[#cc1111]">{fmt(currency, cart.reduce((s,i) => s+i.qty, 0))}</span>
                    </div>
                  </div>

                  {/* Delivery info */}
                  <div>
                    <p className="text-xs tracking-[0.2em] text-[#555] mb-3">LIVRAISON</p>
                    <div className="bg-[#0d0d0d] p-4 space-y-1.5 text-sm">
                      <p className="text-white">{form.firstName} {form.lastName}</p>
                      <p className="text-[#888]">{form.address}</p>
                      <p className="text-[#888]">{form.city}{form.country ? `, ${form.country}` : ""}</p>
                      <p className="text-[#888] mt-2">WhatsApp : {form.whatsapp}</p>
                      <p className="text-[#888]">Email : {form.email}</p>
                    </div>
                  </div>

                  {sendError && <p className="text-[#cc1111] text-xs border border-[#cc1111]/30 p-3">{sendError}</p>}

                  {!EMAILJS_CONFIGURED && (
                    <div className="bg-[#1a1a0a] border border-yellow-900/40 p-4 text-xs text-yellow-600/80 leading-relaxed">
                      <strong className="text-yellow-500 block mb-1">⚠ Configuration EmailJS requise</strong>
                      Configurez les variables <code>VITE_EJS_*</code> dans <code>.env</code> pour activer l'envoi d'e-mails.
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-[#1f1f1f]">
                  <button onClick={submitOrder} disabled={sending}
                    className={`w-full py-4 text-sm tracking-[0.2em] font-semibold transition-all ${sending ? "bg-[#1a1a1a] text-[#555]" : "bg-[#cc1111] text-white hover:bg-[#e01010]"}`}>
                    {sending ? "ENVOI EN COURS…" : "CONFIRMER LA COMMANDE"}
                  </button>
                </div>
              </>
            )}

            {/* ── STEP: SUCCESS ── */}
            {step === "success" && (
              <>
                <SidebarHeader title="" onClose={() => { setCartOpen(false); setStep("cart"); }} />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-16 h-16 rounded-full bg-[#cc1111]/10 border border-[#cc1111]/30 flex items-center justify-center mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cc1111" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 className="font-display font-black text-3xl uppercase mb-3">Commande envoyée !</h3>
                  <p className="text-[#888] text-sm leading-relaxed max-w-xs mb-2">
                    Un e-mail de confirmation a été envoyé à <span className="text-white">{form.email || "votre adresse"}</span>.
                  </p>
                  <p className="text-[#888] text-sm leading-relaxed max-w-xs mb-8">
                    L'équipe VALENS vous contactera sur WhatsApp pour confirmer votre livraison.
                  </p>
                  <button onClick={() => { setCartOpen(false); setStep("cart"); }}
                    className="bg-[#cc1111] text-white text-xs tracking-[0.2em] font-semibold px-8 py-4 hover:bg-[#e01010] transition-colors">
                    RETOUR À LA COLLECTION
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Small components ───────────────────────────────────────────────────── */
function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs tracking-[0.2em] text-[#555]">{children}</p>;
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] text-[#555] mb-1.5">{label.toUpperCase()}</label>
      <input type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white text-sm px-4 py-3 focus:border-[#cc1111] focus:outline-none placeholder-[#333] transition-colors" />
    </div>
  );
}

function SidebarHeader({ title, onClose, onBack }: { title: string; onClose: () => void; onBack?: () => void }) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-[#1f1f1f] flex-shrink-0">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-[#555] hover:text-white text-xs tracking-widest transition-colors">← RETOUR</button>
        )}
        {title && <h2 className="font-display font-black text-2xl tracking-wide uppercase">{title}</h2>}
      </div>
      <button onClick={onClose} className="text-[#555] hover:text-white text-xs tracking-widest transition-colors">✕</button>
    </div>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" className="mb-6">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <p className="text-[#444] text-xs tracking-widest">VOTRE PANIER EST VIDE</p>
      <button onClick={onClose} className="mt-6 text-xs text-[#cc1111] tracking-widest hover:text-white transition-colors">
        VOIR LA COLLECTION →
      </button>
    </div>
  );
}

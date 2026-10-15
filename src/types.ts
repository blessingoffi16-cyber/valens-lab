export type CurrencyCode = "XOF" | "EUR" | "USD";
export type Currency = { code: CurrencyCode; symbol: string; amount: number };

export type ColorKey = "white" | "black";
export type Variant = { color: ColorKey; img: string };

export type Motif = {
  id: string;
  name: string;
  subtitle: string;
  tag?: string;
  sizes: string[];
  variants: Variant[];
};

export type CartItem = {
  motifId: string;
  motifName: string;
  subtitle: string;
  color: ColorKey;
  img: string;
  size: string;
  qty: number;
};

export type OrderForm = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  whatsapp: string;
  email: string;
};

export type CheckoutStep = "cart" | "form" | "recap" | "success";

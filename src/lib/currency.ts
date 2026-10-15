import type { Currency } from "@/types";

const EUROPE = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","GB","NO","CH","IS","LI","AL","BA","ME","MK","RS","MD","UA","BY","RU"];
const AMERICA = ["US","CA","MX","BR","AR","CL","CO","PE","VE","EC","BO","PY","UY","GY","SR","GT","BZ","HN","SV","NI","CR","PA","CU","DO","HT","JM","TT","BB","LC","VC"];

export function detectCurrency(cc: string): Currency {
  if (EUROPE.includes(cc))  return { code: "EUR", symbol: "€",  amount: 45 };
  if (AMERICA.includes(cc)) return { code: "USD", symbol: "$",  amount: 50 };
  return                           { code: "XOF", symbol: "F",  amount: 12000 };
}

export function fmt(c: Currency, qty = 1): string {
  const total = c.amount * qty;
  if (c.code === "XOF") return `${total.toLocaleString("fr-FR")} F`;
  if (c.code === "EUR") return `${total}€`;
  return `$${total}`;
}

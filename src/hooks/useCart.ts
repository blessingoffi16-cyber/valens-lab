import { useState } from "react";
import type { CartItem } from "@/types";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addItem(item: CartItem) {
    setCart(prev => {
      const idx = prev.findIndex(
        i => i.motifId === item.motifId && i.color === item.color && i.size === item.size
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  }

  function removeItem(idx: number) {
    setCart(prev => prev.filter((_, i) => i !== idx));
  }

  function updateQty(idx: number, delta: number) {
    setCart(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      return { ...item, qty: Math.max(1, item.qty + delta) };
    }));
  }

  function clearCart() {
    setCart([]);
  }

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  return { cart, addItem, removeItem, updateQty, clearCart, totalQty };
}

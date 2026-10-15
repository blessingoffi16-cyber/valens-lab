import type { Motif } from "@/types";
import img2 from "@/assets/2.webp";
import img3 from "@/assets/3.webp";
import img4 from "@/assets/4.webp";
import img6 from "@/assets/6.webp";
import img7 from "@/assets/7.webp";
import img8 from "@/assets/8.webp";
import img9 from "@/assets/9.webp";
import img10 from "@/assets/10.webp";
import img11 from "@/assets/11.webp";
import img12 from "@/assets/12.webp";

export const MOTIFS: Motif[] = [
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

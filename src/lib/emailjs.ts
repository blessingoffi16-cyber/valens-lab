/* ─── EmailJS config ─────────────────────────────────────────────────────────
   Créez un compte sur emailjs.com, puis remplacez ces valeurs.
   SERVICE_ID  : l'ID du service email lié à valensbrand214@gmail.com
   TEMPLATE_BRAND : template envoyé à la marque (to_email = valensbrand214@gmail.com)
   TEMPLATE_CLIENT : template envoyé au client (to_email = {{client_email}})
   PUBLIC_KEY  : votre clé publique EmailJS
──────────────────────────────────────────────────────────────────────────── */
// EmailJS identifiers are public in a Vite client bundle. Environment
// variables can still override these defaults for another EmailJS account.
export const EJS_SERVICE = import.meta.env.VITE_EJS_SERVICE || "service_su87zz9";
export const EJS_T_BRAND = import.meta.env.VITE_EJS_T_BRAND || "template_88v1zdi";
export const EJS_T_CLIENT = import.meta.env.VITE_EJS_T_CLIENT || "template_ojjcfee";
export const EJS_PUBLIC_KEY = import.meta.env.VITE_EJS_PUBLIC_KEY || "dpUaaj__EfalQvpfL";
export const EMAILJS_CONFIGURED = Boolean(
  EJS_SERVICE && EJS_T_BRAND && EJS_T_CLIENT && EJS_PUBLIC_KEY,
);

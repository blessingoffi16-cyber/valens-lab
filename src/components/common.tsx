export function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs tracking-widest-xl text-faint">{children}</p>;
}

type InputMode = "text" | "tel" | "email" | "numeric" | "search" | "url" | "decimal" | "none";

export function Field({ name, label, value, onChange, placeholder, type = "text", autoComplete, inputMode, pattern, required }: {
  name: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; autoComplete?: string; inputMode?: InputMode; pattern?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-2xs tracking-widest-xl text-faint mb-1.5">{label.toUpperCase()}</label>
      <input id={name} name={name} type={type} value={value} placeholder={placeholder}
        autoComplete={autoComplete} inputMode={inputMode} pattern={pattern} required={required}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-surface border border-border text-white text-sm px-4 py-3 focus:border-primary focus:outline-none placeholder-line transition-colors" />
    </div>
  );
}

export function SidebarHeader({ title, onClose, onBack }: { title: string; onClose: () => void; onBack?: () => void }) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-divider shrink-0">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-faint hover:text-white text-xs tracking-widest transition-colors">← RETOUR</button>
        )}
        {title && <h2 className="font-display font-black text-2xl tracking-wide uppercase">{title}</h2>}
      </div>
      <button onClick={onClose} className="text-faint hover:text-white text-xs tracking-widest transition-colors">✕</button>
    </div>
  );
}

export function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-6 text-line">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <p className="text-ghost text-xs tracking-widest">VOTRE PANIER EST VIDE</p>
      <button onClick={onClose} className="mt-6 text-xs text-primary tracking-widest hover:text-white transition-colors">
        VOIR LA COLLECTION →
      </button>
    </div>
  );
}

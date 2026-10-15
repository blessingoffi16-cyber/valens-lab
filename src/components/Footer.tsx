export function Footer() {
  return (
    <footer id="contact" className="border-t border-secondary py-16 px-5 bg-background">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="mb-5">
            <p className="font-display font-black text-3xl tracking-widest">VALENS</p>
            <p className="text-faint text-xs tracking-widest mt-1">STRONG BY HIS SPIRIT</p>
          </div>
          <p className="text-ghost text-xs leading-relaxed max-w-xs">© 2026 Valens Studios. Designed by Young Prodigies. All rights reserved.</p>
        </div>
        <div>
          <p className="text-xs tracking-widest-xl text-dim mb-5">NAVIGATION</p>
          <ul className="space-y-3 text-sm text-ghost">
            {["Collection","À Propos","Contact","Livraisons"].map(l => (
              <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-widest-xl text-dim mb-5">CONTACT</p>
          <ul className="space-y-3 text-sm text-ghost">
            <li>valensbrand214@gmail.com</li>
            <li className="flex gap-4 mt-4">
              {["Instagram","TikTok"].map(s => (
                <a key={s} href="#" className="text-xs tracking-widest hover:text-primary transition-colors">{s.toUpperCase()}</a>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

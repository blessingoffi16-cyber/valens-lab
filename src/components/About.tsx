import img2 from "@/assets/2.webp";
import img8 from "@/assets/8.webp";
import img12 from "@/assets/12.webp";

const STATS = [
  { val: "2026", label: "Fondé" },
  { val: "10+", label: "Pièces" },
  { val: "∞", label: "Force" },
];

export function About() {
  return (
    <section id="about" className="py-24 border-t border-secondary bg-surface">
      <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-primary text-xs tracking-widest-3xl mb-4">L'ÉNERGIE DES INVAINCUS</p>
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase leading-display tracking-tight mb-10">
            NÉS POUR<br /><span className="text-primary">PRÉVALOIR</span>
          </h2>
          <p className="text-prose text-sm leading-relaxed mb-5 max-w-md">
            Né du latin <em className="text-white not-italic font-medium">Valere</em> — être fort, prévaloir, impacter —, VALENS est un vestiaire streetwear conçu pour une génération qui refuse de plier face au bruit du monde.
          </p>
          <blockquote className="border-l-2 border-primary pl-5 mb-5">
            <p className="text-white text-sm leading-relaxed italic">« Je vous ai écrit, jeunes gens, parce que vous êtes forts, que la parole demeure en vous, et que vous avez vaincu le mauvais. »</p>
            <cite className="text-primary text-xs tracking-widest-xl not-italic mt-2 block">— 1 JEAN 2:14</cite>
          </blockquote>
          <p className="text-prose text-sm leading-relaxed mb-5 max-w-md">
            Nous ne créons pas de simples vêtements : nous façonnons des <span className="text-white font-medium">armures urbaines</span>. Coupes structurées, matières lourdes et détails millimétrés — chaque pièce incarne la discipline, l'ancrage intérieur et le triomphe de la lumière sur l'obscurité.
          </p>
          <p className="text-prose text-sm leading-relaxed mb-10 max-w-md">
            Porter VALENS, c'est affirmer sa force. Demeurer <span className="text-white font-medium">inébranlable</span>.
          </p>
          <div className="grid grid-cols-3 gap-0 border border-divider">
            {STATS.map(({ val, label }, i) => (
              <div key={label} className={`px-5 py-6 ${i < 2 ? "border-r border-divider" : ""}`}>
                <p className="font-display font-black text-4xl text-primary">{val}</p>
                <p className="text-faint text-xs tracking-widest mt-1 uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 h-130">
          <div className="bg-card overflow-hidden row-span-2">
            <img src={img8} alt="VALENS black tee" className="w-full h-full object-cover object-top" />
          </div>
          <div className="bg-card overflow-hidden">
            <img src={img2} alt="VALENS white tee" className="w-full h-full object-cover object-top" />
          </div>
          <div className="bg-card overflow-hidden">
            <img src={img12} alt="VALENS Jeunes Prodiges tee" className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </div>
    </section>
  );
}

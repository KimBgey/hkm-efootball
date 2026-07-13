import Image from "next/image";
import type { JoueurValide } from "@/lib/inscriptions";
import { CrownIcon } from "./icons";

const ACCENTS = [
  "from-kings-gold/70 via-kings-gold/10",
  "from-kings-blue/80 via-kings-blue/10",
  "from-kings-red/70 via-kings-red/10",
  "from-purple-600/70 via-purple-600/10",
  "from-emerald-600/70 via-emerald-600/10",
  "from-slate-900/90 via-slate-900/10",
];

export function PlayersGrid({ joueurs }: { joueurs: JoueurValide[] }) {
  if (joueurs.length === 0) return null;

  return (
    <section className="bg-black px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="flex items-center justify-center gap-3 text-center font-display text-4xl text-white sm:text-5xl">
          <CrownIcon className="h-8 w-8 text-kings-gold sm:h-10 sm:w-10" />
          Rois déjà inscrits
        </h2>
        <p className="mt-2 text-center text-white/50">{joueurs.length} joueurs validés</p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {joueurs.map((joueur, index) => (
            <PlayerCard key={joueur.id} joueur={joueur} accent={ACCENTS[index % ACCENTS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlayerCard({
  joueur,
  accent,
}: {
  joueur: JoueurValide;
  accent: string;
}) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-900 shadow-lg ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-1 hover:ring-kings-gold/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Image
        src={joueur.photoUrl}
        alt={`${joueur.prenom} ${joueur.initiale}`}
        fill
        sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 50vw"
        className="object-cover"
      />

      <div className={`absolute inset-0 bg-gradient-to-t ${accent} to-transparent opacity-80`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

      <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 ring-1 ring-kings-gold/70 backdrop-blur-sm">
        <CrownIcon className="h-4 w-4 text-kings-gold" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
        <p className="truncate font-heading text-sm font-bold uppercase leading-tight text-white sm:text-base">
          {joueur.prenom} {joueur.initiale}
        </p>
        <p className="truncate text-[11px] uppercase tracking-wide text-white/60 sm:text-xs">
          {joueur.club}
        </p>
      </div>
    </div>
  );
}

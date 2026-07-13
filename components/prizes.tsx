import { TrophyIcon } from "./icons";

const PRIZES = [
  { place: "1ère place", amount: "80.000", tier: "gold" as const },
  { place: "2e place", amount: "50.000", tier: "silver" as const },
  { place: "3e place", amount: "30.000", tier: "bronze" as const },
];

const TIER_STYLES = {
  gold: "border-kings-gold bg-gradient-to-b from-kings-gold/20 to-transparent text-kings-gold",
  silver: "border-slate-300 bg-gradient-to-b from-slate-200/40 to-transparent text-slate-500",
  bronze: "border-orange-400 bg-gradient-to-b from-orange-300/30 to-transparent text-orange-500",
};

export function Prizes() {
  return (
    <section className="bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl text-kings-blue-dark sm:text-5xl">
          Gagne jusqu&apos;à 80K sur la première place
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PRIZES.map((prize) => (
            <div
              key={prize.place}
              className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 shadow-sm ${TIER_STYLES[prize.tier]}`}
            >
              <TrophyIcon className="h-10 w-10" />
              <p className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-600">
                {prize.place}
              </p>
              <p className="font-heading text-3xl font-bold text-slate-900">
                {prize.amount}{" "}
                <span className="text-base font-semibold text-slate-500">F CFA</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

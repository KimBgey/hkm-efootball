import { CalendarIcon, ClockIcon, GamepadIcon, PinIcon } from "./icons";

const ITEMS = [
  { icon: CalendarIcon, label: "Date", value: "08 Août 2026" },
  { icon: ClockIcon, label: "Heure", value: "15h" },
  { icon: PinIcon, label: "Lieu", value: "Calavi Parana" },
];

export function PracticalInfo() {
  return (
    <section className="bg-slate-50 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 sm:grid-cols-3">
          {ITEMS.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white p-6 text-center shadow-sm"
            >
              <Icon className="h-8 w-8 text-kings-blue" />
              <p className="font-heading text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </p>
              <p className="font-heading text-2xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl bg-kings-blue px-6 py-6 text-center text-white sm:flex-row sm:justify-center sm:gap-6">
          <div className="flex items-center gap-2">
            <GamepadIcon className="h-6 w-6 text-kings-gold" />
            <span className="font-heading font-semibold">eFootball sur PS3</span>
          </div>
          <span className="hidden text-white/40 sm:inline">·</span>
          <span className="font-heading font-semibold">
            Frais d&apos;inscription :{" "}
            <span className="text-kings-gold">10.000 F CFA</span>
          </span>
        </div>
      </div>
    </section>
  );
}

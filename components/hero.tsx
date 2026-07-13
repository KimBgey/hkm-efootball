import Image from "next/image";
import { Countdown } from "./countdown";
import { CrownIcon, StarIcon } from "./icons";
import logo from "@/app/assets/Logo.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-kings-blue px-6 pb-16 pt-20 text-center sm:pb-24 sm:pt-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="mb-4 inline-flex items-center px-4 py-2">
        <Image src={logo} alt="LUCIE" className="h-12 w-auto object-contain" />
      </div>
      <CrownIcon className="absolute left-4 top-10 h-12 w-12 rotate-[-12deg] text-kings-gold drop-shadow-lg sm:left-10 sm:h-16 sm:w-16" />
      <StarIcon className="absolute right-6 top-8 h-10 w-10 animate-pulse text-kings-gold drop-shadow-lg motion-reduce:animate-none sm:right-16 sm:h-14 sm:w-14" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
          eFootball · PlayStation 3
        </p>

        <h1 className="font-display text-6xl leading-none text-white [text-shadow:_3px_3px_0_rgb(0_0_0_/_40%)] sm:text-8xl">
          hkm eFootball kings
        </h1>

        <p className="font-heading text-xl font-bold uppercase tracking-wide text-kings-gold sm:text-2xl">
          Ici, on ne joue pas. On règne.
        </p>

        <Countdown />

        <a
          href="#inscription"
          className="cursor-pointer rounded-full bg-kings-red px-8 py-4 font-heading text-lg font-bold uppercase tracking-wide text-white shadow-lg shadow-black/20 transition-colors duration-200 hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Je m&apos;inscris
        </a>
      </div>
    </section>
  );
}

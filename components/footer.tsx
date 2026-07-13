import Image from "next/image";
import logo from "@/app/assets/Logo.png";
import { PhoneIcon } from "./icons";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "WhatsApp", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 px-6 py-12 text-center text-white">
      <div className="mb-4 inline-flex items-center px-4 py-2">
        <Image src={logo} alt="LUCIE" className="h-10 w-auto object-contain" />
      </div>

      <p className="font-display text-3xl">hkm eFootball kings</p>

      <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
        <a
          href="tel:+2290155952589"
          className="flex cursor-pointer items-center gap-2 text-white/80 transition-colors duration-200 hover:text-kings-gold"
        >
          <PhoneIcon className="h-4 w-4" /> +229 0155952589
        </a>
        <a
          href="tel:+2290155357747"
          className="flex cursor-pointer items-center gap-2 text-white/80 transition-colors duration-200 hover:text-kings-gold"
        >
          <PhoneIcon className="h-4 w-4" /> 0155357747
        </a>
      </div>

      <div className="mt-6 flex justify-center gap-6 text-sm">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="cursor-pointer text-white/60 transition-colors duration-200 hover:text-kings-gold"
          >
            {link.label}
          </a>
        ))}
      </div>

      <p className="mt-8 text-xs text-white/40">
        © 2026 hkm eFootball Kings — Calavi Parana, Bénin
      </p>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-08-08T15:00:00+01:00").getTime();

interface TimeLeft {
  jours: number;
  heures: number;
  minutes: number;
  secondes: number;
}

function computeTimeLeft(): TimeLeft {
  const diff = Math.max(EVENT_DATE - Date.now(), 0);
  return {
    jours: Math.floor(diff / (1000 * 60 * 60 * 24)),
    heures: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    secondes: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3">
      <span className="font-heading text-2xl font-bold tabular-nums text-white sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-white/70 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(computeTimeLeft());
    const interval = setInterval(() => setTimeLeft(computeTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) {
    return <div className="h-[72px] sm:h-[84px]" aria-hidden="true" />;
  }

  return (
    <div
      className="flex gap-2 sm:gap-3"
      role="timer"
      aria-label={`Compte à rebours : ${timeLeft.jours} jours ${timeLeft.heures} heures ${timeLeft.minutes} minutes ${timeLeft.secondes} secondes avant le tournoi`}
    >
      <Unit value={timeLeft.jours} label="jours" />
      <Unit value={timeLeft.heures} label="heures" />
      <Unit value={timeLeft.minutes} label="min" />
      <Unit value={timeLeft.secondes} label="sec" />
    </div>
  );
}

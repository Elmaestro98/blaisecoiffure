"use client";

import { useEffect, useState, type ElementType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Truck, CreditCard, Clock, Sparkles, X } from "lucide-react";
import Link from "next/link";

const icons: Record<string, ElementType> = {
  shield: Shield,
  truck: Truck,
  creditCard: CreditCard,
  clock: Clock,
  sparkles: Sparkles,
};

type Message = { text: string; icon?: string; link?: string };

export function AnnouncementBar({
  messages,
  intervalMs = 3500,
}: {
  messages: Message[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (paused || dismissed || messages.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [paused, dismissed, intervalMs, messages.length]);

  if (dismissed || !messages.length) return null;

  // Index dérivé au rendu : reste valide même si messages.length change
  const safeIndex = index % messages.length;
  const current = messages[safeIndex];
  const Icon: ElementType | null = current.icon
    ? (icons[current.icon] ?? null)
    : null;

  const content = (
    <span className="flex items-center gap-2">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {current.text}
    </span>
  );

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-9 w-full rounded py-2 mb-2 overflow-hidden bg-[#7A1220]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${safeIndex}-${current.text}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-center text-xs md:text-sm font-medium text-[#F2F0EC]"
        >
          {current.link ? (
            <Link href={current.link} className="hover:underline">
              {content}
            </Link>
          ) : (
            content
          )}
        </motion.div>
      </AnimatePresence>

      {/* Indicateurs */}
      {messages.length > 1 && (
        <div className="absolute bottom-0.5 right-3 flex gap-1">
          {messages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all ${
                i === safeIndex ? "w-4 bg-[#F2F0EC]" : "w-1.5 bg-white/30"
              }`}
              aria-label={`Message ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Fermer */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F2F0EC]/70 transition hover:text-[#F2F0EC]"
        aria-label="Fermer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default AnnouncementBar;

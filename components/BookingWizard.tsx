"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceSummary } from "@/type/service";

type BookingWizardProps = {
  services: ServiceSummary[];
  defaultServiceSlug?: string;
};

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "19:00",
  "20:00",
];

const steps = [
  { label: "Service", icon: Sparkles },
  { label: "Créneau", icon: CalendarDays },
  { label: "Coordonnées", icon: UserRound },
  { label: "Confirmation", icon: CheckCircle2 },
];

const inputClassName =
  "h-12 w-full rounded-xl border border-[#E8D9D5] bg-white px-4 text-sm text-[#24171A] outline-none transition placeholder:text-[#A59591] focus:border-[#8E2332] focus:ring-4 focus:ring-[#8E2332]/10";

function formatDate(date: string) {
  if (!date) return "À choisir";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="mb-2 block text-sm font-semibold text-[#24171A]">
      {children}
      {required ? <span className="ml-1 text-[#9E2637]">*</span> : null}
    </span>
  );
}

export default function BookingWizard({
  services,
  defaultServiceSlug,
}: BookingWizardProps) {
  const initialService =
    services.find((service) => service.slug === defaultServiceSlug) ??
    services[0];
  const [step, setStep] = useState(0);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState(
    initialService?.slug ?? "",
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState(timeSlots[0]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const selectedService = useMemo(
    () =>
      services.find((service) => service.slug === selectedServiceSlug) ?? null,
    [selectedServiceSlug, services],
  );
  const minDate = new Date().toISOString().split("T")[0];
  const canContinue =
    step === 0
      ? Boolean(selectedService)
      : step === 1
        ? Boolean(date && time)
        : step === 2
          ? Boolean(fullName.trim() && phone.trim() && email.trim())
          : true;

  const nextStep = () => {
    if (canContinue && step < steps.length - 1) {
      setError("");
      setStep((current) => current + 1);
    }
  };

  const previousStep = () => {
    setError("");
    if (step > 0) setStep((current) => current - 1);
  };

  const handleSubmit = async () => {
    if (!selectedService || !date || !time || !fullName || !phone || !email)
      return;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService._id,
          service: selectedService.name,
          serviceSlug: selectedService.slug,
          date,
          time,
          fullName,
          phone,
          email,
          notes,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          result?.details ??
            result?.error ??
            "La réservation n’a pas pu être enregistrée.",
        );
      }
      setWhatsappUrl(result?.whatsappUrl ?? "");
      localStorage.setItem(
        "blaise-booking",
        JSON.stringify({
          service: selectedService.name,
          date,
          time,
          fullName,
          phone,
          email,
          notes,
        }),
      );
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Une erreur est survenue. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl border border-[#E8D9D5] bg-white p-8 shadow-[0_24px_80px_rgba(75,33,29,0.10)] sm:p-12">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#F4E2E5] text-[#8E2332]">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-[#8E2332]">
          Demande reçue
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight text-[#24171A]">
          Votre rendez-vous est en attente de confirmation.
        </h2>
        <p className="mt-4 leading-7 text-[#756563]">
          Nous avons bien enregistré votre demande. Notre équipe vous contactera
          pour confirmer le créneau.
        </p>
        <div className="mt-8 grid gap-4 rounded-2xl bg-[#FBF7F5] p-5 text-sm sm:grid-cols-3">
          <div>
            <p className="text-[#9C8D89]">Service</p>
            <p className="mt-1 font-semibold text-[#24171A]">
              {selectedService?.name}
            </p>
          </div>
          <div>
            <p className="text-[#9C8D89]">Date</p>
            <p className="mt-1 font-semibold capitalize text-[#24171A]">
              {formatDate(date)}
            </p>
          </div>
          <div>
            <p className="text-[#9C8D89]">Heure</p>
            <p className="mt-1 font-semibold text-[#24171A]">{time}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white transition hover:bg-[#1DA851]"
            >
              <MessageCircle className="h-4 w-4" />
              Envoyer sur WhatsApp
            </a>
          ) : null}
          <Link
            href="/mes-reservations"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#8E2332] px-5 text-sm font-bold text-white transition hover:bg-[#711B28]"
          >
            Voir mes réservations
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-[#E8D9D5] px-5 text-sm font-bold text-[#24171A] transition hover:bg-[#FBF7F5]"
          >
            Retour à l’accueil
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="overflow-hidden rounded-3xl border border-[#E8D9D5] bg-white shadow-[0_24px_80px_rgba(75,33,29,0.08)]">
        <div className="border-b border-[#F0E6E2] px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8E2332]">
                Votre rendez-vous
              </p>
              <h2 className="mt-1 font-display text-2xl text-[#24171A]">
                Réservez en quelques étapes
              </h2>
            </div>
            <span className="text-sm font-semibold text-[#9C8D89]">
              {step + 1} / {steps.length}
            </span>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-2">
            {steps.map((currentStep, index) => {
              const Icon = currentStep.icon;
              const complete = index < step;
              const active = index === step;
              return (
                <div key={currentStep.label} className="min-w-0">
                  <div
                    className={cn(
                      "h-1 rounded-full transition-colors",
                      index <= step ? "bg-[#8E2332]" : "bg-[#F0E6E2]",
                    )}
                  />
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full",
                        active || complete
                          ? "bg-[#F4E2E5] text-[#8E2332]"
                          : "bg-[#FBF7F5] text-[#B0A19D]",
                      )}
                    >
                      {complete ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "hidden truncate sm:block",
                        active ? "text-[#24171A]" : "text-[#9C8D89]",
                      )}
                    >
                      {currentStep.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          {step === 0 ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-3xl text-[#24171A]">
                  Quel soin vous ferait plaisir ?
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#756563]">
                  Choisissez une prestation pour commencer votre expérience
                  Blaise.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {services.map((service) => {
                  const selected = service.slug === selectedServiceSlug;
                  return (
                    <button
                      key={service._id}
                      type="button"
                      onClick={() => setSelectedServiceSlug(service.slug)}
                      className={cn(
                        "group rounded-2xl border p-5 text-left transition-all",
                        selected
                          ? "border-[#8E2332] bg-[#FFF7F7] ring-4 ring-[#8E2332]/10"
                          : "border-[#E8D9D5] bg-white hover:-translate-y-0.5 hover:border-[#CDA9A5] hover:shadow-md",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[#24171A]">
                            {service.name}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#9C8D89]">
                            <Clock3 className="h-3.5 w-3.5" />
                            {service.durationMinutes} minutes
                          </p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-bold",
                            selected
                              ? "bg-[#F4E2E5] text-[#8E2332]"
                              : "bg-[#FBF7F5] text-[#756563]",
                          )}
                        >
                          {service.price.toLocaleString("fr-FR")} FCFA
                        </span>
                      </div>
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#756563]">
                        {service.description ??
                          "Un moment de soin personnalisé dans notre salon."}
                      </p>
                      <span
                        className={cn(
                          "mt-4 flex items-center gap-1 text-xs font-bold",
                          selected
                            ? "text-[#8E2332]"
                            : "text-[#9C8D89] group-hover:text-[#8E2332]",
                        )}
                      >
                        {selected ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Sélectionné
                          </>
                        ) : (
                          <>
                            Choisir <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-3xl text-[#24171A]">
                  Quand souhaitez-vous venir ?
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#756563]">
                  Sélectionnez une date puis le créneau qui vous convient.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_1.15fr]">
                <div>
                  <FieldLabel required>Date du rendez-vous</FieldLabel>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-[#8E2332]" />
                    <input
                      aria-label="Date du rendez-vous"
                      type="date"
                      value={date}
                      min={minDate}
                      onChange={(event) => setDate(event.target.value)}
                      className={cn(inputClassName, "pl-12")}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel required>Créneau horaire</FieldLabel>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={cn(
                          "h-11 rounded-xl border text-sm font-semibold transition",
                          time === slot
                            ? "border-[#8E2332] bg-[#8E2332] text-white shadow-sm"
                            : "border-[#E8D9D5] bg-white text-[#756563] hover:border-[#CDA9A5] hover:text-[#8E2332]",
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-3xl text-[#24171A]">
                  Comment pouvons-nous vous joindre ?
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#756563]">
                  Ces informations restent confidentielles et servent uniquement
                  à votre rendez-vous.
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldLabel required>Nom complet</FieldLabel>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-[#9C8D89]" />
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Ex. Marie Diop"
                      className={cn(inputClassName, "pl-12")}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel required>Téléphone</FieldLabel>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-[#9C8D89]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+221 77 000 00 00"
                      className={cn(inputClassName, "pl-12")}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel required>Adresse email</FieldLabel>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-[#9C8D89]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="vous@email.com"
                      className={cn(inputClassName, "pl-12")}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>
                    Message pour l’équipe{" "}
                    <span className="font-normal text-[#9C8D89]">
                      (facultatif)
                    </span>
                  </FieldLabel>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={4}
                    placeholder="Une préférence ou une précision à nous transmettre ?"
                    className={cn(inputClassName, "h-auto resize-none py-3")}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-3xl text-[#24171A]">
                  Tout est-il correct ?
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#756563]">
                  Vérifiez les informations avant d’envoyer votre demande.
                </p>
              </div>
              <div className="divide-y divide-[#F0E6E2] rounded-2xl border border-[#E8D9D5] bg-[#FBF7F5]">
                <div className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9C8D89]">
                      Prestation
                    </p>
                    <p className="mt-1 font-semibold text-[#24171A]">
                      {selectedService?.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-xs font-bold text-[#8E2332]"
                  >
                    Modifier
                  </button>
                </div>
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9C8D89]">
                      Date
                    </p>
                    <p className="mt-1 capitalize font-semibold text-[#24171A]">
                      {formatDate(date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9C8D89]">
                      Heure
                    </p>
                    <p className="mt-1 font-semibold text-[#24171A]">{time}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9C8D89]">
                      Client
                    </p>
                    <p className="mt-1 font-semibold text-[#24171A]">
                      {fullName} · {phone}
                    </p>
                    <p className="mt-1 text-sm text-[#756563]">{email}</p>
                  </div>
                </div>
              </div>
              {error ? (
                <div
                  role="alert"
                  className="rounded-xl border border-[#E8B9B9] bg-[#FFF4F4] px-4 py-3 text-sm leading-6 text-[#8E2332]"
                >
                  {error}
                </div>
              ) : null}
              <p className="flex items-center gap-2 text-xs text-[#9C8D89]">
                <ShieldCheck className="h-4 w-4 text-[#8E2332]" />
                Votre demande sera confirmée par notre équipe.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#F0E6E2] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 0 || isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E8D9D5] bg-white px-4 text-sm font-bold text-[#756563] transition hover:bg-[#FBF7F5] disabled:invisible"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour
            </button>
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center rounded-xl px-3 text-sm font-semibold text-[#9C8D89] transition hover:text-[#8E2332]"
            >
              Annuler
            </Link>
          </div>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canContinue}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#8E2332] px-5 text-sm font-bold text-white transition hover:bg-[#711B28] disabled:cursor-not-allowed disabled:bg-[#D4C5C1]"
            >
              Continuer <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canContinue || isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#8E2332] px-5 text-sm font-bold text-white transition hover:bg-[#711B28] disabled:cursor-not-allowed disabled:bg-[#D4C5C1]"
            >
              {isSubmitting ? "Enregistrement..." : "Confirmer ma demande"}
              {!isSubmitting ? <Check className="h-4 w-4" /> : null}
            </button>
          )}
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-[#E8D9D5] bg-[#24171A] p-6 text-white shadow-[0_24px_80px_rgba(36,23,26,0.14)] lg:sticky lg:top-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E8B5B8]">
          Votre sélection
        </p>
        <h2 className="mt-3 font-display text-3xl">Un moment pour vous.</h2>
        <div className="mt-8 space-y-5 text-sm">
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#E8B5B8]" />
            <div>
              <p className="text-white/50">Prestation</p>
              <p className="mt-1 font-semibold">
                {selectedService?.name ?? "À choisir"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#E8B5B8]" />
            <div>
              <p className="text-white/50">Date et heure</p>
              <p className="mt-1 font-semibold capitalize">
                {date ? `${formatDate(date)} · ${time}` : "À choisir"}
              </p>
            </div>
          </div>
        </div>
        <div className="my-7 h-px bg-white/10" />
        <div className="flex items-center justify-between">
          <span className="text-white/50">Total estimé</span>
          <span className="font-display text-2xl">
            {selectedService
              ? `${selectedService.price.toLocaleString("fr-FR")} F`
              : "—"}
          </span>
        </div>
        <p className="mt-8 text-xs leading-5 text-white/45">
          Le paiement se fait au salon. Votre rendez-vous sera confirmé par
          notre équipe.
        </p>
      </aside>
    </section>
  );
}

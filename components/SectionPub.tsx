"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Volume2, VolumeX } from "lucide-react";
import { SectionPubProps } from "@/type/sectionPub";

const ACCENT = "#7A1220";

export function SectionPub({
  videoSrc,
  posterSrc,
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  reverse = false,
}: SectionPubProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Lecture automatique quand la vidéo entre dans le viewport, pause sinon
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className="py-16 sm:py-20">
      <div
        className={`mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:items-center ${
          reverse ? "sm:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div
          className="group relative mx-auto w-full max-w-[320px] overflow-hidden rounded-3xl shadow-xl"
          style={{ aspectRatio: "9 / 16" }}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Mettre en pause" : "Lancer la vidéo"}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/10"
          >
            {!isPlaying ? (
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
                style={{ backgroundColor: ACCENT }}
              >
                <Play size={22} className="translate-x-[1px]" fill="white" />
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Activer le son" : "Couper le son"}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        <div className="text-center sm:text-left">
          {eyebrow ? (
            <p
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: ACCENT }}
            >
              {eyebrow}
            </p>
          ) : null}

          <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
            {title}
          </h2>

          <p className="mt-4 leading-relaxed text-neutral-600">{description}</p>

          {ctaLabel && ctaHref ? (
            <Link
              href={ctaHref}
              className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              style={{ backgroundColor: ACCENT }}
            >
              {ctaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

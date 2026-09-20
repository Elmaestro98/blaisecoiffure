"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { VideoSectionProps } from "@/type/videoType";

const ACCENT = "#7A1220";

export function VideoSection({
  videoSrc,
  posterSrc,
  badge = "Expérience beauté",
  title = "Une ambiance qui donne envie de se faire chouchouter",
  subtitle = "Découvrez notre univers, nos soins premium et l’atmosphère chaleureuse de notre salon.",
  ctaText = "Réserver un rendez-vous",
  ctaHref = "/reservation",
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 text-center lg:text-left">
            <span
              className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
              style={{
                borderColor: `${ACCENT}33`,
                color: ACCENT,
                backgroundColor: `${ACCENT}0d`,
              }}
            >
              {badge}
            </span>

            <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              {title}
            </h2>

            <p className="max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              {subtitle}
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:opacity-95"
                style={{ backgroundColor: ACCENT }}
              >
                {ctaText}
                <ArrowRight size={16} />
              </a>

              <span className="text-sm text-stone-500">
                Ambiance premium • Soins sur mesure
              </span>
            </div>
          </div>

          <div
            className="group relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/20 bg-stone-950 shadow-[0_30px_80px_rgba(122,18,32,0.18)]"
            style={{ aspectRatio: "16 / 10" }}
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/25" />

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Mettre en pause" : "Lancer la vidéo"}
              className="absolute inset-0 flex items-center justify-center transition"
            >
              {!isPlaying ? (
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition group-hover:scale-105"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Play size={24} className="translate-x-[2px]" fill="white" />
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
              className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/45"
            >
              {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

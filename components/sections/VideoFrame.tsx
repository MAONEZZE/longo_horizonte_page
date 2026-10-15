"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const VIDEO_ID = "d2_FIrJVt1s";
const THUMB = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

// Minimal types for the YouTube IFrame Player API
type YTPlayer = {
  playVideo: () => void;
  stopVideo: () => void;
  setVolume: (v: number) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function VideoFrame() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let alive = true;

    function buildPlayer() {
      if (!alive || !window.YT?.Player || !wrapperRef.current) return;

      // Destroy previous player
      try { playerRef.current?.destroy(); } catch { /* ignore */ }

      // Clear wrapper and inject a fresh target element.
      // YouTube IFrame API REPLACES the target element with an <iframe>.
      // The wrapper (yt-bg-wrapper) stays as the positioned parent.
      wrapperRef.current.innerHTML = "";
      const target = document.createElement("div");
      wrapperRef.current.appendChild(target);

      playerRef.current = new window.YT.Player(target, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady(e) {
            e.target.setVolume(0);
            e.target.playVideo();
          },
          onStateChange(e) {
            // 0 = ENDED, 2 = PAUSED — force continuous replay
            if (e.data === 0 || e.data === 2) {
              setTimeout(() => { if (alive) e.target.playVideo(); }, 100);
            }
          },
        },
      });
    }

    if (window.YT?.Player) {
      buildPlayer();
    } else {
      if (!document.getElementById("yt-api")) {
        const s = document.createElement("script");
        s.id = "yt-api";
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        buildPlayer();
      };
    }

    return () => {
      alive = false;
      try { playerRef.current?.destroy(); } catch { /* ignore */ }
      playerRef.current = null;
    };
  }, []);

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl border border-current/50 shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
        >
          {/* Aspect-ratio shell */}
          <div className="relative aspect-video w-full overflow-hidden">

            {/* Layer 1 — thumbnail (always visible; fallback if video blocked) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={THUMB}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Layer 2 — wrapper that stays as parent; YouTube injects iframe INSIDE it */}
            <div
              ref={wrapperRef}
              className="yt-bg-wrapper absolute inset-0 overflow-hidden"
              style={{ zIndex: 1 }}
            />
          </div>

          {/* Layer 3 — dark overlay */}
          <div className="absolute inset-0 bg-black/62 pointer-events-none" style={{ zIndex: 2 }} />
          <div
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent/12 to-transparent pointer-events-none"
            style={{ zIndex: 3 }}
          />

          {/* Layer 4 — text + play button */}
          <div
            className="absolute inset-0 flex items-center justify-center md:justify-between px-6 md:px-16 gap-6 md:gap-8"
            style={{ zIndex: 4 }}
          >
            {/* Text block — hidden on mobile (no room in aspect-video height) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:block max-w-md"
            >
              <p className="font-ui text-accent text-xs font-bold uppercase tracking-[0.2em] mb-3">
                Sobre a Imersão
              </p>
              <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-offwhite leading-tight mb-4">
                O que é a Imersão Alta Cadência?
              </h2>
              <p className="text-current/70 text-sm md:text-base leading-relaxed">
                Uma tarde imersiva para executivos e empresários que querem transformar conhecimento em marca educacional, ou escalar o que já existe com lucro e método.
Um negócio educacional construído sobre bagagem real, que só acumulam valor com o tempo e são capazes de gerar transformação contínua. Não vive de pico. Quanto mais o tempo passa, mais ele vale.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex-shrink-0 flex flex-col items-center"
            >
              <button
                onClick={() => setOpen(true)}
                className="group relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center hover:bg-accent/40 hover:border-accent hover:scale-110 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Assistir vídeo completo"
              >
                <Play className="w-6 h-6 md:w-10 md:h-10 text-offwhite fill-offwhite ml-0.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="absolute inset-0 rounded-full border border-accent/40 animate-ping opacity-50 pointer-events-none" />
              </button>
              <p className="text-current/70 text-xs text-center mt-2 md:mt-3 font-medium tracking-wide">
                Assistir vídeo
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Video modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-full bg-bg-dark border border-current/50 p-0 overflow-hidden"
          style={{ maxWidth: "min(94vw, 1400px)" }}
        >
          <div className="relative aspect-video w-full">
            {open && (
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
                title="Imersão Alta Cadência — vídeo completo"
                style={{ border: 0 }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

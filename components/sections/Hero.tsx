"use client";

import { motion } from "framer-motion";
import { Target, ArrowRight } from "lucide-react";

const featureBadges = [
  { icon: Target, label: "Imersão Estratégica" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.15,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export function Hero() {
  return (
    <section id="topo" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background base */}
      <div className="absolute inset-0 bg-bg-dark" />

      {/* Dark overlay — keeps text readable */}
      <div className="absolute inset-0 bg-bg-dark/75 pointer-events-none" />

      {/* Vignette: fade left/right/bottom edges to bg */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/75 via-transparent to-bg-dark/75 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-dark pointer-events-none" />

      {/* Logo como marca d'água — acima do véu escuro para não perder opacidade */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: "url('/logos/reduzido/logo-verde.svg')",
          backgroundSize: "min(128vw, 1320px) auto",
        }}
      />

      {/* Ambient accent glow to reinforce brand */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/[0.06] rounded-full blur-[280px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 pt-20 pb-16 text-center">
        {/* Brand title */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <h1
            className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tight mb-8 text-offwhite lowercase"
            style={{
              filter:
                "drop-shadow(0 0 6px rgba(142,221,101,0.35)) drop-shadow(0 0 16px rgba(142,221,101,0.3))",
            }}
          >
            ak
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, #e3f9d5, #8edd65, #2f6b0f)",
              }}
            >
              ee
            </span>
            l
          </h1>
        </motion.div>

        {/* H1 */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <h3 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold leading-[1.15] tracking-tight mb-5 max-w-2xl mx-auto">
            <span className="text-offwhite">Você passou anos acumulando o que poucos têm. Agora é hora de</span>{" "}
            <span className="text-accent"> transformar</span>
            <span className="text-offwhite"> isso em</span>
            <span className="text-accent"> produto.</span>
          </h3>
        </motion.div>

        {/* Subtitle */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <p className="text-base md:text-lg text-offwhite mb-10 leading-snug max-w-xl mx-auto font-medium">
            Uma imersão estratégica para quem quer construir ou escalar um negócio de educação com
            <span className="font-semibold"> posicionamento sólido, produto de alto valor e direção de longo prazo.</span>
          </p>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {featureBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-current/50 text-current/70 text-sm"
            >
              <Icon className="w-4 h-4 text-accent" />
              {label}
            </div>
          ))}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-current/50 text-current/70 text-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
            São Paulo, {process.env.EVT_BAIRRO} · 09h–19h
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#ingressos"
            className="font-ui inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent text-bg-dark font-semibold text-lg hover:bg-accent/85 transition-colors duration-200 cursor-pointer group shadow-[0_0_40px_rgba(142,221,101,0.25)] hover:shadow-[0_0_60px_rgba(142,221,101,0.4)]"
          >
            Garantir minha vaga
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a
            href="#jornada"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-current/50 text-current/70 font-medium text-lg hover:border-current/70 hover:text-offwhite transition-colors duration-200 cursor-pointer"
          >
            Ver programação
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-dark to-transparent pointer-events-none" />
    </section>
  );
}

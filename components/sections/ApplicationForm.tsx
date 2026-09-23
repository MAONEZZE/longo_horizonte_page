"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, MapPin, Clock, Calendar, CheckCircle, Tag, Loader2, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Hash computed at build-time from COUPON_CODE in .env (see next.config.ts).
// Only the SHA-256 digest is exposed — the raw code stays server-side.
const COUPON_HASH = process.env.COUPON_HASH ?? "";

async function hashInput(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.trim().toUpperCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function ApplicationForm() {
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [discounted, setDiscounted] = useState(false);

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setCouponStatus("loading");
    const hash = await hashInput(coupon);
    if (hash === COUPON_HASH) {
      setCouponStatus("valid");
      setDiscounted(true);
    } else {
      setCouponStatus("invalid");
    }
  }

  function resetAndOpen() {
    setCoupon("");
    setCouponStatus("idle");
    setDiscounted(false);
    setOpen(true);
  }

  return (
    <section id="ingressos" className="relative py-16 sm:py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-dark-2/15 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="relative max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          <p className="font-ui text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Ingressos
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-offwhite mb-4 leading-tight">
            Escolha sua vaga
          </h2>
        </motion.div>

        {/* Event info chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12"
        >
          {[
            { icon: Calendar, label: process.env.EVT_DATA },
            { icon: Clock, label: "13h–19h · Coquetel até 21h" },
            { icon: MapPin, label: process.env.EVT_LOCAL },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-current/50 text-current/70 text-sm"
            >
              <Icon className="w-4 h-4 text-accent" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* 3-tier pricing cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr_1fr] gap-4 items-center max-w-3xl mx-auto mb-8"
        >
          {/* Card 1 — Pré Lançamento (esgotado) */}
          <div className="rounded-2xl border border-current/50 bg-white/[0.02] p-6 text-center opacity-55">
            <p className="font-ui text-current/70 text-xs font-bold uppercase tracking-[0.2em] mb-4">Pré Lançamento</p>
            <p className="font-heading text-3xl font-bold text-current/70 mb-1">R$ 4.000</p>
            <p className="text-current/50 text-xs mb-6 leading-relaxed">
              Lote inicial com vagas limitadas. Encerrado.
            </p>
            <button
              disabled
              className="flex items-center justify-center w-full py-3 rounded-xl bg-white/[0.04] border border-current/50 text-current/50 font-semibold text-sm cursor-not-allowed"
            >
              Esgotado
            </button>
          </div>

          {/* Card 2 — Valor Atual (featured) */}
          <div className="relative rounded-2xl border border-accent/50 bg-gradient-to-b from-accent/[0.08] to-transparent p-7 text-center md:scale-[1.04] shadow-[0_12px_48px_rgba(0,0,0,0.45)] hover:border-accent/70 transition-colors duration-300">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent text-bg-dark whitespace-nowrap">
                VAGAS LIMITADAS
              </span>
            </div>
            <p className="font-ui text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">Valor Atual</p>
            <p className="font-heading text-4xl sm:text-5xl font-bold text-accent mb-1">R$ 5.000</p>
            <ul className="space-y-2 mb-7 mt-4 text-left">
              {[
                "Parcelamento disponível",
                "Vagas limitadas",
                "Processo seletivo por ligação de triagem",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                  <span className="text-current/70 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://payment-link-v3.pagar.me/pl_m0ynMoaE7bDx86kidfJQAkPlXK2Z5VJ1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-accent text-bg-dark font-semibold text-base hover:bg-accent/85 transition-colors duration-200 cursor-pointer group shadow-[0_0_30px_rgba(142,221,101,0.25)] hover:shadow-[0_0_50px_rgba(142,221,101,0.4)]"
            >
              Garantir minha vaga
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Card 3 — Valor Final (futuro) */}
          <div className="rounded-2xl border border-current/50 bg-white/[0.02] p-6 text-center opacity-55">
            <p className="font-ui text-current/70 text-xs font-bold uppercase tracking-[0.2em] mb-4">Valor Final</p>
            <p className="font-heading text-3xl font-bold text-current/70 mb-1">R$ 7.500</p>
            <p className="text-current/50 text-xs mb-6 leading-relaxed">
              Em breve — valor final do evento, sem ofertas exclusivas.
            </p>
            <button
              disabled
              className="flex items-center justify-center w-full py-3 rounded-xl bg-white/[0.04] border border-current/50 text-current/50 font-semibold text-sm cursor-not-allowed"
            >
              Em breve
            </button>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent mb-12 sm:mb-16" />

        {/* Wide CTA card with event background image */}
        <div id="aplicar">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative w-full overflow-hidden rounded-2xl border border-accent/20 shadow-[0_24px_80px_rgba(0,0,0,0.6)] min-h-[240px] sm:min-h-[280px] md:min-h-[340px] flex items-center justify-center group"
          >
            {/* Background image */}
            <Image
              src="/capa_chekout/capa_evento.webp"
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 768px) 100vw, 1100px"
              quality={90}
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent" />

            <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-12 text-center">
              <p className="font-ui text-accent text-xs font-bold uppercase tracking-[0.2em]">{process.env.EVT_DATA} · São Paulo, {process.env.EVT_BAIRRO}</p>
              <h4 className="font-heading text-3xl md:text-4xl font-bold text-offwhite leading-tight max-w-xl">
                Imersão Longo Horizonte
              </h4>
              {/* Button opens coupon popup */}
              <button
                onClick={resetAndOpen}
                className="font-ui inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 rounded-xl bg-accent text-bg-dark font-semibold text-base sm:text-lg hover:bg-accent/85 transition-all duration-200 shadow-[0_0_40px_rgba(142,221,101,0.4)] hover:shadow-[0_0_60px_rgba(142,221,101,0.6)] hover:scale-[1.03] cursor-pointer"
              >
                Convidados
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== COUPON POPUP ===== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md bg-bg-dark border border-accent/25 p-0 overflow-hidden gap-0 rounded-2xl">
          {/* Header */}
          <div className="pl-6 pr-12 pt-6 pb-5 border-b border-current/50">
            <p className="font-ui text-accent text-xs font-bold uppercase tracking-[0.2em] mb-1">Finalizar inscrição</p>
            <h3 className="font-heading text-xl font-bold text-offwhite leading-snug">Imersão Longo Horizonte</h3>
            <p className="text-current/70 text-sm mt-1">{process.env.EVT_DATA} · São Paulo, {process.env.EVT_BAIRRO} · 13h–19h</p>
          </div>

          {/* Price display */}
          <div className={`px-6 py-5 border-b transition-colors duration-300 ${discounted ? "border-accent/20 bg-accent/[0.04]" : "border-current/50"}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-current/70 text-xs font-medium mb-1">Valor do ingresso</p>
                {discounted ? (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="font-heading text-2xl font-bold text-current/50 line-through">R$ 5.000</p>
                    <p className="font-heading text-2xl font-bold text-accent">R$ 0</p>
                  </div>
                ) : (
                  <p className="font-heading text-2xl font-bold text-accent">R$ 5.000</p>
                )}
              </div>
              {discounted && (
                <span className="flex-shrink-0 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wide">
                  100% OFF
                </span>
              )}
            </div>
          </div>

          {/* Coupon field */}
          <div className={`px-6 py-5 border-b transition-colors duration-300 ${discounted ? "border-accent/20 bg-accent/[0.04]" : "border-current/50"}`}>
            <p className="text-current/70 text-sm font-medium mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-accent flex-shrink-0" />
              Código de convidado
            </p>

            {discounted ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 border border-accent/25">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-accent text-sm font-semibold">Código aplicado</p>
                  <p className="text-accent/60 text-xs mt-0.5 truncate">{coupon.toUpperCase()}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      if (couponStatus !== "idle") setCouponStatus("idle");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Insira seu código aqui"
                    className={`min-w-0 flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] border text-offwhite placeholder-current/40 focus:outline-none transition-all text-sm ${couponStatus === "invalid" ? "border-red-500/50 focus:border-red-500/70" : "border-current/50 focus:border-accent/50"}`}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponStatus === "loading" || !coupon.trim()}
                    className="flex-shrink-0 w-[82px] px-3 py-2.5 rounded-xl bg-accent/20 border border-accent/30 text-accent text-sm font-semibold hover:bg-accent/30 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                  >
                    {couponStatus === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Aplicar"
                    )}
                  </button>
                </div>

                {couponStatus === "invalid" && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <X className="w-3 h-3 flex-shrink-0" />
                    Código inválido. Tente novamente.
                  </p>
                )}
              </>
            )}
          </div>

          {/* CTA — only enabled when coupon is valid */}
          <div className="px-6 py-5">
            {discounted ? (
              <a
                href={process.env.LINK_CONVIDADO}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-accent text-bg-dark font-semibold text-sm hover:bg-accent/85 transition-all duration-200 cursor-pointer shadow-[0_0_30px_rgba(142,221,101,0.25)] hover:shadow-[0_0_50px_rgba(142,221,101,0.4)]"
              >
                Garantir ingresso de convidado
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-white/[0.06] border border-current/50 text-current/50 font-semibold text-sm cursor-not-allowed"
                aria-label="Insira um código de convite válido para continuar"
              >
                Insira o código de convite
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </button>
            )}
            <p className="text-current/50 text-xs text-center mt-3 leading-relaxed">
              {discounted
                ? "Você será redirecionado para finalizar a inscrição"
                : "Digite e aplique o código de convite para liberar a inscrição"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

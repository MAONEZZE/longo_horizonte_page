"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const targets = [
  {
    number: "01",
    title: "Empresários e Fundadores",
    description:
      "Que já possuem experiência de mercado, sabem que têm algo valioso para vender e querem aumentar ticket, margem e sofisticação comercial. Cansados de depender de indicação aleatória ou esforço pessoal sem estrutura.",
    bold: ["ticket", "margem", "sofisticação comercial"],
    checks: [
      "Aumentar ticket e margem nas vendas",
      "Vender com mais consistência e menos esforço",
      "Construir um processo comercial de alto nível",
    ],
  },
  {
    number: "02",
    title: "Experts, Consultores e Mentores",
    description:
      "Que oferecem soluções, mentorias, serviços ou produtos de alto valor e querem crescer sem depender de volume. Entendem que o próximo salto exige pensamento estratégico, processo comercial e decisão clara.",
    bold: ["alto valor", "pensamento estratégico", "processo comercial"],
    checks: [
      "Estruturar oferta de alto valor com clareza",
      "Vender expertise sem depender de volume",
      "Crescer com critério e Alta Cadência",
    ],
  },
];

type Rect = { x0: number; x1: number; y0: number; y1: number };
type Pos = { top: number; left: number; size: number; dur: number; delay: number };

// keep only the centered title TEXT clear; photos/particles still fill the
// top corners beside it, so they spread across the whole section background
const TITLE_BOX: Rect = { x0: 30, x1: 70, y0: 0, y1: 30 };
const TOP_START = 8;

// Near (foreground) photos get a COARSE grid — one photo per big cell, so
// gaps are guaranteed and nothing overlaps. Far (blurred/depth) photos sit in
// the half-cell gaps between them, filling the background.
function generateLayout(count: number, scale = 1) {
  const nearSizes = [72, 84, 76, 88, 80].map((s) => Math.round(s * scale));
  const durs = [3.5, 4.1, 3.8, 4.4, 3.6, 4.2, 3.9, 4.6];
  const span = 94 - TOP_START;
  const cl = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

  // coarse grid; near photos take EVEN (r+c) cells, far take ODD cells →
  // chessboard stagger (no column alignment), cells big → well spaced.
  const cols = Math.max(5, Math.round(Math.sqrt(count * 2)));
  const cellW = 95 / cols;

  const inTitle = (x: number, y: number, my: number) =>
    x >= TITLE_BOX.x0 - cellW && x <= TITLE_BOX.x1 + cellW &&
    y >= TITLE_BOX.y0 - my && y <= TITLE_BOX.y1 + my;

  // grow rows until BOTH parities have enough non-title cells
  let rows = Math.ceil((count * 2) / cols) + 1;
  let evenCells: { cx: number; cy: number }[] = [];
  let oddCells: { cx: number; cy: number }[] = [];
  let cellH = span / rows;
  for (;;) {
    cellH = span / rows;
    evenCells = [];
    oddCells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = 2 + (c + 0.5) * cellW;
        const cy = TOP_START + (r + 0.5) * cellH;
        if (inTitle(cx, cy, cellH)) continue;
        ((r + c) % 2 === 0 ? evenCells : oddCells).push({ cx, cy });
      }
    }
    if (evenCells.length >= count && oddCells.length >= count) break;
    rows++;
  }

  // jitter ≤ 0.3 cell so a photo stays inside its cell → never overlaps neighbor
  const jit = (i: number, a: number, b: number, amp: number) =>
    (((i * a + b) % 100) / 100 - 0.5) * amp;

  const near: Pos[] = [];
  const far: Pos[] = [];
  for (let i = 0; i < count; i++) {
    const n = evenCells[i];
    near.push({
      left: cl(n.cx + jit(i, 50, -50, cellW * 0.3), 1, 92),
      top:  cl(n.cy + jit(i, 1, 1, cellH * 0.3), TOP_START - 2, 94),
      size: nearSizes[i % nearSizes.length],
      dur:  durs[i % durs.length],
      delay: (i * 0.22) % 2.0,
    });

    const f = oddCells[i];
    far.push({
      left: cl(f.cx + jit(i, 17, 5, cellW * 0.3), 1, 92),
      top:  cl(f.cy + jit(i, 23, 9, cellH * 0.3), TOP_START - 2, 94),
      size: Math.round(nearSizes[i % nearSizes.length] * 0.55),
      dur:  durs[(i + 3) % durs.length],
      delay: (i * 0.31) % 2.0,
    });
  }
  return { near, far };
}

function generateParticles(count: number) {
  const colorOptions = ["rgba(142,221,101,0.9)", "rgba(180,235,150,0.7)", "rgba(47,107,15,0.8)"];
  return Array.from({ length: count }, (_, i) => {
    const top  = 4 + ((i * 4.37) % 90);
    const left = 3 + ((i * 8.71) % 92);
    // keep title text clear: particles inside the title box drop below it
    const inBox =
      left >= TITLE_BOX.x0 && left <= TITLE_BOX.x1 &&
      top  >= TITLE_BOX.y0 && top  <= TITLE_BOX.y1;
    return {
      top:   inBox ? TITLE_BOX.y1 + 2 + ((i * 4.37) % (90 - TITLE_BOX.y1)) : top,
      left,
      size:  1  + (i % 3),
      dur:   2.1 + (i % 6) * 0.28,
      delay: (i * 0.19) % 2.5,
      color: colorOptions[i % colorOptions.length],
    };
  });
}

const PARTICLES = generateParticles(40);

export function ForWhomClient({ clientFiles }: { clientFiles: string[] }) {
  // On phones, render fewer scattered photos so the section stays light.
  // null = full set (server + desktop). Set after mount to avoid hydration mismatch.
  const [maxPhotos, setMaxPhotos] = useState<number | null>(null);

  useEffect(() => {
    const update = () =>
      setMaxPhotos(
        window.innerWidth < 768 ? Math.max(6, Math.ceil(clientFiles.length * 0.7)) : null
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [clientFiles.length]);

  const isPhone = maxPhotos != null;
  const visibleFiles = maxPhotos == null ? clientFiles : clientFiles.slice(0, maxPhotos);
  // Shrink photos on phones so the fixed px sizes don't overlap on a narrow grid.
  const { near: positions, far: farPositions } = generateLayout(
    visibleFiles.length,
    isPhone ? 0.5 : 1
  );

  return (
    <section className="relative pt-24 pb-40 md:pb-24 px-4 overflow-hidden bg-offwhite text-ink">

      {/* Full-section background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Far layer — repeated photos, smaller/blurred/darker (depth) */}
        {visibleFiles.map((file, idx) => {
          const pos = farPositions[idx];
          return (
            <motion.div
              key={`far-${file}`}
              className="absolute rounded-xl overflow-hidden border border-current/50"
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
                width: pos.size,
                height: pos.size,
                filter: "blur(3px) brightness(0.4)",
                opacity: 0.45,
              }}
              animate={{ y: [0, -7, 0] }}
              transition={{ y: { duration: pos.dur * 1.4, repeat: Infinity, ease: "easeInOut", delay: pos.delay } }}
            >
              <Image
                src={`/clientes/${file}`}
                alt=""
                width={pos.size}
                height={pos.size}
                className="object-cover w-full h-full"
              />
            </motion.div>
          );
        })}

        {/* Glowing particles */}
        {PARTICLES.map((p, idx) => (
          <motion.div
            key={`p${idx}`}
            className="absolute rounded-full"
            style={{
              top:       `${p.top}%`,
              left:      `${p.left}%`,
              width:     p.size,
              height:    p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 5}px ${p.color}`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}

        {/* Scattered client photos */}
        {visibleFiles.map((file, idx) => {
          const pos = positions[idx];
          return (
            <motion.div
              key={file}
              className="absolute rounded-2xl overflow-hidden border border-current/50 shadow-[0_6px_28px_rgba(0,0,0,0.45)]"
              style={{ top: `${pos.top}%`, left: `${pos.left}%`, width: pos.size, height: pos.size }}
              initial={{ opacity: 0, scale: 0.75 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ y: [0, -11, 0], rotate: [-1, 1.5, -1] }}
              transition={{
                opacity: { duration: 0.5, delay: idx * 0.05 },
                scale:   { duration: 0.5, delay: idx * 0.05 },
                y:       { duration: pos.dur, repeat: Infinity, ease: "easeInOut", delay: pos.delay },
                rotate:  { duration: pos.dur * 1.3, repeat: Infinity, ease: "easeInOut", delay: pos.delay },
              }}
            >
              <Image
                src={`/clientes/${file}`}
                alt={`cliente ${idx + 1}`}
                width={pos.size}
                height={pos.size}
                quality={90}
                className="object-cover w-full h-full"
              />
            </motion.div>
          );
        })}

        {/* Top / bottom edge fades */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-offwhite to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-offwhite to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-center"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-ink mb-4 leading-tight">
              Para quem é essa imersão
            </h2>
            <p className="text-current/70 text-lg max-w-xl mx-auto">
              A Imersão Alta Cadência foi desenhada para quem já chegou longe e quer ir mais longe ainda.
            </p>
          </motion.div>

          <div className="space-y-20 md:space-y-8">
            {targets.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="bg-bg-dark-2 border border-accent/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.65)] p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-12 text-offwhite"
              >
                <div className="flex-shrink-0">
                  <span className="font-heading text-5xl md:text-8xl font-bold text-transparent [-webkit-text-stroke:1px_var(--color-accent)] opacity-70 leading-none select-none">
                    {item.number}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-offwhite mb-4 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-current/70 text-base md:text-lg leading-relaxed mb-6">
                    {item.description
                      .split(new RegExp(`(${item.bold.join("|")})`))
                      .map((part, j) =>
                        item.bold.includes(part) ? (
                          <strong key={j} className="text-current font-semibold">{part}</strong>
                        ) : (
                          part
                        )
                      )}
                  </p>
                  <ul className="hidden md:block space-y-2.5">
                    {item.checks.map((check, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-current/70 text-sm leading-relaxed">{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

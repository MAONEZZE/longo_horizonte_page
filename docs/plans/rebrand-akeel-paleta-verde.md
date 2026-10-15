# Rebrand akeel — paleta verde, nomes e limpeza

## Context

A landing hoje é a identidade **"Bronze & Grafite"**: roxo `#6d2399` + dourado `#d8b673` sobre quase-preto `#0a050f`, dark-only, com **264 hexes hardcoded em 23 arquivos** e nenhum token de marca real (os que existem em `globals.css` estão duplicados e conflitantes).

Três mudanças foram pedidas juntas:

1. **Paleta nova** — sistema verde de duas superfícies com ratios WCAG já auditados. Dois verdes existem de propósito e não colapsam num só: `accent` só vive sobre escuro (9.69:1), `accent-ink` só vive sobre claro (5.91:1). Cada um é proibido no fundo do outro.
2. **`atlaz` → `akeel`** (minúsculo, estilizado tipo "adidas").
3. **"Fator de Alta Cadência" → "Imersão Alta Cadência"** (11 ocorrências, incluindo `<title>` e metadata de SEO).

Como a paleta nova define superfície clara *e* escura, a página deixa de ser dark-only: três seções de leitura longa invertem para fundo claro. Resultado esperado: nenhum hex da paleta velha sobrando no repo, contraste conforme a tabela em todo lugar, e tokens de marca reais no lugar dos 264 hexes.

> **Nota de execução:** o arquivo é `app/globals.css` — **não existe `src/`**. Também **não existe `tests/`** nem test runner, então `tests/brand.test.ts` (citado na tabela como guarda) não pode travar nada aqui; verificação é build + lint + screenshots. Nenhum hex do blog está presente hoje, então não há o que remover deles.

---

## Tokens

`app/globals.css` — apagar os blocos **"Bronze & Grafite"** (`--purple`, `--gold`, `--gold-dim`, `--accent2`, `--purple-soft`, `--purple-deep`, `--bg-2`, `--bg-3`, `--line`, `--ink`, `--body`, `--text-muted`) e **"tokens legados → remapeados"** (`--color-bg`, `--color-accent: var(--gold)`, `--color-cta`, `--color-cta-hover`, `--color-purple-deep`, `--color-glass`, `--color-glass-border`) por inteiro.

```css
@theme inline {
  --color-accent:     #8edd65;  /* grafismo/texto sobre escuro — 9.69:1 */
  --color-accent-ink: #2f6b0f;  /* texto/UI sobre offwhite — 5.91:1 AA */
  --color-bg-dark:    #071417;  /* derivado: retro-calculado de 9.69:1 */
  --color-bg-dark-2:  #0c1b1f;  /* rodapé, cards, bandas de frase */
  --color-offwhite:   #f4f4f4;  /* fundo claro */
  --color-ink:        #0f1a1c;  /* texto sobre offwhite — 16.11:1 AAA */
  --color-ui-accent:  var(--accent);  /* shadcn, renomeado p/ não colidir */
}
```

`--color-bg-dark: #071417` é **derivado**, não oficial — a tabela cita "sobre bg-dark" e dá os ratios contra ele, mas não fornece o hex. Substituir pelo valor oficial quando existir.

**Regras invioláveis:**
- `accent #8edd65` nunca sobre offwhite (1.51:1)
- `accent-ink #2f6b0f` nunca sobre `bg-dark` nem `bg-dark-2` (2.47:1 / 2.71:1)
- `offwhite` nunca como texto sobre `accent`

**shadcn oklch** — realinhar só os tokens com consumidor vivo (`ui/button`, `ui/input`, `ui/card`, `ui/dialog`, `ui/accordion`): `--background`→`#071417`, `--foreground`→`#f4f4f4`, `--popover`/`--card`/`--muted`→`#0c1b1f`, `--ring`→`#8edd65`, `--border`/`--input`→`currentColor 50%`. **`chart-1..5` e os 8 `sidebar-*` ficam intocados** — ninguém consome, inventar valor ali não é verificável.

---

## Fundo global: 4 camadas → 2

Hoje: `globals.css body{bg}` + `body::before` (3 radiais roxas) + `body::after` (grid dourado 72px) + um `<div fixed inset-0>` roxo em `layout.tsx`, mais `bg-[#0a050f]` duplicado na classe do `<body>`.

- `body::before` — mantém a estrutura, radiais roxas → `accent`, base → `bg-dark`
- `body::after` — mantém, grid dourado → `accent` em opacidade baixa
- **remover** o `<div fixed inset-0>` de `app/layout.tsx` (quarta camada a 4%, imperceptível)
- **remover** `bg-[#0a050f]` da classe do `<body>`; cor de fundo passa a viver só no `globals.css`
- `<body className="text-white">` → `text-offwhite`

Seção escura = transparente (backdrop aparece). Seção clara = `bg-offwhite` **opaco**, cortando o backdrop.

`text-offwhite` no `<body>` faz `border-current/50` resolver claro no escuro e escuro no claro automaticamente — sem precisar de override por seção.

---

## Mapa de seções (`components/sections/LandingBody.tsx`)

| # | Seção | Superfície |
|---|---|---|
| 1 | Hero / PerfilCard | `bg-dark` (transparente) |
| 2 | VideoFrame | `bg-dark` |
| 3 | Cases | `bg-dark-2` (banda) |
| 4 | EventCards | `bg-dark` |
| 5 | QuoteSection | `bg-dark-2` (banda) |
| 6 | **WhatIs** | **`bg-offwhite`** |
| 7 | Testimonials | `bg-dark` |
| 8 | ImpactPhrase | `bg-dark-2` (banda) |
| 9 | **Mentors** | **`bg-offwhite`** |
| 10 | ImpactPhrase | `bg-dark-2` (banda) |
| 11 | **ForWhom** | **`bg-offwhite`** |
| 11.5 | SponsorCarousel | `bg-dark-2` (banda) |
| 12 | ApplicationForm | `bg-dark` |
| — | Footer | `bg-dark-2` |

`Divider` (`LandingBody.tsx:26`): `via-[#d8b673]/40` → `via-accent/50`.

---

## Padrões de substituição

Aplicar por classe de token, não por hex — os componentes vão ser tocados de qualquer forma pela inversão.

**Seção escura** (transparente sobre backdrop):
```
bg-[#0a050f]      → bg-bg-dark
bg-[#1f1133]      → bg-bg-dark-2
bg-[#241f2b]      → bg-bg-dark-2
bg-[#1A0D2E]      → bg-bg-dark-2
#6d2399 / #7c2fb0 → accent    (fundo de botão: bg-accent + text-bg-dark)
#d8b673           → accent
#c79af0           → accent
text-white        → text-offwhite
text-white/xx     → text-current/70
```

**Seção clara** (`bg-offwhite` opaco):
```
text-white     → text-ink
text-white/xx  → text-current/70
eyebrow #d8b673→ text-accent-ink
botão/UI roxo  → bg-accent-ink text-offwhite
accent #8edd65 → PROIBIDO (1.51:1) — usar accent-ink
```

**Bordas** — elevar tudo para `/50` (cumpre 1.4.11 na página inteira; **as bordas vão ficar visivelmente mais fortes do que hoje**, porque o design atual usa hairlines quase invisíveis como estética):
```
--border oklch(1 0 0 / 10%)                 → currentColor 50%
border-white/[0.05|0.06|0.07|0.08|0.1] (33) → border-current/50
```

**Verdes semânticos → unificados em `accent`.** `bg-green-400` (bolinha "vagas abertas" no Hero) e os 8 usos de `green-400`/`green-500` no estado de cupom do `ApplicationForm` viram `accent` com as mesmas opacidades. O `CheckCircle` + o texto "Código aplicado" já comunicam sucesso sem depender da cor.

**Exceção:** `#25D366` do botão flutuante do WhatsApp em `app/layout.tsx:53` **fica** — cor obrigatória de marca de terceiro.

**Utilities** em `globals.css` (único consumidor vivo de ambas após as deleções: `Testimonials`):
- `.gradient-text`: `#c79af0 → var(--color-accent)`, `branco/90 → var(--color-offwhite)`, `#6d2399 → var(--color-accent-ink)`, text-shadow → accent 25%
- `.glass-card`: bg → `bg-dark-2/55`, border → `accent/50`, box-shadow → accent 8%

---

## Ilhas escuras dentro de seção clara

As três seções claras têm arte escura por necessidade — o fundo e o cabeçalho invertem, os cards **não**.

**`WhatIs.tsx`** — os 4 cards da jornada são foto full-bleed (`/capa_cards/jornada/*.png`, imagens escuras) com scrim `from-[#0a050f]` para o texto ficar legível sobre a imagem. Sem o scrim escuro o texto morre.
- Seção: `bg-offwhite`; eyebrow (`:74`) → `text-accent-ink`; h2 (`:77`) → `text-ink`; parágrafo (`:80`) → `text-current/70`
- Cards: scrim (`:112-113`) `#0a050f` → `bg-dark`; título/itens dentro do card seguem `text-offwhite`/`text-current/70`; chevron `›` (`:152`) → `text-accent`; ícone box (`:132-133`) → `accent/15` + `accent/25` + `text-accent`
- Overlay `:64` (`from-[#1f1133]/15`) → remover ou trocar por gradiente offwhite sutil

**`ForWhomClient.tsx`** — card `bg-[#1A0D2E]` (`:276`) com duas radiais roxas de glow atrás das fotos (`:162`, `:164`).
- Seção: `bg-offwhite`; h2 (`:260`) → `text-ink`; parágrafo (`:263`) → `text-current/70`
- Card: `bg-[#1A0D2E]` → `bg-bg-dark-2`, border → `border-accent/50`; texto interno `text-offwhite`/`text-current/70`; `CheckCircle` (`:301`) → `text-accent`
- Radiais roxas → radiais `accent` em opacidade equivalente

**`Mentors.tsx`** — problema inverso: os cards **já são claros** (`bg-[#F7F5F2]` `:78`, `bg-white` `:95`) e só se destacam por flutuarem sobre escuro. Sobre `#f4f4f4` eles desapareceriam (`#F7F5F2` ≈ `#f4f4f4`).
- Seção: `bg-offwhite`; eyebrow (`:48`) → `text-accent-ink`; h2 (`:51`) → `text-ink`; blockquote (`:64`) → `text-current/70`; hairline (`:38`) → `via-accent-ink/50`
- Card: `#F7F5F2` → `#ffffff` puro (mais claro que o fundo) + `border-accent-ink/50` + `shadow-lg`
- Botões de contato (`:116`, `:130`) e CTA (`:152`) → `bg-accent-ink text-offwhite`, hover `accent-ink` mais escuro

---

## Nav e SectionDock (fixos, flutuam sobre claro e escuro)

**`Nav.tsx`** — hoje `bg-white/[0.03]` no topo e `bg-[#0a050f]/80` após 60px de scroll. Texto branco sobre seção clara seria ilegível.
- Passa a ser **`bg-bg-dark-2/95` + backdrop-blur desde o topo**, opaca, em ambos os estados do `scrolled` (`:86-89`). Perde o efeito de nav transparente sobre o Hero — que hoje só existe nos primeiros 60px.
- Texto → `text-offwhite` / `text-current/70`; CTA (`:110`) → `bg-accent text-bg-dark`; botão outline (`:116`) → `border-accent/50 text-accent`; contador (`:63`, `:66`) → `text-offwhite` / `text-accent`
- Menu mobile (`:144`) → `bg-bg-dark-2/95`
- **Logo (`:95`): `FLH.` → `akeel.`** com o ponto em `text-accent`

**`SectionDock.tsx`** — `bg-[#1f1133]/95` → `bg-bg-dark-2/95`.

---

## Renomes

**`atlaz` → `akeel`** (minúsculo, inclusive no meio de frase — é estilização de marca):

| Arquivo | De | Para |
|---|---|---|
| `Mentors.tsx:10` | `"Fundador da Atlaz"` | `"Fundador da akeel"` |
| `Mentors.tsx:23` | `"Co-fundadora da Atlaz"` | `"Co-fundadora da akeel"` |
| `QuoteSection.tsx:29` | `Co-fundador da Atlaz` (comentado) | `akeel` |
| `Footer.tsx:64`, `:78` | `aria-label` "da Atlaz" | "da akeel" |
| `Footer.tsx:98` | `© 2026 Atlaz` | `© 2026 akeel` |
| `data/pessoas.json` ×6 | `"Embaixador Atlaz"` | `"Embaixador akeel"` |

**URLs sociais** — Instagram muda, LinkedIn e YouTube **ficam como estão** (contas ainda não renomeadas):
- `Footer.tsx:61` `instagram.com/by.atlaz` → **`instagram.com/somos.akeel`**
- `Footer.tsx:88` `@by.atlaz` → **`@somos.akeel`**
- `Footer.tsx:75` `linkedin.com/company/atlaz-society` → **intocado**

**"Fator de Alta Cadência" → "Imersão Alta Cadência"** (Title Case, sem trema — vai para `<title>`, H1 e metadata):

- `app/layout.tsx:31` (`metadata.title`)
- `app/proximas-edicoes/page.tsx:7`, `:8` (title + description)
- `VideoFrame.tsx:167` ("O que é o…"), `:211` (`title` do iframe)
- `ForWhomClient.tsx:264` ("A Fator de Alta Cadência foi desenhada…" → **"A Imersão Alta Cadência foi desenhada…"**)
- `ApplicationForm.tsx:184`, `:205`
- `Footer.tsx:39`

**Colisão a tratar:** `Hook.tsx:41` já diz `"Imersão Fator de Alta Cadência"` — substituição ingênua produziria `"Imersão Imersão Alta Cadência"`. Esse arquivo está na lista de deleção, então o problema desaparece; mas se `Hook.tsx` for preservado, tratar essa linha à mão.

`shape-landing-hero.tsx:67` (`title1` default) também tem a string — arquivo deletado.

`package.json` (`"FLH-landing"`), comentários com "FLH", e o texto do link do WhatsApp (`"vim pela pagina da FLH"`, `layout.tsx:48`) **ficam** — não são user-facing na página.

---

## Deleções (código morto)

Sete arquivos que **nenhuma rota importa** — juntos concentram 6 dos 7 usos de `.glass-card`/`.gradient-text`:

```
components/sections/Hook.tsx
components/sections/Includes.tsx
components/sections/Schedule.tsx
components/sections/Unlocks.tsx
components/sections/FAQ.tsx
components/ui/shape-landing-hero.tsx
components/ui/animated-hero.tsx   (só era usado por shape-landing-hero)
```

`EditionsCalendar.tsx` **não** é código morto — é usado por `/proximas-edicoes`.

---

## Rotas secundárias

**`app/[slug]/page.tsx`** — 6 embaixadores (`bruno_rodrigues`, `antonio_minarro`, `thiago_silva`, `marco_cesarino`, `nilson_figueiredo`, `sergio_paiva`), rota `by.{id}`. Usa `PerfilCard` no lugar do Hero + o mesmo `LandingBody`, então herda toda a repintura do corpo de graça. `PerfilCard.tsx` recebe o mesmo tratamento do Hero (escuro + accent): `bg-[#0a050f]`→`bg-dark`, `bg-[#1f1133]`→`bg-dark-2`, roxo→accent, e os cards `bg-white`/`bg-[#F7F5F2]` (`:160`, `:41`) seguem o padrão de card claro sobre escuro.

**`app/proximas-edicoes/page.tsx`** + `EditionsCalendar.tsx` — `bg-[#1A0D2E]/50` → `bg-bg-dark-2/50`; dias confirmados `bg-[#d8b673]` → `bg-accent`; h1 e parágrafo (`:22`, `:24`) → `text-offwhite`/`text-current/70`.
**Correção de copy obrigatória** (`page.tsx:25`): *"Os dias destacados em roxo são as edições confirmadas"* → **"em verde"**. Sem isso o texto descreve uma cor que não existe mais.

**`app/[slug]/not-found.tsx`** — recolorir junto (tem hexes da paleta velha).

---

## Verificação

1. `npm run build` — pega import quebrado dos 7 arquivos deletados e erro de TS
2. `npm run lint`
3. `next dev` + screenshot de `/`, `/by.bruno_rodrigues` e `/proximas-edicoes`
4. Conferir visualmente, nas screenshots:
   - as **3 transições escuro→claro** (QuoteSection→WhatIs, ImpactPhrase→Mentors, ImpactPhrase→ForWhom) e as 3 de volta
   - **Nav sobre seção clara** — o caso que motivou torná-la opaca
   - **cards de foto do WhatIs** — texto sobre imagem ainda legível com o scrim `bg-dark`
   - **cards do Mentors** — `#ffffff` + `border-accent-ink/50` realmente separando do fundo `#f4f4f4`
   - nenhum `text-offwhite` sobrando sobre fundo claro (o build não pega isso)
5. `grep` de confirmação: nenhum `#6d2399`, `#d8b673`, `#0a050f`, `#1f1133`, `#1A0D2E`, `#c79af0`, `#7c2fb0`, `#241f2b` restante, e nenhum hex do blog (`#5ca838`, `#dfe3e1`, `#8b9a9f`, `#51636a`, `#16262b`) introduzido

Sem commit — a revisão é visual antes de qualquer coisa entrar no git.

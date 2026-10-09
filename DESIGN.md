# Stone · Design System "Resultados"

> **Versão:** 1.0.0 · **Atualizado em:** 2026-10-09 · **Tema padrão:** Stone Vibrante
> Fonte de verdade visual do painel **Resultados e Reconhecimentos do Mês**.
> Pode ser reutilizado em outros projetos (Google AI Studio, Lovable, Vite + React).

Este documento serve a duas audiências: **pessoas** que constroem telas e **agentes de IA** (AI Studio, Lovable, Claude etc.) que precisam gerar interfaces consistentes. Se você é um agente, leia a seção [13. Regras para agentes de IA](#13-regras-para-agentes-de-ia) primeiro.

---

## Sumário

1. [Visão geral e princípios](#1-visão-geral-e-princípios)
2. [Stack e instalação](#2-stack-e-instalação)
3. [Tokens](#3-tokens)
4. [Tipografia](#4-tipografia)
5. [Espaçamento, raios e elevação](#5-espaçamento-raios-e-elevação)
6. [Cores fixas (não mudam com o tema)](#6-cores-fixas-não-mudam-com-o-tema)
7. [Componentes](#7-componentes)
8. [Layout da página](#8-layout-da-página)
9. [Gráficos](#9-gráficos)
10. [Temas](#10-temas)
11. [Acessibilidade](#11-acessibilidade)
12. [Faça / Não faça](#12-faça--não-faça)
13. [Regras para agentes de IA](#13-regras-para-agentes-de-ia)
14. [Usando em outros projetos](#14-usando-em-outros-projetos)
15. [Checklist de revisão](#15-checklist-de-revisão)
16. [Pendências conhecidas](#16-pendências-conhecidas)
17. [Changelog](#17-changelog)

---

## 1. Visão geral e princípios

O visual nasceu de um mock chamado **Quixotic** (dashboard financeiro em verde) e foi adaptado para a identidade verde da Stone.

1. **Verde é a identidade.** Superfícies, acentos e gráficos usam a família de verdes da marca. Nada de rosa, lilás ou cinzas azulados.
2. **Cards brancos sobre uma moldura verde-clara.** A separação entre áreas é feita por **cor**, não por sombra ou borda.
3. **Formas arredondadas.** Pills (`rounded-full`) para controles, 26 px para cards, 32 px para a moldura.
4. **Dados primeiro.** Números grandes e em negrito (`font-extrabold`), rótulos pequenos e discretos.
5. **Reconhecimento é fixo.** Medalhas, confetes e avisos têm cores próprias que **não mudam** com o tema (ver [seção 6](#6-cores-fixas-não-mudam-com-o-tema)).
6. **Tokens, nunca hex.** Toda cor temática vem de um token (`bg-q-card`, `text-q-ink`). Hex solto só nas cores fixas da seção 6.

---

## 2. Stack e instalação

| Item | Requisito |
|---|---|
| Build | Vite |
| UI | React 18 ou 19 + TypeScript |
| Estilo | **Tailwind CSS v4** com `@tailwindcss/vite` (tokens via `@theme`) |
| Ícones | `lucide-react` |
| Gráficos | `recharts` (mais `react-is`, que é peer dependency dele) |
| Celebração | `canvas-confetti` |
| Fonte | Plus Jakarta Sans, pesos 400 a 900 |

> Os tokens usam a sintaxe `@theme` do Tailwind **v4**. Em Tailwind v3 as classes `bg-q-card`, `text-q-ink` etc. **não** são geradas. Nesse caso, recrie os componentes a partir da seção 7 em vez de copiar o código.

### Passo a passo

1. Instale as dependências:
   ```bash
   npm install lucide-react recharts react-is canvas-confetti
   npm install -D tailwindcss @tailwindcss/vite
   ```
2. Carregue a fonte no `index.html`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
   ```
3. Copie `src/styles/quixotic-tokens.css` (tokens do tema padrão) e, se quiser temas alternativos, `themes.css`.
4. No `src/index.css`:
   ```css
   @import "tailwindcss";
   @import "./styles/quixotic-tokens.css";
   @import "./styles/themes.css"; /* opcional */

   @layer base {
     body {
       font-family: var(--font-q);
       background-color: var(--color-q-page);
       color: var(--color-q-ink);
     }
   }
   ```
5. (Opcional) Ative um tema alternativo: `<html data-theme="stone-escuro">`. Sem o atributo vale o tema padrão.

> O nome `quixotic-tokens.css` é herdado do mock original. Pode ser renomeado, desde que o `@import` acompanhe.

---

## 3. Tokens

### 3.1 Tema padrão: Stone Vibrante

Bloco `@theme` completo (copie e cole em `quixotic-tokens.css`):

```css
@theme {
  /* Superfícies */
  --color-q-page:  #cfe9bd;   /* fundo externo da página */
  --color-q-frame: #f4faee;   /* moldura que envolve o conteúdo */
  --color-q-card:  #ffffff;   /* cards */
  --color-q-soft:  #edf6e5;   /* superfície interna (toggle, inputs, ícones) */
  --color-q-row:   #f3f9ee;   /* hover de linha de tabela */
  --color-q-line:  #d9e8cc;   /* divisórias e grid de gráfico */

  /* Verde principal */
  --color-q-green:        #007d00;  /* primário: cartão de destaque, rail ativo, botões */
  --color-q-green-deep:   #005f00;  /* hover e texto sobre green-tint */
  --color-q-green-tint:   #e7fbc0;  /* fundo de chips e ícones */
  --color-q-green-stripe: #aee05c;  /* barras listradas */

  /* Texto e ícone sobre o verde principal */
  --color-q-on-green: #ffffff;

  /* Texto direto sobre a moldura (título da página e rodapé) */
  --color-q-on-frame:       #103024;
  --color-q-on-frame-muted: #5d7454;

  /* Texto */
  --color-q-ink:   #103024;   /* texto principal (Verde escuro da marca) */
  --color-q-muted: #5d7454;   /* texto secundário */

  /* Pilares do pódio */
  --color-q-podium-1: #a5fa00;  /* 1º lugar: Verde vibrante */
  --color-q-podium-2: #bce9a6;  /* 2º lugar: Verde claro */
  --color-q-podium-3: #e9f8dc;  /* 3º lugar */

  /* Raios */
  --radius-q-frame: 32px;
  --radius-q-card:  26px;

  /* Tipografia */
  --font-q: "Plus Jakarta Sans", "Inter", system-ui, sans-serif;
}

/* Listras diagonais das barras (gráfico e barras de desempenho) */
.q-stripes {
  background-color: var(--color-q-green-stripe);
  background-image: repeating-linear-gradient(
    135deg,
    rgb(255 255 255 / 0.45) 0 2px,
    transparent 2px 7px
  );
}
```

### 3.2 Classes Tailwind geradas

| Token | Exemplos de classe |
|---|---|
| `--color-q-*` | `bg-q-card`, `text-q-ink`, `border-q-line`, `ring-q-green`, `bg-q-green/10` |
| `--radius-q-card` | `rounded-q-card` |
| `--radius-q-frame` | `rounded-q-frame` |
| `--font-q` | `font-q` |
| (CSS manual) | `.q-stripes` |

### 3.3 Paleta de marca Stone e onde cada verde aparece

| Nome | HEX | Uso no sistema |
|---|---|---|
| Verde escuro | `#103024` | Texto principal (`q-ink`), moldura no tema Stone Noite, cartão no tema Stone Escuro |
| Verde escuro 2 | `#007D00` | Primário (`q-green`): cartão de destaque, rail ativo, 1º pedestal, barra do 1º lugar |
| Verde vibrante | `#A5FA00` | Pilar do 1º lugar (padrão); acento sobre fundo escuro no tema Stone Escuro |
| Verde claro | `#BCE9A6` | Pilar do 2º lugar (padrão); fundo da página no tema Stone Claro |
| Verde claro 1 | `#D2FF7D` | Pilar do 2º lugar nos temas Stone Escuro e Stone Noite; página no tema Stone Lima |
| Verde claro 2 | `#87FF4B` | Pilar do 1º lugar nos temas Stone Claro e Stone Lima |

### 3.4 Contraste do tema padrão (WCAG)

| Par | Razão | Resultado |
|---|---|---|
| `q-ink` sobre `q-card` | 14,3 : 1 | AAA |
| `q-ink` sobre `q-frame` | 13,4 : 1 | AAA |
| Branco sobre `q-green` (#007D00) | 5,3 : 1 | AA |
| `q-green` como texto sobre `q-card` | 5,3 : 1 | AA |
| `q-ink` sobre pilar 1 (#A5FA00) | 11,1 : 1 | AAA |
| `q-ink` sobre pilar 2 (#BCE9A6) | 10,4 : 1 | AAA |
| `q-green-deep` sobre `q-green-tint` (chips) | 7,2 : 1 | AAA |
| `q-muted` (#5D7454) sobre `q-card`, `q-soft` e `q-frame` | 4,6 a 5,2 : 1 | AA para texto normal |

---

## 4. Tipografia

Uma única família: **Plus Jakarta Sans** (fallback Inter e `system-ui`).

| Uso | Classes |
|---|---|
| Título da página (`h1`) | `text-3xl sm:text-4xl font-medium tracking-tight`; a parte secundária ("Agosto") em `font-light` e `text-q-on-frame-muted` |
| Título de card | `text-base sm:text-lg font-extrabold tracking-tight` |
| Número em destaque | `text-5xl` (cartão verde), `text-3xl` (1º lugar), `text-xl font-extrabold tracking-tight` (demais) |
| Rótulo / subtítulo | `text-xs text-q-muted` |
| Rótulo em caixa alta (cabeçalho de valor) | `text-[10px] font-semibold uppercase tracking-wide text-q-muted` |
| Chip / badge | `text-xs font-semibold` (ou `text-[11px] font-bold` em badges de valor) |
| Botão | `text-sm font-semibold` (md) e `text-xs font-semibold` (sm) |

Regras: não usar mais de dois pesos por componente; números sempre em `font-extrabold`; texto corrido nunca abaixo de `text-xs`.

---

## 5. Espaçamento, raios e elevação

**Espaçamento**

| Onde | Valor |
|---|---|
| Entre cards (grid) | `gap-4` |
| Padding de card | `p-5 sm:p-6` (variante "respiro": `p-6 sm:p-8`) |
| Padding da moldura | `p-3 sm:p-5` |
| Padding da página (fora da moldura) | `p-3 sm:p-5` |
| Largura máxima da moldura | `max-w-[1480px]` |
| Linha de tabela | `px-3 py-2.5` |

**Raios**

| Elemento | Classe |
|---|---|
| Moldura | `rounded-q-frame` (32 px) |
| Cards | `rounded-q-card` (26 px) |
| Pilar do pódio | `rounded-3xl` |
| Caixas internas (valor no pódio, inputs, avisos) | `rounded-2xl` |
| Botões, chips, toggles, rail, nav | `rounded-full` |

**Elevação:** o sistema é **plano**. Cards não têm sombra. Só têm sombra: toast e modal (`shadow-2xl`), tooltip de gráfico (`shadow-lg`) e a pílula ativa de um toggle (`shadow-[0_1px_2px_rgb(0_0_0/0.06)]`).

**Movimento:** transições de cor de 200 ms; o card do pódio sobe 4 px no hover (`hover:-translate-y-1`); spinner de carregamento com `animate-spin`. Evite animações longas.

---

## 6. Cores fixas (não mudam com o tema)

Estas cores **não são tokens** e permanecem iguais em qualquer tema. Não as recolora para "combinar" com o tema.

### Medalhas

| Posição | Anel / selo | Contador (cartão verde) | Badge "Nº lugar" |
|---|---|---|---|
| 1º (ouro) | `#d9a512` | `#E9B824` | fundo `#fbf3d4`, texto `#7a5c00` |
| 2º (prata) | `#a9a9b1` | `#D8D8DD` | fundo branco, texto `#55555b` |
| 3º (verde) | `#5ba67c` | `#a8e0bf` | fundo branco, texto `#1f6b45` |

O anel do avatar de medalha usa `border-[3px] border-white` mais `ring-2` na cor da medalha.
Na lista de ranking, o selo de posição usa: 1º `bg-[#fbf3d4] text-[#7a5c00]`, 2º `bg-[#e9e9ec] text-[#55555b]`, 3º `bg-q-green-tint text-q-green-deep`.

### Confetes (`canvas-confetti`)

| Gatilho | Cores |
|---|---|
| Clique no pilar do pódio | `#F59E0B`, `#FCD34D`, `#94A3B8`, `#D97706`, `#10B981`, `#3B82F6` |
| Fogos dourados (botão "Celebrar") | `#F59E0B`, `#FCD34D`, `#FFFFFF`, `#FBBF24` |

### Status e avisos

| Elemento | Cor |
|---|---|
| Ponto "Planilha conectada" | `bg-q-green` |
| Ponto "Dados de amostra" | `#e0a400` |
| Ponto "Sincronizando" | `bg-q-muted animate-pulse` |
| Banner de aviso (fundo / texto / ícone) | `#fdf3dc` / `#7a5200` / `#d99a00` |
| Toast de sucesso | fundo `bg-q-ink`, texto branco, ícone `#4ade80` |

---

## 7. Componentes

Todos ficam em `src/components/`. Componentes base em `src/components/stone-ds/`.

### 7.1 Base

#### `Card` (`stone-ds/Card.tsx`)
Superfície branca arredondada.

| Prop | Valores | Padrão |
|---|---|---|
| `layout` | `"principal"` (p-5/6), `"respiro"` (p-6/8), `"semMoldura"` (p-0) | `"principal"` |
| `className` | string | `""` |
| `tone` | aceita mas é **ignorada** (compatibilidade) | |

```tsx
<Card layout="respiro"><h3>Título</h3></Card>
```

#### `Button` (`stone-ds/Button.tsx`)
Sempre em formato pill.

| Prop | Valores | Padrão |
|---|---|---|
| `variant` | `primary` (verde), `secondary` / `outline` (branco com borda), `ghost` (cinza claro), `dark` (fundo escuro `q-ink`, texto branco), `onGreen` (branco, para usar **sobre** o cartão verde) | `primary` |
| `size` | `sm`, `md`, `lg` | `md` |

Estados: `hover` muda o fundo; `focus-visible` mostra outline de 2 px em `q-green`; `disabled` fica com 40 % de opacidade.

#### `AssetChip` (`stone-ds/AssetChip.tsx`)
Pílula pequena de rótulo, valor e ícone.

| Prop | Valores |
|---|---|
| `label` | texto (obrigatório) |
| `value` | texto ou número, destacado em negrito |
| `icon` | nó React opcional |
| `variant` | `success`, `warning`, `silver`, `bronze` (verde, ver seção 6), `info`, `neutral`, `onGreen` (para uso sobre fundo verde) |

#### `AvatarPhoto`
Foto circular com **fallback de iniciais** (se a imagem falha ou não existe).

| Prop | Valores |
|---|---|
| `src` | URL da foto (opcional) |
| `name` | nome, usado em `alt` e `title` |
| `fallbackInitials` | iniciais exibidas no fallback |
| `size` | `sm` (32 px), `md` (40), `lg` (56), `xl` (80), `2xl` (112) |
| `medalRing` | `gold`, `silver`, `bronze`, `none` |

#### `StatCard`
Card compacto: ícone em círculo `q-green-tint`, rótulo, valor grande e badge verde opcional.

| Prop | Tipo |
|---|---|
| `icon` | nó React |
| `label` | string |
| `value` | nó React |
| `badge` | string opcional |

### 7.2 Navegação e cabeçalho

#### `Header` (barra superior)
Pill branca com: logo (círculo `q-green` + ícone + wordmark), **switcher** de visão (pill `q-soft` com opção ativa em branco) e chip de status da planilha.

| Prop | Tipo |
|---|---|
| `viewMode` | `"OPERACOES" \| "ANGELS"` |
| `onViewModeChange` | `(mode) => void` |
| `isLoading` | boolean |
| `isUsingSampleData` | boolean |

#### `PageHead`
Título "Resultados de *Mês*" e duas ações: mês de referência **editável** (pill com calendário; clique para editar, Enter salva) e "Atualizar dados".

| Prop | Tipo |
|---|---|
| `referenceMonth` | string |
| `onReferenceMonthChange` | `(month: string) => void` |
| `onRefresh` | `() => void` |
| `isLoading` | boolean |

#### `Rail`
Barra lateral de ícones em pills brancas. **Grupo 1:** seleção de métrica (ícone ativo em `q-green`). **Grupo 2:** tela cheia e configurações. Abaixo de `lg` vira uma barra horizontal; em `lg+`, tooltip escuro ao passar o mouse.

| Prop | Tipo |
|---|---|
| `metrics` | `MetricDefinition[]` |
| `activeMetricKey` | `MetricKey` |
| `onMetricSelect` | `(key) => void` |
| `isFullscreen` | boolean |
| `onToggleFullscreen` | `() => void` |
| `onOpenSettings` | `() => void` |

### 7.3 Blocos de conteúdo

#### `MonthHighlight` ("HeroCard")
Cartão verde de destaque (`bg-q-green`, texto branco) com círculos decorativos translúcidos. Contém: badge "Destaque do Mês • Mês", avatar `2xl` com anel dourado, nome, nota-resumo, número de pódios (`text-5xl`, cor `text-q-on-green`), contadores 1º/2º/3º, chips das medalhas por categoria e o botão **Celebrar reconhecimento** (`Button variant="onGreen"`).

| Prop | Tipo |
|---|---|
| `highlight` | `MonthHighlightData \| null` (retorna `null` se vazio) |
| `referenceMonth` | string |
| `isOperations` | boolean |

#### `Podium`
Card branco com **3 pilares**. Cada pilar tem fundo próprio (`bg-q-podium-1/2/3`), avatar, nome, caixa branca com o valor e **pedestal** de alturas diferentes (1º `h-28` sólido `q-green`; 2º `h-20` e 3º `h-16` listrados com `.q-stripes`). Ordem visual no desktop: 2º, 1º, 3º; no mobile: 1º, 2º, 3º. Clique no pilar dispara confete.

| Prop | Tipo |
|---|---|
| `items` | `RankedItem[]` (usa os 3 primeiros) |
| `metric` | `MetricDefinition` |
| `isOperations` | boolean |

#### `RankingChart`
Gráfico de barras horizontais (recharts). 1º lugar em `q-green` sólido, demais com listras. Ver [seção 9](#9-gráficos).

| Prop | Tipo |
|---|---|
| `items` | `RankedItem[]` |
| `metric` | `MetricDefinition` |

#### `RankingList`
Tabela em card: colunas **#**, **Nome**, **Desempenho** (barra) e **valor**. Tem busca em pill `q-soft`, toggle "A partir do 4º / Todos" e estado vazio. Linhas com `hover:bg-q-row`. Barra de desempenho: 1º ao 3º em `bg-q-green`, demais com `.q-stripes`.

| Prop | Tipo |
|---|---|
| `items` | `RankedItem[]` |
| `metric` | `MetricDefinition` |
| `isOperations` | boolean |

#### `SheetSettingsModal`
Modal de configuração: overlay `bg-q-ink/40` com blur, painel `rounded-q-card` branco (`max-w-xl`), campo de entrada `bg-q-soft rounded-2xl`, aviso em verde-tint ou âmbar e botões em pill.

### 7.4 Modelo de dados esperado

```ts
interface RankedItem {
  id: string; nome: string; displayNome: string;
  rank: number; value: number; formattedValue: string;
  photoUrl?: string; avatarFallback: string; isTied: boolean;
  metricKey: MetricKey;
}
interface MetricDefinition {
  key: MetricKey; label: string; shortLabel: string; description: string;
  direction: "higher_is_better" | "lower_is_better";
}
```

Os componentes de visual **não** conhecem a planilha: recebem dados prontos. Mantenha a lógica de ranking e leitura de dados em `utils/` e `services/`.

---

## 8. Layout da página

```
┌ página  bg-q-page  (p-3 / sm:p-5) ─────────────────────────────────────┐
│ ┌ moldura  bg-q-frame  rounded-q-frame  max-w-[1480px] ──────────────┐ │
│ │  Header (pill branca)                                              │ │
│ │  PageHead (título + mês + atualizar)                               │ │
│ │  ┌ Rail ┐ ┌ main ──────────────────────────────────────────────┐   │ │
│ │  │      │ │ grid 12 colunas · gap-4                            │   │ │
│ │  │      │ │  MonthHighlight (8)        │ StatCards (4)         │   │ │
│ │  │      │ │  Podium (12)                                       │   │ │
│ │  │      │ │  RankingChart (5)          │ RankingList (7)       │   │ │
│ │  └──────┘ └────────────────────────────────────────────────────┘   │ │
│ │  Footer                                                            │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Breakpoints** (Tailwind padrão): `sm` 640 px, `lg` 1024 px.

| Largura | Comportamento |
|---|---|
| `< lg` | Coluna única; o Rail vira barra horizontal acima do conteúdo; StatCards em 3 colunas a partir de `sm` |
| `lg+` | Grid de 12 colunas e Rail vertical à esquerda (sticky) |
| `< md` (768 px) | Pilares do pódio empilhados (1º, 2º, 3º) e sem pedestal |
| `< sm` | Rótulos do gráfico encurtados (eixo Y de 112 px) |

Se não houver destaque do mês, os StatCards ocupam as 12 colunas (3 em linha).

---

## 9. Gráficos

Biblioteca: **recharts**. As cores vêm de variáveis CSS, assim o gráfico acompanha o tema:

```tsx
const GREEN = "var(--color-q-green)";

<BarChart layout="vertical" data={data}>
  <defs>
    <pattern id="q-bar-stripes" width="7" height="7"
             patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="7" height="7" fill="var(--color-q-green-stripe)" />
      <rect width="2" height="7" fill="#ffffff" opacity="0.45" />
    </pattern>
  </defs>
  <CartesianGrid strokeDasharray="4 4" horizontal={false} vertical stroke="var(--color-q-line)" />
  <XAxis type="number" stroke="var(--color-q-muted)" fontSize={11} tickLine={false} axisLine={false} />
  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={18}>
    {data.map((d, i) => <Cell key={i} fill={d.rank === 1 ? GREEN : "url(#q-bar-stripes)"} />)}
  </Bar>
</BarChart>
```

Regras:
- **1º lugar** em verde sólido; **demais** com listras. Não use uma cor por barra.
- Altura dinâmica: `max(280, itens × 44 + 70)` px.
- Eixo Y com largura 168 px no desktop e 112 px abaixo de `sm`; rótulos truncados em 19 e 13 caracteres, com reticências.
- Rótulo do 1º lugar em `q-green` e negrito; do 2º e 3º em negrito neutro.
- **Tooltip:** pílula `bg-q-green text-white rounded-2xl px-3.5 py-2.5` com posição, nome e valor.
- Cursor de hover: `rgba(0, 125, 0, 0.06)`.

---

## 10. Temas

O tema padrão é o **Stone Vibrante** (seção 3.1). Os demais ficam em `themes.css` e se ativam com `data-theme` no `<html>`. Cada tema só redefine tokens, então nenhum componente muda.

| `data-theme` | Nome | Caráter | Primário |
|---|---|---|---|
| *(sem atributo)* / `stone-vibrante` | **Stone Vibrante** (padrão) | Moldura clara, acentos em lima | `#007D00` |
| `stone-claro` | Stone Claro | Fundo no verde claro da marca | `#007D00` |
| `stone-escuro` | Stone Escuro | Primário `#103024` com lima `#A5FA00` de acento | `#103024` |
| `stone-noite` | Stone Noite | Moldura escura `#103024`, cards brancos | `#007D00` |
| `stone-lima` | Stone Lima | Página toda em `#D2FF7D` | `#007D00` |
| `menta` | Menta Viva | Fundo menta, pilares vivos | `#108652` |
| `folha` | Folha & Lima | Verde-limão natural | `#108652` |
| `floresta` | Floresta | Sálvia sóbria e verde profundo | `#0b7344` |

**Como criar um tema:** copie um bloco de `themes.css`, troque o nome do `data-theme` e ajuste os tokens. Um tema novo precisa definir, no mínimo: `q-page`, `q-frame`, `q-soft`, `q-row`, `q-line`, `q-green`, `q-green-deep`, `q-green-tint`, `q-green-stripe`, `q-ink`, `q-muted` e os três `q-podium-*`. Se o primário for escuro, defina também `--color-q-on-green` com um tom claro (ex.: `#A5FA00`). Se a moldura for escura, defina `--color-q-on-frame` e `--color-q-on-frame-muted` claros.

Todo tema novo deve passar na [checklist da seção 15](#15-checklist-de-revisão), principalmente no contraste do texto secundário.

---

## 11. Acessibilidade

- **Contraste:** texto normal com razão mínima de 4,5 : 1 (AA); texto grande e ícones de 3 : 1. O tema padrão atende (seção 3.4).
- **Foco visível:** botões usam `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-q-green`; inputs usam `focus:outline-2 focus:outline-q-green`. Nunca remova o outline sem substituto.
- **Semântica:** controles clicáveis são `<button>`, nunca `<div onClick>`. O switcher usa `aria-current="page"` na opção ativa; botões do Rail têm `aria-label` e `aria-pressed`.
- **Imagens:** toda foto tem `alt` (nome da pessoa ou da operação) e fallback de iniciais.
- **Cor não é o único sinal:** posição vem sempre com número (1º, 2º, 3º), não só com a cor da medalha.
- **Alvos de toque:** mínimo de 40 px (`size-10`) nos botões do Rail.
- **Movimento:** animações curtas e sem efeito essencial para entender a informação.

---

## 12. Faça / Não faça

| Faça | Não faça |
|---|---|
| Usar tokens: `bg-q-card`, `text-q-ink`, `border-q-line` | Escrever hex de tema direto no componente (`bg-[#007d00]`) |
| Separar áreas por cor (card branco sobre moldura) | Adicionar sombras ou bordas pesadas em cards |
| Usar `rounded-full` em controles e `rounded-q-card` em cards | Misturar raios aleatórios |
| Manter medalhas e confetes nas cores da seção 6 | Recolorir medalhas para combinar com o tema |
| Usar `Button`, `Card` e `AssetChip` existentes | Recriar botões e chips do zero |
| Mostrar número em `font-extrabold` | Usar números em peso normal ou fino |
| Usar o 1º lugar em verde sólido e os demais listrados | Dar uma cor diferente para cada barra |
| Usar rosa, lilás ou cinzas azulados | Usar cinzas neutros ou frios; os neutros do sistema são **esverdeados** |
| Manter a lógica de ranking fora dos componentes visuais | Ler a planilha dentro de componentes de UI |

---

## 13. Regras para agentes de IA

> Se você é uma IA construindo ou alterando telas neste projeto, siga **todas** as regras abaixo.

1. **Leia primeiro** `src/styles/quixotic-tokens.css` e este documento. Reaproveite os componentes de `src/components/` e `src/components/stone-ds/`; só crie um novo se nenhum servir.
2. **Nunca escreva cor de tema em hex.** Use as classes geradas dos tokens (`bg-q-green`, `text-q-muted`, etc.). Exceção: as cores fixas da seção 6.
3. **Não altere** as cores de medalhas, confetes, status e avisos (seção 6), a menos que o usuário peça explicitamente.
4. **Não use** rosa, lilás, roxo ou pêssego. Neutros devem ser os esverdeados dos tokens (`q-soft`, `q-row`, `q-line`, `q-muted`).
5. **Sem sombras** em cards. Separação por cor.
6. **Raios:** `rounded-q-card` para cards, `rounded-q-frame` para a moldura, `rounded-full` para controles.
7. **Tipografia:** só Plus Jakarta Sans (`font-q`); números em `font-extrabold`.
8. **Gráficos:** recharts com cores por variável CSS (seção 9); 1º lugar sólido, demais listrados.
9. **Responsivo:** mobile primeiro; coluna única abaixo de `lg`; sem rolagem horizontal da página.
10. **Acessibilidade:** `<button>` para ações, `alt` em imagens, foco visível, contraste AA.
11. **Mudança só de cor = só tokens.** Para trocar a aparência geral, edite os tokens ou crie um tema; **não** edite cada componente.
12. **Não** adicione dependências, não mexa em `package.json`, `vite.config.ts`, `utils/` ou `services/` sem pedido explícito.
13. Ao terminar, confirme: build compila, nenhum erro no console, e a tela confere com a checklist da seção 15.

---

## 14. Usando em outros projetos

### Opção A: copiar os arquivos (Vite + React + Tailwind v4)
Copie `quixotic-tokens.css`, `themes.css` (opcional) e a pasta `components/stone-ds/` (mais os componentes de conteúdo de que precisar). Siga a [seção 2](#2-stack-e-instalação).

### Opção B: Google AI Studio
- **Projeto novo a partir de repositório:** use **Import from GitHub** (menu de adicionar arquivos do modo Build) apontando para este repositório.
- **Projeto existente:** cole no chat do Build o prompt abaixo, anexando o conteúdo de `quixotic-tokens.css` e deste `DESIGN.md`.

```text
Use o design system descrito no DESIGN.md anexado em TODAS as telas deste app.
- Cole os tokens de quixotic-tokens.css em src/styles e importe-os no index.css (Tailwind v4).
- Use apenas classes de token (bg-q-card, text-q-ink, rounded-q-card...). Nada de hex de tema.
- Reaproveite Card, Button, AssetChip, AvatarPhoto e StatCard; não recrie.
- Siga as regras da seção 13 do DESIGN.md. Não altere lógica, dados nem dependências.
```

### Opção C: Lovable
Cole o `DESIGN.md` e o conteúdo de `quixotic-tokens.css` na área de **Knowledge** (conhecimento do projeto) e peça: *"Siga o DESIGN.md em todas as telas e use somente os tokens"*. Se o projeto do Lovable usar uma versão de Tailwind diferente da v4, peça que o agente **recrie** os componentes da seção 7 usando os mesmos valores, em vez de copiar o código.

### Opção D: Claude e outros assistentes
Adicione este arquivo ao contexto do projeto. A seção 13 funciona como instrução permanente.

---

## 15. Checklist de revisão

**Visual**
- [ ] Fundo da página e moldura nos verdes do tema; cards brancos
- [ ] Nenhum tom de rosa, lilás ou cinza azulado
- [ ] Cartão de destaque, rail ativo, botões e selos no verde primário
- [ ] Pódio com pilares nas cores de `q-podium-1/2/3`
- [ ] Gráfico: 1º lugar sólido, demais listrados, cores acompanham o tema
- [ ] Medalhas, confetes, status e avisos nas cores fixas da seção 6

**Código**
- [ ] Nenhum hex de tema fora dos tokens
- [ ] Componentes existentes reaproveitados
- [ ] Sem sombras novas em cards
- [ ] `npm run build` passa sem erros e o console está limpo

**Acessibilidade**
- [ ] Texto normal com contraste mínimo de 4,5 : 1 (inclusive o `q-muted`)
- [ ] Foco visível em todos os controles
- [ ] Imagens com `alt` e fallback

**Responsivo**
- [ ] Testado em 390 px (mobile) e 1440 px (desktop)
- [ ] Sem rolagem horizontal da página

---

## 16. Pendências conhecidas

- A prop `size` do `AssetChip` e a prop `tone` do `Card` são aceitas por compatibilidade, mas **ignoradas**.
- `stone-tokens.css` e `minimal-tokens.css` são resquícios de versões anteriores. `minimal-tokens.css` não é importado por nenhum arquivo e pode ser removido; o bloco `window.tailwind.config` do `index.html` também não tem efeito no Tailwind v4.
- O rótulo do eixo Y do `RankingChart` para posições a partir do 2º ainda usa um hex fixo (`#46544c`); deveria virar um token de texto secundário escuro.
- O nome `quixotic-tokens.css` e as classes `q-*` vêm do mock original. Um futuro renome para um prefixo `stone-*` exigiria trocar todas as classes.
- O logo é um ícone genérico (`Award`) com o wordmark "Resultados", ainda sem a marca oficial.

---

## 17. Changelog

| Versão | Data | Mudanças |
|---|---|---|
| 1.0.0 | 2026-10-09 | Primeira versão: tokens, 8 temas, componentes, regras fixas de medalhas/confetes, tema padrão Stone Vibrante, textos secundários ajustados para contraste AA |

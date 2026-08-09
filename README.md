# @turystack/react-icons

Stable, cross-platform icon API backed by Solar Icons.

## Installation

```bash
pnpm add @turystack/react-icons
```

### Peer dependencies

The host application provides these:

```bash
pnpm add react
```

Optional — install only the ones whose feature you use:

```bash
pnpm add react-native react-native-svg
```

## Entry points

```ts
import { /* … */ } from '@turystack/react-icons'
import { /* … */ } from '@turystack/react-icons/web'
import { /* … */ } from '@turystack/react-icons/mobile'
import { iconManifest } from '@turystack/react-icons/manifest'
```

## What is in the set

605 icons in 38 categories, taken from Solar's own grouping rather than a
taxonomy invented here. One API and one set of props across all of them; where
a name came from only tells you how stable it is.

| | | |
|---|---|---|
| **66** | semantic | Named for the job, not the drawing. `DeleteIcon` stays `DeleteIcon` if the artwork behind it changes. |
| **481** | lucide-compatible | Named after `lucide-react` so existing code ports across, drawn by Solar. |
| **29** | brands | Every provider `@turystack/nestjs-social-auth` supports, plus the marks products reach for. |

A lucide name Solar has no glyph for is left out rather than approximated with
a different picture — `Plane`, `Fingerprint`, `Puzzle` and `Barcode` have no
equivalent and are absent on purpose.

Each brand comes twice. `GoogleIcon` inherits `color` like any other icon;
`GoogleColorIcon` keeps the official palette that sign-in buttons need.

```tsx
<GoogleColorIcon size={20} />
<span>Continue with Google</span>
```

Five marks — Apple, GitHub, TikTok, Threads and X — have no colour: they are
black on light grounds and white on dark ones, which is what their guidelines
say. Their colour variant inherits `color` rather than filling with black, so
it stays visible either way.

Two of the remaining marks are legitimately hard to place, and no library can
fix that for you: Snapchat's yellow reads 1.1:1 on white, PayPal's navy 1.5:1
on a dark ground. Both are the real brand colours. Give them a surface that
contrasts — a white chip, a neutral card — or use the monochrome variant.

Importing one icon costs roughly 0.6 kB gzipped, and only what you import is
bundled — the size of the set is not the size of your build.

To build a picker, read the manifest. It is a separate entry point, so nothing
that merely renders an icon pays for a list of all of them.

```ts
import { iconCategories, iconManifest } from '@turystack/react-icons/manifest'

iconManifest.filter((icon) => icon.category === 'weather')
// [{ name: 'CloudIcon', source: 'lucide', category: 'weather' }, …]
```

## Regenerating

Everything under `src/{web,mobile}/{lucide,brands}`, plus `src/manifest.ts`, is
generated. The hand-written semantic icons sit at the root of those folders and
are never touched.

```bash
pnpm generate
```

The mapping lives in `scripts/`: `map.mjs` pairs names automatically where the
words agree, `curated.mjs` carries the judgements words cannot make, and
`brands.mjs` lists the marks. Both sides of every pair are checked against the
real catalogues, so a name that does not exist fails the run instead of
shipping a component that imports nothing.

## Documentation

Options, API reference and examples:

**https://tury.dev/libs/react-icons**

## Development

```bash
pnpm install
pnpm typecheck
pnpm check
pnpm build
```

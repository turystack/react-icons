/**
 * Regenerates the lucide-compatible and brand icon sets.
 *
 * Run with `pnpm generate`. Everything under `src/{web,mobile}/lucide` and
 * `src/{web,mobile}/brands` is owned by this script and rewritten from scratch;
 * the semantic icons at the root of those folders are hand-written and never
 * touched.
 *
 * The mapping has two halves. `map.mjs` matches lucide names to Solar names
 * automatically where the words agree, and `curated.mjs` carries the judgements
 * words cannot make. Both are validated against the real catalogues here: a
 * name that does not exist on either side aborts the run rather than emitting a
 * component that imports nothing.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as lucide from 'lucide-react'
import * as si from 'simple-icons'
import * as solar from '@solar-icons/react-perf/Outline'

import { BRAND_COLOUR_VARIANTS, BRANDS } from './brands.mjs'
import { CURATED } from './curated.mjs'
import { automatch } from './map.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PLATFORMS = [
	'web',
	'mobile',
]

const fail = (message) => {
	console.error(`\n  ✗ ${message}\n`)
	process.exit(1)
}

// ── catalogues ─────────────────────────────────────────────────────────────

const solarNames = new Set(Object.keys(solar))

/**
 * Which Solar category each glyph belongs to, read from Solar's own category
 * modules rather than guessed from the name. Every glyph appears in exactly
 * one, so a picker can group the whole set without any judgement from us.
 */
const solarCategory = new Map()
const CATEGORY_DIR = path.join(
	ROOT,
	'node_modules/@solar-icons/react-perf/dist/icons',
)

for (const entry of fs.readdirSync(CATEGORY_DIR, {
	withFileTypes: true,
})) {
	if (!entry.isDirectory() || entry.name === 'style') {
		continue
	}
	const module = await import(`@solar-icons/react-perf/category/${entry.name}`)
	for (const glyph of Object.keys(module.Outline)) {
		solarCategory.set(glyph, entry.name)
	}
}

/**
 * lucide exports every icon twice — `House` and `HouseIcon` — plus deprecated
 * aliases kept for compatibility. The pair is what makes a name canonical.
 */
const lucideNames = Object.keys(lucide)
	.filter(
		(name) =>
			name.endsWith('Icon') &&
			name !== 'Icon' &&
			Object.hasOwn(lucide, name.slice(0, -4)),
	)
	.map((name) => name.slice(0, -4))
	.sort()

/**
 * Semantic icons this package hand-wrote, mapped to the Solar glyph each one
 * draws. The generator must not shadow these names, and the glyph is what
 * places them in a category alongside everything else.
 */
const handWrittenGlyph = new Map(
	fs
		.readdirSync(path.join(ROOT, 'src/web'))
		.filter(
			(file) =>
				file.endsWith('-icon.tsx') &&
				file !== 'create-icon.tsx' &&
				file !== 'create-brand.tsx',
		)
		.map((file) => {
			const source = fs.readFileSync(path.join(ROOT, 'src/web', file), 'utf8')
			const glyph = source.match(/import \{ (\w+) \} from '@solar-icons/)?.[1]
			const name = file
				.replace(/-icon\.tsx$/, '')
				.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())
				.concat('Icon')

			return [
				name,
				glyph,
			]
		}),
)

const handWritten = new Set(handWrittenGlyph.keys())

// ── mapping ────────────────────────────────────────────────────────────────

const lucideSet = new Set(lucideNames)
const mapping = new Map()

for (const [name, target] of Object.entries(CURATED)) {
	if (!lucideSet.has(name)) {
		fail(`curated.mjs maps "${name}", which lucide-react does not export`)
	}
	if (target.startsWith('@')) {
		if (!handWritten.has(target.slice(1))) {
			fail(`curated.mjs aliases "${name}" to unknown local icon "${target}"`)
		}
	} else if (!solarNames.has(target)) {
		fail(`curated.mjs maps "${name}" to "${target}", absent from Solar Outline`)
	}
	mapping.set(name, target)
}

let auto = 0
for (const [name, target] of automatch(lucideNames, [...solarNames])) {
	if (mapping.has(name)) {
		continue
	}
	mapping.set(name, target)
	auto += 1
}

/** A generated file would overwrite a hand-written one of the same name. */
const generated = [
	...mapping,
].filter(([name]) => !handWritten.has(`${name}Icon`))

// ── brand artwork ──────────────────────────────────────────────────────────

/**
 * Every brand as paths, resolved once so both platforms emit the same artwork.
 *
 * Each yields two components. `<Name>Icon` drops the fill and inherits `color`,
 * so a mark sits in a toolbar like any other icon; `<Name>ColorIcon` keeps the
 * official palette, which is what a "Continue with…" button needs. For most
 * brands that palette is the single hex Simple Icons publishes; for the two in
 * BRAND_COLOUR_VARIANTS it is multi-path artwork no single hex can express.
 */
const brandArtwork = [
	...Object.entries(BRANDS)
		// Hand-drawn artwork replaces the silhouette outright rather than
		// sitting beside it under the same name.
		.filter(([, name]) => !BRAND_COLOUR_VARIANTS[name])
		.map(([slug, name]) => {
			const icon = si[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`]
			if (!icon) {
				fail(`brands.mjs lists "${slug}", absent from simple-icons`)
			}

			return {
				hex: `#${icon.hex}`,
				name,
				paths: [
					{
						d: icon.path,
						fill: `#${icon.hex}`,
					},
				],
				slug,
				title: icon.title,
			}
		}),
	...Object.entries(BRAND_COLOUR_VARIANTS).map(([name, paths]) => ({
		hex: 'multi-colour',
		name,
		paths,
		slug: name.toLowerCase(),
		title: name,
	})),
]

const brandNames = new Set(brandArtwork.map((brand) => brand.name))
if (brandNames.size !== brandArtwork.length) {
	fail('two brands resolve to the same component name')
}

// ── emit ───────────────────────────────────────────────────────────────────

const kebab = (name) =>
	name
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
		.toLowerCase()

const testId = (name) => `icon-${kebab(name)}`

const BANNER = '// Generated by scripts/generate.mjs — do not edit by hand.\n'

const resetDir = (dir) => {
	fs.rmSync(dir, {
		force: true,
		recursive: true,
	})
	fs.mkdirSync(dir, {
		recursive: true,
	})
}

const solarPackage = {
	mobile: '@solar-icons/react-native/Outline',
	web: '@solar-icons/react-perf/Outline',
}

for (const platform of PLATFORMS) {
	const lucideDir = path.join(ROOT, 'src', platform, 'lucide')
	const brandsDir = path.join(ROOT, 'src', platform, 'brands')
	resetDir(lucideDir)
	resetDir(brandsDir)

	for (const [name, target] of generated) {
		const file = path.join(lucideDir, `${kebab(name)}-icon.tsx`)

		// Solar ships an icon called `Infinity`, and importing it under that
		// name shadows the global. Ask the runtime which names are taken
		// instead of keeping a list that goes stale.
		const local = Object.hasOwn(globalThis, target) ? `Solar${target}` : target
		const imported = local === target ? target : `${target} as ${local}`

		const source = target.startsWith('@')
			? `${BANNER}\nexport { ${target.slice(1)} as ${name}Icon } from '../${kebab(
					target.slice(1, -4),
				)}-icon.js'\n`
			: `${BANNER}import { ${imported} } from '${solarPackage[platform]}'\n\nimport { createIcon } from '../create-icon.js'\n\nexport const ${name}Icon = createIcon('${testId(
					name,
				)}', ${local})\n`

		fs.writeFileSync(file, source)
	}

	for (const { hex, name, paths, slug, title } of brandArtwork) {
		const list = (withFill) =>
			paths
				.map(
					(p) =>
						`\t{\n\t\td: '${p.d}',${
							withFill ? `\n\t\tfill: '${p.fill}',` : ''
						}\n\t},\n`,
				)
				.join('')

		fs.writeFileSync(
			path.join(brandsDir, `${slug}-icon.tsx`),
			`${BANNER}import { createBrand } from '../create-brand.js'\n\n/** ${title}, monochrome — inherits \`color\` like every other icon. */\nexport const ${name}Icon = createBrand('icon-${slug}', [\n${list(
				false,
			)}])\n\n/** ${title} in its official ${hex} palette, for sign-in buttons. */\nexport const ${name}ColorIcon = createBrand('icon-${slug}-color', [\n${list(
				true,
			)}])\n`,
		)
	}
}

// ── index ──────────────────────────────────────────────────────────────────

const brandExports = brandArtwork.map(({ name, slug }) => [
	`brands/${slug}-icon.js`,
	[
		`${name}ColorIcon`,
		`${name}Icon`,
	],
])

for (const platform of PLATFORMS) {
	const lines = [
		...generated.map(
			([name]) =>
				`export { ${name}Icon } from './lucide/${kebab(name)}-icon.js'`,
		),
		...brandExports.map(
			([file, names]) => `export { ${names.join(', ')} } from './${file}'`,
		),
	].sort()

	const indexPath = path.join(ROOT, 'src', platform, 'index.ts')
	const existing = fs.readFileSync(indexPath, 'utf8')
	const MARK = '\n// ─── generated ───\n'
	const head = existing.split(MARK)[0].trimEnd()

	fs.writeFileSync(indexPath, `${head}\n${MARK}\n${lines.join('\n')}\n`)
}

// ── manifest ───────────────────────────────────────────────────────────────

// Data only, and its own entry point: an app building an icon picker needs to
// know what exists and how to group it, but nothing that merely renders an
// icon should pay for a list of every other one.

/**
 * Categories come from Solar's own grouping, so a picker's sections match how
 * the artwork was actually drawn instead of a taxonomy invented here. Brands
 * are the one group Solar has no opinion about.
 */
const categoryOf = (glyph) => {
	const category = solarCategory.get(glyph)
	if (!category) {
		fail(`no Solar category for glyph "${glyph}"`)
	}
	return category
}

const manifest = [
	...[
		...handWrittenGlyph,
	].map(([name, glyph]) => [
		name,
		'semantic',
		// The four glyph icons (check, close, minus, plus) are drawn inline
		// rather than taken from Solar, so they have no category of their own.
		glyph ? categoryOf(glyph) : 'ui',
	]),
	...generated.map(([name, target]) => [
		`${name}Icon`,
		'lucide',
		categoryOf(
			target.startsWith('@')
				? (handWrittenGlyph.get(target.slice(1)) ?? 'Widget')
				: target,
		),
	]),
	...brandExports.flatMap(([, names]) =>
		names.map((name) => [
			name,
			'brand',
			'brands',
		]),
	),
].sort(([a], [b]) => a.localeCompare(b))

const categories = [
	...new Set(manifest.map(([, , category]) => category)),
].sort()

fs.writeFileSync(
	path.join(ROOT, 'src/manifest.ts'),
	`${BANNER}
/** Where an icon's drawing comes from. */
export type IconSource =
	/** Hand-written name this package defines, independent of any other set. */
	| 'semantic'
	/** Named after \`lucide-react\`, drawn by Solar. */
	| 'lucide'
	/** Brand mark. Trademarks belong to their owners — see LICENSE-THIRD-PARTY. */
	| 'brand'

/**
 * What the icon depicts, taken from Solar's own grouping rather than a
 * taxonomy invented here — \`brands\` is the one group Solar has no say in.
 */
export type IconCategory =
${categories.map((category) => `\t| '${category}'`).join('\n')}

export type IconManifestEntry = {
	name: string
	source: IconSource
	category: IconCategory
}

/** Every category present in \`iconManifest\`, in the order a picker should list them. */
export const iconCategories: IconCategory[] = [
${categories.map((category) => `\t'${category}',`).join('\n')}
]

/**
 * Every icon this package exports, for building pickers and catalogues.
 *
 * Import it from \`@turystack/react-icons/manifest\`; it is a separate entry
 * point so rendering a single icon never pulls in a list of all of them.
 */
export const iconManifest: IconManifestEntry[] = [
${manifest
	.map(
		([name, source, category]) =>
			`\t{\n\t\tcategory: '${category}',\n\t\tname: '${name}',\n\t\tsource: '${source}',\n\t},`,
	)
	.join('\n')}
]
`,
)

// ── format ─────────────────────────────────────────────────────────────────

// Let the formatter own whitespace instead of the string templates above.
// Emitting text that merely looks right is how generated files start failing
// `pnpm check` on a config change nobody thought to mirror here.
execFileSync(
	process.execPath,
	[
		path.join(ROOT, 'node_modules/@biomejs/biome/bin/biome'),
		'check',
		'--write',
		'src',
	],
	{
		cwd: ROOT,
		stdio: 'inherit',
	},
)

// ── report ─────────────────────────────────────────────────────────────────

const aliases = generated.filter(([, t]) => t.startsWith('@')).length
const covered = new Set(
	[
		...generated.map(([name]) => name),
		...[
			...handWritten,
		]
			.map((n) => n.slice(0, -4))
			.filter((n) => lucideSet.has(n)),
	],
)

console.log(`lucide-react names          ${lucideNames.length}`)
console.log(
	`  covered                   ${covered.size}  (${Math.round(
		(covered.size / lucideNames.length) * 100,
	)}%)`,
)
console.log(`    from curated.mjs        ${mapping.size - auto}`)
console.log(`    from automatch          ${auto}`)
console.log(`    aliasing a semantic icon ${aliases}`)
console.log(`brand marks                 ${brandExports.length}`)
console.log(`hand-written semantic icons ${handWritten.size}`)

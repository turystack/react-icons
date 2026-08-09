/**
 * Automatic half of the lucide → Solar mapping: the pairs the words themselves
 * agree on, so `curated.mjs` only has to carry the ones they don't.
 *
 * The rule that matters is what disqualifies a match. Every meaningful word in
 * the lucide name must survive in the Solar name, and the only words Solar may
 * add are frames and style variants. Relaxing that produced `Check` →
 * `AirbudsCheck` and `Cross` → `BagCross`: names that score well and hand back
 * a completely different picture.
 */

/** Style variants Solar appends to distinguish drawings of the same thing. */
const NOISE = new Set([
	'2',
	'3',
	'4',
	'5',
	'alt',
	'broken',
	'line',
	'linear',
	'minimalistic',
	'minimlistic',
	'outline',
	'round',
	'rounded',
])

/**
 * Words that frame a subject without replacing it. `InfoCircle` is still info.
 * Anything outside this set and NOISE is a noun, and a noun changes the icon.
 */
const CONTAINER = new Set([
	'circle',
	'square',
])

/**
 * Same concept, different house style — including Solar's own misspellings
 * (`magnifer`, `clound`, `minimlistic`), which ship in the real export names
 * and would otherwise silently miss.
 */
const SYNONYM = {
	altarrow: 'chevron',
	bin: 'trash',
	clound: 'cloud',
	cross: 'close',
	dots: 'ellipsis',
	envelope: 'letter',
	favourite: 'bookmark',
	global: 'globe',
	hamburgermenu: 'menu',
	house: 'home',
	magnifer: 'search',
	magnifier: 'search',
	mail: 'letter',
	pencil: 'pen',
	photo: 'image',
	picture: 'image',
	videocamera: 'video',
	x: 'close',
}

const split = (name) =>
	name
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/([A-Za-z])([0-9])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter(Boolean)

const raw = (name) => split(name).join('')
const canon = (name) => split(name).map((t) => SYNONYM[t] ?? t)

export function automatch(lucideNames, solarNames) {
	const index = solarNames.map((name) => ({
		name,
		raw: raw(name),
		tokens: canon(name),
	}))

	const pairs = []

	for (const wanted of lucideNames) {
		const wantRaw = raw(wanted)
		const want = new Set(canon(wanted))

		let best

		for (const candidate of index) {
			const have = new Set(candidate.tokens)

			let covered = true
			for (const token of want) {
				if (!have.has(token) && !NOISE.has(token)) {
					covered = false
					break
				}
			}
			if (!covered) {
				continue
			}

			const extra = [
				...have,
			].filter((token) => !want.has(token))
			if (extra.some((t) => !NOISE.has(t) && !CONTAINER.has(t))) {
				continue
			}

			// A literal name match outranks one reached through a synonym.
			// Without this, Solar's `Document` (synonym of file) beat its own
			// `File` to the lucide name `File`, purely on alphabetical order.
			const cost =
				(candidate.raw === wantRaw ? 0 : 1000) +
				extra.reduce((sum, t) => sum + (NOISE.has(t) ? 1 : 2), 0)

			if (!best || cost < best.cost) {
				best = {
					cost,
					name: candidate.name,
				}
			}
		}

		if (best) {
			pairs.push([
				wanted,
				best.name,
			])
		}
	}

	return pairs
}

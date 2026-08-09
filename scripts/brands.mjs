/**
 * Brand marks, which neither Solar nor lucide ships.
 *
 * lucide removed brand icons on purpose and points at Simple Icons; Solar never
 * had them. But a sign-in screen needs the provider's own mark — a generic
 * padlock next to "Continue with Google" is not a Google button — so the four
 * providers `@turystack/nestjs-social-auth` supports are non-negotiable here,
 * and the rest are the marks products actually reach for.
 *
 * Paths come from `simple-icons` (CC0-1.0) and are baked into the generated
 * source, so nothing is pulled in at runtime. The marks themselves stay the
 * trademarks of their owners — see LICENSE-THIRD-PARTY.
 *
 * Keys are the Simple Icons slug; values are the exported component name minus
 * the `Icon` suffix.
 */
export const BRANDS = {
	// Providers `nestjs-social-auth` implements — these must exist.
	// Microsoft is absent here: Simple Icons pulled it, so it is drawn from
	// the geometry in BRAND_COLOUR_VARIANTS instead.
	apple: 'Apple',
	facebook: 'Facebook',
	google: 'Google',

	// Messaging
	discord: 'Discord',
	messenger: 'Messenger',
	signal: 'Signal',
	telegram: 'Telegram',
	wechat: 'WeChat',
	whatsapp: 'WhatsApp',

	// Social
	bluesky: 'Bluesky',
	instagram: 'Instagram',
	mastodon: 'Mastodon',
	pinterest: 'Pinterest',
	reddit: 'Reddit',
	snapchat: 'Snapchat',
	threads: 'Threads',
	tiktok: 'TikTok',
	x: 'XSocial',
	youtube: 'YouTube',

	// Developer
	bitbucket: 'Bitbucket',
	github: 'GitHub',
	gitlab: 'GitLab',

	// Media
	spotify: 'Spotify',
	twitch: 'Twitch',

	// Payments
	mercadopago: 'MercadoPago',
	paypal: 'PayPal',
	pix: 'Pix',
	stripe: 'Stripe',
}

/**
 * Marks whose colour form needs more than one path, hand-authored because
 * Simple Icons ships a single silhouette and a single hex.
 *
 * Every brand gets a `<Name>ColorIcon`; for most of them that is the silhouette
 * filled with the brand's own hex, which is what their guidelines ask for. The
 * two below cannot be expressed that way — Google's mark is four colours and
 * Microsoft's is four squares — so a flattened one-colour version would be the
 * most common way a "Continue with…" button ends up off-brand.
 *
 * Microsoft is here for a second reason: Simple Icons withdrew it. It survives
 * only because the mark is four plain squares, which is geometry anyone can
 * measure, not a logo redrawn from memory. `LinkedIn` and `Slack` were
 * withdrawn too and are NOT included — both are distinctive artwork, and
 * approximating them would mean inventing a trademark.
 */
export const BRAND_COLOUR_VARIANTS = {
	Google: [
		{
			d: 'M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87Z',
			fill: '#4285F4',
		},
		{
			d: 'M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96h-4v3.11A12 12 0 0 0 12 24Z',
			fill: '#34A853',
		},
		{
			d: 'M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1h-4a12 12 0 0 0 0 10.75l4-3.11Z',
			fill: '#FBBC05',
		},
		{
			d: 'M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.18 15.24 0 12 0A12 12 0 0 0 1.28 6.63l4 3.1c.94-2.85 3.59-4.98 6.72-4.98Z',
			fill: '#EA4335',
		},
	],
	Microsoft: [
		{
			d: 'M1 1h10.2v10.2H1V1Z',
			fill: '#F25022',
		},
		{
			d: 'M12.8 1H23v10.2H12.8V1Z',
			fill: '#7FBA00',
		},
		{
			d: 'M1 12.8h10.2V23H1V12.8Z',
			fill: '#00A4EF',
		},
		{
			d: 'M12.8 12.8H23V23H12.8V12.8Z',
			fill: '#FFB900',
		},
	],
}

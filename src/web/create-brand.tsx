import type { IconProps } from './create-icon.js'
import type { IconComponent } from './types.js'

/**
 * One filled path of a brand mark.
 *
 * `fill` is set only on marks whose official form is multi-colour. Leaving it
 * off is what lets the mark inherit `color` like every other icon here.
 */
export type BrandPath = {
  d: string
  fill?: string
}

/**
 * Brand marks are filled artwork, not stroked glyphs, so they cannot go through
 * `createGlyph`: a trademark redrawn as an outline is no longer the trademark.
 *
 * A path that names its own `fill` keeps it whatever `color` says — that is the
 * point of the coloured variants, which brand guidelines require on sign-in
 * buttons. Paths without one follow `color`, so a monochrome mark sits in a
 * button the same way the rest of the set does.
 */
export function createBrand(
  testId: string,
  paths: BrandPath[],
): IconComponent<IconProps> {
  return function Brand({
    accessibilityLabel,
    color = 'currentColor',
    mirrored,
    size = 24,
    ...props
  }: IconProps) {
    return (
      <svg
        {...props}
        aria-hidden={accessibilityLabel ? undefined : true}
        aria-label={accessibilityLabel}
        data-testid={testId}
        height={size}
        role={accessibilityLabel ? 'img' : undefined}
        style={{
          transform: mirrored ? 'scaleX(-1)' : undefined,
          ...props.style,
        }}
        viewBox="0 0 24 24"
        width={size}
      >
        {paths.map((path) => (
          <path d={path.d} fill={path.fill ?? color} key={path.d} />
        ))}
      </svg>
    )
  }
}

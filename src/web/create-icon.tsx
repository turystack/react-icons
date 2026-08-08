import type { ComponentType, SVGProps } from 'react'

import type { CommonIconProps, IconComponent, IconSize } from './types.js'

export type IconProps = CommonIconProps &
  Omit<
    SVGProps<SVGSVGElement>,
    'color' | 'data-testid' | 'height' | 'ref' | 'width'
  >

type SolarIconProps = SVGProps<SVGSVGElement> & {
  alt?: string
  color?: string
  mirrored?: boolean
  size?: IconSize | string
}

export function createIcon(
  testId: string,
  Component: ComponentType<SolarIconProps>,
): IconComponent<IconProps> {
  return function ReactIcon({ accessibilityLabel, ...props }: IconProps) {
    return (
      <Component
        {...props}
        alt={accessibilityLabel}
        aria-hidden={accessibilityLabel ? undefined : true}
        data-testid={testId}
      />
    )
  }
}

export function createGlyph(
  testId: string,
  path: string,
): IconComponent<IconProps> {
  return function Glyph({
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
        fill="none"
        height={size}
        role={accessibilityLabel ? 'img' : undefined}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        style={{
          transform: mirrored ? 'scaleX(-1)' : undefined,
          ...props.style,
        }}
        viewBox="0 0 24 24"
        width={size}
      >
        <path d={path} />
      </svg>
    )
  }
}

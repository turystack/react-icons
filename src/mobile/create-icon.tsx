import type { ComponentType } from 'react'
import Svg, { Path, type SvgProps } from 'react-native-svg'

import type { CommonIconProps, IconComponent, IconSize } from './types.js'

export type IconProps = CommonIconProps &
  Omit<SvgProps, 'color' | 'height' | 'ref' | 'testID' | 'width'>

type SolarIconProps = SvgProps & {
  alt?: string
  color?: string
  mirrored?: boolean
  size?: IconSize
}

export function createIcon(
  testId: string,
  Component: ComponentType<SolarIconProps>,
): IconComponent<IconProps> {
  return function ReactIcon({ accessibilityLabel, ...props }: IconProps) {
    return (
      <Component
        {...props}
        accessibilityLabel={accessibilityLabel}
        accessible={Boolean(accessibilityLabel)}
        alt={accessibilityLabel}
        testID={testId}
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
      <Svg
        {...props}
        accessibilityLabel={accessibilityLabel}
        accessible={Boolean(accessibilityLabel)}
        height={size}
        style={[
          mirrored ? { transform: [{ scaleX: -1 }] } : undefined,
          props.style,
        ]}
        testID={testId}
        viewBox="0 0 24 24"
        width={size}
      >
        <Path
          d={path}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
        />
      </Svg>
    )
  }
}

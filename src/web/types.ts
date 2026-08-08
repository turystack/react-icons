import type { ComponentType } from 'react'

export type IconSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | number

export type CommonIconProps = {
  accessibilityLabel?: string
  color?: string
  mirrored?: boolean
  size?: IconSize
}

export type IconComponent<Props extends CommonIconProps = CommonIconProps> =
  ComponentType<Props>

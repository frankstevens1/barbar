// @workspace/mobile-ui/components/button.tsx
import React, { useMemo } from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
  PressableStateCallbackType,
  useColorScheme,      // ← from react-native
} from 'react-native'
import { lightTokens, darkTokens } from '../lib/tokens'

// Map tokens per theme
const Colors = { light: lightTokens, dark: darkTokens }

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Pressable>, 'style'> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
}

export const Button = React.forwardRef<View, ButtonProps>(
  ({ variant = 'default', size = 'default', style, children, ...props }, ref) => {
    // ← built-in hook, no provider needed
    const scheme = useColorScheme() === 'dark' ? 'dark' : 'light'
    const tokens = Colors[scheme]
    const styles = useMemo(() => createStyles(tokens), [tokens])

    const getButtonStyle = (state: PressableStateCallbackType): StyleProp<ViewStyle> => {
      const baseStyles: StyleProp<ViewStyle>[] = [
        styles.baseButton,
        styles.variants[variant].container,
        styles.sizes[size].container,
        props.disabled && styles.disabled,
      ]
      if (typeof style === 'function') baseStyles.push(style(state))
      else if (style) baseStyles.push(style)
      return baseStyles
    }

    const getTextStyle = (): StyleProp<TextStyle> => [
      styles.sizes[size].text,
      styles.variants[variant].text,
    ]

    return (
      <Pressable ref={ref} style={getButtonStyle} accessibilityRole="button" {...props}>
        <Text style={getTextStyle()}>{children}</Text>
      </Pressable>
    )
  }
)
Button.displayName = 'Button'

const createStyles = (tokens: typeof lightTokens | typeof darkTokens) => {
  const base = StyleSheet.create({
    baseButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: parseFloat(tokens.radius) * 16,
      overflow: 'hidden',
    } as ViewStyle,
    disabled: { opacity: 0.5 } as ViewStyle,
  })

  const variants: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: { backgroundColor: tokens.primary },
      text: { color: tokens.primaryForeground },
    },
    destructive: {
      container: { backgroundColor: tokens.destructive },
      text: { color: tokens.destructiveForeground },
    },
    outline: {
      container: {
        backgroundColor: tokens.background,
        borderWidth: 1,
        borderColor: tokens.border,
      },
      text: { color: tokens.accentForeground },
    },
    secondary: {
      container: { backgroundColor: tokens.secondary },
      text: { color: tokens.secondaryForeground },
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: { color: tokens.accentForeground },
    },
    link: {
      container: { backgroundColor: 'transparent' },
      text: { color: tokens.primary, textDecorationLine: 'underline' },
    },
  }

  const sizes: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: { height: 40, paddingHorizontal: 16, paddingVertical: 8 },
      text: { fontSize: 14, fontWeight: '500' },
    },
    sm: {
      container: { height: 36, paddingHorizontal: 12, paddingVertical: 6 },
      text: { fontSize: 14, fontWeight: '500' },
    },
    lg: {
      container: { height: 44, paddingHorizontal: 32, paddingVertical: 10 },
      text: { fontSize: 18, fontWeight: '500' },
    },
    icon: {
      container: { height: 40, width: 40, padding: 0 },
      text: { fontSize: 0 },
    },
  }

  return {
    baseButton: base.baseButton,
    disabled: base.disabled,
    variants,
    sizes,
  }
}
export default Button
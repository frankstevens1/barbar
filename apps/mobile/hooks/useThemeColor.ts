import { useColorScheme } from '@/hooks/useColorScheme'
// point at your mobile-ui tokens
import {
  lightTokens,
  darkTokens,
} from '@workspace/mobile-ui/lib/tokens'

export type ThemeTokenKey = keyof typeof lightTokens

/**
 * Returns a color for the current color scheme,
 * allowing an override via props.light / props.dark.
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeTokenKey
) {
  const scheme = useColorScheme() ?? 'light'
  const tokens = scheme === 'dark' ? darkTokens : lightTokens
  return props[scheme] ?? tokens[colorName]
}

import { useColorScheme } from '@/hooks/useColorScheme';
// point at your shared tokens package
import {
  lightTokens,
  darkTokens,
  type ThemeTokens,
} from '@workspace/mobile-ui/lib/tokens';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ThemeTokens
) {
  const scheme = useColorScheme() ?? 'light';
  const tokens = scheme === 'dark' ? darkTokens : lightTokens;

  // allow prop override
  const colorFromProps = props[scheme];
  return colorFromProps ?? tokens[colorName];
}

import React, { useMemo } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  PressableStateCallbackType,
  useColorScheme
} from 'react-native';
import { lightTokens, darkTokens } from '../lib/tokens';

// Map tokens per theme
const Colors = { light: lightTokens, dark: darkTokens };

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<View, ButtonProps>(
  (
    { variant = 'default', size = 'default', style, children, asChild = false, ...props },
    ref
  ) => {
    const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
    const tokens = Colors[scheme];
    const styles = useMemo(() => createStyles(tokens), [tokens]);

    const getButtonStyle = (
      state: PressableStateCallbackType
    ): StyleProp<ViewStyle> => {
      const baseStyles: StyleProp<ViewStyle>[] = [
        styles.baseButton,
        styles.variants[variant].container,
        styles.sizes[size].container,
        props.disabled && styles.disabled
      ];
      if (typeof style === 'function') {
        baseStyles.push(style(state));
      } else if (style) {
        baseStyles.push(style as StyleProp<ViewStyle>);
      }
      return baseStyles;
    };

    const getTextStyle = (): StyleProp<TextStyle> => [
      styles.sizes[size].text,
      styles.variants[variant].text
    ];

    return (
      <Pressable
        ref={ref}
        style={getButtonStyle}
        accessibilityRole="button"
        {...props}
      >
        <Text style={getTextStyle()}>{children}</Text>
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

const createStyles = (tokens: typeof lightTokens) => {
  // Base styles
  const base = StyleSheet.create({
    baseButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: parseFloat(tokens.radius) * 16,
      overflow: 'hidden'
    } as ViewStyle,
    disabled: {
      opacity: 0.5
    } as ViewStyle
  });

  // Variant containers & text
  const variants: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: { backgroundColor: tokens.primary } as ViewStyle,
      text: { color: tokens.primaryForeground } as TextStyle
    },
    destructive: {
      container: { backgroundColor: tokens.destructive } as ViewStyle,
      text: { color: tokens.destructiveForeground } as TextStyle
    },
    outline: {
      container: {
        backgroundColor: tokens.background,
        borderWidth: 1,
        borderColor: tokens.border
      } as ViewStyle,
      text: { color: tokens.accentForeground } as TextStyle
    },
    secondary: {
      container: { backgroundColor: tokens.secondary } as ViewStyle,
      text: { color: tokens.secondaryForeground } as TextStyle
    },
    ghost: {
      container: { backgroundColor: 'transparent' } as ViewStyle,
      text: { color: tokens.accentForeground } as TextStyle
    },
    link: {
      container: { backgroundColor: 'transparent' } as ViewStyle,
      text: {
        color: tokens.primary,
        textDecorationLine: 'underline'
      } as TextStyle
    }
  };

  // Size containers & text
  const sizes: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: {
        height: 40,
        paddingHorizontal: 16,
        paddingVertical: 8
      } as ViewStyle,
      text: {
        fontSize: 14,
        fontWeight: '500'
      } as TextStyle
    },
    sm: {
      container: {
        height: 36,
        paddingHorizontal: 12,
        paddingVertical: 6
      } as ViewStyle,
      text: {
        fontSize: 14,
        fontWeight: '500'
      } as TextStyle
    },
    lg: {
      container: {
        height: 44,
        paddingHorizontal: 32,
        paddingVertical: 10
      } as ViewStyle,
      text: {
        fontSize: 18,
        fontWeight: '500'
      } as TextStyle
    },
    icon: {
      container: {
        height: 40,
        width: 40,
        padding: 0
      } as ViewStyle,
      text: {
        fontSize: 0
      } as TextStyle
    }
  };

  return {
    baseButton: base.baseButton,
    disabled: base.disabled,
    variants,
    sizes
  };
};

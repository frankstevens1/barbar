import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Text,
} from 'react-native';
import { lightTokens, darkTokens } from '../lib/tokens';

const Colors = { light: lightTokens, dark: darkTokens };

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof View> {
  children?: React.ReactNode;
}

export const Avatar = React.forwardRef<View, AvatarProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <View ref={ref} style={[styles.avatar, style]} {...props}>
        {children}
      </View>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof Image> {}

export const AvatarImage = React.forwardRef<Image, AvatarImageProps>(
  ({ style, ...props }, ref) => {
    return <Image ref={ref} style={[styles.image, style]} {...props} />;
  }
);

AvatarImage.displayName = 'AvatarImage';

export interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof View> {
  children?: React.ReactNode;
}

export const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <View ref={ref} style={[styles.fallback, style]} {...props}>
        {children}
      </View>
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';

const styles = StyleSheet.create({
  avatar: {
    position: 'relative',
    flexDirection: 'row',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 9999, // circular
    height: 32, // size-8 in tailwind
    width: 32, // size-8 in tailwind
  } as ViewStyle,
  image: {
    aspectRatio: 1,
    width: '100%',
    height: '100%',
  } as ImageStyle,
  fallback: {
    backgroundColor: Colors.light.muted, // Adjust based on light/dark theme
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999, // circular
    height: '100%',
    width: '100%',
  } as ViewStyle,
});

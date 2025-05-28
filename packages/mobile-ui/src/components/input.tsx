import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { lightTokens, darkTokens } from '../lib/tokens';

const Colors = { light: lightTokens, dark: darkTokens };

export interface InputProps extends TextInputProps {
  type?: string;
}

export const Input: React.FC<InputProps> = ({
  style,
  type,
  ...props
}) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const tokens = Colors[scheme];
  const dynamicStyles = createStyles(tokens);
  
  return (
    <TextInput
      style={[dynamicStyles.input, style]}
      placeholderTextColor={tokens.mutedForeground}
      {...props}
      keyboardType={type === 'number' ? 'numeric' : 'default'}
    />
  );
};

const createStyles = (tokens: typeof lightTokens) => StyleSheet.create({
  input: {
    height: 36,
    minWidth: 0,
    borderRadius: parseFloat(tokens.radius) * 16,
    borderColor: tokens.border,
    borderWidth: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    fontSize: 14,
    color: tokens.text,
    shadowColor: tokens.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    opacity: 1,
    outline: 'none',
    '&:focus': {
      borderColor: tokens.primary,
      ringColor: tokens.ring,
    },
    '&::placeholder': {
      color: tokens.mutedForeground,
    },
  },
});

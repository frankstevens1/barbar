import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof View> {
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ children, style, ...props }) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  } as ViewStyle,
  text: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    select: 'none',
  } as TextStyle,
});

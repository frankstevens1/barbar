import { StyleSheet, Text, TextProps } from 'react-native';

export default function Strong({ children, style, ...props }: TextProps) {
  return (
    <Text {...props} style={[$strong, style]}>
      {children}
    </Text>
  );
}

const { $strong } = StyleSheet.create({
  $strong: {
    fontWeight: 'bold',
  },
});

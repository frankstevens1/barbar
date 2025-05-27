import { StyleSheet, Text, TextProps } from 'react-native';

export default function Paragraph({ children, style, ...props }: TextProps) {
  return (
    <Text {...props} style={[$paragraph, style]}>
      {children}
    </Text>
  );
}

const { $paragraph } = StyleSheet.create({
  $paragraph: {
    fontSize: 24,
    letterSpacing: 0.25,
    marginVertical: 2,
  },
});

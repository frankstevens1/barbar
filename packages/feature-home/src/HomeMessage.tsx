import Paragraph from '../../mobile-ui/src/components/Paragraph';
import Strong from '../../mobile-ui/src/components/Strong';
import { ComponentProps } from 'react';

type HomeMessageProps = ComponentProps<typeof Paragraph>;

export const HomeMessage = (props: HomeMessageProps) => (
  <Paragraph {...props}>
    Hello from an <Strong>Expo monorepo</Strong>!
  </Paragraph>
);

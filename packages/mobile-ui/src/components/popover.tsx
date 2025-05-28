import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  ViewStyle,
  TouchableWithoutFeedback
} from 'react-native';
import { lightTokens, darkTokens } from '../lib/tokens';

const Colors = { light: lightTokens, dark: darkTokens };

interface PopoverProps {
  children: React.ReactNode;
  isVisible: boolean;
  onDismiss: () => void;
}

export const Popover: React.FC<PopoverProps> = ({ children, isVisible, onDismiss }) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.popover}>
        {children}
      </View>
    </Modal>
  );
};

interface PopoverTriggerProps {
  onPress: () => void;
  children: React.ReactNode;
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ onPress, children }) => {
  return (
    <Pressable onPress={onPress} style={styles.trigger}>
      {children}
    </Pressable>
  );
};

interface PopoverContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  children: React.ReactNode;
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
  className,
  align = 'center',
  sideOffset = 4,
  children
}) => {
  return (
    <View style={[styles.content, { marginTop: sideOffset }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle,
  popover: {
    backgroundColor: Colors.light.popover, // Default to light theme
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: 288,
    alignSelf: 'center'
  } as ViewStyle,
  trigger: {
    alignSelf: 'center'
  } as ViewStyle,
  content: {
    borderWidth: 1,
    borderColor: Colors.light.border // Default to light theme
  } as ViewStyle
});

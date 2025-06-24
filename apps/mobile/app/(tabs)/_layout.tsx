import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { lightTokens, darkTokens } from '@workspace/mobile-ui/lib/tokens';

export default function TabLayout() {
  const scheme = useColorScheme() ?? 'light';
  const tokens = scheme === 'dark' ? darkTokens : lightTokens;

  return (
    <Tabs
      screenOptions={{
        // use your primary token as the active tint
        tabBarActiveTintColor: tokens.primary,
        // optional: set the inactive tint too, e.g. mutedForeground
        tabBarInactiveTintColor: tokens.mutedForeground,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // transparent on iOS to let your TabBarBackground's blur show through
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

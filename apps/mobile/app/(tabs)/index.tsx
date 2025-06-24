// app/screens/LandingScreen.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native'
import { Button } from '@workspace/mobile-ui/components/button'
import { Line, NamedSilhouette, PRESET_SILHOUETTES } from '../../lib/silhouettes'

// Animated silhouette for hero
function HeroMobileSimple() {
  const [lines, setLines] = useState<Omit<Line, 'id'>[]>([])
  const animValues = useRef<Animated.Value[]>([]).current
  const windowWidth = Dimensions.get('window').width
  const containerWidth = windowWidth * 0.9
  const containerHeight = (containerWidth * 900) / 1200
  const scale = containerWidth / 1200

  useEffect(() => {
    const preset: NamedSilhouette = PRESET_SILHOUETTES[
      Math.floor(Math.random() * PRESET_SILHOUETTES.length)
    ]
    setLines(preset.lines)
    preset.lines.forEach((_, i) => {
      animValues[i] = new Animated.Value(0)
    })
    const animations = preset.lines.map((_, i) =>
      Animated.timing(animValues[i], {
        toValue: 1,
        duration: 400,
        delay: i * 30,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    )
    Animated.stagger(30, animations).start()
  }, [])

  return (
    <View style={[styles.heroContainer, { width: containerWidth, height: containerHeight }]}>      
      {lines.map((l, i) => {
        const dx = l.x2 - l.x1
        const dy = l.y2 - l.y1
        const length = Math.hypot(dx, dy)
        const angle = Math.atan2(dy, dx)
        const widthAnim = animValues[i]?.interpolate({
          inputRange: [0, 1],
          outputRange: [0, length * scale],
        }) || 0
        return (
          <Animated.View
            key={`${l.x1},${l.y1}-${l.x2},${l.y2}`}
            style={[
              styles.line,
              {
                left: l.x1 * scale,
                top: l.y1 * scale,
                width: widthAnim,
                transform: [{ rotate: `${angle}rad` }],
              },
            ]}
          />
        )
      })}
      <Text style={styles.heroTitle}>datafluent.one</Text>
    </View>
  )
}

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Welcome to</Text>
        <Text style={styles.headerAccent}>DataFluent.one</Text>

        <HeroMobileSimple />

        <Text style={styles.subheader}>
          Your journey into data visualization starts here.
        </Text>

        <Button variant="default" size="lg" onPress={() => { /* navigate */ }}>
          Get Started
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? 'var(--color-background)' : '#fff',
  },
  content: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 20,
  },
  header: {
    fontSize: 24,
    color: Platform.OS === 'web' ? 'var(--color-foreground)' : '#222',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  headerAccent: {
    fontSize: 32,
    color: Platform.OS === 'web' ? 'var(--color-accent)' : '#111',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  heroContainer: {
    backgroundColor: Platform.OS === 'web' ? 'var(--color-secondary)' : '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: Platform.OS === 'web' ? 'var(--color-foreground)' : '#222',
  },
  heroTitle: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: Platform.OS === 'web' ? 'var(--color-primary)' : '#111',
  },
  subheader: {
    fontSize: 16,
    color: Platform.OS === 'web' ? 'var(--color-muted)' : '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
})

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEMES } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const T = THEMES['sakura'].colors;

const BG        = '#F0EAF8';
const PURPLE    = T.primary;
const TEXT_DARK = T.text;
const MUTED     = T.textSecondary;

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    id: 's1',
    icon: 'leaf-outline',
    label: 'Welcome',
    title: 'Build habits\nthat stick.',
    subtitle:
      'Bloom helps you stay consistent with your goals — one small task at a time, every day.',
  },
  {
    id: 's2',
    icon: 'timer-outline',
    label: 'Focus',
    title: 'Deep work,\ndone right.',
    subtitle:
      'Set goals, run timed focus sessions and track exactly where your energy goes each day.',
  },
  {
    id: 's3',
    icon: 'trending-up-outline',
    label: 'Grow',
    title: 'Watch yourself\nbloom.',
    subtitle:
      'Build streaks, unlock new themes and celebrate how far you have come — every single day.',
  },
];

interface OnboardingScreenProps {
  onDone: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onDone }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  };

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    } else {
      onDone();
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;

  const renderSlide = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={styles.slide}>
      <Text style={styles.overline}>{item.label}</Text>
      <Ionicons name={item.icon} size={48} color={PURPLE} style={styles.icon} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.root}>

      {/* Slide pages — fills most of the screen */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      />

      {/* ── Bottom action area ── */}
      <View style={styles.bottom}>

        {/* Centered page dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Primary CTA */}
        <TouchableOpacity style={styles.cta} onPress={goNext} activeOpacity={0.82}>
          <Text style={styles.ctaText}>
            {isLast ? 'Get Started' : 'Continue'}
          </Text>
          {!isLast && (
            <Ionicons name="arrow-forward" size={17} color="#fff" style={{ marginLeft: 8 }} />
          )}
        </TouchableOpacity>

        {/* Skip — below CTA, subtle */}
        <TouchableOpacity onPress={onDone} style={styles.skipBtn} hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  // ── Slide ──
  slide: {
    width,
    paddingHorizontal: 36,
    paddingTop: height * 0.14,  // Push content down from top — fills space properly
  },

  overline: {
    color: PURPLE,
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 32,
    opacity: 0.65,
  },

  icon: {
    marginBottom: 32,
  },

  title: {
    color: TEXT_DARK,
    fontFamily: 'Outfit_700Bold',
    fontSize: 42,
    lineHeight: 50,
    marginBottom: 20,
  },

  subtitle: {
    color: MUTED,
    fontFamily: 'Outfit_400Regular',
    fontSize: 17,
    lineHeight: 27,
  },

  // ── Bottom ──
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 44,
    paddingTop: 12,
    alignItems: 'center',
    gap: 16,
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
  dotActive: {
    width: 22,
    backgroundColor: PURPLE,
  },
  dotInactive: {
    width: 7,
    backgroundColor: PURPLE,
    opacity: 0.22,
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PURPLE,
    borderRadius: T.borderRadiusButton,
    paddingVertical: 18,
    width: '100%',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  ctaText: {
    color: '#fff',
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
  },

  skipBtn: {
    paddingVertical: 4,
  },
  skipText: {
    color: MUTED,
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    opacity: 0.7,
  },
});

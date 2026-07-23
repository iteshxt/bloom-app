import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEMES } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface SignInScreenProps {
  onSignIn: () => void;
}


// Always uses Midnight Orchid (sakura) theme for the sign-in screen
const T = THEMES['sakura'].colors;

const PURPLE_BG = T.primary;                           // #715578
const BOTTOM_BG = T.background;                        // #FAF8FC
const TEXT_DARK = T.text;                              // #312A44
const TEXT_MUTED = T.textSecondary;                    // #544660
const BORDER = T.border;                               // rgba(136,112,142,0.15)
const GREEN_LEAF = '#8CC98A';                          // Kept as-is, decorative leaf accent
const LEAF_FAINT = 'rgba(255,255,255,0.13)';           // Faint white for corner branches

export const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  return (
    <View style={styles.root}>

      {/* ── TOP PURPLE SECTION ── */}
      <View style={styles.topSection}>

        {/* Decorative faint leaf branch – top-left */}
        <View style={[styles.cornerBranch, styles.cornerBranchTopLeft]} pointerEvents="none">
          <Ionicons name="leaf" size={44} color={LEAF_FAINT} style={{ transform: [{ rotate: '30deg' }] }} />
          <Ionicons name="leaf" size={32} color={LEAF_FAINT} style={{ transform: [{ rotate: '-15deg' }], marginTop: -10, marginLeft: 8 }} />
          <Ionicons name="leaf" size={24} color={LEAF_FAINT} style={{ transform: [{ rotate: '60deg' }], marginTop: 4, marginLeft: -4 }} />
        </View>

        {/* Decorative faint leaf branch – top-right */}
        <View style={[styles.cornerBranch, styles.cornerBranchTopRight]} pointerEvents="none">
          <Ionicons name="leaf" size={44} color={LEAF_FAINT} style={{ transform: [{ rotate: '-40deg' }] }} />
          <Ionicons name="leaf" size={28} color={LEAF_FAINT} style={{ transform: [{ rotate: '20deg' }], marginTop: -8, marginLeft: -12 }} />
          <Ionicons name="leaf" size={20} color={LEAF_FAINT} style={{ transform: [{ rotate: '-70deg' }], marginTop: 6, marginLeft: 4 }} />
        </View>

        {/* Scattered sparkle/star decorations */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {/* 4-pointed cross sparkles */}
          <Text style={[styles.sparkStar, { top: height * 0.07, left: width * 0.14 }]}>✦</Text>
          <Text style={[styles.sparkStar, styles.sparkStarSmall, { top: height * 0.12, left: width * 0.25 }]}>✦</Text>
          <Text style={[styles.sparkStar, { top: height * 0.05, right: width * 0.16 }]}>✦</Text>
          <Text style={[styles.sparkStar, styles.sparkStarSmall, { top: height * 0.14, right: width * 0.07 }]}>✦</Text>
          <Text style={[styles.sparkStar, styles.sparkStarSmall, { top: height * 0.20, left: width * 0.07 }]}>✦</Text>
          <View style={[styles.sparkDot, { top: height * 0.10, right: width * 0.28 }]} />
          <View style={[styles.sparkDot, { top: height * 0.22, right: width * 0.05 }]} />
        </View>

        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <Image
            source={require('../../assets/android-icon-foreground.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* "bloom" logo */}
        <Text style={styles.logoText}>bloom</Text>


        {/* "GROW TOGETHER" tagline */}
        <Text style={styles.tagline}>GROW TOGETHER</Text>

      </View>

      {/* ── BOTTOM LAVENDER SECTION with dome arch ── */}
      {/*
        The trick: make the bottom container wider than the screen,
        then set a border radius equal to half the container width.
        This creates a large-circle arc that intersects the screen edges cleanly.
        We then compensate with paddingHorizontal so the text content
        looks like it has normal screen-width margins.
      */}
      <View style={styles.bottomWrapper}>

        {/* Decorative faint leaf – bottom-left corner */}
        <View style={[styles.bottomCornerLeaf, styles.bottomLeafLeft]} pointerEvents="none">
          <Ionicons name="leaf" size={48} color="rgba(94,64,112,0.14)" style={{ transform: [{ rotate: '40deg' }] }} />
          <Ionicons name="leaf" size={34} color="rgba(94,64,112,0.10)" style={{ transform: [{ rotate: '-10deg' }], marginTop: -14, marginLeft: 10 }} />
          <Ionicons name="leaf" size={24} color="rgba(140,201,138,0.25)" style={{ transform: [{ rotate: '20deg' }], marginTop: 4, marginLeft: -4 }} />
        </View>

        {/* Decorative faint leaf – bottom-right corner */}
        <View style={[styles.bottomCornerLeaf, styles.bottomLeafRight]} pointerEvents="none">
          <Ionicons name="leaf" size={48} color="rgba(94,64,112,0.14)" style={{ transform: [{ rotate: '-50deg' }] }} />
          <Ionicons name="leaf" size={34} color="rgba(94,64,112,0.10)" style={{ transform: [{ rotate: '15deg' }], marginTop: -14, marginLeft: -12 }} />
          <Ionicons name="leaf" size={24} color="rgba(140,201,138,0.25)" style={{ transform: [{ rotate: '-20deg' }], marginTop: 6, marginLeft: 2 }} />
        </View>

        {/* Dot · leaf · dot decorative accent */}
        <View style={styles.accentRow}>
          <View style={styles.accentDot} />
          <Ionicons name="leaf" size={13} color={TEXT_MUTED} style={{ opacity: 0.4, marginHorizontal: 6 }} />
          <View style={styles.accentDot} />
        </View>

        <Text style={styles.welcomeTitle}>Welcome back</Text>
        <Text style={styles.welcomeSubtitle}>
          Sign in to continue growing{'\n'}your garden and tracking your tasks.
        </Text>

        {/* Google Sign-In Button */}
        <TouchableOpacity style={styles.googleButton} onPress={onSignIn} activeOpacity={0.85}>
          <Ionicons name="logo-google" size={20} color="#EA4335" style={{ marginRight: 12 }} />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

const DOME_WIDTH = width;      // Exactly screen width
const DOME_RADIUS = 40;        // Modal-style rounded top corners (like a bottom sheet)
const DOME_OVERHANG = 0;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BOTTOM_BG,
  },

  // ── Top section ──
  topSection: {
    backgroundColor: PURPLE_BG,
    height: height * 0.60, // Fixed 60% height for purple section
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.04,
    overflow: 'hidden',   // Clip corner decorations
    position: 'relative',
  },

  cornerBranch: {
    position: 'absolute',
    zIndex: 0,
  },
  cornerBranchTopLeft: {
    top: -8,
    left: -10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cornerBranchTopRight: {
    top: -8,
    right: -10,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  sparkStar: {
    position: 'absolute',
    fontSize: 16,
    color: 'rgba(255,255,255,0.50)',
  },
  sparkStarSmall: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
  },
  sparkDot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  mascotContainer: {
    width: 280,
    height: 280,
    marginBottom: -20, // PNG has transparent space at bottom; pull text up
    zIndex: 1,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 1,
    marginBottom: 4,
  },
  logoText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_700Bold',
    fontSize: 72,
    letterSpacing: -2,
    lineHeight: 80,
  },
  mLeaves: {
    position: 'absolute',
    right: -18,
    top: -5,    // Above the 'm' glyph top — lowercase 'm' peak
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  tagline: {
    color: 'rgba(255,255,255,0.70)',
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    letterSpacing: 3.5,
    marginTop: 2,
    zIndex: 1,
  },

  // ── Bottom section ──
  bottomWrapper: {
    width: DOME_WIDTH,
    alignSelf: 'center',
    backgroundColor: BOTTOM_BG,
    borderTopLeftRadius: DOME_RADIUS,
    borderTopRightRadius: DOME_RADIUS,
    marginTop: -DOME_RADIUS, // Tuck the rounded corners into the purple section
    flex: 1,
    paddingTop: DOME_RADIUS + 24,
    paddingHorizontal: 32,
    alignItems: 'center',
  },

  bottomCornerLeaf: {
    position: 'absolute',
    bottom: 24,
    zIndex: 0,
  },
  bottomLeafLeft: {
    left: DOME_OVERHANG + 4,
    bottom: 16,
    alignItems: 'flex-start',
  },
  bottomLeafRight: {
    right: DOME_OVERHANG + 4,
    bottom: 16,
    alignItems: 'flex-end',
  },

  accentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  accentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TEXT_MUTED,
    opacity: 0.3,
  },

  welcomeTitle: {
    color: TEXT_DARK,
    fontFamily: 'Outfit_700Bold',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    color: TEXT_MUTED,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: T.borderRadiusButton, // From Midnight Orchid theme
    paddingVertical: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: T.borderWidth,
    borderColor: BORDER,
  },
  googleButtonText: {
    color: TEXT_DARK,
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
  },
});

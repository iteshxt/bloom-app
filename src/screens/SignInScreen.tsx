import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface SignInScreenProps {
  onSignIn: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  const { theme, currentTheme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Top Section with Watermark and Curve */}
      <View style={{ flex: 1, overflow: 'hidden', alignItems: 'center' }}>
        {/* Background Art / Watermark (Using a faint huge icon) */}
        <View style={StyleSheet.absoluteFill} className="items-center justify-center opacity-5">
          <Ionicons name="flower-outline" size={width * 1.2} color={theme.primaryDark} style={{ transform: [{ rotate: '15deg' }] }} />
        </View>

        <View className="flex-1 items-center justify-center pt-20">
          <View style={{ 
            backgroundColor: `${theme.primary}15`, 
            width: 80, 
            height: 80, 
            borderRadius: 24, 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 24,
            borderWidth: 1,
            borderColor: `${theme.primary}30`
          }}>
            <Ionicons name="leaf" size={40} color={theme.primary} />
          </View>
          <Text style={{ color: theme.text, fontFamily: theme.fontFamilyBold, fontSize: 36, letterSpacing: -1 }}>
            Bloom
          </Text>
          <Text style={{ color: theme.textSecondary, fontFamily: theme.fontFamilyMedium, fontSize: 16, marginTop: 8, opacity: 0.8 }}>
            Grow your habits together.
          </Text>
        </View>

        {/* Inverted Half-Moon Curve separating top and bottom */}
        {/* We use a very large circle positioned to create an inverted curve at the bottom of this section */}
        <View 
          style={{
            position: 'absolute',
            bottom: -width * 0.75, // push down so only the top curve shows
            width: width * 1.5,
            height: width * 1.5,
            borderRadius: width * 0.75,
            backgroundColor: theme.cardBg, // The bottom section color
            borderTopWidth: theme.borderWidth,
            borderColor: theme.border,
            alignSelf: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -10 },
            shadowOpacity: 0.05,
            shadowRadius: 15,
            elevation: 10,
          }}
        />
      </View>

      {/* Bottom Section below the inverted half moon */}
      <View 
        style={{ 
          height: height * 0.35, 
          backgroundColor: theme.cardBg,
          alignItems: 'center', 
          justifyContent: 'center',
          paddingHorizontal: 32,
          zIndex: 10,
        }}
      >
        <Text style={{ color: theme.text, fontFamily: theme.fontFamilyBold, fontSize: 24, marginBottom: 8 }}>
          Welcome back
        </Text>
        <Text style={{ color: theme.textSecondary, fontFamily: theme.fontFamilyMedium, fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
          Sign in to continue growing your garden and tracking your tasks.
        </Text>

        {/* Google Sign In Button */}
        <TouchableOpacity 
          onPress={onSignIn}
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: theme.borderRadiusButton,
            width: '100%',
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="logo-google" size={20} color={theme.text} style={{ marginRight: 12 }} />
          <Text style={{ color: theme.text, fontFamily: theme.fontFamilyBold, fontSize: 16 }}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

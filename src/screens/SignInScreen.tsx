import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface SignInScreenProps {
  onSignIn: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* 2/3 Top Crescent Section */}
      <View 
        style={{ 
          height: height * 0.62, 
          backgroundColor: theme.primary, 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'relative',
          overflow: 'visible', // Let the crescent curve spill out
        }}
      >
        <StatusBar barStyle="light-content" />

        {/* Background Watermark/Art */}
        <View style={StyleSheet.absoluteFill} className="items-center justify-center opacity-10">
          <Ionicons name="flower-outline" size={width * 1.0} color={theme.primaryContrast || '#FFFFFF'} style={{ transform: [{ rotate: '15deg' }] }} />
        </View>

        {/* Logo and Branding Container */}
        <View className="items-center justify-center z-10" style={{ marginTop: -40 }}>
          <View style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            width: 86, 
            height: 86, 
            borderRadius: theme.borderRadiusCard || 24, 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)'
          }}>
            <Ionicons name="leaf" size={44} color={theme.primaryContrast || '#FFFFFF'} />
          </View>
          
          <Text style={{ 
            color: theme.primaryContrast || '#FFFFFF', 
            fontFamily: "Outfit_700Bold", 
            fontSize: 42, 
            letterSpacing: -1.5 
          }}>
            Bloom
          </Text>
          
          <Text style={{ 
            color: theme.primaryContrast || '#FFFFFF', 
            fontFamily: "Outfit_500Medium", 
            fontSize: 16, 
            marginTop: 6, 
            opacity: 0.9 
          }}>
            Grow your habits together
          </Text>
        </View>

        {/* Crescent downward bulge */}
        <View 
          style={{
            position: 'absolute',
            bottom: -width * 0.3,
            width: width * 1.6,
            height: width * 0.6,
            borderRadius: width * 0.8,
            backgroundColor: theme.primary,
            transform: [{ scaleX: 1.15 }],
            zIndex: 1,
          }}
        />
      </View>

      {/* 1/3 Bottom Welcome & Action Section */}
      <View 
        style={{ 
          flex: 1,
          backgroundColor: theme.background,
          alignItems: 'center', 
          justifyContent: 'flex-end',
          paddingHorizontal: 32,
          paddingBottom: height * 0.08,
          zIndex: 10,
        }}
      >
        <Text style={{ 
          color: theme.text, 
          fontFamily: "Outfit_700Bold", 
          fontSize: 26, 
          marginBottom: 8,
          textAlign: 'center'
        }}>
          Welcome back
        </Text>
        
        <Text style={{ 
          color: theme.textSecondary, 
          fontFamily: "Outfit_500Medium", 
          fontSize: 14, 
          textAlign: 'center', 
          marginBottom: 36,
          lineHeight: 20,
          paddingHorizontal: 12,
        }}>
          Sign in to continue growing your garden and tracking your tasks.
        </Text>

        {/* Google Sign In Button */}
        <TouchableOpacity 
          onPress={onSignIn}
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.border,
            borderWidth: theme.borderWidth || 1,
            borderRadius: theme.borderRadiusButton || 14,
            width: '100%',
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Ionicons name="logo-google" size={20} color={theme.text} style={{ marginRight: 12 }} />
          <Text style={{ color: theme.text, fontFamily: "Outfit_700Bold", fontSize: 16 }}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

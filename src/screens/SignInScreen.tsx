import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface SignInScreenProps {
  onSignIn: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.primary }}>
      {/* Top Purple Section (approx 55% height) */}
      <View 
        style={{ 
          height: height * 0.55, 
          backgroundColor: theme.primary, 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Background Sparkles & Sparkle Dots */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Sparkles */}
          <Ionicons name="sparkles" size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', top: '15%', left: '20%' }} />
          <Ionicons name="sparkles" size={20} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', top: '25%', right: '25%' }} />
          <Ionicons name="sparkles" size={14} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '45%', left: '15%' }} />
          
          {/* Faint side leaf illustrations (watermarks) */}
          <Ionicons name="leaf-outline" size={80} color="rgba(255,255,255,0.06)" style={{ position: 'absolute', top: '10%', left: -20, transform: [{ rotate: '-45deg' }] }} />
          <Ionicons name="leaf-outline" size={100} color="rgba(255,255,255,0.06)" style={{ position: 'absolute', top: '30%', right: -30, transform: [{ rotate: '45deg' }] }} />
        </View>

        {/* Mascot & Brand Container */}
        <View className="items-center justify-center z-10" style={{ marginTop: -10 }}>
          {/* Mascot Image (Actual android-icon-foreground containing the purple sprout character) */}
          <View style={{ position: 'relative', width: 150, height: 150, marginBottom: 16 }}>
            <Image 
              source={require('../../assets/android-icon-foreground.png')} 
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }} 
            />
            {/* Mascot shadow */}
            <View 
              style={{
                position: 'absolute',
                bottom: 8,
                alignSelf: 'center',
                width: 70,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0,0,0,0.15)',
                zIndex: -1,
              }}
            />
          </View>
          
          {/* Custom Stylized Logo "bloom" with leaves on "m" */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={{ 
              color: theme.primaryContrast || '#FFFFFF', 
              fontFamily: "Outfit_700Bold", 
              fontSize: 54, 
              letterSpacing: -1.5,
              lineHeight: 60,
            }}>
              bloom
            </Text>
            {/* Custom leaf decoration sprouting from the 'm' */}
            <View style={{ position: 'absolute', right: -12, top: 4 }}>
              <Ionicons name="leaf" size={20} color="#A7D3A6" style={{ transform: [{ rotate: '25deg' }] }} />
            </View>
          </View>
          
          <Text style={{ 
            color: theme.primaryContrast || '#FFFFFF', 
            fontFamily: "Outfit_500Medium", 
            fontSize: 13, 
            marginTop: 4, 
            opacity: 0.8,
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>
            Grow Together
          </Text>
        </View>

        {/* Upward dome bulge (Reverse half circle) connecting to bottom */}
        <View 
          style={{
            position: 'absolute',
            bottom: 0,
            width: width * 1.4,
            height: width * 0.45,
            borderTopLeftRadius: width * 0.7,
            borderTopRightRadius: width * 0.7,
            backgroundColor: theme.background,
            alignSelf: 'center',
            zIndex: 1,
          }}
        />
      </View>

      {/* Bottom Welcome & Action Section (approx 45% height) */}
      <View 
        style={{ 
          flex: 1,
          backgroundColor: theme.background,
          alignItems: 'center', 
          justifyContent: 'flex-start',
          paddingHorizontal: 32,
          paddingTop: 16,
          zIndex: 10,
        }}
      >
        {/* Leaf Accent Divider (dot - leaf - dot) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.primary, opacity: 0.3, marginRight: 8 }} />
          <Ionicons name="leaf" size={14} color={theme.primary} style={{ opacity: 0.4 }} />
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.primary, opacity: 0.3, marginLeft: 8 }} />
        </View>

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
          marginBottom: 44,
          lineHeight: 20,
          paddingHorizontal: 16,
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
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
            marginBottom: height * 0.04, // Bottom spacing
          }}
        >
          {/* Using logo-google from Ionicons */}
          <Ionicons name="logo-google" size={20} color={theme.text} style={{ marginRight: 12 }} />
          <Text style={{ color: theme.text, fontFamily: "Outfit_700Bold", fontSize: 16 }}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

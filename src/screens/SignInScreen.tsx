import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SignInScreenProps {
  onSignIn: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  // We hardcode the custom deep purple and lavender colors to match the mockup exactly
  const colors = {
    purpleBg: '#47304C',        // Deep, rich purple for the top section
    bottomBg: '#F9F4FA',        // Extremely soft lavender-white for the bottom
    textDark: '#3A283E',        // Dark slate purple for high-contrast legible text
    textMuted: '#68596B',       // Muted slate purple for secondary text
    border: '#E8DCE9',          // Soft border color
    buttonBg: '#FFFFFF',        // White card background
    greenLeaf: '#A5D6A7',       // Soft green for the leaf detail on the logo
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bottomBg }}>
      {/* 60% Top Deep Purple Section */}
      <View 
        style={{ 
          height: height * 0.60, 
          backgroundColor: colors.purpleBg, 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Sparkles / Background Details */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Sparkles */}
          <Ionicons name="sparkles" size={12} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', top: '15%', left: '20%' }} />
          <Ionicons name="sparkles" size={16} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', top: '10%', right: '30%' }} />
          <Ionicons name="sparkles" size={10} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', top: '35%', left: '28%' }} />
          <Ionicons name="sparkles" size={14} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', top: '30%', right: '18%' }} />

          {/* Left faint branch */}
          <View style={{ position: 'absolute', left: -25, top: '8%', opacity: 0.12, transform: [{ rotate: '-15deg' }] }}>
            <Ionicons name="leaf-outline" size={110} color="#FFFFFF" />
          </View>

          {/* Right faint branch */}
          <View style={{ position: 'absolute', right: -30, top: '22%', opacity: 0.12, transform: [{ rotate: '45deg' }] }}>
            <Ionicons name="leaf-outline" size={130} color="#FFFFFF" />
          </View>
        </View>

        {/* Mascot & Brand Logo Container */}
        <View className="items-center justify-center z-10" style={{ marginTop: -20 }}>
          {/* Mascot Image (The purple sprout character) */}
          <View style={{ position: 'relative', width: 170, height: 170, marginBottom: 12 }}>
            <Image 
              source={require('../../assets/android-icon-foreground.png')} 
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }} 
            />
            {/* Mascot shadow */}
            <View 
              style={{
                position: 'absolute',
                bottom: 6,
                alignSelf: 'center',
                width: 76,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0,0,0,0.18)',
                zIndex: -1,
              }}
            />
          </View>
          
          {/* Stylized Logo "bloom" */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={{ 
              color: '#FFFFFF', 
              fontFamily: "Outfit_700Bold", 
              fontSize: 58, 
              letterSpacing: -1.5,
              lineHeight: 64,
            }}>
              bloom
            </Text>
            {/* Two leaves growing out of the 'm' */}
            <View style={{ position: 'absolute', right: -14, top: 4 }}>
              <Ionicons name="leaf" size={22} color={colors.greenLeaf} style={{ transform: [{ rotate: '25deg' }] }} />
            </View>
          </View>
          
          <Text style={{ 
            color: '#FFFFFF', 
            fontFamily: "Outfit_500Medium", 
            fontSize: 13, 
            marginTop: 6, 
            opacity: 0.75,
            letterSpacing: 3,
            textTransform: 'uppercase'
          }}>
            Grow Together
          </Text>
        </View>

        {/* Curved Divider - Dome bulge pointing UPWARDS (Reverse half circle) */}
        {/* We use a very wide ellipse positioned lower down to create a flatter, smoother curve */}
        <View 
          style={{
            position: 'absolute',
            bottom: -width * 0.45,
            width: width * 2.0,
            height: width * 1.0,
            borderRadius: width * 1.0,
            backgroundColor: colors.bottomBg,
            alignSelf: 'center',
            zIndex: 1,
          }}
        />
      </View>

      {/* 40% Bottom Section */}
      <View 
        style={{ 
          flex: 1,
          backgroundColor: colors.bottomBg,
          alignItems: 'center', 
          justifyContent: 'flex-start',
          paddingHorizontal: 32,
          paddingTop: 10,
          zIndex: 10,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Bottom Background Hills and Leaves (matching the mockup decoration) */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Hills */}
          <View 
            style={{
              position: 'absolute',
              bottom: -50,
              width: width * 1.2,
              height: 100,
              borderRadius: width * 0.6,
              backgroundColor: '#EDE5F0',
              left: -width * 0.1,
              opacity: 0.6,
            }}
          />
          <View 
            style={{
              position: 'absolute',
              bottom: -60,
              width: width * 1.3,
              height: 110,
              borderRadius: width * 0.65,
              backgroundColor: '#E5D8E8',
              right: -width * 0.15,
            }}
          />
          
          {/* Leaves at the bottom corners */}
          <Ionicons 
            name="leaf-outline" 
            size={70} 
            color="#DCC7E0" 
            style={{ position: 'absolute', bottom: 10, left: 10, transform: [{ rotate: '-30deg' }] }} 
          />
          <Ionicons 
            name="leaf-outline" 
            size={80} 
            color="#DCC7E0" 
            style={{ position: 'absolute', bottom: 15, right: 10, transform: [{ rotate: '45deg' }] }} 
          />
        </View>

        {/* Content */}
        <View className="items-center z-10 w-full">
          {/* Leaf Accent Divider (dot • leaf • dot) */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textMuted, opacity: 0.3, marginRight: 8 }} />
            <Ionicons name="leaf" size={14} color={colors.textMuted} style={{ opacity: 0.4 }} />
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textMuted, opacity: 0.3, marginLeft: 8 }} />
          </View>

          <Text style={{ 
            color: colors.textDark, 
            fontFamily: "Outfit_700Bold", 
            fontSize: 28, 
            marginBottom: 8,
            textAlign: 'center'
          }}>
            Welcome back
          </Text>
          
          <Text style={{ 
            color: colors.textMuted, 
            fontFamily: "Outfit_500Medium", 
            fontSize: 14, 
            textAlign: 'center', 
            marginBottom: 36,
            lineHeight: 20,
            paddingHorizontal: 20,
          }}>
            Sign in to continue growing your garden and tracking your tasks.
          </Text>

          {/* Google Sign In Button */}
          <TouchableOpacity 
            onPress={onSignIn}
            style={{
              backgroundColor: colors.buttonBg,
              borderColor: colors.border,
              borderWidth: 1.2,
              borderRadius: 16,
              width: '100%',
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.textDark,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            {/* Google Logo (Colored representation or clean SVG) */}
            {/* Expo vector-icons logo-google is a clean choice, we use a custom colored look if possible, but logo-google is standard */}
            <Ionicons name="logo-google" size={20} color="#EA4335" style={{ marginRight: 12 }} />
            <Text style={{ color: colors.textDark, fontFamily: "Outfit_700Bold", fontSize: 16 }}>
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

import "./global.css";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, ActivityIndicator, LogBox, PanResponder, Animated, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from "@expo-google-fonts/outfit";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { TasksProvider } from "./src/contexts/TasksContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";

// Disable Reanimated strict mode warnings for NativeWind shared value writes during render
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Import Screens & Components
import { HomeScreen } from "./src/screens/HomeScreen";
import { FocusScreen } from "./src/screens/FocusScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { InsightsScreen } from "./src/screens/InsightsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SignInScreen } from "./src/screens/SignInScreen";
import { BottomDock, TabSlug } from "./src/components/BottomDock";

// Dynamic text component override to alias font families app-wide
const isIconFont = (fontName: string) => {
  if (!fontName) return false;
  const lower = fontName.toLowerCase();
  return lower.includes("icon") || 
         lower.includes("feather") || 
         lower.includes("awesome") || 
         lower.includes("vector") || 
         lower.includes("material") || 
         lower.includes("evil") || 
         lower.includes("entypo") || 
         lower.includes("antdesign") || 
         lower.includes("simpleline") || 
         lower.includes("octicons") || 
         lower.includes("foundation") ||
         lower.includes("ionicons");
};

const originalTextRender = (Text as any).render;
(Text as any).render = function(props: any, ref: any) {
  const result = originalTextRender.call(this, props, ref);
  
  if (result?.props?.style) {
    let currentFont = "";
    
    if (Array.isArray(result.props.style)) {
      const found = result.props.style.find((s: any) => s?.fontFamily);
      if (found) currentFont = found.fontFamily;
    } else if (result.props.style.fontFamily) {
      currentFont = result.props.style.fontFamily;
    }

    if (currentFont && isIconFont(currentFont)) {
      return result;
    }

    let targetFont = (globalThis as any).activeFontFamilyRegular;
    if (currentFont === "Outfit_500Medium" || currentFont === "Outfit_600SemiBold") {
      targetFont = (globalThis as any).activeFontFamilyMedium;
    } else if (currentFont === "Outfit_700Bold") {
      targetFont = (globalThis as any).activeFontFamilyBold;
    }

    if (targetFont) {
      const customStyle = [result.props.style, { fontFamily: targetFont }];
      return React.cloneElement(result, { style: customStyle });
    }
  }
  return result;
};

function AppContent() {
  const { theme, isThemeLoading, currentTheme } = useTheme();
  
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const isAppLoading = isThemeLoading || !fontsLoaded;

  const [activeTab, setActiveTab] = useState<TabSlug>("home");
  const [showProfile, setShowProfile] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Splash Screen Fade & Scale Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const [showSplash, setShowSplash] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    // 1. Animate Logo Fade In and Scale Up
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: theme.animationTension,
        friction: theme.animationFriction,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Guard minimum display time of 1 second
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAppLoading && minTimePassed) {
      // 2. Once loaded and 1.0s has passed, fade out splash screen overlay
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }
  }, [isAppLoading, minTimePassed]);

  // Render screens conditionally based on navigation state
  const renderScreen = () => {
    if (!isSignedIn) {
      return <SignInScreen onSignIn={() => setIsSignedIn(true)} />;
    }
    
    if (showProfile) {
      return <ProfileScreen onBack={() => setShowProfile(false)} />;
    }
    switch (activeTab) {
      case "home":
        return <HomeScreen onNavigateToProfile={() => setShowProfile(true)} onModalToggle={setIsFullScreen} />;
      case "focus":
        return <FocusScreen onFullScreenToggle={setIsFullScreen} />;
      case "calendar":
        return <CalendarScreen onModalToggle={setIsFullScreen} />;
      case "insights":
        return <InsightsScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <StatusBar style={theme.statusBar} />
      
      <View key={currentTheme} style={{ flex: 1 }}>
        {renderScreen()}
      </View>

      {/* Persistent Floating Bottom Dock Navigation */}
      {!isFullScreen && isSignedIn && !showProfile && (
        <BottomDock 
          activeTab={activeTab} 
          onTabSelect={(tab) => setActiveTab(tab)} 
        />
      )}

      {/* Custom Premium Animated Splash Screen Overlay */}
      {showSplash && (
        <Animated.View 
          pointerEvents="none"
          style={{ 
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.background, 
            justifyContent: "center", 
            alignItems: "center", 
            opacity: fadeAnim,
            zIndex: 9999
          }}
        >
          {/* Background Watermark Leaves */}
          <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, overflow: "hidden" }} pointerEvents="none">
            <Ionicons 
              name={theme.watermarkIcon as any} 
              size={350} 
              color={theme.primary} 
              style={{ 
                position: "absolute", 
                left: -100, 
                top: -50, 
                opacity: 0.08, 
                transform: [{ rotate: "-35deg" }] 
              }} 
            />
            <Ionicons 
              name={theme.watermarkIcon as any} 
              size={450} 
              color={theme.primary} 
              style={{ 
                position: "absolute", 
                right: -150, 
                bottom: 50, 
                opacity: 0.08, 
                transform: [{ rotate: "45deg" }] 
              }} 
            />
          </View>

          {/* Animated Center Logo */}
          <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity, alignItems: "center" }}>
            <Ionicons name={theme.watermarkIcon as any} size={100} color={theme.primary} />
            <Text style={{ fontSize: 38, color: theme.text, fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", marginTop: 16, fontWeight: "bold" }}>
              bloom
            </Text>
            <Text style={{ fontSize: 11, color: theme.textSecondary, fontFamily: "Outfit_500Medium", marginTop: 8, letterSpacing: 3, textTransform: "uppercase" }}>
              Grow together
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <TasksProvider>
            <AppContent />
          </TasksProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

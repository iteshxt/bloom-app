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
  const { theme, isThemeLoading } = useTheme();
  const [activeTab, setActiveTab] = useState<TabSlug>("home");
  const [showProfile, setShowProfile] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Splash Screen Fade & Scale Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 1. Animate Logo Fade In and Scale Up
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 18,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!isThemeLoading) {
      // 2. Once theme has loaded, wait 800ms for user to enjoy animation, then fade out the entire splash screen
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }).start(() => {
          setShowSplash(false);
        });
      }, 800);
    }
  }, [isThemeLoading]);

  // Use refs to avoid stale closures in PanResponder callbacks
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;
  const isFullScreenRef = useRef(isFullScreen);
  isFullScreenRef.current = isFullScreen;
  const isSwipingTaskRef = useRef(false);

  const TABS_ORDER: TabSlug[] = ["home", "focus", "calendar", "insights"];
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (isFullScreenRef.current) return false;
        if (isSwipingTaskRef.current) return false;
        return Math.abs(gestureState.dx) > 40 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 3.5;
      },
      onPanResponderRelease: (_, gestureState) => {
        const index = TABS_ORDER.indexOf(activeTabRef.current);
        if (gestureState.dx > 60) {
          // Swipe Right -> Go Previous
          if (index > 0) {
            setActiveTab(TABS_ORDER[index - 1]);
          }
        } else if (gestureState.dx < -60) {
          // Swipe Left -> Go Next
          if (index < TABS_ORDER.length - 1) {
            setActiveTab(TABS_ORDER[index + 1]);
          }
        }
      }
    })
  ).current;

  // Render screens conditionally based on navigation state
  if (showProfile) {
    return <ProfileScreen onBack={() => setShowProfile(false)} />;
  }

  const renderScreen = (onSwipeTask: (swiping: boolean) => void) => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onNavigateToProfile={() => setShowProfile(true)} onSwipeTask={onSwipeTask} onModalToggle={setIsFullScreen} />;
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
      
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        {renderScreen((swiping) => {
          isSwipingTaskRef.current = swiping;
        })}
      </View>

      {/* Persistent Floating Bottom Dock Navigation */}
      {!isFullScreen && (
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
            backgroundColor: "#FAF8F3", 
            justifyContent: "center", 
            alignItems: "center", 
            opacity: fadeAnim,
            zIndex: 9999
          }}
        >
          {/* Background Watermark Leaves */}
          <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, overflow: "hidden" }} pointerEvents="none">
            <Ionicons 
              name="leaf" 
              size={350} 
              color="#834063" 
              style={{ 
                position: "absolute", 
                left: -100, 
                top: -50, 
                opacity: 0.08, 
                transform: [{ rotate: "-35deg" }] 
              }} 
            />
            <Ionicons 
              name="leaf" 
              size={450} 
              color="#834063" 
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
            <Ionicons name="leaf" size={100} color="#834063" />
            <Text style={{ fontSize: 38, color: "#834063", fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", marginTop: 16, fontWeight: "bold" }}>
              bloom
            </Text>
            <Text style={{ fontSize: 11, color: "#8A707F", fontFamily: "Outfit_500Medium", marginTop: 8, letterSpacing: 3, textTransform: "uppercase" }}>
              Grow together
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FBFBFD]">
        <ActivityIndicator size="large" color="#8C7AB8" />
        <Text style={{ fontSize: 16, color: "#8C7AB8", fontFamily: "sans-serif", marginTop: 12 }}>
          Growing Bloom...
        </Text>
      </View>
    );
  }

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

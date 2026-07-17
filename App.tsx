import "./global.css";
import React, { useState } from "react";
import { View, Text, ActivityIndicator, LogBox } from "react-native";
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from "@expo-google-fonts/outfit";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { TasksProvider } from "./src/contexts/TasksContext";
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
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabSlug>("home");
  const [showProfile, setShowProfile] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Render screens conditionally based on navigation state
  if (showProfile) {
    return <ProfileScreen onBack={() => setShowProfile(false)} />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onNavigateToProfile={() => setShowProfile(true)} />;
      case "focus":
        return <FocusScreen onFullScreenToggle={setIsFullScreen} />;
      case "calendar":
        return <CalendarScreen />;
      case "insights":
        return <InsightsScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <StatusBar style={theme.statusBar} />
      
      {renderScreen()}

      {/* Persistent Floating Bottom Dock Navigation */}
      {!isFullScreen && (
        <BottomDock 
          activeTab={activeTab} 
          onTabSelect={(tab) => setActiveTab(tab)} 
        />
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
        <TasksProvider>
          <AppContent />
        </TasksProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

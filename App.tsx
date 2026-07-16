import "./global.css";
import React, { useState } from "react";
import { View, Text, ActivityIndicator, LogBox } from "react-native";
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from "@expo-google-fonts/outfit";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// Ignore NativeWind / Reanimated rendering warning
LogBox.ignoreLogs(["[Reanimated] Writing to `value` during component render."]);

// Import Screens & Components
import { HomeScreen } from "./src/screens/HomeScreen";
import { FocusScreen } from "./src/screens/FocusScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { InsightsScreen } from "./src/screens/InsightsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { BottomDock, TabSlug } from "./src/components/BottomDock";

function AppContent() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabSlug>("home");
  const [showProfile, setShowProfile] = useState(false);

  // Render screens conditionally based on navigation state
  if (showProfile) {
    return <ProfileScreen onBack={() => setShowProfile(false)} />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onNavigateToProfile={() => setShowProfile(true)} />;
      case "focus":
        return <FocusScreen />;
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
      <BottomDock 
        activeTab={activeTab} 
        onTabSelect={(tab) => setActiveTab(tab)} 
      />
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
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

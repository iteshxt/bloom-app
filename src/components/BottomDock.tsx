import React from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { LinearTransition, FadeIn, FadeOut } from "react-native-reanimated";

export type TabSlug = "home" | "focus" | "calendar" | "insights";

interface BottomDockProps {
  activeTab: TabSlug;
  onTabSelect: (tab: TabSlug) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({ activeTab, onTabSelect }) => {
  const { theme, currentTheme } = useTheme();

  const tabs: { slug: TabSlug; label: string; icon: string; provider: "ionicons" | "feather" | "mci" }[] = [
    { slug: "home", label: "Home", icon: "home", provider: "ionicons" },
    { slug: "focus", label: "Focus", icon: "clock", provider: "feather" },
    { slug: "calendar", label: "Calendar", icon: "calendar", provider: "feather" },
    { slug: "insights", label: "Insights", icon: "chart-bar", provider: "mci" },
  ];

  // Synchronous Pre-calculation for flawless, zero-delay sliding
  const windowWidth = Dimensions.get("window").width;
  const containerWidth = windowWidth * 0.92;
  const innerWidth = containerWidth - 24; // px-3 is 12px padding on each side

  const getActiveWidth = (slug: TabSlug) => {
    switch (slug) {
      case "home": return 90;
      case "focus": return 92;
      case "calendar": return 114;
      case "insights": return 110;
      default: return 90;
    }
  };

  const getPillLayout = (activeSlug: TabSlug) => {
    const activeWidth = getActiveWidth(activeSlug);
    const sumOfWidths = 44 * 3 + activeWidth; // 3 inactive tabs (44px each) + 1 active tab
    const gap = (innerWidth - sumOfWidths) / 3; // Flexbox space-between gap
    
    const activeIndex = tabs.findIndex(t => t.slug === activeSlug);
    
    let x = 12; // Start after left padding
    for (let i = 0; i < activeIndex; i++) {
      x += 44 + gap; // All tabs before active are inactive (44px)
    }
    
    return { x, width: activeWidth };
  };

  const pillLayout = getPillLayout(activeTab);

  const renderIcon = (
    provider: "ionicons" | "feather" | "mci",
    name: string,
    size: number,
    color: string
  ) => {
    switch (provider) {
      case "ionicons":
        return <Ionicons name={name as any} size={size} color={color} />;
      case "feather":
        return <Feather name={name as any} size={size} color={color} />;
      case "mci":
        return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
    }
  };

  return (
    <View pointerEvents="box-none" className="absolute bottom-6 left-0 right-0 items-center justify-center" style={{ zIndex: 50 }}>
      <View 
        style={{ 
          backgroundColor: theme.primary, 
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
          width: containerWidth,
          pointerEvents: "auto",
          position: "relative",
          borderRadius: theme.borderRadiusCard,
          borderWidth: theme.borderWidth,
          borderColor: theme.border
        }} 
        className="flex-row justify-between items-center py-2.5 px-3"
      >
        {/* Synchronous Animated Sliding Pill - Zero Delay */}
        <Animated.View 
          style={{
            position: "absolute",
            top: 10,
            bottom: 10,
            left: pillLayout.x,
            width: pillLayout.width,
            backgroundColor: theme.backgroundSecondary,
            borderRadius: theme.borderRadiusButton,
          }}
          layout={LinearTransition.duration(300)}
        />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.slug;

          return (
            <TouchableOpacity
              key={tab.slug}
              activeOpacity={0.85}
              onPress={() => onTabSelect(tab.slug)}
              style={{
                width: isActive ? getActiveWidth(tab.slug) : 44, // Force exact widths to match math perfectly
                paddingVertical: 10,
                paddingHorizontal: isActive ? 16 : 12,
                zIndex: 2,
              }}
              className="flex-row items-center justify-center rounded-full"
            >
              <View className="flex-row items-center justify-center">
                {renderIcon(
                  tab.provider,
                  isActive ? (tab.slug === "home" ? "home" : tab.icon) : (tab.slug === "home" ? "home-outline" : tab.icon),
                  20,
                  isActive 
                    ? theme.primary 
                    : "rgba(255, 255, 255, 0.75)"
                )}
                {isActive && (
                  <Text
                    numberOfLines={1}
                    style={{ 
                      color: theme.primary, 
                      fontFamily: "Outfit_700Bold", 
                      fontSize: 13,
                      marginLeft: 8
                    }} 
                  >
                    {tab.label}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

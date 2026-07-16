import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export type TabSlug = "home" | "focus" | "calendar" | "insights";

interface BottomDockProps {
  activeTab: TabSlug;
  onTabSelect: (tab: TabSlug) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({ activeTab, onTabSelect }) => {
  const { theme } = useTheme();

  const tabs: { slug: TabSlug; label: string; icon: string; provider: "ionicons" | "feather" | "mci" }[] = [
    { slug: "home", label: "Home", icon: "home", provider: "ionicons" },
    { slug: "focus", label: "Focus", icon: "clock", provider: "feather" },
    { slug: "calendar", label: "Calendar", icon: "calendar", provider: "feather" },
    { slug: "insights", label: "Insights", icon: "chart-bar", provider: "mci" },
  ];

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
    <View className="absolute bottom-6 left-0 right-0 items-center justify-center pointer-events-none">
      <View 
        style={{ 
          backgroundColor: "#1F1E24", // Sleek obsidian/dark charcoal across all themes for maximum premium feel
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
          width: Dimensions.get("window").width * 0.88,
          pointerEvents: "auto"
        }} 
        className="rounded-[40px] flex-row justify-between items-center py-2.5 px-3"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.slug;

          return (
            <TouchableOpacity
              key={tab.slug}
              activeOpacity={0.85}
              onPress={() => onTabSelect(tab.slug)}
              style={{
                backgroundColor: isActive ? theme.primary : "transparent",
                paddingVertical: 10,
                paddingHorizontal: isActive ? 16 : 12,
              }}
              className="flex-row items-center justify-center rounded-full"
            >
              {renderIcon(
                tab.provider,
                isActive ? (tab.slug === "home" ? "home" : tab.icon) : (tab.slug === "home" ? "home-outline" : tab.icon),
                20,
                isActive ? theme.primaryContrast : "#9CA3AF"
              )}
              {isActive && (
                <Text 
                  style={{ 
                    color: theme.primaryContrast, 
                    fontFamily: "Outfit_700Bold", 
                    fontSize: 13 
                  }} 
                  className="ml-2"
                >
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

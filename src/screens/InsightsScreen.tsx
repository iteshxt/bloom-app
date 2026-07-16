import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export const InsightsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: theme.text, fontFamily: "Outfit_700Bold", fontSize: 24, marginBottom: 8 }}>
        Insights & Analytics
      </Text>
      <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_400Regular", textAlign: "center", paddingHorizontal: 40 }}>
        This screen will display visual analytics, consistency metrics, and habit heatmaps.
      </Text>
    </View>
  );
};

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, THEMES, ThemeSlug } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

interface ProfileScreenProps {
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const { 
    currentTheme, 
    theme, 
    themeInfo, 
    setTheme, 
    unlockedThemes, 
    currentStreak, 
    updateStreakAndEvaluateThemes 
  } = useTheme();

  const [displayName, setDisplayName] = useState("Jonathan");
  const [partnerCode, setPartnerCode] = useState("bloom-x93a");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={theme.statusBar} />
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        
        {/* Navigation Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity 
            onPress={onBack}
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 }}
            className="w-10 h-10 rounded-full justify-center items-center"
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>
          <Text 
            style={{ color: theme.text, fontFamily: "Outfit_700Bold" }} 
            className="text-xl"
          >
            My Profile
          </Text>
          <View className="w-10" />
        </View>

        {/* Profile Card */}
        <View 
          style={{ 
            backgroundColor: theme.cardBg, 
            borderColor: theme.border, 
            borderWidth: 1,
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2
          }} 
          className="rounded-[32px] p-6 mb-6 items-center"
        >
          {/* Avatar Container */}
          <View className="relative mb-4">
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" }} 
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity 
              style={{ backgroundColor: theme.primary }} 
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full justify-center items-center border-4 border-white"
            >
              <Ionicons name="camera" size={14} color={theme.primaryContrast} />
            </TouchableOpacity>
          </View>

          {/* User Name Info */}
          {isEditing ? (
            <View className="flex-row items-center mb-1">
              <TextInput 
                value={displayName} 
                onChangeText={setDisplayName}
                style={{ 
                  color: theme.text, 
                  fontFamily: "Outfit_600SemiBold", 
                  borderBottomColor: theme.primary, 
                  borderBottomWidth: 2,
                  fontSize: 20,
                  textAlign: "center",
                  minWidth: 120
                }}
              />
              <TouchableOpacity onPress={() => setIsEditing(false)} className="ml-2">
                <Ionicons name="checkmark-circle" size={24} color={theme.accent} />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row items-center mb-1">
              <Text 
                style={{ color: theme.text, fontFamily: "Outfit_700Bold" }} 
                className="text-2xl"
              >
                {displayName}
              </Text>
              <TouchableOpacity onPress={() => setIsEditing(true)} className="ml-2">
                <Ionicons name="create-outline" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          <Text 
            style={{ color: theme.textSecondary, fontFamily: "Outfit_400Regular" }} 
            className="text-sm mb-4"
          >
            LeetCode: @jonathan_dev
          </Text>

          {/* Streak Freeze Token Status */}
          <View 
            style={{ backgroundColor: theme.backgroundSecondary }} 
            className="rounded-2xl px-4 py-3 flex-row items-center w-full justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="snow" size={20} color="#0284C7" style={{ marginRight: 8 }} />
              <View>
                <Text style={{ color: theme.text, fontFamily: "Outfit_600SemiBold" }} className="text-sm">
                  Streak Freeze
                </Text>
                <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_400Regular" }} className="text-xs">
                  Auto-preserves daily misses
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: "#E0F2FE" }} className="rounded-full px-3 py-1">
              <Text style={{ color: "#0284C7", fontFamily: "Outfit_700Bold" }} className="text-sm">
                3 Left
              </Text>
            </View>
          </View>
        </View>

        {/* Partner Connection Card */}
        <View 
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 }} 
          className="rounded-[32px] p-6 mb-6"
        >
          <Text 
            style={{ color: theme.text, fontFamily: "Outfit_700Bold" }} 
            className="text-lg mb-3"
          >
            Account Sync
          </Text>

          <View className="flex-row items-center mb-4">
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" }} 
              className="w-12 h-12 rounded-full mr-3"
            />
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontFamily: "Outfit_600SemiBold" }} className="text-base">
                Sarah
              </Text>
              <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_400Regular" }} className="text-xs">
                Partner Active Since July 2026
              </Text>
            </View>
            <View style={{ backgroundColor: "#DCFCE7" }} className="rounded-full px-3 py-1">
              <Text style={{ color: "#15803D", fontFamily: "Outfit_700Bold" }} className="text-xs">
                ● Active
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between border-t pt-4" style={{ borderTopColor: theme.border }}>
            <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_400Regular" }} className="text-xs">
              Sync ID: {partnerCode}
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="copy-outline" size={14} color={theme.textSecondary} className="mr-1" />
              <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_500Medium" }} className="text-xs">
                Copy
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Customization Section */}
        <View className="mb-6">
          <Text 
            style={{ color: theme.text, fontFamily: "Outfit_700Bold" }} 
            className="text-lg mb-1 px-2"
          >
            Theme Unlocks
          </Text>
          <Text 
            style={{ color: theme.textSecondary, fontFamily: "Outfit_400Regular" }} 
            className="text-xs mb-3 px-2"
          >
            Unlocked automatically via streak milestones. Active: {themeInfo.name}
          </Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="py-1 mb-2"
          >
            {(Object.keys(THEMES) as ThemeSlug[]).map((slug) => {
              const item = THEMES[slug];
              const isUnlocked = unlockedThemes.includes(slug);
              const isActive = currentTheme === slug;

              return (
                <TouchableOpacity
                  key={slug}
                  disabled={!isUnlocked}
                  onPress={() => setTheme(slug)}
                  style={{
                    backgroundColor: isActive ? theme.primary : isUnlocked ? theme.cardBg : theme.backgroundSecondary,
                    borderColor: isActive ? theme.primaryDark : theme.border,
                    borderWidth: 1,
                    opacity: isUnlocked ? 1 : 0.6,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 20,
                    marginRight: 8,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  {/* Small visual color preview dot */}
                  <View 
                    style={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: 5, 
                      backgroundColor: item.colors.primary, 
                      marginRight: 6,
                      borderWidth: 1,
                      borderColor: "rgba(0, 0, 0, 0.15)"
                    }} 
                  />
                  
                  <Text 
                    style={{ 
                      color: isActive ? theme.primaryContrast : theme.text,
                      fontFamily: "Outfit_600SemiBold",
                      fontSize: 13
                    }}
                  >
                    {item.name}
                  </Text>
                  
                  {!isUnlocked ? (
                    <Ionicons 
                      name="lock-closed" 
                      size={11} 
                      color={theme.textSecondary} 
                      style={{ marginLeft: 6 }} 
                    />
                  ) : isActive ? (
                    <Ionicons 
                      name="checkmark" 
                      size={12} 
                      color={theme.primaryContrast} 
                      style={{ marginLeft: 6 }} 
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Simulation Sandbox Card */}
        <View 
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 }} 
          className="rounded-[32px] p-6 mb-6"
        >
          <Text 
            style={{ color: theme.text, fontFamily: "Outfit_700Bold" }} 
            className="text-base mb-1"
          >
            Streak Sandbox Simulator
          </Text>
          <Text 
            style={{ color: theme.textSecondary, fontFamily: "Outfit_400Regular" }} 
            className="text-xs mb-4"
          >
            Modify streak values to unlock themes and preview the lock/unlock UI logic.
          </Text>

          <View className="flex-row items-center justify-between mb-4">
            <Text style={{ color: theme.text, fontFamily: "Outfit_600SemiBold" }} className="text-sm">
              Simulated Streak:
            </Text>
            <Text style={{ color: theme.primaryDark, fontFamily: "Outfit_700Bold" }} className="text-lg">
              {currentStreak} Days
            </Text>
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity 
              onPress={() => updateStreakAndEvaluateThemes(Math.max(0, currentStreak - 15))}
              style={{ backgroundColor: theme.backgroundSecondary }}
              className="rounded-full py-2.5 px-6"
            >
              <Text style={{ color: theme.text, fontFamily: "Outfit_600SemiBold" }} className="text-xs">
                -15 Days
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => updateStreakAndEvaluateThemes(currentStreak + 15)}
              style={{ backgroundColor: theme.primary }}
              className="rounded-full py-2.5 px-6"
            >
              <Text className="text-xs font-bold" style={{ color: theme.primaryContrast, fontFamily: "Outfit_700Bold" }}>
                +15 Days
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

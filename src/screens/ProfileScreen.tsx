import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Image, 
  Alert, 
  Platform,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, THEMES, ThemeSlug } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { Ionicons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const AVATARS = {
  Jonathan: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  Sarah: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
};

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
  const { showToast } = useToast();

  // Profile fields state
  const [displayName, setDisplayName] = useState("Jonathan");
  const [leetcodeUsername, setLeetcodeUsername] = useState("jonathan_dev");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop");
  const [isEditing, setIsEditing] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(4);

  // Temporary inputs during edit mode
  const [tempName, setTempName] = useState(displayName);
  const [tempLeetcode, setTempLeetcode] = useState(leetcodeUsername);
  const [tempAvatar, setTempAvatar] = useState(avatarUrl);

  // Sync / Partner state
  const [isPartnerConnected, setIsPartnerConnected] = useState(true);
  const [partnerCode, setPartnerCode] = useState("");
  const [syncId, setSyncId] = useState("");

  // Generate unique 4-character alpha-numeric suffix sync ID on mount
  useEffect(() => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randCode = "";
    for (let i = 0; i < 4; i++) {
      randCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSyncId(`bloom-${randCode}`);
  }, []);

  const handleSaveProfile = () => {
    if (tempName.trim() === "") {
      showToast("Name cannot be empty.", "error");
      return;
    }
    setDisplayName(tempName);
    setLeetcodeUsername(tempLeetcode);
    setAvatarUrl(tempAvatar);
    setIsEditing(false);
  };

  const handleDisconnectPartner = () => {
    Alert.alert(
      "Disconnect Partner",
      "Are you sure you want to unlink your account from Sarah? Your shared garden stats will be paused.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Disconnect", 
          style: "destructive",
          onPress: () => {
            setIsPartnerConnected(false);
            showToast("Partner disconnected.", "success");
          } 
        }
      ]
    );
  };

  const handleConnectPartner = () => {
    if (partnerCode.trim().length < 4) {
      showToast("Please enter a valid 6-character partner invite code.", "error");
      return;
    }
    setIsPartnerConnected(true);
    setPartnerCode("");
    showToast("Connected! You are now linked with Sarah's garden!", "success");
  };

  // Determine active font fallback based on theme
  const getFontFamily = (weight: "Regular" | "Medium" | "Bold") => {
    switch (weight) {
      case "Regular": return theme.fontFamilyRegular;
      case "Medium": return theme.fontFamilyMedium;
      case "Bold": return theme.fontFamilyBold;
    }
  };

  // Border layout overrides
  const cardStyle = {
    backgroundColor: theme.cardBg, 
    borderColor: theme.border, 
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadiusCard,
    padding: 24,
    marginBottom: 20,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: currentTheme === "mario" ? 0 : 0.05,
    shadowRadius: 10,
    elevation: currentTheme === "mario" ? 0 : 2
  };

  const buttonStyle = {
    borderRadius: theme.borderRadiusButton,
    borderWidth: theme.borderWidth,
    borderColor: currentTheme === "mario" ? "#000000" : "transparent"
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <StatusBar style={theme.statusBar} />
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        
        {/* Navigation Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity 
            onPress={onBack}
            style={{ 
              backgroundColor: theme.cardBg, 
              borderColor: theme.border, 
              borderWidth: theme.borderWidth,
              borderRadius: theme.borderRadiusButton 
            }}
            className="w-10 h-10 justify-center items-center"
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>
          <Text 
            style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
            className="text-xl"
          >
            My Profile
          </Text>
          <View className="w-10" />
        </View>

        {/* Profile Card */}
        <View style={cardStyle} className="items-center">
          {/* Avatar Container */}
          <View className="relative mb-4">
            <Image 
              source={{ uri: isEditing ? tempAvatar : avatarUrl }} 
              className="w-24 h-24 rounded-full"
              style={{ borderRadius: currentTheme === "mario" ? 0 : 48 }}
            />
            {isEditing && (
              <View 
                style={{ backgroundColor: theme.primary }} 
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full justify-center items-center border-4 border-white"
              >
                <Ionicons name="camera" size={14} color={theme.primaryContrast} />
              </View>
            )}
          </View>

          {/* Editable Name & Info */}
          {isEditing ? (
            <View className="w-full">
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 12, marginBottom: 4 }}>
                Display Name
              </Text>
              <TextInput 
                value={tempName} 
                onChangeText={setTempName}
                style={{ 
                  color: theme.text, 
                  fontFamily: getFontFamily("Medium"), 
                  borderColor: theme.border, 
                  borderWidth: theme.borderWidth,
                  borderRadius: theme.borderRadiusButton,
                  backgroundColor: theme.background,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  fontSize: 16,
                  marginBottom: 12
                }}
              />

              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 12, marginBottom: 4 }}>
                LeetCode Profile Handle
              </Text>
              <TextInput 
                value={tempLeetcode} 
                onChangeText={setTempLeetcode}
                style={{ 
                  color: theme.text, 
                  fontFamily: getFontFamily("Medium"), 
                  borderColor: theme.border, 
                  borderWidth: theme.borderWidth,
                  borderRadius: theme.borderRadiusButton,
                  backgroundColor: theme.background,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  fontSize: 14,
                  marginBottom: 12
                }}
              />

              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 12, marginBottom: 4 }}>
                Avatar Image URL
              </Text>
              <TextInput 
                value={tempAvatar} 
                onChangeText={setTempAvatar}
                style={{ 
                  color: theme.text, 
                  fontFamily: getFontFamily("Medium"), 
                  borderColor: theme.border, 
                  borderWidth: theme.borderWidth,
                  borderRadius: theme.borderRadiusButton,
                  backgroundColor: theme.background,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  fontSize: 12,
                  marginBottom: 16
                }}
              />

              <View className="flex-row justify-between">
                <TouchableOpacity 
                  onPress={() => setIsEditing(false)}
                  style={{ backgroundColor: theme.backgroundSecondary, ...buttonStyle }}
                  className="flex-1 py-2.5 rounded-full items-center mr-2"
                >
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 13 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleSaveProfile}
                  style={{ backgroundColor: theme.primary, ...buttonStyle }}
                  className="flex-1 py-2.5 rounded-full items-center ml-2"
                >
                  <Text style={{ color: theme.primaryContrast, fontFamily: getFontFamily("Bold"), fontSize: 13 }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="items-center w-full">
              <View className="flex-row items-center justify-center mb-1">
                <Text 
                  style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
                  className="text-2xl"
                >
                  {displayName}
                </Text>
                <TouchableOpacity 
                  onPress={() => {
                    setTempName(displayName);
                    setTempLeetcode(leetcodeUsername);
                    setTempAvatar(avatarUrl);
                    setIsEditing(true);
                  }} 
                  className="ml-2"
                >
                  <Ionicons name="create-outline" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text 
                style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular") }} 
                className="text-sm mb-4"
              >
                LeetCode: @{leetcodeUsername}
              </Text>

              {/* Stats highlights */}
              <View className="flex-row justify-between w-full mb-5">
                <View style={{ backgroundColor: theme.background, flex: 1, marginRight: 6, paddingVertical: 12, borderRadius: theme.borderRadiusButton, alignItems: "center" }}>
                  <Ionicons name="flame" size={18} color="#FF6D00" />
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 15, marginTop: 4 }}>{currentStreak}d</Text>
                  <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9 }}>Streak</Text>
                </View>
                <View style={{ backgroundColor: theme.background, flex: 1, marginHorizontal: 3, paddingVertical: 12, borderRadius: theme.borderRadiusButton, alignItems: "center" }}>
                  <Ionicons name="time" size={18} color={theme.primary} />
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 15, marginTop: 4 }}>107.5h</Text>
                  <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9 }}>Focused</Text>
                </View>
                <View style={{ backgroundColor: theme.background, flex: 1, marginLeft: 6, paddingVertical: 12, borderRadius: theme.borderRadiusButton, alignItems: "center" }}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.accent} />
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 15, marginTop: 4 }}>254</Text>
                  <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9 }}>Tasks</Text>
                </View>
              </View>

              {/* Streak Freeze Slots */}
              <View 
                style={{ backgroundColor: theme.backgroundSecondary }} 
                className="rounded-2xl p-4 w-full"
              >
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 13, marginBottom: 8 }}>
                  Streak Protection
                </Text>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row">
                    {[1, 2, 3].map((slot) => (
                      <View 
                        key={slot} 
                        style={{ 
                          backgroundColor: slot <= 3 ? `${theme.primary}20` : theme.background, 
                          borderColor: slot <= 3 ? theme.primary : theme.border, 
                          borderWidth: 1 
                        }} 
                        className="w-10 h-10 rounded-full justify-center items-center mr-2"
                      >
                        <Ionicons name="snow" size={18} color={slot <= 3 ? theme.primary : theme.textSecondary} />
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity 
                    onPress={() => showToast("Your streak auto-freezes when missing a daily task!", "success")}
                    style={{ borderColor: theme.primary, borderWidth: 1 }}
                    className="px-3.5 py-1.5 rounded-full"
                  >
                    <Text style={{ color: theme.primary, fontFamily: getFontFamily("Bold"), fontSize: 10 }}>3 Active</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Account Sync Card */}
        <View style={cardStyle}>
          <Text 
            style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
            className="text-lg mb-3"
          >
            Account Sync
          </Text>

          {isPartnerConnected ? (
            <View className="items-center py-2">
              <View className="flex-row items-center justify-center mb-4">
                {/* User Avatar */}
                <View className="relative">
                  <Image source={{ uri: avatarUrl }} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" style={{ borderRadius: currentTheme === "mario" ? 0 : 32 }} />
                  <View style={{ backgroundColor: theme.primary }} className="absolute bottom-0 right-0 w-5 h-5 rounded-full justify-center items-center border border-white">
                    <Ionicons name="person" size={10} color={theme.primaryContrast} />
                  </View>
                </View>
                
                {/* Connecting Line and Link Badge */}
                <View className="items-center px-4 relative justify-center">
                  <View style={{ height: 2, width: 60, borderStyle: "dashed", borderWidth: 1, borderColor: theme.accent, opacity: 0.5 }} />
                  <View style={{ backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: theme.borderWidth }} className="absolute w-8 h-8 rounded-full justify-center items-center shadow-sm">
                    <Ionicons name="swap-horizontal" size={14} color={theme.accent} />
                  </View>
                </View>

                {/* Partner Avatar */}
                <View className="relative">
                  <Image source={{ uri: AVATARS.Sarah }} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" style={{ borderRadius: currentTheme === "mario" ? 0 : 32 }} />
                  <View style={{ backgroundColor: theme.accent }} className="absolute bottom-0 right-0 w-5 h-5 rounded-full justify-center items-center border border-white">
                    <Ionicons name="people" size={10} color="#FFFFFF" />
                  </View>
                </View>
              </View>

              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 14 }}>
                Synced with Sarah
              </Text>
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 11, marginTop: 4, marginBottom: 16 }}>
                Co-working active since July 2026
              </Text>

              <View className="flex-row justify-between items-center w-full border-t pt-4" style={{ borderTopColor: theme.border }}>
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 11 }}>
                  ID: bloom-x93a
                </Text>
                <TouchableOpacity 
                  onPress={handleDisconnectPartner}
                  style={{ backgroundColor: `${theme.warning}15`, paddingHorizontal: 16, paddingVertical: 8, ...buttonStyle }}
                  className="rounded-full"
                >
                  <Text style={{ color: theme.warning, fontFamily: getFontFamily("Bold"), fontSize: 11 }}>
                    Disconnect Partner
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 13, marginBottom: 12, lineHeight: 18 }}>
                You are currently not connected to any partner. Sync to study, verify LeetCode tasks, and grow streaks together!
              </Text>
              
              <View className="bg-gray-100 rounded-xl p-3 mb-4 flex-row justify-between items-center" style={{ backgroundColor: theme.background }}>
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 13 }}>
                  Your Code: {syncId}
                </Text>
                <TouchableOpacity className="flex-row items-center">
                  <Feather name="copy" size={14} color={theme.textSecondary} />
                  <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 11, marginLeft: 4 }}>Copy</Text>
                </TouchableOpacity>
              </View>

              {/* Input for connecting */}
              <View className="flex-row">
                <TextInput
                  value={partnerCode}
                  onChangeText={setPartnerCode}
                  placeholder="Enter partner invite code"
                  placeholderTextColor="#9CA3AF"
                  style={{ 
                    flex: 1.5,
                    backgroundColor: theme.background, 
                    color: theme.text, 
                    fontFamily: getFontFamily("Medium"),
                    borderColor: theme.border, 
                    borderWidth: theme.borderWidth,
                    borderRadius: theme.borderRadiusButton,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    fontSize: 12
                  }}
                />
                <TouchableOpacity
                  onPress={handleConnectPartner}
                  style={{ backgroundColor: theme.primary, flex: 1, ...buttonStyle }}
                  className="py-3 rounded-full items-center justify-center"
                >
                  <Text style={{ color: theme.primaryContrast, fontFamily: getFontFamily("Bold"), fontSize: 11 }}>
                    Connect
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Theme Customization Section */}
        <View className="mb-6">
          <Text 
            style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
            className="text-lg mb-1 px-2"
          >
            Theme Unlocks
          </Text>
          <Text 
            style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular") }} 
            className="text-xs mb-4 px-2"
          >
            Switch styles dynamically. Unlocked via streak milestones.
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
                    backgroundColor: isActive ? theme.primary : isUnlocked ? theme.cardBg : `${theme.border}10`,
                    borderColor: isActive ? theme.primaryDark : theme.border,
                    borderWidth: theme.borderWidth,
                    borderRadius: theme.borderRadiusCard,
                    opacity: isUnlocked ? 1 : 0.65,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginRight: 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: 140,
                    height: 125,
                    shadowColor: isActive ? theme.primary : theme.text,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isActive ? 0.08 : 0.02,
                    shadowRadius: 6,
                    elevation: 1
                  }}
                >
                  {/* 3 Color Preview Dots */}
                  <View className="flex-row justify-center mb-2.5">
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: item.colors.primary, marginRight: 4, borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" }} />
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: item.colors.background, marginRight: 4, borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" }} />
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: item.colors.backgroundSecondary, borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" }} />
                  </View>

                  <Text 
                    style={{ 
                      color: isActive ? theme.primaryContrast : theme.text,
                      fontFamily: getFontFamily("Bold"),
                      fontSize: 12,
                      textAlign: "center"
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <View className="flex-row items-center mt-1">
                    {isUnlocked ? (
                      isActive ? (
                        <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }} className="flex-row items-center">
                          <Ionicons name="checkmark-circle" size={12} color={theme.primaryContrast} />
                          <Text style={{ color: theme.primaryContrast, fontFamily: getFontFamily("Bold"), fontSize: 9, marginLeft: 3 }}>Active</Text>
                        </View>
                      ) : (
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 10 }}>Unlocked</Text>
                      )
                    ) : (
                      <View className="flex-row items-center">
                        <Ionicons name="lock-closed" size={11} color={theme.textSecondary} />
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9, marginLeft: 3 }}>{item.milestone}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Daily Focus Goal */}
        <View style={cardStyle}>
          <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} className="text-lg mb-2">
            Daily Focus Goal
          </Text>
          <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 11, marginBottom: 12 }}>
            Set your target daily focus duration.
          </Text>
          <View className="flex-row justify-between">
            {[1, 2, 4, 6].map((hours) => {
              const isGoal = dailyGoal === hours;
              return (
                <TouchableOpacity 
                  key={hours} 
                  onPress={() => {
                    setDailyGoal(hours);
                    showToast(`Daily focus target set to ${hours} hours!`, "success");
                  }}
                  style={{ 
                    backgroundColor: isGoal ? theme.primary : theme.background,
                    borderColor: isGoal ? theme.primaryDark : theme.border,
                    borderWidth: 1,
                    borderRadius: theme.borderRadiusButton
                  }}
                  className="flex-1 py-2 mx-1 items-center justify-center"
                >
                  <Text style={{ color: isGoal ? theme.primaryContrast : theme.text, fontFamily: getFontFamily("Bold"), fontSize: 12 }}>
                    {hours}h
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Connected Services */}
        <View style={cardStyle}>
          <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} className="text-lg mb-3">
            Connected Services
          </Text>
          <View>
            {/* LeetCode Row */}
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Ionicons name="code-slash" size={18} color="#E7A43F" style={{ marginRight: 10 }} />
                <View>
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 13 }}>LeetCode Sync</Text>
                  <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 10 }}>@{leetcodeUsername}</Text>
                </View>
              </View>
              <View style={{ backgroundColor: `${theme.accent}15` }} className="px-2.5 py-1 rounded-full">
                <Text style={{ color: theme.primary, fontFamily: getFontFamily("Bold"), fontSize: 9 }}>Connected</Text>
              </View>
            </View>

            {/* GitHub Row */}
            <View className="flex-row items-center justify-between py-3 border-t" style={{ borderTopColor: theme.border }}>
              <View className="flex-row items-center">
                <Ionicons name="logo-github" size={18} color={theme.text} style={{ marginRight: 10 }} />
                <View>
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 13 }}>GitHub Commit Sync</Text>
                  <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 10 }}>Verify coding tasks via commits</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => showToast("GitHub linked successfully!", "success")}
                style={{ borderColor: theme.border, borderWidth: 1, borderRadius: theme.borderRadiusButton }} 
                className="px-2.5 py-1"
              >
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 9 }}>Link</Text>
              </TouchableOpacity>
            </View>

            {/* Spotify Row */}
            <View className="flex-row items-center justify-between py-3 border-t" style={{ borderTopColor: theme.border }}>
              <View className="flex-row items-center">
                <Ionicons name="musical-notes" size={18} color="#1DB954" style={{ marginRight: 10 }} />
                <View>
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 13 }}>Spotify Session Play</Text>
                  <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 10 }}>Sync background tracks</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => showToast("Spotify linked successfully!", "success")}
                style={{ borderColor: theme.border, borderWidth: 1, borderRadius: theme.borderRadiusButton }} 
                className="px-2.5 py-1"
              >
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 9 }}>Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Streak Sandbox Simulator */}
        <View style={cardStyle}>
          <Text 
            style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
            className="text-base mb-1"
          >
            Streak Sandbox Simulator
          </Text>
          <Text 
            style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular") }} 
            className="text-xs mb-4"
          >
            Modify streak values in 5-day increments to unlock themes.
          </Text>

          <View className="flex-row items-center justify-between mb-4">
            <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium") }} className="text-sm">
              Simulated Streak:
            </Text>
            <Text style={{ color: theme.primaryDark, fontFamily: getFontFamily("Bold") }} className="text-lg">
              {currentStreak} Days
            </Text>
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity 
              onPress={() => updateStreakAndEvaluateThemes(Math.max(0, currentStreak - 5))}
              style={{ backgroundColor: theme.backgroundSecondary, ...buttonStyle }}
              className="rounded-full py-2.5 px-6"
            >
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} className="text-xs">
                -5 Days
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => updateStreakAndEvaluateThemes(currentStreak + 5)}
              style={{ backgroundColor: theme.primary, ...buttonStyle }}
              className="rounded-full py-2.5 px-6"
            >
              <Text style={{ color: theme.primaryContrast, fontFamily: getFontFamily("Bold") }} className="text-xs">
                +5 Days
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Google Sync and Sign-Out Button */}
        <View style={cardStyle} className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="logo-google" size={18} color="#EA4335" style={{ marginRight: 8 }} />
            <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 13 }}>
              Google Connected
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => showToast("You have successfully signed out.", "success")}
            style={{ 
              backgroundColor: `${theme.warning}15`, 
              borderRadius: theme.borderRadiusButton,
              borderWidth: currentTheme === "mario" ? theme.borderWidth : 1, 
              borderColor: currentTheme === "mario" ? "#000000" : theme.warning
            }}
            className="px-5 py-2 rounded-full"
          >
            <Text style={{ color: theme.warning, fontFamily: getFontFamily("Bold"), fontSize: 11 }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

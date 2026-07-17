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

  // Profile fields state
  const [displayName, setDisplayName] = useState("Jonathan");
  const [leetcodeUsername, setLeetcodeUsername] = useState("jonathan_dev");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop");
  const [isEditing, setIsEditing] = useState(false);

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
      Alert.alert("Error", "Name cannot be empty.");
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
          } 
        }
      ]
    );
  };

  const handleConnectPartner = () => {
    if (partnerCode.trim().length < 4) {
      Alert.alert("Error", "Please enter a valid 6-character partner invite code.");
      return;
    }
    setIsPartnerConnected(true);
    setPartnerCode("");
    Alert.alert("Connected!", "You are now linked with Sarah's garden!");
  };

  // Determine active font fallback based on theme
  const getFontFamily = (weight: "Regular" | "Medium" | "Bold") => {
    const isRetro = currentTheme === "retro" || currentTheme === "mario";
    if (isRetro) {
      return Platform.OS === "ios" ? "Courier-Bold" : "monospace";
    }
    switch (weight) {
      case "Regular": return "Outfit_400Regular";
      case "Medium": return "Outfit_500Medium";
      case "Bold": return "Outfit_700Bold";
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

              {/* Streak Freeze Token Status */}
              <View 
                style={{ backgroundColor: theme.backgroundSecondary }} 
                className="rounded-2xl px-4 py-3 flex-row items-center w-full justify-between"
              >
                <View className="flex-row items-center">
                  <Ionicons name="snow" size={20} color="#0284C7" style={{ marginRight: 8 }} />
                  <View>
                    <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium") }} className="text-sm">
                      Streak Freeze
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular") }} className="text-xs">
                      Auto-preserves daily misses
                    </Text>
                  </View>
                </View>
                <View style={{ backgroundColor: "#E0F2FE" }} className="rounded-full px-3 py-1">
                  <Text style={{ color: "#0284C7", fontFamily: getFontFamily("Bold") }} className="text-sm">
                    3 Left
                  </Text>
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
            <View>
              <View className="flex-row items-center mb-4">
                <Image 
                  source={{ uri: AVATARS.Sarah }} 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium") }} className="text-base">
                    Sarah
                  </Text>
                  <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular") }} className="text-xs">
                    Partner Active Since July 2026
                  </Text>
                </View>
                <View style={{ backgroundColor: "#DCFCE7" }} className="rounded-full px-3 py-1">
                  <Text style={{ color: "#15803D", fontFamily: getFontFamily("Bold") }} className="text-xs">
                    ● Active
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between border-t pt-4" style={{ borderTopColor: theme.border }}>
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular") }} className="text-xs">
                  Sync ID: bloom-x93a
                </Text>
                <TouchableOpacity 
                  onPress={handleDisconnectPartner}
                  style={{ backgroundColor: `${theme.warning}15`, paddingHorizontal: 12, paddingVertical: 6, ...buttonStyle }}
                  className="rounded-full"
                >
                  <Text style={{ color: theme.warning, fontFamily: getFontFamily("Bold"), fontSize: 10 }}>
                    Disconnect
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
            Unlocked automatically via weekly milestones (5-day intervals).
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
                    borderWidth: theme.borderWidth,
                    borderRadius: theme.borderRadiusButton,
                    opacity: isUnlocked ? 1 : 0.6,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginRight: 8,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
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
                      fontFamily: getFontFamily("Medium"),
                      fontSize: 13
                    }}
                  >
                    {item.name} ({item.milestone})
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
            onPress={() => Alert.alert("Signed Out", "You have successfully signed out.")}
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

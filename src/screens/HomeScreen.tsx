import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert, Animated } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

interface HomeScreenProps {
  onNavigateToProfile: () => void;
}

interface Mission {
  id: string;
  name: string;
  category: string;
  goalValue: number;
  unit: string;
  verificationType: "manual" | "timer" | "leetcode";
  color: string;
  completed: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToProfile }) => {
  const { theme, currentStreak } = useTheme();

  // Mock Missions/Habits state
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "1",
      name: "Solve 2 DSA Questions",
      category: "LeetCode",
      goalValue: 2,
      unit: "problems",
      verificationType: "leetcode",
      color: theme.accent, // Sage green or accent
      completed: true,
    },
    {
      id: "2",
      name: "Strength Training Workout",
      category: "Fitness",
      goalValue: 60,
      unit: "minutes",
      verificationType: "manual",
      color: theme.warning, // Peach coral or warning
      completed: false,
    },
    {
      id: "3",
      name: "Read 10 Pages",
      category: "Growth",
      goalValue: 10,
      unit: "pages",
      verificationType: "manual",
      color: theme.primary, // Theme primary
      completed: false,
    },
  ]);

  // Mock Reflection notes state
  const [reflectionText, setReflectionText] = useState("");
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);

  // Mock Partner Active Status
  const [partnerStatus, setPartnerStatus] = useState<"Studying" | "On Break" | "Idle" | "Offline">("Studying");

  // Toggle mission completion with micro-interactivity
  const toggleMission = (id: string) => {
    setMissions(prev =>
      prev.map(mission =>
        mission.id === id ? { ...mission, completed: !mission.completed } : mission
      )
    );
  };

  const completedCount = missions.filter(m => m.completed).length;

  const handleSaveReflection = () => {
    if (reflectionText.trim() === "") return;
    setIsReflectionSaved(true);
    setTimeout(() => {
      setIsReflectionSaved(false);
      setReflectionText("");
      Alert.alert("Reflections Saved!", "Your daily thought has been synced with your partner.");
    }, 1500);
  };

  // Mock weekly focus bar heights (in percentages)
  const weeklyData = [
    { day: "M", height: "40%", active: false },
    { day: "T", height: "60%", active: false },
    { day: "W", height: "80%", active: false },
    { day: "T", height: "95%", active: true }, // Today
    { day: "F", height: "30%", active: false },
    { day: "S", height: "0%", active: false },
    { day: "S", height: "0%", active: false },
  ];

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 110, paddingTop: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Row */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={onNavigateToProfile}
            style={{ 
              borderColor: theme.border, 
              borderWidth: 1.5,
              shadowColor: theme.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}
            className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-white"
          >
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" }} 
              className="w-full h-full"
            />
          </TouchableOpacity>
          <View>
            <Text 
              style={{ color: theme.textSecondary, fontFamily: "Outfit_500Medium" }} 
              className="text-xs uppercase tracking-wider"
            >
              Welcome back
            </Text>
            <Text 
              style={{ color: theme.text, fontFamily: "Outfit_700Bold" }} 
              className="text-lg"
            >
              Jonathan
            </Text>
          </View>
        </View>

        {/* Freeze Tokens Badge */}
        <TouchableOpacity 
          onPress={onNavigateToProfile}
          style={{ backgroundColor: "#E0F2FE", borderColor: "#BAE6FD", borderWidth: 1 }} 
          className="rounded-full px-3.5 py-1.5 flex-row items-center"
        >
          <Ionicons name="snow" size={13} color="#0284C7" style={{ marginRight: 4 }} />
          <Text 
            style={{ color: "#0284C7", fontFamily: "Outfit_700Bold" }} 
            className="text-xs"
          >
            3 Freezes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero Overview Card - Combined Streak & Live Partner Status */}
      <View 
        style={{ 
          backgroundColor: theme.cardBg, 
          borderColor: theme.border, 
          borderWidth: 1,
          shadowColor: theme.text,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.04,
          shadowRadius: 16,
          elevation: 2
        }} 
        className="rounded-[40px] p-6 mb-6"
      >
        <View className="flex-row items-center justify-between">
          {/* Streak Details (Left) */}
          <View style={{ flex: 1.1 }}>
            <Text 
              style={{ color: theme.textSecondary, fontFamily: "Outfit_500Medium" }} 
              className="text-xs uppercase tracking-wider mb-1"
            >
              Consistency Streak
            </Text>
            <View className="flex-row items-center mb-1">
              <Ionicons name="flame" size={28} color="#FF6D00" style={{ marginRight: 6 }} />
              <Text 
                style={{ color: theme.text, fontFamily: "Outfit_700Bold" }} 
                className="text-3xl"
              >
                {currentStreak}
              </Text>
            </View>
            <Text 
              style={{ color: theme.textSecondary, fontFamily: "Outfit_400Regular" }} 
              className="text-xs"
            >
              {currentStreak > 0 ? "You're growing great!" : "Start checking off habits today!"}
            </Text>
          </View>

          {/* Vertical divider */}
          <View className="w-[1px] h-12 mx-2 bg-gray-200" style={{ backgroundColor: theme.border }} />

          {/* Partner Status Details (Right) */}
          <View style={{ flex: 1.2, alignItems: "flex-end" }}>
            <Text 
              style={{ color: theme.textSecondary, fontFamily: "Outfit_500Medium" }} 
              className="text-xs uppercase tracking-wider mb-1.5"
            >
              Sarah's Garden
            </Text>

            <TouchableOpacity 
              onPress={() => {
                // Cycle partner status just for fun mock interactivity!
                const statuses: ("Studying" | "On Break" | "Idle" | "Offline")[] = ["Studying", "On Break", "Idle", "Offline"];
                const nextIdx = (statuses.indexOf(partnerStatus) + 1) % statuses.length;
                setPartnerStatus(statuses[nextIdx]);
              }}
              className="flex-row items-center"
            >
              <View className="mr-2 items-end">
                <Text style={{ color: theme.text, fontFamily: "Outfit_600SemiBold" }} className="text-sm">
                  Sarah
                </Text>
                
                {/* Status Indicator */}
                <View className="flex-row items-center mt-0.5">
                  <View 
                    style={{ 
                      backgroundColor: 
                        partnerStatus === "Studying" ? theme.accent : 
                        partnerStatus === "On Break" ? theme.primary : 
                        partnerStatus === "Idle" ? "#D99B26" : "#A0A0A0" 
                    }} 
                    className="w-2 h-2 rounded-full mr-1.5 animate-pulse" 
                  />
                  <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_500Medium" }} className="text-xs">
                    {partnerStatus}
                  </Text>
                </View>
              </View>

              <View className="w-10 h-10 rounded-full overflow-hidden border border-white">
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" }} 
                  className="w-full h-full"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dynamic Focus status message */}
        {partnerStatus === "Studying" && (
          <View 
            style={{ backgroundColor: `${theme.accent}12` }} 
            className="rounded-2xl p-3 mt-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="book" size={16} color={theme.accent} style={{ marginRight: 6 }} />
              <Text style={{ color: theme.accent, fontFamily: "Outfit_500Medium" }} className="text-xs">
                Sarah is studying "DSA Graph Algorithms"
              </Text>
            </View>
            <Text style={{ color: theme.accent, fontFamily: "Outfit_700Bold" }} className="text-xs">
              24m Left
            </Text>
          </View>
        )}
      </View>

      {/* Today's Missions List Section */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-4 px-2">
          <View>
            <Text 
              style={{ color: theme.text, fontFamily: "Outfit_700Bold" }} 
              className="text-xl"
            >
              Today's Missions
            </Text>
            <Text 
              style={{ color: theme.textSecondary, fontFamily: "Outfit_500Medium" }} 
              className="text-xs"
            >
              {completedCount} of {missions.length} completed
            </Text>
          </View>

          <TouchableOpacity 
            style={{ borderColor: theme.border, borderWidth: 1 }}
            className="flex-row items-center bg-white rounded-full px-3 py-1.5"
            onPress={() => {
              Alert.prompt("Add Custom Mission", "Enter habit details", [
                { text: "Cancel" },
                { 
                  text: "Add", 
                  onPress: (val?: string) => {
                    if (val) {
                      setMissions(prev => [
                        ...prev,
                        {
                          id: Date.now().toString(),
                          name: val,
                          category: "Custom",
                          goalValue: 1,
                          unit: "times",
                          verificationType: "manual",
                          color: theme.primary,
                          completed: false
                        }
                      ]);
                    }
                  } 
                }
              ]);
            }}
          >
            <Ionicons name="add" size={16} color={theme.text} className="mr-0.5" />
            <Text style={{ color: theme.text, fontFamily: "Outfit_600SemiBold" }} className="text-xs">
              Habit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mission Cards */}
        <View>
          {missions.map((mission) => (
            <TouchableOpacity
              key={mission.id}
              activeOpacity={0.8}
              onPress={() => toggleMission(mission.id)}
              style={{ 
                backgroundColor: theme.cardBg, 
                borderColor: theme.border, 
                borderWidth: 1,
              }}
              className="rounded-3xl p-5 mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 pr-4">
                {/* Left decorative color bar */}
                <View 
                  style={{ backgroundColor: mission.color }} 
                  className="w-1.5 h-10 rounded-full mr-3.5"
                />
                
                <View className="flex-1">
                  {/* Category Badge */}
                  <View className="flex-row mb-1">
                    <View 
                      style={{ backgroundColor: `${mission.color}15` }} 
                      className="px-2 py-0.5 rounded-full"
                    >
                      <Text 
                        style={{ color: mission.color, fontFamily: "Outfit_600SemiBold", fontSize: 9 }}
                        className="uppercase tracking-wider"
                      >
                        {mission.category}
                      </Text>
                    </View>
                    
                    {mission.verificationType === "leetcode" && (
                      <View className="bg-amber-50 px-2 py-0.5 rounded-full ml-1.5 flex-row items-center">
                        <Ionicons name="flash" size={10} color="#D99B26" style={{ marginRight: 2 }} />
                        <Text style={{ color: "#D99B26", fontFamily: "Outfit_600SemiBold", fontSize: 9 }}>
                          AUTO-VERIFIED
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text 
                    style={{ 
                      color: mission.completed ? theme.textSecondary : theme.text,
                      fontFamily: "Outfit_600SemiBold",
                      textDecorationLine: mission.completed ? "line-through" : "none"
                    }} 
                    className="text-base"
                  >
                    {mission.name}
                  </Text>
                </View>
              </View>

              {/* Checkbox Trigger */}
              <View 
                style={{ 
                  width: 28, 
                  height: 28, 
                  borderRadius: 14, 
                  borderWidth: 2, 
                  borderColor: mission.completed ? mission.color : theme.border,
                  backgroundColor: mission.completed ? mission.color : "transparent",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {mission.completed && (
                  <Ionicons name="checkmark" size={16} color={theme.primaryContrast} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Weekly Progress Analytics Preview */}
      <View 
        style={{ backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 }} 
        className="rounded-[40px] p-6 mb-6"
      >
        <Text 
          style={{ color: theme.text, fontFamily: "Outfit_700Bold" }} 
          className="text-base mb-1"
        >
          Weekly Activity
        </Text>
        <Text 
          style={{ color: theme.textSecondary, fontFamily: "Outfit_400Regular" }} 
          className="text-xs mb-6"
        >
          Aggregated focus hours logged by you and Sarah.
        </Text>

        {/* Bar Chart Representation */}
        <View className="flex-row items-end justify-between h-28 px-1 mb-2">
          {weeklyData.map((item, idx) => (
            <View key={idx} className="items-center flex-1">
              {/* Vertical Bar */}
              <View 
                style={{ backgroundColor: theme.backgroundSecondary }} 
                className="w-3.5 h-full rounded-full justify-end"
              >
                <View 
                  style={{ 
                    height: item.height as any, 
                    backgroundColor: item.active ? theme.primary : theme.primaryDark,
                    shadowColor: item.active ? theme.primary : "transparent",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                  }} 
                  className="w-full rounded-full"
                />
              </View>
              
              {/* Day Label */}
              <Text 
                style={{ 
                  color: item.active ? theme.text : theme.textSecondary, 
                  fontFamily: item.active ? "Outfit_700Bold" : "Outfit_500Medium" 
                }} 
                className="text-[10px] mt-2"
              >
                {item.day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Daily Thoughts / Reflection Notepad */}
      <View 
        style={{ backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: 1 }} 
        className="rounded-[40px] p-6"
      >
        <Text 
          style={{ color: theme.text, fontFamily: "Outfit_700Bold" }} 
          className="text-base mb-1"
        >
          Daily Reflection
        </Text>
        <Text 
          style={{ color: theme.textSecondary, fontFamily: "Outfit_400Regular" }} 
          className="text-xs mb-4"
        >
          Share your daily wins, thoughts, or what you learned with Sarah.
        </Text>

        <TextInput
          placeholder="What did you focus on today? Any milestones reached?"
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={3}
          value={reflectionText}
          onChangeText={setReflectionText}
          style={{ 
            backgroundColor: theme.background, 
            color: theme.text, 
            fontFamily: "Outfit_400Regular", 
            borderWidth: 1, 
            borderColor: theme.border,
            textAlignVertical: "top"
          }}
          className="rounded-2xl p-4 min-h-[80px] text-sm mb-4 leading-5"
        />

        <TouchableOpacity
          disabled={reflectionText.trim() === "" || isReflectionSaved}
          onPress={handleSaveReflection}
          style={{ 
            backgroundColor: reflectionText.trim() === "" ? theme.backgroundSecondary : theme.primary,
            opacity: isReflectionSaved ? 0.7 : 1
          }}
          className="rounded-full py-3 items-center justify-center"
        >
          <Text 
            style={{ 
              color: reflectionText.trim() === "" ? theme.textSecondary : theme.primaryContrast, 
              fontFamily: "Outfit_700Bold" 
            }} 
            className="text-sm font-bold"
          >
            {isReflectionSaved ? "Syncing..." : "Publish Reflection"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

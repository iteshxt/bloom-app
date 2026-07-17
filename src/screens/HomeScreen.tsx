import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput, 
  Alert, 
  Modal, 
  Switch,
  Platform,
  Dimensions,
  NativeModules
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTasks, Task } from "../contexts/TasksContext";
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withSequence,
  runOnJS
} from "react-native-reanimated";

interface HomeScreenProps {
  onNavigateToProfile: () => void;
}

// Floating Heart Object Interface
interface FloatingHeart {
  id: string;
  x: number;
  color: string;
  size: number;
}

const CHEER_MESSAGES = {
  Nudge: [
    "Hey! Just checking in, let's focus up! ⏰",
    "Time for a study sprint! You've got this! 🚀",
    "Let's crush this hour together! 👊"
  ],
  Heart: [
    "You're doing amazing! So proud of you! 💛",
    "Sending you warm vibes and focus energy! ✨",
    "Keep shining, you're doing great! 🌟"
  ],
  Coffee: [
    "Take a sip of coffee/tea and keep growing! ☕",
    "Sending a virtual caffeine boost! ⚡",
    "Remember to take a deep breath and stretch! 🧘"
  ],
  Celebrate: [
    "Awesome job completing that task! 🎉",
    "Double focus power! We are unstoppable! 🙌",
    "Celebrating your hard work today! 🥳"
  ]
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToProfile }) => {
  const { theme, currentTheme, currentStreak } = useTheme();
  const { tasks, addTask, toggleTask } = useTasks();

  // Partner Active Status
  const [partnerStatus, setPartnerStatus] = useState<"Studying" | "On Break" | "Idle" | "Offline">("Studying");
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Sync partner status to native widget when it changes
  useEffect(() => {
    if (NativeModules.WidgetBridge) {
      const partnerData = {
        name: "Sarah",
        status: partnerStatus,
        task: "Graph Algorithms",
        timeLeft: partnerStatus === "Studying" ? "24m" : (partnerStatus === "On Break" ? "5m" : "")
      };
      try {
        NativeModules.WidgetBridge.updatePartner(JSON.stringify(partnerData));
      } catch (e) {
        console.error("Widget partner sync failed", e);
      }
    }
  }, [partnerStatus]);

  // Floating Hearts Animation State
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  // Add Task Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);

  // Cheers Messages Modal State
  const [isCheersModalVisible, setIsCheersModalVisible] = useState(false);
  const [activeCheerType, setActiveCheerType] = useState<"Nudge" | "Heart" | "Coffee" | "Celebrate">("Nudge");

  // Reflections State
  const [reflectionText, setReflectionText] = useState("");
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);
  const [pastReflections, setPastReflections] = useState([
    { date: "Yesterday", text: "Finished the API integration. Feels good to check that major task off." },
    { date: "July 14", text: "Studied DSA graph algorithms. Sarah nudged me and it really kept me going." }
  ]);

  // Suggested tags
  const suggestedTags = ["LeetCode", "Fitness", "Growth", "Coding"];

  // Mock focus data
  const weeklyData = [
    { day: "M", you: 3.5, sarah: 4.0 },
    { day: "T", you: 4.2, sarah: 3.5 },
    { day: "W", you: 5.0, sarah: 4.8 },
    { day: "T", you: 3.8, sarah: 4.2 }, 
    { day: "F", you: 4.5, sarah: 5.5 },
    { day: "S", you: 2.0, sarah: 3.0 },
    { day: "S", you: 1.5, sarah: 2.5 },
  ];
  const maxWeeklyHours = 6;

  const completedCount = tasks.filter(t => t.completed).length;

  const triggerHeartBurst = () => {
    // Generate a burst of 6 floating hearts
    const newHearts: FloatingHeart[] = [];
    const colors = ["#EF4444", "#F43F5E", "#EC4899", "#D946EF", "#A855F7"];
    for (let i = 0; i < 6; i++) {
      newHearts.push({
        id: Math.random().toString(),
        x: Math.random() * 80 - 40, // spread horizontally
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 16 // random sizes
      });
    }
    setFloatingHearts(prev => [...prev, ...newHearts]);
  };

  const handleSaveReflection = () => {
    if (reflectionText.trim() === "") return;
    setIsReflectionSaved(true);
    setTimeout(() => {
      setIsReflectionSaved(false);
      // Save to local list
      setPastReflections(prev => [
        { date: "Today", text: reflectionText },
        ...prev
      ]);
      setReflectionText("");
      Alert.alert("Reflections Saved!", "Your daily thought has been synced with your partner.");
    }, 1500);
  };

  const handleAddTaskSubmit = () => {
    if (taskName.trim() === "") {
      Alert.alert("Error", "Please enter a task name.");
      return;
    }
    addTask(taskName, taskCategory, isRecurring);
    setTaskName("");
    setTaskCategory("");
    setIsRecurring(true);
    setIsModalVisible(false);
  };

  const handleSendCheerMessage = (msg: string) => {
    setIsCheersModalVisible(false);
    
    if (activeCheerType === "Heart") {
      triggerHeartBurst();
    }

    setNotificationToast(`Cheer sent to Sarah: "${msg}"`);
    
    // Auto-clear toast banner
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

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

  // Card styles
  const cardStyle = {
    backgroundColor: theme.cardBg, 
    borderColor: theme.border, 
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadiusCard,
    padding: 24,
    marginBottom: 20,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: currentTheme === "mario" ? 0 : 0.03,
    shadowRadius: 16,
    elevation: 2
  };

  const buttonStyle = {
    borderRadius: theme.borderRadiusButton,
    borderWidth: theme.borderWidth,
    borderColor: currentTheme === "mario" ? "#000000" : "transparent"
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView 
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
                borderWidth: theme.borderWidth,
                shadowColor: theme.text,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
                borderRadius: 999
              }}
              className="w-12 h-12 overflow-hidden mr-3 bg-white"
            >
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" }} 
                className="w-full h-full"
              />
            </TouchableOpacity>
            
            <View>
              <Text 
                style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium") }} 
                className="text-xs uppercase tracking-wider"
              >
                Welcome back
              </Text>
              <Text 
                style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
                className="text-lg"
              >
                Jonathan
              </Text>
            </View>
          </View>

          {/* Clean Premium Streak Badge */}
          <TouchableOpacity 
            onPress={onNavigateToProfile}
            className="flex-row items-center"
            style={{ paddingVertical: 4 }}
          >
            <Text 
              style={{ 
                color: theme.text, 
                fontFamily: getFontFamily("Bold"), 
                fontSize: 20, 
                lineHeight: 24,
                marginRight: 4
              }}
            >
              {currentStreak}
            </Text>
            <Ionicons name="flame" size={24} color="#FF6D00" />
          </TouchableOpacity>
        </View>

        {/* Local Notification Banner */}
        {notificationToast && (
          <View 
            style={{ backgroundColor: theme.primary, borderRadius: theme.borderRadiusButton }}
            className="p-3.5 mb-4 flex-row items-center shadow"
          >
            <Ionicons name="information-circle" size={20} color={theme.primaryContrast} style={{ marginRight: 8 }} />
            <Text style={{ color: theme.primaryContrast, fontFamily: getFontFamily("Medium"), fontSize: 12, flex: 1 }}>
              {notificationToast}
            </Text>
          </View>
        )}

        {/* Dedicated Partner Card (Sarah's active stats) */}
        <View style={cardStyle}>
          <Text 
            style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium") }} 
            className="text-xs uppercase tracking-wider mb-3"
          >
            Sarah's Garden
          </Text>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full overflow-hidden border border-white mr-3">
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" }} 
                  className="w-full h-full"
                />
              </View>
              <View>
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} className="text-base">
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
                    className="w-2.5 h-2.5 rounded-full mr-1.5" 
                  />
                  <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium") }} className="text-xs">
                    {partnerStatus}
                  </Text>
                </View>
              </View>
            </View>

            {/* Interaction to cycle mock states */}
            <TouchableOpacity 
              onPress={() => {
                const statuses: ("Studying" | "On Break" | "Idle" | "Offline")[] = ["Studying", "On Break", "Idle", "Offline"];
                const nextIdx = (statuses.indexOf(partnerStatus) + 1) % statuses.length;
                setPartnerStatus(statuses[nextIdx]);
              }}
              style={{ backgroundColor: theme.backgroundSecondary, ...buttonStyle }}
              className="px-3 py-1 rounded-full"
            >
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 10 }}>
                Status Check
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active status panel */}
          {partnerStatus === "Studying" && (
            <View 
              style={{ backgroundColor: `${theme.accent}12` }} 
              className="rounded-2xl p-3 mb-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Ionicons name="book-outline" size={16} color={theme.accent} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.accent, fontFamily: getFontFamily("Medium"), fontSize: 11 }}>
                  Sarah is studying Graph Algorithms
                </Text>
              </View>
              <Text style={{ color: theme.accent, fontFamily: getFontFamily("Bold"), fontSize: 11 }}>
                24m Left
              </Text>
            </View>
          )}

          {partnerStatus === "On Break" && (
            <View 
              style={{ backgroundColor: `${theme.primary}12` }} 
              className="rounded-2xl p-3 mb-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Ionicons name="cafe-outline" size={16} color={theme.primary} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.primary, fontFamily: getFontFamily("Medium"), fontSize: 11 }}>
                  Sarah is taking a coffee break
                </Text>
              </View>
              <Text style={{ color: theme.primary, fontFamily: getFontFamily("Bold"), fontSize: 11 }}>
                5m Left
              </Text>
            </View>
          )}

          {/* Cheers & Nudge Row (NO emojis - Clean Vector Icons!) */}
          <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
            <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 11, marginBottom: 8 }}>
              Send Co-working Cheer
            </Text>
            
            <View className="flex-row justify-between">
              {/* Nudge Trigger */}
              <TouchableOpacity 
                onPress={() => {
                  setActiveCheerType("Nudge");
                  setIsCheersModalVisible(true);
                }}
                style={{ backgroundColor: theme.background, borderColor: theme.border, borderWidth: theme.borderWidth }}
                className="w-11 h-11 rounded-full items-center justify-center"
              >
                <Ionicons name="notifications-outline" size={18} color={theme.text} />
              </TouchableOpacity>

              {/* Heart Trigger */}
              <TouchableOpacity 
                onPress={() => {
                  setActiveCheerType("Heart");
                  setIsCheersModalVisible(true);
                }}
                style={{ backgroundColor: theme.background, borderColor: theme.border, borderWidth: theme.borderWidth }}
                className="w-11 h-11 rounded-full items-center justify-center"
              >
                <Ionicons name="heart-outline" size={18} color="#EF4444" />
              </TouchableOpacity>

              {/* Coffee Trigger */}
              <TouchableOpacity 
                onPress={() => {
                  setActiveCheerType("Coffee");
                  setIsCheersModalVisible(true);
                }}
                style={{ backgroundColor: theme.background, borderColor: theme.border, borderWidth: theme.borderWidth }}
                className="w-11 h-11 rounded-full items-center justify-center"
              >
                <Ionicons name="cafe-outline" size={18} color={theme.primary} />
              </TouchableOpacity>

              {/* Celebrate Trigger */}
              <TouchableOpacity 
                onPress={() => {
                  setActiveCheerType("Celebrate");
                  setIsCheersModalVisible(true);
                }}
                style={{ backgroundColor: theme.background, borderColor: theme.border, borderWidth: theme.borderWidth }}
                className="w-11 h-11 rounded-full items-center justify-center"
              >
                <Ionicons name="sparkles-outline" size={18} color="#D99B26" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Today's Tasks List Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4 px-2">
            <View>
              <Text 
                style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
                className="text-xl"
              >
                Today's Tasks
              </Text>
              <Text 
                style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium") }} 
                className="text-xs"
              >
                {completedCount} of {tasks.length} completed
              </Text>
            </View>

            <TouchableOpacity 
              style={{ borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadiusButton }}
              className="flex-row items-center bg-white px-3 py-1.5"
              onPress={() => setIsModalVisible(true)}
            >
              <Ionicons name="add" size={16} color={theme.text} className="mr-0.5" />
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} className="text-xs">
                Add Task
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Task List from Context */}
          <View>
            {tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                activeOpacity={0.8}
                onPress={() => toggleTask(task.id)}
                style={{ 
                  backgroundColor: theme.cardBg, 
                  borderColor: theme.border, 
                  borderWidth: theme.borderWidth,
                  borderRadius: theme.borderRadiusCard,
                }}
                className="p-5 mb-3 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1 pr-4">
                  {/* Left decorative color bar */}
                  <View 
                    style={{ backgroundColor: task.color }} 
                    className="w-1.5 h-10 rounded-full mr-3.5"
                  />
                  
                  <View className="flex-1">
                    <View className="flex-row mb-1">
                      <View 
                        style={{ backgroundColor: `${task.color}15` }} 
                        className="px-2.5 py-0.5 rounded-full"
                      >
                        <Text 
                          style={{ color: task.color, fontFamily: getFontFamily("Bold") }} 
                          className="text-[9px] uppercase"
                        >
                          {task.category}
                        </Text>
                      </View>

                      {task.isRecurring && (
                        <View style={{ backgroundColor: `${theme.primary}15` }} className="px-2 py-0.5 rounded-full ml-1.5 flex-row items-center">
                          <Ionicons name="repeat" size={9} color={theme.primary} style={{ marginRight: 3 }} />
                          <Text style={{ color: theme.primary, fontFamily: getFontFamily("Bold"), fontSize: 9 }}>RECURRING</Text>
                        </View>
                      )}
                    </View>

                    <Text 
                      style={{ 
                        color: theme.text, 
                        fontFamily: getFontFamily("Bold"),
                        textDecorationLine: task.completed ? "line-through" : "none",
                        opacity: task.completed ? 0.6 : 1
                      }} 
                      className="text-base"
                    >
                      {task.name}
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
                    borderColor: task.completed ? task.color : theme.border,
                    backgroundColor: task.completed ? task.color : "transparent",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {task.completed && (
                    <Ionicons name="checkmark" size={16} color={theme.primaryContrast} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Refined Weekly Activity Bar Graph - Side-by-side hours comparisons */}
        <View style={cardStyle}>
          <Text 
            style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
            className="text-base mb-1"
          >
            Weekly Activity
          </Text>
          <Text 
            style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular") }} 
            className="text-xs mb-6"
          >
            Aggregated focus hours logged by you and Sarah.
          </Text>

          {/* Bar Chart Representation */}
          <View style={{ height: 140, paddingHorizontal: 4 }} className="flex-row items-end justify-between px-1 mb-3">
            {weeklyData.map((item, idx) => {
              const myHeight = `${(item.you / maxWeeklyHours) * 100}%`;
              const sarahHeight = `${(item.sarah / maxWeeklyHours) * 100}%`;

              return (
                <View key={idx} className="items-center flex-1 h-full justify-end" style={{ paddingHorizontal: 2 }}>
                  {/* Hours Values Labels */}
                  <View className="items-center mb-1">
                    <Text style={{ fontSize: 7, color: theme.textSecondary, fontFamily: getFontFamily("Bold") }}>
                      {item.you}h / {item.sarah}h
                    </Text>
                  </View>

                  <View style={{ backgroundColor: theme.backgroundSecondary, padding: 3, borderRadius: 8, height: "72%", alignItems: "flex-end", flexDirection: "row", width: "100%", justifyContent: "center" }}>
                    {/* You (Lavender) */}
                    <View 
                      style={{ 
                        height: myHeight as any, 
                        backgroundColor: theme.primary,
                        flex: 1,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        marginRight: 1
                      }} 
                    />
                    
                    {/* Sarah (Sage Green) */}
                    <View 
                      style={{ 
                        height: sarahHeight as any, 
                        backgroundColor: theme.accent,
                        flex: 1,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        marginLeft: 1
                      }} 
                    />
                  </View>
                  
                  {/* Day Label */}
                  <Text 
                    style={{ 
                      color: item.day === "T" ? theme.text : theme.textSecondary, 
                      fontFamily: item.day === "T" ? getFontFamily("Bold") : getFontFamily("Medium") 
                    }} 
                    className="text-[10px] mt-2"
                  >
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Summary Insights footer */}
          <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 12 }} className="flex-row items-center">
            <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} style={{ marginRight: 6 }} />
            <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 11, flex: 1, lineHeight: 16 }}>
              Weekly Focus Total: You focused 22.3h • Sarah focused 25.1h. Great job staying in sync!
            </Text>
          </View>
        </View>

        {/* Daily Thoughts / Reflection Notepad (Redesigned textbox) */}
        <View style={cardStyle}>
          <Text 
            style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
            className="text-base mb-1"
          >
            Daily Reflection
          </Text>
          <Text 
            style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular") }} 
            className="text-xs mb-4"
          >
            Share daily thoughts, logs, and wins with Sarah. Future AI analysis will show mood patterns here.
          </Text>

          {/* Premium Diary Card text input */}
          <View 
            style={{ 
              borderColor: theme.border, 
              borderWidth: theme.borderWidth, 
              borderRadius: 16,
              backgroundColor: theme.background,
              padding: 14,
              marginBottom: 16
            }}
          >
            <View className="flex-row items-center justify-between border-b pb-2 mb-2" style={{ borderBottomColor: theme.border }}>
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 10 }}>
                TODAY'S JOURNAL ENTRY
              </Text>
              <Feather name="edit-3" size={12} color={theme.textSecondary} />
            </View>

            <TextInput
              placeholder="Write your thoughts here..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              value={reflectionText}
              onChangeText={setReflectionText}
              style={{ 
                color: theme.text,
                fontFamily: getFontFamily("Regular"),
                fontSize: 13,
                textAlignVertical: "top",
                height: 90
              }}
            />
          </View>

          <TouchableOpacity 
            onPress={handleSaveReflection}
            style={{ 
              backgroundColor: reflectionText.trim() === "" ? theme.backgroundSecondary : theme.primary,
              ...buttonStyle
            }}
            className="py-3.5 items-center justify-center mb-6"
            disabled={reflectionText.trim() === ""}
          >
            <Text 
              style={{ 
                color: reflectionText.trim() === "" ? theme.textSecondary : theme.primaryContrast, 
                fontFamily: getFontFamily("Bold") 
              }} 
              className="text-sm"
            >
              Save Reflection
            </Text>
          </TouchableOpacity>

          {/* Past Reflection History List */}
          {pastReflections.length > 0 && (
            <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 12, marginBottom: 8 }}>
                Recent Reflections
              </Text>
              
              {pastReflections.map((ref, idx) => (
                <View 
                  key={idx} 
                  style={{ backgroundColor: theme.backgroundSecondary, borderRadius: 12, padding: 12, marginBottom: 8 }}
                >
                  <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 9, marginBottom: 4 }}>
                    {ref.date}
                  </Text>
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Regular"), fontSize: 11, lineHeight: 16 }}>
                    {ref.text}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>

      {/* Floating Hearts Animation Layers */}
      <View 
        pointerEvents="none" 
        style={{ 
          position: "absolute", 
          top: 0, 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 9999 
        }}
      >
        {floatingHearts.map((heart) => {
          // Trigger floating hearts effect on mount
          const startY = Dimensions.get("window").height;
          const endY = startY * 0.3;
          const animY = useSharedValue(startY);
          const animOpacity = useSharedValue(1);

          useEffect(() => {
            animY.value = withTiming(endY, { duration: 2500 });
            animOpacity.value = withSequence(
              withTiming(1, { duration: 1500 }),
              withTiming(0, { duration: 1000 }, () => {
                // Remove heart from state when animation completes
                runOnJS(setFloatingHearts)(prev => prev.filter(h => h.id !== heart.id));
              })
            );
          }, []);

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [
              { translateY: animY.value },
              { translateX: heart.x }
            ],
            opacity: animOpacity.value
          }));

          return (
            <Animated.View
              key={heart.id}
              style={[
                {
                  position: "absolute",
                  alignSelf: "center",
                  width: heart.size,
                  height: heart.size,
                  bottom: 0
                },
                animatedStyle
              ]}
            >
              <Ionicons name="heart" size={heart.size} color={heart.color} />
            </Animated.View>
          );
        })}
      </View>

      {/* Cheers pre-written message modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCheersModalVisible}
        onRequestClose={() => setIsCheersModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)", justifyContent: "center", padding: 24 }}>
          <View style={{ backgroundColor: theme.cardBg, borderRadius: theme.borderRadiusCard, borderWidth: theme.borderWidth, borderColor: theme.border, padding: 24 }}>
            <View className="flex-row items-center justify-between mb-5">
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 16 }}>
                Send {activeCheerType} Cheer
              </Text>
              <TouchableOpacity onPress={() => setIsCheersModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 12, marginBottom: 16 }}>
              Select a heartwarming message to send to Sarah:
            </Text>

            {/* Render List of prewritten Messages */}
            {CHEER_MESSAGES[activeCheerType].map((msg, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleSendCheerMessage(msg)}
                style={{ backgroundColor: theme.background, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadiusButton }}
                className="p-4 mb-3 flex-row items-center justify-between"
              >
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 13, flex: 1, marginRight: 8 }}>
                  {msg}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)", justifyContent: "center", padding: 24 }}>
          <View style={{ backgroundColor: theme.cardBg, borderRadius: theme.borderRadiusCard, borderWidth: theme.borderWidth, borderColor: theme.border, padding: 24 }}>
            <View className="flex-row items-center justify-between mb-5">
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 18 }}>
                Add New Task
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Field: Name */}
            <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 12, marginBottom: 6 }}>
              Task Name / Title
            </Text>
            <TextInput
              placeholder="e.g. Solve DSA Graph Questions"
              placeholderTextColor="#9CA3AF"
              value={taskName}
              onChangeText={setTaskName}
              style={{
                backgroundColor: theme.background,
                color: theme.text,
                fontFamily: getFontFamily("Medium"),
                borderColor: theme.border,
                borderWidth: theme.borderWidth,
                borderRadius: theme.borderRadiusButton,
                padding: 12,
                fontSize: 14,
                marginBottom: 16
              }}
            />

            {/* Field: Category Tag */}
            <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 12, marginBottom: 6 }}>
              Category Tag
            </Text>
            <TextInput
              placeholder="Type tag (e.g. LeetCode)"
              placeholderTextColor="#9CA3AF"
              value={taskCategory}
              onChangeText={setTaskCategory}
              style={{
                backgroundColor: theme.background,
                color: theme.text,
                fontFamily: getFontFamily("Medium"),
                borderColor: theme.border,
                borderWidth: theme.borderWidth,
                borderRadius: theme.borderRadiusButton,
                padding: 12,
                fontSize: 14,
                marginBottom: 10
              }}
            />

            {/* Tag suggestions */}
            <View className="flex-row flex-wrap mb-4">
              {suggestedTags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => setTaskCategory(tag)}
                  style={{
                    backgroundColor: taskCategory === tag ? theme.primary : theme.backgroundSecondary,
                    borderRadius: theme.borderRadiusButton,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginRight: 6,
                    marginBottom: 6,
                    borderWidth: currentTheme === "mario" ? theme.borderWidth : 0,
                    borderColor: "#000000"
                  }}
                >
                  <Text style={{ 
                    color: taskCategory === tag ? theme.primaryContrast : theme.textSecondary,
                    fontFamily: getFontFamily("Bold"),
                    fontSize: 10
                  }}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Field: Recurring Check */}
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 13 }}>
                  Daily Recurring Habit
                </Text>
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 10 }}>
                  Shows contribution heatmap in Insights
                </Text>
              </View>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={Platform.OS === "android" ? "#ffffff" : undefined}
              />
            </View>

            {/* Add Submit Button */}
            <TouchableOpacity
              onPress={handleAddTaskSubmit}
              style={{ backgroundColor: theme.primary, borderRadius: theme.borderRadiusButton, borderWidth: currentTheme === "mario" ? theme.borderWidth : 0, borderColor: "#000000" }}
              className="py-3.5 items-center justify-center"
            >
              <Text style={{ color: theme.primaryContrast, fontFamily: getFontFamily("Bold"), fontSize: 14 }}>
                Create Task
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

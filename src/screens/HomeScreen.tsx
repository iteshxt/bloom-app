import React, { useState, useEffect, useRef, useMemo } from "react";
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
  NativeModules,
  Animated as AnimatedRN,
  PanResponder,
  StyleSheet
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTasks, Task } from "../contexts/TasksContext";
import { useToast } from "../contexts/ToastContext";
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withSequence,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown
} from "react-native-reanimated";

interface HomeScreenProps {
  onNavigateToProfile: () => void;
  onSwipeTask?: (swiping: boolean) => void;
  onModalToggle?: (visible: boolean) => void;
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

interface SwipeableTaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  theme: any;
  getFontFamily: (weight: "Regular" | "Medium" | "Bold") => string;
  onSwipeTask?: (swiping: boolean) => void;
}

const getRecurrenceLabel = (days: string[]) => {
  if (!days || days.length === 0) return "";
  if (days.length === 7) return "WEEKLONG";
  
  const shortDays = days.map(d => {
    switch (d.toLowerCase()) {
      case "monday": return "MON";
      case "tuesday": return "TUE";
      case "wednesday": return "WED";
      case "thursday": return "THU";
      case "friday": return "FRI";
      case "saturday": return "SAT";
      case "sunday": return "SUN";
      default: return "";
    }
  });
  return shortDays.join(", ");
};

const SwipeableTaskRow: React.FC<SwipeableTaskRowProps> = ({ task, onToggle, onDelete, theme, getFontFamily, onSwipeTask }) => {
  const translateX = useRef(new AnimatedRN.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderGrant: () => {
        onSwipeTask?.(true);
      },
      onPanResponderMove: (_, gestureState) => {
        let val = gestureState.dx;
        if (val < 0) val = 0; // Disable left-side swipe entirely
        translateX.setValue(val);
      },
      onPanResponderRelease: (_, gestureState) => {
        onSwipeTask?.(false);
        const screenWidth = Dimensions.get("window").width;
        if (gestureState.dx > screenWidth * 0.45) {
          // Swipe past 45% -> Animate card off-screen right and trigger delete
          AnimatedRN.timing(translateX, {
            toValue: screenWidth,
            duration: 200,
            useNativeDriver: true
          }).start(() => {
            onDelete(task.id);
          });
        } else {
          // Snap closed
          AnimatedRN.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 40,
            friction: 7
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        onSwipeTask?.(false);
        AnimatedRN.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 40,
          friction: 7
        }).start();
      }
    })
  ).current;

  useEffect(() => {
    AnimatedRN.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 40,
      friction: 7
    }).start();
  }, [task.id]);

  return (
    <View 
      style={{ 
        position: "relative", 
        marginBottom: 12, 
        borderRadius: theme.borderRadiusCard,
        overflow: "hidden"
      }}
    >
      {/* Background Trash Panel (Full-width card, reveals on drag) */}
      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#EF4444",
          paddingLeft: 24,
          justifyContent: "center",
          zIndex: 1
        }}
        activeOpacity={0.9}
      >
        <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Slideable Foreground Card */}
      <AnimatedRN.View
        style={{
          transform: [{ translateX }],
          backgroundColor: theme.cardBg,
          borderRadius: theme.borderRadiusCard,
          zIndex: 2,
          shadowColor: theme.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 2
        }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.855}
          onPress={() => onToggle(task.id)}
          className="p-5 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 pr-4">
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

                {task.recurrenceDays && task.recurrenceDays.length > 0 && (
                  <View style={{ backgroundColor: `${theme.primary}15` }} className="px-2 py-0.5 rounded-full ml-1.5 flex-row items-center">
                    <Ionicons name="repeat" size={9} color={theme.primary} style={{ marginRight: 3 }} />
                    <Text style={{ color: theme.primary, fontFamily: getFontFamily("Bold"), fontSize: 9 }}>
                      {getRecurrenceLabel(task.recurrenceDays)}
                    </Text>
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

          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: task.completed ? task.color : theme.border,
              backgroundColor: task.completed ? task.color : "transparent",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {task.completed && (
              <Ionicons name="checkmark" size={16} color={theme.primaryContrast} />
            )}
          </View>
        </TouchableOpacity>
      </AnimatedRN.View>
    </View>
  );
};

const FloatingHeartComponent = ({ heart, onComplete }: { heart: FloatingHeart, onComplete: (id: string) => void }) => {
  const startY = Dimensions.get("window").height;
  const endY = startY * 0.3;
  const animY = useSharedValue(startY);
  const animOpacity = useSharedValue(1);

  useEffect(() => {
    animY.value = withTiming(endY, { duration: 2500 });
    animOpacity.value = withSequence(
      withTiming(1, { duration: 1500 }),
      withTiming(0, { duration: 1000 }, () => {
        runOnJS(onComplete)(heart.id);
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
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToProfile, onSwipeTask, onModalToggle }) => {
  const { theme, currentTheme, currentStreak } = useTheme();
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const { showToast } = useToast();

  // Partner Active Status
  const [partnerStatus, setPartnerStatus] = useState<"Studying" | "On Break" | "Idle" | "Offline">("Studying");
  const [isCheersModalVisible, setIsCheersModalVisible] = useState(false);
  const [activeCheerType, setActiveCheerType] = useState<"Nudge" | "Heart" | "Coffee" | "Celebrate">("Nudge");
  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    showToast("Task deleted successfully.", "success");
  };

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

  useEffect(() => {
    if (onModalToggle) {
      onModalToggle(isModalVisible || isCheersModalVisible);
    }
  }, [isModalVisible, isCheersModalVisible]);
  const [taskName, setTaskName] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Reflections State
  const [reflectionText, setReflectionText] = useState("");
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);
  const [pastReflections, setPastReflections] = useState([
    { date: "Yesterday", text: "Finished the API integration. Feels good to check that major task off." },
    { date: "July 14", text: "Studied DSA graph algorithms. Sarah nudged me and it really kept me going." }
  ]);

  // Suggested tags
  const suggestedTags = useMemo(() => {
    const uniqueTags = Array.from(new Set(tasks.map(t => t.category)));
    const filtered = uniqueTags.filter(tag => tag && tag.trim() !== "" && tag.trim().toLowerCase() !== "custom");
    if (filtered.length === 0) {
      return ["LeetCode", "Fitness", "Growth", "Coding"];
    }
    return filtered;
  }, [tasks]);

  // Mock focus data
  const [weekRange, setWeekRange] = useState<"This Week" | "Last Week">("This Week");

  const thisWeekData = [
    { day: "Mon", you: 3.5, sarah: 4.0 },
    { day: "Tue", you: 4.2, sarah: 3.5 },
    { day: "Wed", you: 5.0, sarah: 4.8 },
    { day: "Thu", you: 3.8, sarah: 4.2 }, 
    { day: "Fri", you: 4.5, sarah: 5.5 },
    { day: "Sat", you: 2.0, sarah: 3.0 },
    { day: "Sun", you: 1.5, sarah: 2.5 },
  ];

  const lastWeekData = [
    { day: "Mon", you: 2.8, sarah: 3.2 },
    { day: "Tue", you: 3.5, sarah: 4.0 },
    { day: "Wed", you: 4.2, sarah: 3.8 },
    { day: "Thu", you: 4.0, sarah: 4.5 }, 
    { day: "Fri", you: 3.8, sarah: 4.2 },
    { day: "Sat", you: 1.8, sarah: 2.2 },
    { day: "Sun", you: 2.2, sarah: 1.8 },
  ];

  const weeklyData = weekRange === "This Week" ? thisWeekData : lastWeekData;
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
      showToast("Your daily thought has been synced with your partner.", "success");
    }, 1500);
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleAddTaskSubmit = () => {
    if (taskName.trim() === "") {
      showToast("Please enter a task name.", "error");
      return;
    }
    const days = isRecurring ? selectedDays : [];
    addTask(taskName, taskCategory, days);
    setTaskName("");
    setTaskCategory("");
    setIsRecurring(false);
    setSelectedDays([]);
    setIsModalVisible(false);
  };

  const handleSendCheerMessage = (msg: string) => {
    setIsCheersModalVisible(false);
    
    if (activeCheerType === "Heart") {
      triggerHeartBurst();
    }

    showToast(`Cheer sent to Sarah: "${msg}"`, "success");
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
      {/* Background Watermark */}
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, overflow: "hidden" }} pointerEvents="none">
        <Ionicons 
          name={theme.watermarkIcon as any} 
          size={350} 
          color={theme.primary} 
          style={{ 
            position: "absolute", 
            left: -100, 
            top: -50, 
            opacity: 0.06, 
            transform: [{ rotate: "-35deg" }] 
          }} 
        />
        <Ionicons 
          name={theme.watermarkIcon as any} 
          size={450} 
          color={theme.primary} 
          style={{ 
            position: "absolute", 
            right: -150, 
            bottom: 50, 
            opacity: 0.06, 
            transform: [{ rotate: "45deg" }] 
          }} 
        />
      </View>
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
            className="flex-row items-center justify-center rounded-2xl px-4 py-2"
            style={{ backgroundColor: theme.backgroundSecondary }}
          >
            <View className="items-center">
              <View className="flex-row items-center">
                <Ionicons name="flame" size={16} color={theme.primary} style={{ marginRight: 4 }} />
                <Text 
                  style={{ 
                    color: theme.text, 
                    fontFamily: getFontFamily("Bold"), 
                    fontSize: 20, 
                    lineHeight: 24,
                  }}
                >
                  {currentStreak}
                </Text>
              </View>
              <Text style={{ color: theme.primary, fontFamily: getFontFamily("Medium"), fontSize: 10 }}>Day Streak</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Dedicated Partner Card (Sarah's active stats) */}
        <View style={{ ...cardStyle, backgroundColor: theme.backgroundSecondary, position: "relative", overflow: "hidden" }}>
          {/* Flower Decoration Graphic on Right Edge - Set to watermark style to match weekly activity card */}
          <View style={{ position: "absolute", right: -25, top: 35, opacity: 0.18, zIndex: 1 }} pointerEvents="none">
            <Ionicons name="flower" size={105} color={theme.accent} style={{ transform: [{ rotate: "-15deg" }] }} />
          </View>

          <Text 
            style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), zIndex: 1 }} 
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
              style={{ backgroundColor: "#FDF8E7", borderWidth: 1, borderColor: "rgba(172, 99, 138, 0.15)", borderRadius: 999 }}
              className="px-3.5 py-1.5 flex-row items-center"
            >
              <Text style={{ color: theme.primary, fontFamily: getFontFamily("Bold"), fontSize: 11, marginRight: 4 }}>
                Status Check
              </Text>
              <Feather name="chevron-right" size={12} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* Active status panel */}
          {partnerStatus === "Studying" && (
            <View 
              style={{ backgroundColor: "#FFF8E5", borderWidth: 1, borderColor: "rgba(131, 64, 99, 0.12)" }} 
              className="rounded-2xl p-4 mb-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center" style={{ flex: 1, marginRight: 12 }}>
                <Ionicons name="book" size={18} color={theme.primary} style={{ marginRight: 8 }} />
                <Text style={{ flex: 1, color: theme.primary, fontFamily: getFontFamily("Medium"), fontSize: 13 }} numberOfLines={1} ellipsizeMode="tail">
                  Sarah is studying Graph Algorithms
                </Text>
              </View>
              <Text style={{ color: theme.primary, fontFamily: getFontFamily("Bold"), fontSize: 13 }} className="shrink-0">
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

          {/* Cheers & Nudge Row */}
          <View style={{ borderTopWidth: 1, borderTopColor: "rgba(172, 99, 138, 0.1)", paddingTop: 16 }}>
            <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 11, marginBottom: 12 }}>
              Send Co-working Cheer
            </Text>
            
            <View className="flex-row justify-between">
              {/* Nudge Trigger */}
              <TouchableOpacity 
                onPress={() => showToast(`Sent a Nudge to Sarah!`, "success")}
                style={{ backgroundColor: "#F3E6EE" }}
                className="flex-row items-center px-4 py-3 rounded-2xl flex-1 mr-2 justify-center"
              >
                <Ionicons name="leaf" size={16} color={theme.accent} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 12 }}>Nudge</Text>
              </TouchableOpacity>

              {/* Heart Trigger */}
              <TouchableOpacity 
                onPress={() => {
                  triggerHeartBurst();
                  showToast(`Sent a Heart to Sarah!`, "success");
                }}
                style={{ backgroundColor: "#FCF5E2" }}
                className="flex-row items-center px-4 py-3 rounded-2xl flex-1 mx-2 justify-center"
              >
                <Ionicons name="heart" size={16} color={theme.primary} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 12 }}>Heart</Text>
              </TouchableOpacity>

              {/* Coffee Trigger */}
              <TouchableOpacity 
                onPress={() => showToast(`Sent a Coffee to Sarah!`, "success")}
                style={{ backgroundColor: "#EFE6F5" }}
                className="flex-row items-center px-4 py-3 rounded-2xl flex-1 ml-2 justify-center"
              >
                <Ionicons name="cafe" size={16} color={theme.primary} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 12 }}>Coffee</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

          {/* Today's Tasks List Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <View className="flex-row items-center">
                  <Text 
                    style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
                    className="text-xl"
                  >
                    Today's Tasks
                  </Text>
                  <Ionicons name="leaf" size={18} color={theme.accent} style={{ marginLeft: 6, opacity: 0.8 }} />
                </View>
                <Text 
                  style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium") }} 
                  className="text-xs mt-1"
                >
                  {tasks.length > 0 ? `${completedCount} of ${tasks.length} completed` : "No tasks pending"}
                </Text>
              </View>

              <TouchableOpacity 
                style={{ 
                  backgroundColor: theme.primary, 
                  borderRadius: 999,
                  flexShrink: 0
                }}
                className="flex-row items-center px-5 py-2.5"
                onPress={() => setIsModalVisible(true)}
              >
              <Ionicons name="add" size={16} color={theme.primaryContrast} style={{ marginRight: 4 }} />
              <Text style={{ color: theme.primaryContrast, fontFamily: getFontFamily("Medium") }} className="text-xs shrink-0" numberOfLines={1}>
                Add Task
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Task List from Context */}
          <View>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <SwipeableTaskRow
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={handleDeleteTask}
                  theme={theme}
                  getFontFamily={getFontFamily}
                  onSwipeTask={onSwipeTask}
                />
              ))
            ) : (
              <View 
                style={{ 
                  padding: 32, 
                  alignItems: 'center', 
                  backgroundColor: theme.cardBg, 
                  borderRadius: theme.borderRadiusCard, 
                  borderWidth: theme.borderWidth, 
                  borderColor: theme.border,
                  borderStyle: 'dashed'
                }}
              >
                <Ionicons name="leaf-outline" size={32} color={theme.textSecondary} style={{ marginBottom: 12 }} />
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 14, marginBottom: 4 }}>
                  Your garden is clear!
                </Text>
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 12, textAlign: 'center' }}>
                  Click the + Add button to plant a new task for today.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Refined Weekly Activity Bar Graph - Side-by-side hours comparisons */}
        <View style={[cardStyle, { position: "relative", overflow: "hidden" }]}>
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text 
                style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
                className="text-xl"
              >
                Weekly Activity
              </Text>
              <Text 
                style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular") }} 
                className="text-xs"
              >
                Focus hours logged by you and Sarah
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setWeekRange(prev => prev === "This Week" ? "Last Week" : "This Week")}
              style={{ borderColor: "rgba(131, 64, 99, 0.2)", borderWidth: 1, borderRadius: 20 }}
              className="px-3.5 py-1.5 flex-row items-center bg-white"
            >
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 10, marginRight: 4 }}>{weekRange}</Text>
              <Ionicons name="chevron-down" size={12} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Leaf Decoration Graphic on Right Edge - Set to watermark style to not block graph */}
          <View style={{ position: "absolute", right: -25, top: 40, opacity: 0.18, zIndex: 1 }} pointerEvents="none">
            <Ionicons name="leaf" size={100} color={theme.accent} style={{ transform: [{ rotate: "25deg" }] }} />
          </View>

          {/* Bar Chart Representation with Y-axis labels and gridlines */}
          <View className="flex-row items-stretch" style={{ height: 160, zIndex: 5, marginTop: 12 }}>
            {/* Y-Axis Labels */}
            <View className="justify-between items-end pr-3 pb-8" style={{ height: "100%", width: 28 }}>
              <Text style={{ fontSize: 9, color: theme.textSecondary, fontFamily: getFontFamily("Medium") }}>6h</Text>
              <Text style={{ fontSize: 9, color: theme.textSecondary, fontFamily: getFontFamily("Medium") }}>4h</Text>
              <Text style={{ fontSize: 9, color: theme.textSecondary, fontFamily: getFontFamily("Medium") }}>2h</Text>
              <Text style={{ fontSize: 9, color: theme.textSecondary, fontFamily: getFontFamily("Medium") }}>0h</Text>
            </View>

            {/* Chart Area with Gridlines */}
            <View className="flex-1 relative justify-end">
              {/* Horizontal Gridlines */}
              <View style={{ position: "absolute", left: 0, right: 0, top: 4, bottom: 32, justifyContent: "space-between" }}>
                <View style={{ height: 1, backgroundColor: "rgba(172, 99, 138, 0.08)" }} />
                <View style={{ height: 1, backgroundColor: "rgba(172, 99, 138, 0.08)" }} />
                <View style={{ height: 1, backgroundColor: "rgba(172, 99, 138, 0.08)" }} />
                <View style={{ height: 1, backgroundColor: "rgba(172, 99, 138, 0.08)" }} />
              </View>

              {/* Bars Row */}
              <View className="flex-row items-end justify-between h-full pb-8">
                {weeklyData.map((item, idx) => {
                  const myHeight = `${(item.you / maxWeeklyHours) * 100}%`;
                  const sarahHeight = `${(item.sarah / maxWeeklyHours) * 100}%`;

                  return (
                    <View key={idx} className="items-center flex-1 h-full justify-end" style={{ paddingHorizontal: 2 }}>
                      <View style={{ height: "82%", alignItems: "flex-end", flexDirection: "row", width: "100%", justifyContent: "center" }}>
                        {/* You (Plum) */}
                        <View 
                          style={{ 
                            height: myHeight as any, 
                            backgroundColor: theme.primary,
                            width: 10,
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                            marginRight: 1.5
                          }} 
                        />
                        
                        {/* Sarah (Cream) */}
                        <View 
                          style={{ 
                            height: sarahHeight as any, 
                            backgroundColor: theme.backgroundSecondary,
                            width: 10,
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                            marginLeft: 1.5
                          }} 
                        />
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Day Labels Row */}
              <View style={{ position: "absolute", left: 0, right: 0, bottom: 4, height: 20, flexDirection: "row", justifyContent: "space-between" }}>
                {weeklyData.map((item, idx) => (
                  <View key={idx} className="flex-1 items-center">
                    <Text 
                      style={{ 
                        color: theme.textSecondary, 
                        fontFamily: getFontFamily("Medium"),
                        fontSize: 10
                      }}
                    >
                      {item.day === "Mon" ? "Mon" : item.day === "Tue" ? "Tue" : item.day === "Wed" ? "Wed" : item.day === "Thu" ? "Thu" : item.day === "Fri" ? "Fri" : item.day === "Sat" ? "Sat" : "Sun"}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Legend Row */}
          <View className="flex-row justify-center items-center mb-6 mt-1" style={{ zIndex: 5 }}>
            <View className="flex-row items-center mr-6">
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary, marginRight: 6 }} />
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 11 }}>You</Text>
            </View>
            <View className="flex-row items-center">
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.backgroundSecondary, marginRight: 6 }} />
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 11 }}>Sarah</Text>
            </View>
          </View>

          {/* Summary Insights footer */}
          <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
            <View className="flex-row justify-between items-center mb-4 px-2">
              <View>
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 11, marginBottom: 2 }}>You Focused</Text>
                <Text style={{ color: theme.primary, fontFamily: getFontFamily("Bold"), fontSize: 18 }}>22.3h</Text>
              </View>
              
              <View className="items-center justify-center">
                <View style={{ backgroundColor: `${theme.accent}20`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ color: theme.accent, fontFamily: getFontFamily("Bold"), fontSize: 10 }}>SYNCED</Text>
                </View>
              </View>

              <View className="items-end">
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 11, marginBottom: 2 }}>Sarah Focused</Text>
                <Text style={{ color: theme.accent, fontFamily: getFontFamily("Bold"), fontSize: 18 }}>25.1h</Text>
              </View>
            </View>

            <View style={{ backgroundColor: theme.backgroundSecondary, padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="sparkles" size={16} color="#D99B26" style={{ marginRight: 10 }} />
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 11, flex: 1, lineHeight: 16 }}>
                Great job! You and Sarah are highly synchronized this week! Keep the momentum going.
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Thoughts / Reflection Notepad (Redesigned textbox) */}
        <View style={cardStyle}>
          <Text 
            style={{ color: theme.text, fontFamily: getFontFamily("Bold") }} 
            className="text-xl mb-3"
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
        {floatingHearts.map((heart) => (
          <FloatingHeartComponent
            key={heart.id}
            heart={heart}
            onComplete={(id) => {
              setFloatingHearts(prev => prev.filter(h => h.id !== id));
            }}
          />
        ))}
      </View>



      {isModalVisible && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 99999, justifyContent: "flex-end" }]}>
          {/* Translucent Backdrop */}
          <Animated.View 
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0, 0, 0, 0.4)" }]}
          />
          {/* Modal Container */}
          <Animated.View 
            entering={SlideInDown.duration(250)}
            exiting={SlideOutDown.duration(200)}
            style={{ backgroundColor: theme.cardBg, borderTopLeftRadius: theme.borderRadiusCard, borderTopRightRadius: theme.borderRadiusCard, borderWidth: theme.borderWidth, borderColor: theme.border, padding: 24, paddingBottom: 40 }}
          >
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
                    backgroundColor: taskCategory === tag ? theme.text : theme.backgroundSecondary,
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

            {/* Field: Recurring Toggle */}
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 13 }}>
                  Recurring Habit
                </Text>
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 10 }}>
                  Repeat this task on selected days
                </Text>
              </View>
              <Switch
                value={isRecurring}
                onValueChange={(val) => {
                  setIsRecurring(val);
                  if (val) {
                    setSelectedDays(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);
                  } else {
                    setSelectedDays([]);
                  }
                }}
                trackColor={{ false: theme.border, true: theme.text }}
                thumbColor={Platform.OS === "android" ? "#ffffff" : undefined}
              />
            </View>

            {/* Days Selector */}
            {isRecurring && (
              <View className="mb-6">
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 11, marginBottom: 8 }}>
                  Repeat On:
                </Text>
                <View className="flex-row justify-between">
                  {(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const).map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleDaySelection(day)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: isSelected ? theme.text : theme.backgroundSecondary,
                          borderWidth: isSelected ? 0 : theme.borderWidth,
                          borderColor: theme.border,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Text style={{
                          color: isSelected ? theme.primaryContrast : theme.text,
                          fontFamily: getFontFamily("Bold"),
                          fontSize: 10
                        }}>
                          {day.substring(0, 1).toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

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
          </Animated.View>
        </View>
      )}
    </View>
  );
};

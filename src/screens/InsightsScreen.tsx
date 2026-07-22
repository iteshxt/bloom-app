import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTasks, Task } from "../contexts/TasksContext";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import Animated, { 
  LinearTransition,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown
} from "react-native-reanimated";

// Dynamic streak tracker calculator
const getStreak = (contributions: number[]) => {
  let streak = 0;
  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i] > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

// Render vector mood icons instead of raw emojis
const renderMoodIcon = (score: number, size: number, color: string) => {
  switch (score) {
    case 1: return <MaterialIcons name="sentiment-very-dissatisfied" size={size} color={color} />;
    case 2: return <MaterialIcons name="sentiment-dissatisfied" size={size} color={color} />;
    case 3: return <MaterialIcons name="sentiment-neutral" size={size} color={color} />;
    case 4: return <MaterialIcons name="sentiment-satisfied" size={size} color={color} />;
    case 5: return <MaterialIcons name="sentiment-very-satisfied" size={size} color={color} />;
    default: return <MaterialIcons name="sentiment-neutral" size={size} color={color} />;
  }
};

export const InsightsScreen: React.FC = () => {
  const { theme, currentTheme } = useTheme();
  const { tasks } = useTasks();

  // Filter recurring tasks/habits from context
  const recurringTasks = tasks.filter(t => t.isRecurring);

  // "habits" for Github contribution heatmaps, "focus" for comparative graphs & mood logs
  const [activeView, setActiveView] = useState<"habits" | "focus">("habits");
  const [selectedHabit, setSelectedHabit] = useState<Task | null>(null);

  // Focus Statistics Mock Database (Last 7 days: Mon - Sun)
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const myFocusHours = [3.5, 4.2, 5.0, 3.8, 4.5, 2.0, 1.5]; // Jonathan
  const partnerFocusHours = [4.0, 3.5, 4.8, 4.2, 5.5, 3.0, 2.5]; // Sarah
  const maxHours = 6;

  // Mood logs (Mon - Sun, scale 1-5)
  const moodScores = [3, 4, 5, 3, 4, 4, 5];

  // Distraction logged statistics
  const distractions = [
    { source: "Social Media", percentage: 42, color: theme.primary },
    { source: "Video Games", percentage: 24, color: theme.accent },
    { source: "Overslept", percentage: 18, color: theme.warning },
    { source: "Friends & Call", percentage: 16, color: "#FBBF24" } 
  ];

  const getHeatmapColor = (intensity: number, baseColor: string) => {
    if (intensity === 0) return theme.backgroundSecondary; // Gray empty cell
    if (intensity === 1) return `${baseColor}40`; // 25% opacity
    if (intensity === 2) return `${baseColor}80`; // 50% opacity
    return baseColor; // 100% opacity
  };

  const getFontFamily = (weight: "Regular" | "Medium" | "Bold") => {
    switch (weight) {
      case "Regular": return theme.fontFamilyRegular;
      case "Medium": return theme.fontFamilyMedium;
      case "Bold": return theme.fontFamilyBold;
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: currentTheme === "mario" ? 0 : theme.shadowOpacity,
    shadowRadius: theme.shadowRadius,
    elevation: theme.shadowOpacity > 0 ? 1 : 0
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
      
      {/* Title & Page Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 24, marginBottom: 16 }}>
          Insights
        </Text>

        {/* Sliding Segmented Pill Toggle Switch */}
        <View 
          style={{ 
            backgroundColor: theme.cardBg, 
            borderColor: theme.border, 
            borderWidth: theme.borderWidth, 
            borderRadius: theme.borderRadiusCard,
            position: "relative",
            height: 44,
            padding: 4
          }} 
          className="flex-row mb-5"
        >
          <Animated.View 
            style={{
              position: "absolute",
              top: 4,
              bottom: 4,
              left: activeView === "habits" ? 4 : "50%",
              right: activeView === "habits" ? "50%" : 4,
              backgroundColor: theme.primary,
              borderRadius: theme.borderRadiusButton,
            }}
            layout={LinearTransition.duration(300)}
          />

          <TouchableOpacity 
            onPress={() => setActiveView("habits")}
            className="flex-1 items-center justify-center"
            style={{ zIndex: 2 }}
          >
            <Text style={{ 
              color: activeView === "habits" ? theme.primaryContrast : theme.textSecondary,
              fontFamily: getFontFamily("Bold"), 
              fontSize: 13 
            }}>
              Habit Heatmaps
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setActiveView("focus")}
            className="flex-1 items-center justify-center"
            style={{ zIndex: 2 }}
          >
            <Text style={{ 
              color: activeView === "focus" ? theme.primaryContrast : theme.textSecondary,
              fontFamily: getFontFamily("Bold"), 
              fontSize: 13 
            }}>
              Focus & Mood
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Views */}
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {activeView === "habits" ? (
          /* VIEW A: DYNAMIC HABIT HEATMAPS */
          <View>
            {recurringTasks.length > 0 ? (
              recurringTasks.map((habit) => {
                const baseColor = habit.color;
                
                // Group 91 contributions into 13 columns of 7 days
                const gridColumns = [];
                for (let i = 0; i < 13; i++) {
                  gridColumns.push(habit.contributions.slice(i * 7, (i + 1) * 7));
                }

                const totalCompletions = habit.contributions.filter(c => c > 0).length;
                const streak = getStreak(habit.contributions);

                return (
                  <TouchableOpacity 
                    key={habit.id}
                    style={cardStyle}
                    activeOpacity={0.9}
                    onPress={() => setSelectedHabit(habit)}
                  >
                    {/* Habit Card Header */}
                    <View className="flex-row items-center justify-between mb-4">
                      <View>
                        <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 18 }}>
                          {habit.name} {habit.category.toLowerCase().includes("fitness") ? "👟" : habit.category.toLowerCase().includes("leetcode") ? "💻" : "📚"}
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 12, marginTop: 2 }}>
                          {habit.recurrenceDays && habit.recurrenceDays.length > 0 ? `${habit.recurrenceDays.length} times weekly` : "Daily Habit"}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <TouchableOpacity className="p-1"><Ionicons name="chevron-back" size={14} color={theme.textSecondary} /></TouchableOpacity>
                        <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 13, marginHorizontal: 4 }}>2026</Text>
                        <TouchableOpacity className="p-1"><Ionicons name="chevron-forward" size={14} color={theme.textSecondary} /></TouchableOpacity>
                      </View>
                    </View>

                    {/* Split Monthly Grids (Oct, Nov, Dec represented by 4, 4, 5 columns) */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 16 }}>
                      {/* Weekday labels */}
                      <View style={{ marginRight: 10, height: 90, paddingVertical: 1 }} className="justify-between">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                          <Text key={idx} style={{ color: theme.textSecondary, opacity: 0.6, fontFamily: getFontFamily("Medium"), fontSize: 8 }}>
                            {day}
                          </Text>
                        ))}
                      </View>

                      {/* May Block */}
                      <View className="items-center" style={{ marginRight: 12 }}>
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9, marginBottom: 6 }}>May</Text>
                        <View style={{ flexDirection: "row" }}>
                          {gridColumns.slice(0, 4).map((col, colIdx) => (
                            <View key={`col-0-${colIdx}`} style={{ flexDirection: "column" }}>
                              {col.map((intensity, rowIdx) => (
                                <View 
                                  key={`cell-0-${colIdx}-${rowIdx}`}
                                  style={{
                                    width: 11,
                                    height: 11,
                                    borderRadius: 2.5,
                                    backgroundColor: getHeatmapColor(intensity, baseColor),
                                    margin: 1
                                  }}
                                />
                              ))}
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Jun Block */}
                      <View className="items-center" style={{ marginRight: 12 }}>
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9, marginBottom: 6 }}>Jun</Text>
                        <View style={{ flexDirection: "row" }}>
                          {gridColumns.slice(4, 8).map((col, colIdx) => (
                            <View key={`col-1-${colIdx}`} style={{ flexDirection: "column" }}>
                              {col.map((intensity, rowIdx) => (
                                <View 
                                  key={`cell-1-${colIdx}-${rowIdx}`}
                                  style={{
                                    width: 11,
                                    height: 11,
                                    borderRadius: 2.5,
                                    backgroundColor: getHeatmapColor(intensity, baseColor),
                                    margin: 1
                                  }}
                                />
                              ))}
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Jul Block */}
                      <View className="items-center">
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9, marginBottom: 6 }}>Jul</Text>
                        <View style={{ flexDirection: "row" }}>
                          {gridColumns.slice(8, 13).map((col, colIdx) => (
                            <View key={`col-2-${colIdx}`} style={{ flexDirection: "column" }}>
                              {col.map((intensity, rowIdx) => (
                                <View 
                                  key={`cell-2-${colIdx}-${rowIdx}`}
                                  style={{
                                    width: 11,
                                    height: 11,
                                    borderRadius: 2.5,
                                    backgroundColor: getHeatmapColor(intensity, baseColor),
                                    margin: 1
                                  }}
                                />
                              ))}
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>

                    {/* Summary Habit Stats row - Inspiration Layout */}
                    <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16, marginTop: 4 }} className="flex-row items-center justify-between">
                      <View>
                        <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 13 }}>
                          Longest Streak:  <Text style={{ fontFamily: getFontFamily("Bold") }}>{streak + 4} 💧</Text>
                        </Text>
                        <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 13, marginTop: 4 }}>
                          Current Streak:  <Text style={{ fontFamily: getFontFamily("Bold") }}>{streak} 🔥</Text>
                        </Text>
                      </View>

                      <TouchableOpacity 
                        style={{
                          borderWidth: 1.5,
                          borderColor: theme.primary,
                          borderRadius: 20,
                          paddingHorizontal: 16,
                          paddingVertical: 6,
                        }}
                      >
                        <Text style={{ color: theme.primary, fontFamily: getFontFamily("Bold"), fontSize: 11 }}>
                          Mark Today
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View className="py-20 items-center justify-center">
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 13 }}>
                  No recurring tasks set up yet
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* VIEW B: FOCUS & MOOD ANALYTICS */
          <View>
            {/* Weekly Focus Comparative Bar Chart */}
            <View style={cardStyle}>
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 16, marginBottom: 4 }}>
                Weekly Focus Time
              </Text>
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 11, marginBottom: 20 }}>
                Cooperative comparison (You vs Sarah)
              </Text>

              {/* Chart Grid */}
              <View style={{ height: 180, flexDirection: "row", alignItems: "flex-end", paddingBottom: 10 }} className="border-b border-gray-200">
                {daysOfWeek.map((day, idx) => {
                  const myHeight = `${(myFocusHours[idx] / maxHours) * 100}%`;
                  const partnerHeight = `${(partnerFocusHours[idx] / maxHours) * 100}%`;

                  return (
                    <View key={idx} style={{ flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center" }}>
                      <View className="flex-row items-end">
                        {/* Jonathan Bar (Lavender) */}
                        <View 
                          style={{ 
                            height: myHeight as any, 
                            width: 8, 
                            backgroundColor: theme.primary, 
                            borderTopLeftRadius: 4, 
                            borderTopRightRadius: 4,
                            marginRight: 2 
                          }} 
                        />
                        {/* Sarah Bar (Sage Green) */}
                        <View 
                          style={{ 
                            height: partnerHeight as any, 
                            width: 8, 
                            backgroundColor: theme.accent, 
                            borderTopLeftRadius: 4, 
                            borderTopRightRadius: 4,
                            marginLeft: 2 
                          }} 
                        />
                      </View>
                      
                      {/* Day Label */}
                      <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 11, marginTop: 8 }}>
                        {day}
                      </Text>
                    </View>
                  );
                })}
              </View>
              
              {/* Legend Indicator info */}
              <View className="flex-row mt-4 justify-center">
                <View className="flex-row items-center mr-6">
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.primary, marginRight: 6 }} />
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 11 }}>You (Jonathan)</Text>
                </View>
                <View className="flex-row items-center">
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.accent, marginRight: 6 }} />
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 11 }}>Sarah</Text>
                </View>
              </View>
            </View>

            {/* Mood Scores Weekly Trend (Emoji-Free) */}
            <View style={cardStyle}>
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 16, marginBottom: 4 }}>
                Daily Mood Log
              </Text>
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 11, marginBottom: 16 }}>
                Your registered weekly check-in scores
              </Text>

              {/* Mood row grid */}
              <View className="flex-row justify-between mb-4">
                {daysOfWeek.map((day, idx) => {
                  const score = moodScores[idx];

                  return (
                    <View key={idx} className="items-center">
                      <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 10, marginBottom: 6 }}>
                        {day}
                      </Text>
                      <View style={{ backgroundColor: theme.backgroundSecondary }} className="w-9 h-9 rounded-full items-center justify-center">
                        {renderMoodIcon(score, 18, theme.text)}
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={{ backgroundColor: `${theme.primary}10`, padding: 12, borderRadius: 16 }} className="flex-row items-center">
                <Ionicons name="bulb-outline" size={16} color={theme.primary} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.primary, fontFamily: getFontFamily("Medium"), fontSize: 11, lineHeight: 16, flex: 1 }}>
                  You stayed focused 30 mins longer on days you logged a Great mood rating while co-working with Sarah.
                </Text>
              </View>
            </View>

            {/* Distractions logs */}
            <View style={cardStyle}>
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 16, marginBottom: 4 }}>
                Top Distractions
              </Text>
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 11, marginBottom: 20 }}>
                Logged causes from your study misses
              </Text>

              {distractions.map((dist, idx) => (
                <View key={idx} className="mb-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text style={{ color: theme.text, fontFamily: getFontFamily("Medium"), fontSize: 12 }}>
                      {dist.source}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 12 }}>
                      {dist.percentage}%
                    </Text>
                  </View>
                  
                  {/* Progress Line */}
                  <View style={{ backgroundColor: theme.backgroundSecondary }} className="h-2 w-full rounded-full overflow-hidden">
                    <View 
                      style={{ 
                        backgroundColor: dist.color, 
                        width: `${dist.percentage}%` 
                      }} 
                      className="h-full rounded-full" 
                    />
                  </View>
                </View>
              ))}

              <View style={{ backgroundColor: `${theme.warning}10`, padding: 12, borderRadius: 16, marginTop: 12 }} className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color={theme.warning} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.warning, fontFamily: getFontFamily("Medium"), fontSize: 11, lineHeight: 16, flex: 1 }}>
                  Most distractions occurred between 2 PM and 4 PM. Try planning a Pomodoro co-working session in this block!
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Dynamic Detailed Habit Modal */}
      {selectedHabit && (() => {
        const baseColor = selectedHabit.color;
        const totalCompletions = selectedHabit.contributions.filter(c => c > 0).length;
        const successRate = Math.round((totalCompletions / 91) * 100);
        const streak = getStreak(selectedHabit.contributions);

        // Group 91 contributions into 13 columns of 7 days
        const gridColumns = [];
        for (let i = 0; i < 13; i++) {
          gridColumns.push(selectedHabit.contributions.slice(i * 7, (i + 1) * 7));
        }

        return (
          <Modal
            transparent
            visible={!!selectedHabit}
            animationType="none"
            onRequestClose={() => setSelectedHabit(null)}
          >
            <View style={[StyleSheet.absoluteFill, { zIndex: 99999, justifyContent: "flex-end" }]}>
              {/* Translucent Backdrop - Tap empty space to close */}
              <TouchableWithoutFeedback onPress={() => setSelectedHabit(null)}>
                <Animated.View 
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                  style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0, 0, 0, 0.4)" }]}
                />
              </TouchableWithoutFeedback>

              {/* Modal Container */}
              <Animated.View 
                entering={SlideInDown.duration(250)}
                exiting={SlideOutDown.duration(200)}
                style={{ 
                  backgroundColor: theme.cardBg, 
                  borderTopLeftRadius: theme.borderRadiusCard, 
                  borderTopRightRadius: theme.borderRadiusCard,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderWidth: theme.borderWidth,
                  borderColor: theme.border,
                  paddingHorizontal: 24,
                  paddingTop: 24,
                  paddingBottom: Platform.OS === "ios" ? 40 : 32,
                  maxHeight: "85%",
                }}
              >
                {/* Drag Handle indicator */}
                <View 
                  style={{ 
                    width: 40, 
                    height: 5, 
                    borderRadius: 2.5, 
                    backgroundColor: theme.border, 
                    alignSelf: "center", 
                    marginBottom: 20 
                  }} 
                />

                {/* Modal Title Row */}
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 20 }}>
                      {selectedHabit.name}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 12, marginTop: 2 }}>
                      {selectedHabit.category} Habit • Detailed Analysis
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setSelectedHabit(null)}
                    style={{ 
                      backgroundColor: theme.backgroundSecondary,
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Ionicons name="close" size={18} color={theme.text} />
                  </TouchableOpacity>
                </View>

                {/* scrollable instruction indicator */}
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 10, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  90-Day History (Swipe horizontally to view full log)
                </Text>

                {/* Scrollable Heatmap Container */}
                <View 
                  style={{ 
                    backgroundColor: theme.background, 
                    borderColor: theme.border, 
                    borderWidth: theme.borderWidth,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 24,
                    alignItems: "center"
                  }}
                >
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
                    <View style={{ flexDirection: "row" }}>
                      {gridColumns.map((col, colIdx) => (
                        <View key={`col-${colIdx}`} style={{ flexDirection: "column" }}>
                          {col.map((intensity, rowIdx) => (
                            <View 
                              key={`cell-${colIdx}-${rowIdx}`}
                              style={{
                                width: 15,
                                height: 15,
                                borderRadius: 3.5,
                                backgroundColor: getHeatmapColor(intensity, baseColor),
                                margin: 2
                              }}
                            />
                          ))}
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Detailed Analytics Grid */}
                <View className="mb-6">
                  <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 14, marginBottom: 12 }}>
                    Habit Performance
                  </Text>

                  <View className="flex-row flex-wrap justify-between">
                    {/* stat 1 */}
                    <View 
                      style={{ 
                        width: "48%", 
                        backgroundColor: theme.background, 
                        borderColor: theme.border, 
                        borderWidth: theme.borderWidth,
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 12
                      }}
                    >
                      <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 10, textTransform: "uppercase" }}>
                        Current Streak
                      </Text>
                      <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 20, marginTop: 4 }}>
                        {streak} days
                      </Text>
                    </View>

                    {/* stat 2 */}
                    <View 
                      style={{ 
                        width: "48%", 
                        backgroundColor: theme.background, 
                        borderColor: theme.border, 
                        borderWidth: theme.borderWidth,
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 12
                      }}
                    >
                      <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 10, textTransform: "uppercase" }}>
                        Completions
                      </Text>
                      <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 20, marginTop: 4 }}>
                        {totalCompletions} / 91
                      </Text>
                    </View>

                    {/* stat 3 */}
                    <View 
                      style={{ 
                        width: "48%", 
                        backgroundColor: theme.background, 
                        borderColor: theme.border, 
                        borderWidth: theme.borderWidth,
                        borderRadius: 12,
                        padding: 12
                      }}
                    >
                      <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 10, textTransform: "uppercase" }}>
                        Success Rate
                      </Text>
                      <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 20, marginTop: 4 }}>
                        {successRate}%
                      </Text>
                    </View>

                    {/* stat 4 */}
                    <View 
                      style={{ 
                        width: "48%", 
                        backgroundColor: theme.background, 
                        borderColor: theme.border, 
                        borderWidth: theme.borderWidth,
                        borderRadius: 12,
                        padding: 12
                      }}
                    >
                      <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 10, textTransform: "uppercase" }}>
                        Longest Streak
                      </Text>
                      <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 20, marginTop: 4 }}>
                        {streak + 4} days
                      </Text>
                    </View>
                  </View>
                </View>

              </Animated.View>
            </View>
          </Modal>
        );
      })()}
    </View>
  );
};

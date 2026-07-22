import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  Platform
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTasks, Task } from "../contexts/TasksContext";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import Animated, { 
  LinearTransition 
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
                const successRate = Math.round((totalCompletions / 91) * 100);
                const streak = getStreak(habit.contributions);

                return (
                  <View 
                    key={habit.id}
                    style={cardStyle}
                  >
                    {/* Habit Card Header */}
                    <View className="flex-row items-center justify-between mb-4">
                      <View>
                        <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 18 }}>
                          {habit.name}
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 11, marginTop: 1 }}>
                          {habit.category} Habit
                        </Text>
                      </View>
                      <View style={{ backgroundColor: `${baseColor}15` }} className="px-2.5 py-1 rounded-full">
                        <Text style={{ color: baseColor, fontFamily: getFontFamily("Bold"), fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          Active
                        </Text>
                      </View>
                    </View>

                    {/* Dynamic Heatmap Grid (13 weeks x 7 days) */}
                    <View className="mb-4 bg-white p-4 rounded-2xl border" style={{ borderColor: theme.border, alignItems: "center" }}>
                      <View className="flex-row items-center">
                        {/* Day Labels Column on Left */}
                        <View className="justify-between pr-2.5" style={{ height: 95, paddingVertical: 2 }}>
                          <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 8 }}>Mon</Text>
                          <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 8 }}>Wed</Text>
                          <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 8 }}>Fri</Text>
                        </View>
                        
                        <View>
                          {/* Months Top Header Row */}
                          <View className="flex-row justify-between mb-1.5 px-0.5" style={{ width: 13 * 15 }}>
                            <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9 }}>May</Text>
                            <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9 }}>Jun</Text>
                            <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9 }}>Jul</Text>
                          </View>

                          <View style={{ flexDirection: "row" }}>
                            {gridColumns.map((col, colIdx) => (
                              <View key={`col-${colIdx}`} style={{ flexDirection: "column" }}>
                                {col.map((intensity, rowIdx) => (
                                  <View 
                                    key={`cell-${colIdx}-${rowIdx}`}
                                    style={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: 3,
                                      backgroundColor: getHeatmapColor(intensity, baseColor),
                                      margin: 1.5
                                    }}
                                  />
                                ))}
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>

                      {/* Heatmap Legend */}
                      <View className="flex-row justify-between items-center w-full mt-4 border-t pt-3" style={{ borderTopColor: theme.border }}>
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 10 }}>
                          Last 3 months
                        </Text>
                        <View className="flex-row items-center">
                          <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 10, marginRight: 6 }}>Less</Text>
                          <View style={{ width: 10, height: 10, borderRadius: 2.5, backgroundColor: theme.backgroundSecondary, marginRight: 3 }} />
                          <View style={{ width: 10, height: 10, borderRadius: 2.5, backgroundColor: `${baseColor}40`, marginRight: 3 }} />
                          <View style={{ width: 10, height: 10, borderRadius: 2.5, backgroundColor: `${baseColor}80`, marginRight: 3 }} />
                          <View style={{ width: 10, height: 10, borderRadius: 2.5, backgroundColor: baseColor, marginRight: 6 }} />
                          <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 10 }}>More</Text>
                        </View>
                      </View>
                    </View>

                    {/* Summary Habit Stats row - Styled as clean micro-cards */}
                    <View className="flex-row justify-between">
                      {/* Metric 1 */}
                      <View style={{ backgroundColor: theme.backgroundSecondary, borderRadius: theme.borderRadiusButton, padding: 10, flex: 1, marginRight: 6, alignItems: "center" }}>
                        <Ionicons name="flame" size={16} color="#FF6D00" style={{ marginBottom: 4 }} />
                        <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 14 }}>
                          {streak}d
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 8, marginTop: 2, textTransform: "uppercase" }}>
                          Streak
                        </Text>
                      </View>

                      {/* Metric 2 */}
                      <View style={{ backgroundColor: theme.backgroundSecondary, borderRadius: theme.borderRadiusButton, padding: 10, flex: 1, marginHorizontal: 3, alignItems: "center" }}>
                        <Ionicons name="checkmark-circle" size={16} color={theme.accent} style={{ marginBottom: 4 }} />
                        <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 14 }}>
                          {totalCompletions}
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 8, marginTop: 2, textTransform: "uppercase" }}>
                          Done
                        </Text>
                      </View>

                      {/* Metric 3 */}
                      <View style={{ backgroundColor: theme.backgroundSecondary, borderRadius: theme.borderRadiusButton, padding: 10, flex: 1, marginLeft: 6, alignItems: "center" }}>
                        <Ionicons name="trending-up" size={16} color={theme.primary} style={{ marginBottom: 4 }} />
                        <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 14 }}>
                          {successRate}%
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 8, marginTop: 2, textTransform: "uppercase" }}>
                          Rate
                        </Text>
                      </View>
                    </View>
                  </View>
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
    </View>
  );
};

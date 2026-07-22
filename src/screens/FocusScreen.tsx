import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { Ionicons, Feather } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolateColor,
  LinearTransition,
  FadeIn,
  FadeOut
} from "react-native-reanimated";

interface FocusScreenProps {
  onFullScreenToggle?: (isFullScreen: boolean) => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width, height } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.75;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type TimerMode = "Focus" | "Break";

interface Preset {
  label: string;
  focus: number;
  break: number;
  color: string;
  bgColor: string;
}

export const FocusScreen: React.FC<FocusScreenProps> = ({ onFullScreenToggle }) => {
  const { theme, currentTheme } = useTheme();
  const { showToast } = useToast();

  const getFontFamily = (weight: "Regular" | "Medium" | "Bold") => {
    switch (weight) {
      case "Regular": return theme.fontFamilyRegular;
      case "Medium": return theme.fontFamilyMedium;
      case "Bold": return theme.fontFamilyBold;
    }
  };

  const PRESETS: Preset[] = [
    { label: "15 min", focus: 15 * 60, break: 3 * 60, color: "#137333", bgColor: "#E6F4EA" },
    { label: "25 min", focus: 25 * 60, break: 5 * 60, color: "#1A73E8", bgColor: "#E8F0FE" },
    { label: "50 min", focus: 50 * 60, break: 10 * 60, color: "#D93025", bgColor: "#FCE8E6" },
  ];

  // Timer State
  const [activePresetIndex, setActivePresetIndex] = useState(1);
  const [mode, setMode] = useState<TimerMode>("Focus");
  const [duration, setDuration] = useState(PRESETS[1].focus);
  const [timeLeft, setTimeLeft] = useState(PRESETS[1].focus);
  const [totalDuration, setTotalDuration] = useState(PRESETS[1].focus);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState<"Focus" | "Break">("Focus");
  const [chatText, setChatText] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [totalFocusedMinutes, setTotalFocusedMinutes] = useState(85);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Animations
  const progress = useSharedValue(1);
  const bgScale = useSharedValue(0);

  const breakColor = theme.statusBar === "light" ? "#4B5563" : "#9CA3AF";
  const currentColor = mode === "Focus" ? PRESETS[activePresetIndex].color : breakColor;
  const currentBgColor = mode === "Focus" ? PRESETS[activePresetIndex].bgColor : breakColor;

  // Handle Timer Ticking (Robust drift-free implementation)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          const nextTime = prev - 1;
          progress.value = withTiming(nextTime / totalDuration, { duration: 1000, easing: Easing.linear });
          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, totalDuration]);

  const formatDuration = (secs: number) => {
    if (secs < 60) return `${secs} sec`;
    return `${Math.floor(secs / 60)} min`;
  };

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      if (currentMode === "Focus") {
        // Focus session finished!
        const elapsedMinutes = Math.floor(totalDuration / 60);
        setTotalFocusedMinutes(prev => prev + elapsedMinutes);
        
        // Transition to Break mode automatically
        const breakDuration = PRESETS[activePresetIndex].break;
        setTimeLeft(breakDuration);
        setTotalDuration(breakDuration);
        setCurrentMode("Break");
        setMode("Break");
        
        // Restart ticking in Break mode
        setIsRunning(true);
        progress.value = 1;

        showToast(`Focus Completed! Starting your ${formatDuration(breakDuration)} break.`, "success");
      } else {
        // Break session finished!
        setCompletedSessions(prev => prev + 1);

        // Transition back to Focus mode automatically
        const focusDuration = PRESETS[activePresetIndex].focus;
        setTimeLeft(focusDuration);
        setTotalDuration(focusDuration);
        setCurrentMode("Focus");
        setMode("Focus");

        // Restart ticking in Focus mode
        setIsRunning(true);
        progress.value = 1;

        showToast("Break Finished! Starting next Focus session.", "success");
      }
      
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      
      // Keep background scaled up for active mode
      bgScale.value = withTiming(2.5, { duration: 500, easing: Easing.out(Easing.ease) });
    }
  }, [timeLeft, isRunning, currentMode, activePresetIndex, totalDuration]);

  const toggleTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (onFullScreenToggle) onFullScreenToggle(true);
      bgScale.value = withTiming(2.5, { duration: 700, easing: Easing.out(Easing.exp) });
    } else {
      setIsRunning(false);
      if (onFullScreenToggle) onFullScreenToggle(false);
      bgScale.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
    }
  };

  const handleCompleteSession = () => {
    if (currentMode === "Focus") {
      const elapsedSeconds = totalDuration - timeLeft;
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      if (elapsedMinutes > 0) {
        setTotalFocusedMinutes(prev => prev + elapsedMinutes);
      }
    }
    resetTimer(PRESETS[activePresetIndex].focus, "Focus");
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    if (onFullScreenToggle) onFullScreenToggle(false);
    bgScale.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
  };

  const handleCancelSession = () => {
    resetTimer(PRESETS[activePresetIndex].focus, "Focus");
    if (onFullScreenToggle) onFullScreenToggle(false);
    bgScale.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
  };

  const resetTimer = (newTime: number, mode: TimerMode, presetIndex?: number) => {
    setIsRunning(false);
    setTimeLeft(newTime);
    setTotalDuration(newTime);
    setMode(mode);
    setCurrentMode(mode);
    if (presetIndex !== undefined) setActivePresetIndex(presetIndex);
    progress.value = withTiming(1, { duration: 300 });
    setShowCelebration(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCUMFERENCE * (1 - progress.value)
    };
  });

  const bgAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bgScale.value }],
      backgroundColor: currentColor,
    };
  });

  const fadeOutStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isRunning ? 0 : 1, { duration: 150 }),
      transform: [{ translateY: withTiming(isRunning ? 15 : 0, { duration: 200 }) }]
    };
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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

      <View style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]} pointerEvents="none">
        <Animated.View
          style={[
            {
              width: height,
              height: height,
              borderRadius: height / 2,
              position: "absolute",
            },
            bgAnimatedStyle
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        pointerEvents={isRunning ? "box-none" : "auto"}
      >
        <Animated.View style={[{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }, fadeOutStyle]} pointerEvents={isRunning ? "none" : "auto"}>
          <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 24 }}>Focus</Text>
        </Animated.View>

        <Animated.View style={[{ alignSelf: "flex-start", backgroundColor: theme.cardBg, borderRadius: theme.borderRadiusButton, borderWidth: theme.borderWidth, borderColor: theme.border, paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row", alignItems: "center", marginBottom: 24 }, fadeOutStyle]}>
          <Ionicons name="flame" size={14} color="#FF6D00" />
          <Text style={{ fontFamily: getFontFamily("Medium"), color: theme.textSecondary, fontSize: 13, marginLeft: 6 }}>
            Today: <Text style={{ fontFamily: getFontFamily("Bold"), color: theme.text }}>{Math.floor(totalFocusedMinutes / 60)}h {totalFocusedMinutes % 60}m</Text> focused • <Text style={{ fontFamily: getFontFamily("Bold"), color: theme.text }}>{completedSessions}</Text> {completedSessions === 1 ? "session" : "sessions"}
          </Text>
        </Animated.View>

        <Animated.View
          style={[{
            flexDirection: "row",
            backgroundColor: theme.cardBg,
            borderRadius: theme.borderRadiusCard,
            borderWidth: theme.borderWidth,
            borderColor: theme.border,
            padding: 4,
            marginBottom: 40,
            position: "relative"
          }, fadeOutStyle]}
          pointerEvents={isRunning ? "none" : "auto"}
        >
          <View style={{ position: "absolute", top: 4, bottom: 4, left: 4, right: 4 }}>
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: activePresetIndex === 0 ? "0%" : (activePresetIndex === 1 ? "33.33%" : "66.66%"),
                width: "33.33%",
                backgroundColor: currentBgColor,
                borderRadius: theme.borderRadiusButton,
              }}
              layout={LinearTransition.duration(200)}
            />
          </View>

          {PRESETS.map((preset, idx) => {
            const isSelected = activePresetIndex === idx;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => resetTimer(preset.focus, "Focus", idx)}
                style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 12, zIndex: 2 }}
                activeOpacity={0.8}
              >
                <Text style={{
                  color: isSelected ? preset.color : theme.textSecondary,
                  fontFamily: getFontFamily("Bold"),
                  fontSize: 14
                }}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </Animated.View>

        <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 20 }}>
          <View style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, alignItems: "center", justifyContent: "center" }}>
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={{ position: "absolute" }}>
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke={isRunning ? "rgba(255,255,255,0.2)" : theme.cardBg}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              <AnimatedCircle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke={isRunning ? "#FFFFFF" : currentColor}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                animatedProps={animatedProps}
                strokeLinecap="round"
                rotation="-90"
                originX={CIRCLE_SIZE / 2}
                originY={CIRCLE_SIZE / 2}
              />
            </Svg>

            <View style={{ alignItems: "center" }}>
              <Text style={{
                color: isRunning ? "#FFFFFF" : theme.text,
                fontFamily: getFontFamily("Bold"),
                fontSize: 64,
                letterSpacing: 2,
                includeFontPadding: false
              }}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={{
                color: isRunning ? "rgba(255,255,255,0.8)" : theme.textSecondary,
                fontFamily: getFontFamily("Medium"),
                fontSize: 16,
                marginTop: 4,
                textTransform: "uppercase",
                letterSpacing: 1
              }}>
                {mode}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: "center", marginTop: 40, flexDirection: "row", justifyContent: "center" }}>
            {(isRunning || timeLeft < totalDuration) && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <TouchableOpacity
                  onPress={handleCancelSession}
                  activeOpacity={0.7}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 20,
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>
            )}

            <TouchableOpacity
              onPress={toggleTimer}
              activeOpacity={0.8}
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: isRunning ? "#FFFFFF" : currentColor,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: currentColor,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Ionicons
                name={isRunning ? "pause" : (showCelebration ? "refresh" : "play")}
                size={36}
                color={isRunning ? currentColor : "#FFFFFF"}
                style={{ marginLeft: (!isRunning && !showCelebration) ? 4 : 0 }}
              />
            </TouchableOpacity>

            {(isRunning || timeLeft < totalDuration) && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <TouchableOpacity
                  onPress={handleCompleteSession}
                  activeOpacity={0.7}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 20,
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>

        <Animated.View style={[{ marginTop: 40 }, fadeOutStyle]} pointerEvents={isRunning ? "none" : "auto"}>
          <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 18, marginBottom: 16 }}>
            Focus Together (Live)
          </Text>
          <View style={{ backgroundColor: theme.cardBg, borderRadius: theme.borderRadiusCard, borderWidth: theme.borderWidth, borderColor: theme.border, padding: 20 }}>
            {/* Live Status Row */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#E0F2FE", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                <Feather name="monitor" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 16 }}>Sarah is focusing</Text>
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 14 }}>12:45 remaining</Text>
              </View>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: theme.background, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: theme.border }}>
                <Feather name="heart" size={16} color={theme.textSecondary} />
              </View>
            </View>

            {/* Simulated Chat Feed */}
            <View style={{ backgroundColor: theme.background, borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <Text style={{ color: theme.primary, fontFamily: getFontFamily("Bold"), fontSize: 13, marginRight: 8 }}>You</Text>
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 13 }}>Let's crush this session!</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: theme.accent, fontFamily: getFontFamily("Bold"), fontSize: 13, marginRight: 8 }}>Sarah</Text>
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Regular"), fontSize: 13 }}>Already on it</Text>
              </View>
            </View>

            {/* Input Field */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                value={chatText}
                onChangeText={setChatText}
                placeholder="Send encouragement..."
                placeholderTextColor={theme.textSecondary}
                style={{
                  flex: 1,
                  backgroundColor: theme.background,
                  borderRadius: theme.borderRadiusButton,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  color: theme.text,
                  fontFamily: getFontFamily("Regular"),
                  fontSize: 14,
                  borderWidth: theme.borderWidth,
                  borderColor: theme.border
                }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: chatText ? theme.primary : theme.border,
                  width: 44,
                  height: 44,
                  borderRadius: theme.borderRadiusButton,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 12,
                  borderWidth: currentTheme === "mario" ? theme.borderWidth : 0,
                  borderColor: "#000000"
                }}
              >
                <Ionicons name="send" size={18} color={chatText ? "#FFFFFF" : theme.textSecondary} style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  Modal, 
  TextInput, 
  Alert,
  Image
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { Ionicons, Feather } from "@expo/vector-icons";
import Animated, { 
  LinearTransition, 
  FadeIn, 
  FadeOut,
  SlideInDown,
  SlideOutDown
} from "react-native-reanimated";

interface Task {
  id: string;
  title: string;
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "10:15 AM"
  category: "To Do" | "Reminder" | "Event";
  owner: "Jonathan" | "Sarah" | "Shared" | "Self";
  date: number; // Day of the month
  month: number; // 0-11
  year: number;
  completed: boolean;
}

const AVATARS = {
  Jonathan: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  Sarah: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  Self: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
};

const parseTimeToMinutes = (timeStr: string) => {
  const parts = timeStr.trim().split(" ");
  if (parts.length < 2) return 0;
  const [time, modifier] = parts;
  const [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10) || 0;

  if (hours === 12) {
    hours = 0;
  }
  if (modifier === "PM") {
    hours += 12;
  }
  return hours * 60 + minutes;
};

// Generate relative mock data so there are always active items on "Today"
const getMockTasks = (today: Date): Task[] => {
  const tD = today.getDate();
  const tM = today.getMonth();
  const tY = today.getFullYear();

  const prevDay = new Date(today);
  prevDay.setDate(tD - 1);
  
  const nextDay = new Date(today);
  nextDay.setDate(tD + 1);

  return [
    {
      id: "1",
      title: "Call Bhavin",
      startTime: "08:00 AM",
      endTime: "08:45 AM",
      category: "Reminder",
      owner: "Jonathan",
      date: tD,
      month: tM,
      year: tY,
      completed: false
    },
    {
      id: "2",
      title: "Design 2 App Screens",
      startTime: "09:00 AM",
      endTime: "10:15 AM",
      category: "To Do",
      owner: "Shared",
      date: tD,
      month: tM,
      year: tY,
      completed: false
    },
    {
      id: "3",
      title: "Meeting with Jhon",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      category: "Event",
      owner: "Sarah",
      date: tD,
      month: tM,
      year: tY,
      completed: true
    },
    {
      id: "4",
      title: "Website audit review",
      startTime: "11:20 AM",
      endTime: "12:20 PM",
      category: "To Do",
      owner: "Jonathan",
      date: nextDay.getDate(),
      month: nextDay.getMonth(),
      year: nextDay.getFullYear(),
      completed: false
    },
    {
      id: "5",
      title: "Meeting with Client",
      startTime: "12:30 PM",
      endTime: "01:00 PM",
      category: "Event",
      owner: "Shared",
      date: nextDay.getDate(),
      month: nextDay.getMonth(),
      year: nextDay.getFullYear(),
      completed: false
    },
    {
      id: "6",
      title: "Review reflections",
      startTime: "02:00 PM",
      endTime: "02:30 PM",
      category: "Reminder",
      owner: "Sarah",
      date: prevDay.getDate(),
      month: prevDay.getMonth(),
      year: prevDay.getFullYear(),
      completed: false
    }
  ];
};

const HOURS = [
  "08 AM", "09 AM", "10 AM", "11 AM", "12 PM", 
  "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", 
  "06 PM", "07 PM", "08 PM"
];

interface CalendarScreenProps {
  onModalToggle?: (visible: boolean) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onModalToggle }) => {
  const { theme, currentTheme } = useTheme();
  const { showToast } = useToast();

  // "week" for Weekly Timeline, "month" for Month Grid
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  
  // Dynamic current date state synced with the device
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Dynamic Tasks State
  const [tasks, setTasks] = useState<Task[]>(getMockTasks(currentDate));

  // Form inputs
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("09:00 AM");
  const [newEnd, setNewEnd] = useState("10:00 AM");
  const [newCategory, setNewCategory] = useState<Task["category"]>("To Do");
  const [newOwner, setNewOwner] = useState<Task["owner"]>("Self");

  const handleAddTask = () => {
    if (newTitle.trim() === "") {
      showToast("Please enter an activity title.", "error");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle,
      startTime: newStart,
      endTime: newEnd,
      category: newCategory,
      owner: newOwner,
      date: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      completed: false
    };

    setTasks(prev => [...prev, newTask].sort((a, b) => {
      return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
    }));
    
    setIsModalVisible(false);
    if (onModalToggle) onModalToggle(false);
    setNewTitle("");
    setNewStart("09:00 AM");
    setNewEnd("10:00 AM");
    setNewCategory("To Do");
    setNewOwner("Self");
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getWeekDays = (selectedDate: Date) => {
    const currentDayOfWeek = selectedDate.getDay(); 
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - currentDayOfWeek);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDays.push(d);
    }
    return weekDays;
  };

  const getDayName = (date: Date) => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names[date.getDay()];
  };

  const getCategoryColor = (category: Task["category"]) => {
    switch (category) {
      case "Reminder":
        return "#E0F2FE"; 
      case "To Do":
        return "#DCFCE7"; 
      case "Event":
        return "#FFEDD5"; 
      default:
        return "#F3F4F6";
    }
  };

  const getCategoryAccent = (category: Task["category"]) => {
    switch (category) {
      case "Reminder":
        return "#0284C7"; 
      case "To Do":
        return "#15803D"; 
      case "Event":
        return "#EA580C"; 
      default:
        return theme.text;
    }
  };

  const renderAvatars = (owner: Task["owner"], size: number = 24) => {
    if (owner === "Jonathan") {
      return (
        <Image 
          source={{ uri: AVATARS.Jonathan }} 
          style={{ width: size, height: size, borderRadius: size / 2 }} 
          className="border border-white"
        />
      );
    }
    if (owner === "Sarah") {
      return (
        <Image 
          source={{ uri: AVATARS.Sarah }} 
          style={{ width: size, height: size, borderRadius: size / 2 }} 
          className="border border-white"
        />
      );
    }
    return (
      <View className="flex-row items-center">
        <Image 
          source={{ uri: AVATARS.Jonathan }} 
          style={{ width: size, height: size, borderRadius: size / 2 }} 
          className="border border-white"
        />
        <Image 
          source={{ uri: AVATARS.Sarah }} 
          style={{ width: size, height: size, borderRadius: size / 2, marginLeft: -size / 2.5 }} 
          className="border border-white"
        />
      </View>
    );
  };

  const generateMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay(); 
    const totalDays = new Date(year, month + 1, 0).getDate(); 
    const prevMonthDays = new Date(year, month, 0).getDate(); 

    const gridDays = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      gridDays.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        dateObject: new Date(year, month - 1, prevMonthDays - i)
      });
    }

    for (let i = 1; i <= totalDays; i++) {
      gridDays.push({
        day: i,
        isCurrentMonth: true,
        dateObject: new Date(year, month, i)
      });
    }

    const remaining = 42 - gridDays.length;
    for (let i = 1; i <= remaining; i++) {
      gridDays.push({
        day: i,
        isCurrentMonth: false,
        dateObject: new Date(year, month + 1, i)
      });
    }

    return gridDays;
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(t => {
      return t.date === date.getDate() && 
             t.month === date.getMonth() && 
             t.year === date.getFullYear();
    });
  };

  const dayTasks = getTasksForDate(currentDate);
  const weekDays = getWeekDays(currentDate);

  const START_MINUTES = 480; // 08:00 AM
  const HOUR_HEIGHT = 80;
  const pixelsPerMinute = HOUR_HEIGHT / 60;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Background Watermark Leaves */}
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, overflow: "hidden" }} pointerEvents="none">
        <Ionicons 
          name="leaf" 
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
          name="leaf" 
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
      
      {/* Title & Floating Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <View className="flex-row items-center justify-between mb-4">
          <Text style={{ color: theme.text, fontFamily: "Outfit_700Bold", fontSize: 24 }}>
            Calendar
          </Text>
          
          {/* Header Subtitle showing Month & Year with slider controls for Month view */}
          {viewMode === "month" && (
            <View style={{ backgroundColor: theme.cardBg, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadiusButton }} className="flex-row items-center px-2 py-1">
              <TouchableOpacity 
                onPress={() => {
                  const d = new Date(currentDate);
                  d.setMonth(currentDate.getMonth() - 1);
                  setCurrentDate(d);
                }}
                className="p-1"
              >
                <Ionicons name="chevron-back" size={16} color={theme.text} />
              </TouchableOpacity>
              
              <Text style={{ color: theme.text, fontFamily: "Outfit_700Bold", fontSize: 13, marginHorizontal: 8 }}>
                {currentDate.toLocaleDateString("default", { month: "short", year: "2-digit" })}
              </Text>

              <TouchableOpacity 
                onPress={() => {
                  const d = new Date(currentDate);
                  d.setMonth(currentDate.getMonth() + 1);
                  setCurrentDate(d);
                }}
                className="p-1"
              >
                <Ionicons name="chevron-forward" size={16} color={theme.text} />
              </TouchableOpacity>
            </View>
          )}

          {viewMode === "week" && (
            <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_700Bold", fontSize: 14 }}>
              {currentDate.toLocaleDateString("default", { month: "long", day: "numeric" })}
            </Text>
          )}
        </View>

        {/* Dynamic Signature Sliding Segmented Pill Toggle */}
        <View 
          style={{ 
            backgroundColor: theme.cardBg, 
            borderColor: theme.border, 
            borderWidth: theme.borderWidth, 
            borderRadius: theme.borderRadiusCard,
            position: "relative" 
          }} 
          className="flex-row p-1 mb-5"
        >
          <Animated.View 
            style={{
              position: "absolute",
              top: 4,
              bottom: 4,
              left: viewMode === "week" ? "1%" : "51%",
              width: "48%",
              backgroundColor: theme.primary,
              borderRadius: theme.borderRadiusButton,
            }}
            layout={LinearTransition.duration(300)}
          />

          <TouchableOpacity 
            onPress={() => setViewMode("week")}
            className="flex-1 py-2 items-center justify-center rounded-full"
            style={{ zIndex: 2 }}
          >
            <Text style={{ 
              color: viewMode === "week" ? theme.primaryContrast : theme.textSecondary,
              fontFamily: "Outfit_600SemiBold", 
              fontSize: 13 
            }}>
              Timeline
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setViewMode("month")}
            className="flex-1 py-2 items-center justify-center rounded-full"
            style={{ zIndex: 2 }}
          >
            <Text style={{ 
              color: viewMode === "month" ? theme.primaryContrast : theme.textSecondary,
              fontFamily: "Outfit_600SemiBold", 
              fontSize: 13 
            }}>
              Month Grid
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Modes */}
      {viewMode === "week" ? (
        /* SCREEN A: WEEKLY TIMELINE MODE */
        <View style={{ flex: 1 }}>
          {/* Horizontal Week Strip */}
          <View style={{ paddingHorizontal: 24 }} className="mb-4">
            <View className="flex-row justify-between">
              {weekDays.map((dateItem) => {
                const dayVal = dateItem.getDate();
                const isSelected = currentDate.getDate() === dayVal && currentDate.getMonth() === dateItem.getMonth();
                return (
                  <TouchableOpacity
                    key={dateItem.toString()}
                    onPress={() => setCurrentDate(dateItem)}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 4,
                      width: `${100 / 7}%`,
                    }}
                  >
                    <Text style={{ 
                      color: theme.textSecondary, 
                      fontFamily: "Outfit_600SemiBold", 
                      fontSize: 11,
                      marginBottom: 6 
                    }}>
                      {getDayName(dateItem)}
                    </Text>
                    {/* Consistent circular selection highlight */}
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: isSelected ? theme.primary : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ 
                        color: isSelected ? theme.primaryContrast : theme.text, 
                        fontFamily: "Outfit_700Bold", 
                        fontSize: 13 
                      }}>
                        {dayVal}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Timeline Table */}
          <ScrollView 
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row">
              {/* Timeline Hours Column */}
              <View style={{ width: 50, paddingTop: 10 }}>
                {HOURS.map((hour, idx) => (
                  <View key={idx} style={{ height: HOUR_HEIGHT, justifyContent: "flex-start" }}>
                    <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_600SemiBold", fontSize: 12, textAlign: "right", paddingRight: 10 }}>
                      {hour}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Guide Lines & Time Blocks */}
              <View style={{ flex: 1, position: "relative", minHeight: HOURS.length * HOUR_HEIGHT }}>
                {HOURS.map((hour, idx) => (
                  <View 
                    key={`line-${idx}`} 
                    style={{ 
                      position: "absolute",
                      top: idx * HOUR_HEIGHT + 10,
                      left: 0,
                      right: 0,
                      height: 1,
                      backgroundColor: theme.border
                    }} 
                  />
                ))}

                {/* Dotted current time indicator line */}
                <View 
                  style={{
                    position: "absolute",
                    top: 1.5 * HOUR_HEIGHT + 10, // Simulated indicator at 09:30 AM
                    left: 0,
                    right: 0,
                    borderBottomWidth: 1.5,
                    borderStyle: "dashed",
                    borderColor: theme.primary,
                    zIndex: 5
                  }}
                />

                {/* Render cards based on layout coordinates */}
                {dayTasks.length > 0 ? (
                  dayTasks.map((task) => {
                    const startM = parseTimeToMinutes(task.startTime);
                    const endM = parseTimeToMinutes(task.endTime);

                    const top = Math.max(0, (startM - START_MINUTES) * pixelsPerMinute) + 10;
                    const height = Math.max(50, (endM - startM) * pixelsPerMinute);

                    const cardBg = getCategoryColor(task.category);
                    const accentColor = getCategoryAccent(task.category);

                    const getIcon = () => {
                      switch (task.category) {
                        case "Reminder":
                          return <Feather name="bell" size={15} color={accentColor} />;
                        case "To Do":
                          return (
                            <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)}>
                              <Ionicons 
                                name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                                size={18} 
                                color={accentColor} 
                              />
                            </TouchableOpacity>
                          );
                        case "Event":
                          return <Feather name="calendar" size={15} color={accentColor} />;
                      }
                    };

                    return (
                      <TouchableOpacity
                        key={task.id}
                        activeOpacity={0.9}
                        style={{
                          position: "absolute",
                          top: top,
                          left: 10,
                          right: 0,
                          height: height - 6,
                          backgroundColor: theme.cardBg,
                          borderRadius: theme.borderRadiusCard,
                          borderWidth: theme.borderWidth,
                          borderColor: theme.border,
                          padding: 12,
                          justifyContent: "space-between",
                          shadowColor: theme.text,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.03,
                          shadowRadius: 5,
                          elevation: 1,
                          overflow: 'hidden'
                        }}
                      >
                        <View className="flex-row justify-between items-start">
                          <View style={{ flex: 1, marginRight: 8, flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
                            <View 
                              style={{ backgroundColor: `${accentColor}15`, marginTop: 1 }} 
                              className="px-2 py-0.5 rounded-full mr-2"
                            >
                              <Text style={{ color: accentColor, fontFamily: "Outfit_700Bold", fontSize: 8, textTransform: "uppercase" }}>
                                {task.category}
                              </Text>
                            </View>
                            <Text 
                              style={{ 
                                color: theme.text, 
                                fontFamily: "Outfit_700Bold", 
                                fontSize: 13, 
                                lineHeight: 16,
                                textDecorationLine: task.completed ? "line-through" : "none",
                                opacity: task.completed ? 0.6 : 1,
                                flexShrink: 1
                              }}
                              numberOfLines={1}
                            >
                              {task.title}
                            </Text>
                          </View>
                          {getIcon()}
                        </View>

                        <View className="flex-row items-center justify-between mt-1">
                          <View className="flex-row items-center">
                            <Feather name="clock" size={11} color={theme.textSecondary} style={{ marginRight: 4 }} />
                            <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_500Medium", fontSize: 9 }}>
                              {task.startTime.replace(" ", "")} - {task.endTime.replace(" ", "")}
                            </Text>
                          </View>
                          {renderAvatars(task.owner, 20)}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View className="py-20 items-center justify-center">
                    <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_500Medium", fontSize: 12 }}>
                      No timeline tasks for today
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        /* SCREEN B: MONTHLY AGENDA GRID */
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Calendar Month Grid */}
          <View style={{ paddingHorizontal: 16 }} className="mb-4">
            <View className="flex-row justify-between mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                <Text 
                  key={dayName} 
                  style={{ 
                    color: theme.textSecondary, 
                    fontFamily: "Outfit_600SemiBold", 
                    fontSize: 11, 
                    textAlign: "center", 
                    width: `${100 / 7}%` 
                  }}
                >
                  {dayName}
                </Text>
              ))}
            </View>
            
            {/* 42 days grid mapping */}
            <View className="flex-row flex-wrap">
              {generateMonthGrid().map((dayItem, idx) => {
                const isSelected = currentDate.getDate() === dayItem.day && currentDate.getMonth() === dayItem.dateObject.getMonth();
                const dayTasks = getTasksForDate(dayItem.dateObject);
                const isCurrentMonth = dayItem.isCurrentMonth;

                return (
                  <TouchableOpacity
                    key={`month-day-${idx}`}
                    onPress={() => setCurrentDate(dayItem.dateObject)}
                    style={{
                      width: `${100 / 7}%`,
                      height: 52,
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {/* Perfect Dynamic Circle Selection Highlight */}
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18, 
                        backgroundColor: isSelected ? theme.primary : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{
                        color: isSelected ? theme.primaryContrast : isCurrentMonth ? theme.text : `${theme.text}40`,
                        fontFamily: isSelected ? "Outfit_700Bold" : "Outfit_500Medium",
                        fontSize: 13
                      }}>
                        {dayItem.day}
                      </Text>
                    </View>
                    
                    {/* Color-coded calendar dots indicator */}
                    <View className="flex-row justify-center mt-0.5" style={{ position: "absolute", bottom: 2 }}>
                      {dayTasks.slice(0, 3).map((t, idxDot) => (
                        <View 
                          key={idxDot}
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: t.owner === "Jonathan" ? theme.primary : t.owner === "Sarah" ? theme.accent : theme.warning,
                            marginHorizontal: 1
                          }}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Static, Professional Today's Tasks Section */}
          <View 
            style={{ 
              borderTopWidth: 1, 
              borderTopColor: theme.border, 
              paddingTop: 16, 
              paddingHorizontal: 24 
            }}
            className="mb-4"
          >
            <Text style={{ color: theme.text, fontFamily: "Outfit_700Bold", fontSize: 16 }}>
              Today's Tasks
            </Text>
          </View>

          {/* Clean Flat List of Task Cards */}
          <View style={{ paddingHorizontal: 24 }}>
            {dayTasks.length > 0 ? (
              dayTasks.map((item) => {
                const ownerColor = item.owner === "Jonathan" ? theme.primary : item.owner === "Sarah" ? theme.accent : theme.warning;
                return (
                  <View 
                    key={item.id} 
                    style={{ 
                      backgroundColor: theme.cardBg, 
                      borderColor: theme.border, 
                      borderWidth: theme.borderWidth,
                      borderRadius: theme.borderRadiusCard,
                      shadowColor: "#000000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: currentTheme === "mario" ? 0 : 0.02,
                      shadowRadius: 6,
                      elevation: 1,
                      marginBottom: 10
                    }} 
                    className="p-4 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center flex-1 pr-4">
                      {/* Owner Color Indicator Bar */}
                      <View 
                        style={{ backgroundColor: ownerColor }} 
                        className="w-1.5 h-8 rounded-full mr-3"
                      />
                      
                      <View className="flex-1">
                        <Text style={{ 
                          color: "#1F1E24", 
                          fontFamily: "Outfit_700Bold", 
                          fontSize: 13, 
                          textDecorationLine: item.completed ? "line-through" : "none",
                          opacity: item.completed ? 0.6 : 1 
                        }}>
                          {item.title}
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_500Medium", fontSize: 10, marginTop: 2 }}>
                          {item.category} • {item.startTime} - {item.endTime}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center">
                      {renderAvatars(item.owner, 20)}
                      
                      {/* Interactive checkmark circle */}
                      <TouchableOpacity 
                        onPress={() => toggleTaskCompletion(item.id)} 
                        className="ml-3"
                      >
                        <Ionicons 
                          name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
                          size={22} 
                          color={item.completed ? theme.accent : theme.textSecondary} 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className="py-8 items-center justify-center">
                <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_500Medium", fontSize: 12 }}>
                  No tasks scheduled for today
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Floating Plus Action Button bottom-right (safe location above bottom dock) */}
      <TouchableOpacity
        onPress={() => {
          setIsModalVisible(true);
          if (onModalToggle) onModalToggle(true);
        }}
        style={{ 
          position: "absolute",
          bottom: 100, 
          right: 24,
          backgroundColor: theme.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 6,
          zIndex: 40
        }}
      >
        <Ionicons name="add" size={32} color={theme.primaryContrast} />
      </TouchableOpacity>

      {/* Premium Task Modal - Themed and structured */}
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
            <View className="flex-row items-center justify-between mb-6">
              <Text style={{ color: theme.text, fontFamily: "Outfit_700Bold", fontSize: 20 }}>
                Schedule Shared Entry
              </Text>
              <TouchableOpacity onPress={() => {
                setIsModalVisible(false);
                if (onModalToggle) onModalToggle(false);
              }}>
                <Ionicons name="close-circle" size={28} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Input: Title */}
            <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_600SemiBold", fontSize: 13, marginBottom: 8 }}>
              Activity Title
            </Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="e.g. Design admin settings panel"
              placeholderTextColor="#9CA3AF"
              style={{ 
                backgroundColor: theme.background, 
                color: theme.text, 
                fontFamily: "Outfit_500Medium", 
                borderColor: theme.border, 
                borderWidth: theme.borderWidth,
                borderRadius: theme.borderRadiusButton
              }}
              className="p-4 mb-4"
            />

            {/* Time Selector - Horizontal Scroll Chips */}
            <View className="mb-4">
              <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_600SemiBold", fontSize: 13, marginBottom: 8 }}>
                Start Time
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" contentContainerStyle={{ paddingRight: 24 }}>
                {HOURS.map(hour => {
                  const timeStr = `${hour.split(" ")[0]}:00 ${hour.split(" ")[1]}`;
                  const isSelected = newStart === timeStr;
                  return (
                    <TouchableOpacity
                      key={`start-${hour}`}
                      onPress={() => setNewStart(timeStr)}
                      style={{
                        backgroundColor: isSelected ? theme.primary : theme.background,
                        borderColor: isSelected ? theme.primary : theme.border,
                        borderWidth: theme.borderWidth,
                        borderRadius: theme.borderRadiusButton,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        marginRight: 8
                      }}
                    >
                      <Text style={{ color: isSelected ? theme.primaryContrast : theme.text, fontFamily: "Outfit_600SemiBold", fontSize: 12 }}>
                        {timeStr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_600SemiBold", fontSize: 13, marginBottom: 8 }}>
                End Time
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
                {HOURS.map(hour => {
                  const timeStr = `${hour.split(" ")[0]}:00 ${hour.split(" ")[1]}`;
                  const isSelected = newEnd === timeStr;
                  return (
                    <TouchableOpacity
                      key={`end-${hour}`}
                      onPress={() => setNewEnd(timeStr)}
                      style={{
                        backgroundColor: isSelected ? theme.primary : theme.background,
                        borderColor: isSelected ? theme.primary : theme.border,
                        borderWidth: theme.borderWidth,
                        borderRadius: theme.borderRadiusButton,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        marginRight: 8
                      }}
                    >
                      <Text style={{ color: isSelected ? theme.primaryContrast : theme.text, fontFamily: "Outfit_600SemiBold", fontSize: 12 }}>
                        {timeStr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Selector: Category & Assignee */}
            <View className="flex-row mb-8">
              <View className="flex-1 mr-2">
                <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_600SemiBold", fontSize: 13, marginBottom: 8 }}>
                  Category
                </Text>
                <View className="flex-row items-center justify-between">
                  {["To Do", "Reminder", "Event"].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setNewCategory(cat as any)}
                      style={{
                        paddingBottom: 4,
                        borderBottomWidth: newCategory === cat ? 2 : 0,
                        borderBottomColor: theme.text
                      }}
                    >
                      <Text style={{ 
                        color: newCategory === cat ? theme.text : theme.textSecondary, 
                        fontFamily: "Outfit_600SemiBold", 
                        fontSize: 12
                      }}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-1 ml-4">
                <Text style={{ color: theme.textSecondary, fontFamily: "Outfit_600SemiBold", fontSize: 13, marginBottom: 8 }}>
                  Ownership
                </Text>
                <View className="flex-row p-1" style={{ backgroundColor: theme.background, borderRadius: theme.borderRadiusButton, borderWidth: theme.borderWidth, borderColor: theme.border }}>
                  {["Self", "Shared"].map((own) => (
                    <TouchableOpacity
                      key={own}
                      onPress={() => setNewOwner(own as any)}
                      style={{
                        backgroundColor: newOwner === own ? theme.text : "transparent",
                        flex: 1,
                        paddingVertical: 8,
                        borderRadius: theme.borderRadiusButton,
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ 
                        color: newOwner === own ? theme.primaryContrast : theme.textSecondary, 
                        fontFamily: "Outfit_600SemiBold", 
                        fontSize: 12
                      }}>
                        {own}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Action Buttons - Theme Cohesive styling */}
            <TouchableOpacity
              onPress={handleAddTask}
              style={{ backgroundColor: theme.primary, borderRadius: theme.borderRadiusButton, borderWidth: currentTheme === "mario" ? theme.borderWidth : 0, borderColor: "#000000" }} 
              className="py-4 items-center justify-center mb-6"
            >
              <Text style={{ color: theme.primaryContrast, fontFamily: "Outfit_700Bold", fontSize: 16 }}>
                Create Shared Entry
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

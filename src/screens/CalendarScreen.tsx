import React, { useState, useEffect, useRef } from "react";
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
  Image,
  TouchableWithoutFeedback,
  Platform,
  Animated as AnimatedRN,
  PanResponder
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

const formatMinutesToTime = (mins: number) => {
  let hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const padMins = minutes.toString().padStart(2, "0");
  const padHours = hours.toString().padStart(2, "0");
  return `${padHours}:${padMins} ${ampm}`;
};

interface DraggableTimelineCardProps {
  task: Task;
  top: number;
  height: number;
  accentColor: string;
  theme: any;
  currentTheme: string;
  getFontFamily: (weight: "Regular" | "Medium" | "Bold") => string;
  getIcon: () => React.ReactNode;
  renderAvatars: (owner: Task["owner"], size: number) => React.ReactNode;
  onTimeChange: (taskId: string, deltaMinutes: number) => void;
  pixelsPerMinute: number;
}

const DraggableTimelineCard: React.FC<DraggableTimelineCardProps> = ({
  task,
  top,
  height,
  accentColor,
  theme,
  currentTheme,
  getFontFamily,
  getIcon,
  renderAvatars,
  onTimeChange,
  pixelsPerMinute
}) => {
  const panY = useRef(new AnimatedRN.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 4;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (_, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        const dragDistance = gestureState.dy;
        const deltaMinutes = Math.round(dragDistance / pixelsPerMinute);
        const snapInterval = 15;
        const snappedDelta = Math.round(deltaMinutes / snapInterval) * snapInterval;

        if (snappedDelta !== 0) {
          onTimeChange(task.id, snappedDelta);
        }
        
        AnimatedRN.spring(panY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 40,
          friction: 7
        }).start();
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        AnimatedRN.spring(panY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 40,
          friction: 7
        }).start();
      }
    })
  ).current;

  return (
    <AnimatedRN.View
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        top: top,
        left: 10,
        right: 0,
        height: height - 6,
        transform: [{ translateY: panY }],
        backgroundColor: theme.cardBg,
        borderRadius: theme.borderRadiusCard,
        borderWidth: theme.borderWidth,
        borderColor: isDragging ? theme.primary : theme.border,
        padding: 12,
        justifyContent: "space-between",
        shadowColor: theme.text,
        shadowOffset: { width: 0, height: isDragging ? 6 : 2 },
        shadowOpacity: isDragging ? theme.shadowOpacity * 2 : theme.shadowOpacity,
        shadowRadius: isDragging ? theme.shadowRadius * 1.5 : theme.shadowRadius,
        elevation: isDragging ? 4 : (theme.shadowOpacity > 0 ? 1 : 0),
        zIndex: isDragging ? 99 : 10,
        overflow: 'hidden'
      }}
    >
      <View className="flex-row justify-between items-start">
        <View style={{ flex: 1, marginRight: 8, flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
          <View 
            style={{ backgroundColor: `${accentColor}15`, marginTop: 1 }} 
            className="px-2 py-0.5 rounded-full mr-2"
          >
            <Text style={{ color: accentColor, fontFamily: getFontFamily("Bold"), fontSize: 8, textTransform: "uppercase" }}>
              {task.category}
            </Text>
          </View>
          <Text 
            style={{ 
              color: theme.text, 
              fontFamily: getFontFamily("Bold"), 
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
          <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 9 }}>
            {task.startTime.replace(" ", "")} - {task.endTime.replace(" ", "")}
          </Text>
        </View>
        {renderAvatars(task.owner, 20)}
      </View>
    </AnimatedRN.View>
  );
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

  const getFontFamily = (weight: "Regular" | "Medium" | "Bold") => {
    switch (weight) {
      case "Regular": return theme.fontFamilyRegular;
      case "Medium": return theme.fontFamilyMedium;
      case "Bold": return theme.fontFamilyBold;
    }
  };

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

  const handleTimeChange = (taskId: string, deltaMinutes: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const startM = parseTimeToMinutes(t.startTime);
        const endM = parseTimeToMinutes(t.endTime);
        const duration = endM - startM;
        
        let newStartM = startM + deltaMinutes;
        // Limit start time between 8:00 AM (480 mins) and 8:00 PM (1200 mins) minus duration
        newStartM = Math.max(480, Math.min(1200 - duration, newStartM));
        const newEndM = newStartM + duration;
        
        const newStart = formatMinutesToTime(newStartM);
        const newEnd = formatMinutesToTime(newEndM);
        
        return {
          ...t,
          startTime: newStart,
          endTime: newEnd
        };
      }
      return t;
    }).sort((a, b) => {
      return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
    }));
    showToast("Task rescheduled successfully!", "success");
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
      
      {/* Title & Floating Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <View className="flex-row items-center justify-between mb-4">
          <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 24 }}>
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
              
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 13, marginHorizontal: 8 }}>
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
            <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 14 }}>
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
              left: viewMode === "week" ? 4 : "50%",
              right: viewMode === "week" ? "50%" : 4,
              backgroundColor: theme.primary,
              borderRadius: theme.borderRadiusButton,
            }}
            layout={LinearTransition.duration(300)}
          />

          <TouchableOpacity 
            onPress={() => setViewMode("week")}
            className="flex-1 items-center justify-center"
            style={{ zIndex: 2 }}
          >
            <Text style={{ 
              color: viewMode === "week" ? theme.primaryContrast : theme.textSecondary,
              fontFamily: getFontFamily("Bold"), 
              fontSize: 13 
            }}>
              Timeline
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setViewMode("month")}
            className="flex-1 items-center justify-center"
            style={{ zIndex: 2 }}
          >
            <Text style={{ 
              color: viewMode === "month" ? theme.primaryContrast : theme.textSecondary,
              fontFamily: getFontFamily("Bold"), 
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
                      fontFamily: getFontFamily("Bold"), 
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
                        fontFamily: getFontFamily("Bold"), 
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
                    <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 12, textAlign: "right", paddingRight: 10 }}>
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
                      <DraggableTimelineCard
                        key={task.id}
                        task={task}
                        top={top}
                        height={height}
                        accentColor={accentColor}
                        theme={theme}
                        currentTheme={currentTheme}
                        getFontFamily={getFontFamily}
                        getIcon={getIcon}
                        renderAvatars={renderAvatars}
                        onTimeChange={handleTimeChange}
                        pixelsPerMinute={pixelsPerMinute}
                      />
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
                    fontFamily: getFontFamily("Bold"), 
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
                        fontFamily: isSelected ? getFontFamily("Bold") : getFontFamily("Medium"),
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
            <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 16 }}>
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
                      shadowColor: theme.text,
                      shadowOffset: { width: 0, height: theme.shadowRadius > 0 ? Math.round(theme.shadowRadius / 4) : 0 },
                      shadowOpacity: theme.shadowOpacity,
                      shadowRadius: theme.shadowRadius,
                      elevation: theme.shadowOpacity > 0 ? 1 : 0,
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
                          color: theme.text, 
                          fontFamily: getFontFamily("Bold"), 
                          fontSize: 14, 
                          textDecorationLine: item.completed ? "line-through" : "none",
                          opacity: item.completed ? 0.6 : 1 
                        }}>
                          {item.title}
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 10, marginTop: 2 }}>
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
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Medium"), fontSize: 12 }}>
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
          borderRadius: theme.borderRadiusButton,
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
          {/* Translucent Backdrop - Touch to close */}
          <TouchableWithoutFeedback onPress={() => {
            setIsModalVisible(false);
            if (onModalToggle) onModalToggle(false);
          }}>
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
              borderTopLeftRadius: theme.borderRadiusCard * 1.2, 
              borderTopRightRadius: theme.borderRadiusCard * 1.2, 
              borderWidth: theme.borderWidth, 
              borderColor: theme.border, 
              paddingHorizontal: 24, 
              paddingTop: 12,
              paddingBottom: 40 
            }}
          >
            {/* Sheet drag indicator */}
            <View className="items-center mb-4">
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.textSecondary, opacity: 0.2 }} />
            </View>

            <View className="flex-row items-center justify-between mb-5">
              <Text style={{ color: theme.text, fontFamily: getFontFamily("Bold"), fontSize: 19 }}>
                Schedule Shared Entry
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setIsModalVisible(false);
                  if (onModalToggle) onModalToggle(false);
                }}
                style={{ backgroundColor: `${theme.border}30`, padding: 4, borderRadius: 99 }}
              >
                <Ionicons name="close" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Input: Title */}
            <View className="mb-4">
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
                Activity Title
              </Text>
              <View className="flex-row items-center" style={{ backgroundColor: theme.background, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadiusButton, paddingHorizontal: 12 }}>
                <Feather name="edit-3" size={15} color={theme.textSecondary} style={{ marginRight: 8 }} />
                <TextInput
                  value={newTitle}
                  onChangeText={setNewTitle}
                  placeholder="e.g. Design admin settings panel"
                  placeholderTextColor={`${theme.textSecondary}80`}
                  style={{ 
                    flex: 1,
                    color: theme.text, 
                    fontFamily: getFontFamily("Medium"), 
                    paddingVertical: 10,
                    fontSize: 14
                  }}
                />
              </View>
            </View>

            {/* Time Selector - Horizontal Scroll Chips */}
            <View className="mb-4">
              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
                Start Time
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ paddingRight: 24 }}>
                {HOURS.map(hour => {
                  const timeStr = `${hour.split(" ")[0]}:00 ${hour.split(" ")[1]}`;
                  const isSelected = newStart === timeStr;
                  return (
                    <TouchableOpacity
                      key={`start-${hour}`}
                      onPress={() => setNewStart(timeStr)}
                      style={{
                        backgroundColor: isSelected ? theme.primary : theme.background,
                        borderColor: isSelected ? theme.primaryDark : theme.border,
                        borderWidth: theme.borderWidth,
                        borderRadius: theme.borderRadiusButton,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        marginRight: 8
                      }}
                    >
                      <Text style={{ color: isSelected ? theme.primaryContrast : theme.text, fontFamily: getFontFamily("Bold"), fontSize: 12 }}>
                        {timeStr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
                End Time
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-1" contentContainerStyle={{ paddingRight: 24 }}>
                {HOURS.map(hour => {
                  const timeStr = `${hour.split(" ")[0]}:00 ${hour.split(" ")[1]}`;
                  const isSelected = newEnd === timeStr;
                  return (
                    <TouchableOpacity
                      key={`end-${hour}`}
                      onPress={() => setNewEnd(timeStr)}
                      style={{
                        backgroundColor: isSelected ? theme.primary : theme.background,
                        borderColor: isSelected ? theme.primaryDark : theme.border,
                        borderWidth: theme.borderWidth,
                        borderRadius: theme.borderRadiusButton,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        marginRight: 8
                      }}
                    >
                      <Text style={{ color: isSelected ? theme.primaryContrast : theme.text, fontFamily: getFontFamily("Bold"), fontSize: 12 }}>
                        {timeStr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Selector: Category & Assignee */}
            <View className="flex-row mb-6">
              <View className="flex-1 mr-3">
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
                  Category
                </Text>
                <View className="flex-row p-1" style={{ backgroundColor: theme.background, borderRadius: theme.borderRadiusButton, borderWidth: theme.borderWidth, borderColor: theme.border }}>
                  {["To Do", "Reminder", "Event"].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setNewCategory(cat as any)}
                      style={{
                        backgroundColor: newCategory === cat ? theme.primary : "transparent",
                        flex: 1,
                        paddingVertical: 6,
                        borderRadius: theme.borderRadiusButton,
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ 
                        color: newCategory === cat ? theme.primaryContrast : theme.textSecondary, 
                        fontFamily: getFontFamily("Bold"), 
                        fontSize: 11
                      }}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-1 ml-1" style={{ maxWidth: "38%" }}>
                <Text style={{ color: theme.textSecondary, fontFamily: getFontFamily("Bold"), fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
                  Ownership
                </Text>
                <View className="flex-row p-1" style={{ backgroundColor: theme.background, borderRadius: theme.borderRadiusButton, borderWidth: theme.borderWidth, borderColor: theme.border }}>
                  {["Self", "Shared"].map((own) => (
                    <TouchableOpacity
                      key={own}
                      onPress={() => setNewOwner(own as any)}
                      style={{
                        backgroundColor: newOwner === own ? theme.primary : "transparent",
                        flex: 1,
                        paddingVertical: 6,
                        borderRadius: theme.borderRadiusButton,
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ 
                        color: newOwner === own ? theme.primaryContrast : theme.textSecondary, 
                        fontFamily: getFontFamily("Bold"), 
                        fontSize: 11
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
              style={{ 
                backgroundColor: theme.primary, 
                borderRadius: theme.borderRadiusButton, 
                borderWidth: currentTheme === "mario" ? theme.borderWidth : 0, 
                borderColor: "#000000",
                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: theme.shadowOpacity,
                shadowRadius: 8,
                elevation: theme.shadowOpacity > 0 ? 3 : 0
              }} 
              className="py-3.5 items-center justify-center"
            >
              <Text style={{ color: theme.primaryContrast, fontFamily: getFontFamily("Bold"), fontSize: 15 }}>
                Create Shared Entry
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

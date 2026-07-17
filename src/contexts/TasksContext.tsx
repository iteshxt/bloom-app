import React, { createContext, useContext, useState, useEffect } from "react";
import { NativeModules } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
  id: string;
  name: string;
  category: string;
  color: string;
  completed: boolean;
  isRecurring: boolean;
  contributions: number[]; // 91 values representing completion history
}

interface TasksContextProps {
  tasks: Task[];
  addTask: (name: string, category: string, isRecurring: boolean) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TasksContext = createContext<TasksContextProps | undefined>(undefined);

const ASYNC_STORAGE_TASKS_KEY = "@bloom_shared_tasks";

const CATEGORY_COLORS: Record<string, string> = {
  leetcode: "#4B7E4F", // Sage Green
  fitness: "#F29F8F",  // Peach Coral
  growth: "#A78BFA",   // Theme Lavender
  custom: "#3B82F6"    // Blue
};

const DYNAMIC_PALETTE = ["#A78BFA", "#4B7E4F", "#F29F8F", "#3B82F6", "#FBBF24", "#06B6D4", "#EC4899"];

const generateMockContributions = (frequency: number) => {
  const data = [];
  for (let i = 0; i < 91; i++) {
    if (Math.random() < frequency) {
      data.push(Math.floor(Math.random() * 3) + 1);
    } else {
      data.push(0);
    }
  }
  return data;
};

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customTagsColors, setCustomTagsColors] = useState<Record<string, string>>({});

  const syncWithWidgets = (updatedTasks: Task[]) => {
    if (NativeModules.WidgetBridge) {
      try {
        const widgetPayload = updatedTasks.map(t => ({
          name: t.name,
          category: t.category,
          completed: t.completed
        }));
        NativeModules.WidgetBridge.updateTasks(JSON.stringify(widgetPayload));
      } catch (e) {
        console.error("Widget tasks sync failed", e);
      }
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem(ASYNC_STORAGE_TASKS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setTasks(parsed);
          syncWithWidgets(parsed);
        } else {
          const defaultTasks: Task[] = [
            {
              id: "1",
              name: "Solve 2 DSA Questions",
              category: "LeetCode",
              color: CATEGORY_COLORS.leetcode,
              completed: true,
              isRecurring: true,
              contributions: generateMockContributions(0.75)
            },
            {
              id: "2",
              name: "Strength Training Workout",
              category: "Fitness",
              color: CATEGORY_COLORS.fitness,
              completed: false,
              isRecurring: true,
              contributions: generateMockContributions(0.55)
            },
            {
              id: "3",
              name: "Read 10 Pages",
              category: "Growth",
              color: CATEGORY_COLORS.growth,
              completed: false,
              isRecurring: true,
              contributions: generateMockContributions(0.88)
            }
          ];
          setTasks(defaultTasks);
          syncWithWidgets(defaultTasks);
          await AsyncStorage.setItem(ASYNC_STORAGE_TASKS_KEY, JSON.stringify(defaultTasks));
        }
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    };
    loadTasks();
  }, []);

  const saveTasks = async (newTasks: Task[]) => {
    try {
      setTasks(newTasks);
      await AsyncStorage.setItem(ASYNC_STORAGE_TASKS_KEY, JSON.stringify(newTasks));
      syncWithWidgets(newTasks);
    } catch (e) {
      console.error("Failed to save tasks", e);
    }
  };

  const getTagColor = (tagName: string) => {
    const key = tagName.toLowerCase().trim();
    if (CATEGORY_COLORS[key]) return CATEGORY_COLORS[key];
    if (customTagsColors[key]) return customTagsColors[key];

    const index = Object.keys(customTagsColors).length % DYNAMIC_PALETTE.length;
    const selectedColor = DYNAMIC_PALETTE[index];
    setCustomTagsColors(prev => ({ ...prev, [key]: selectedColor }));
    return selectedColor;
  };

  const addTask = (name: string, category: string, isRecurring: boolean) => {
    const cleanTag = category.trim() === "" ? "Custom" : category.trim();
    const taskColor = getTagColor(cleanTag);
    
    const initialContributions = isRecurring ? generateMockContributions(0.2) : [];
    if (isRecurring && initialContributions.length > 0) {
      initialContributions[90] = 0; 
    }

    const newTask: Task = {
      id: Date.now().toString(),
      name,
      category: cleanTag,
      color: taskColor,
      completed: false,
      isRecurring,
      contributions: initialContributions
    };

    saveTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        const nextContributions = [...t.contributions];
        
        if (t.isRecurring && nextContributions.length > 0) {
          nextContributions[90] = nextCompleted ? 3 : 0;
        }

        return {
          ...t,
          completed: nextCompleted,
          contributions: nextContributions
        };
      }
      return t;
    });
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export type ThemeSlug = "lavender" | "sakura" | "minimal" | "honey" | "nordic" | "retro" | "mario";

export interface ColorPalette {
  primary: string;
  primaryDark: string;
  primaryContrast: string; 
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  accent: string;       
  warning: string;      
  border: string;       
  statusBar: "light" | "dark";
  cardBg: string;
  borderRadiusCard: number;
  borderRadiusButton: number;
  borderWidth: number;
  fontFamilyRegular: string;
  fontFamilyMedium: string;
  fontFamilyBold: string;
}

export const THEMES: Record<ThemeSlug, { name: string; milestone: string; colors: ColorPalette }> = {
  lavender: {
    name: "Default Lavender",
    milestone: "0 Days",
    colors: {
      primary: "#A78BFA", 
      primaryDark: "#7C3AED", 
      primaryContrast: "#FFFFFF",
      background: "#F8F6FC", 
      backgroundSecondary: "#F1ECF9", 
      text: "#3F2D6B", 
      textSecondary: "#8E7CAE", 
      accent: "#4B7E4F", 
      warning: "#F29F8F", 
      border: "#E5DCF5", 
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 32,
      borderRadiusButton: 999,
      borderWidth: 1,
      fontFamilyRegular: "Outfit_400Regular",
      fontFamilyMedium: "Outfit_500Medium",
      fontFamilyBold: "Outfit_700Bold",
    },
  },
  sakura: {
    name: "Sakura",
    milestone: "5 Days",
    colors: {
      primary: "#E8A7A1",
      primaryDark: "#D48C84",
      primaryContrast: "#4F2626", 
      background: "#FFF8F8",
      backgroundSecondary: "#FFEBEB",
      text: "#4F2626",
      textSecondary: "#A87070",
      accent: "#8BBA93",
      warning: "#E67E7E",
      border: "#FAD0D0",
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 40,
      borderRadiusButton: 999,
      borderWidth: 1.2,
      fontFamilyRegular: Platform.OS === "ios" ? "Georgia" : "serif",
      fontFamilyMedium: Platform.OS === "ios" ? "Georgia" : "serif",
      fontFamilyBold: Platform.OS === "ios" ? "Georgia-Bold" : "serif",
    },
  },
  minimal: {
    name: "Minimal",
    milestone: "10 Days",
    colors: {
      primary: "#E5E5E5",
      primaryDark: "#888888",
      primaryContrast: "#121212", 
      background: "#121212",
      backgroundSecondary: "#252525", 
      text: "#F5F5F5",
      textSecondary: "#A0A0A0",
      accent: "#888888",
      warning: "#FF5E5E",
      border: "#333333", 
      statusBar: "light",
      cardBg: "#1E1E1E",
      borderRadiusCard: 12,
      borderRadiusButton: 8,
      borderWidth: 1.5,
      fontFamilyRegular: Platform.OS === "ios" ? "Helvetica-Light" : "sans-serif-light",
      fontFamilyMedium: Platform.OS === "ios" ? "Helvetica" : "sans-serif-light",
      fontFamilyBold: Platform.OS === "ios" ? "Helvetica-Bold" : "sans-serif-medium",
    },
  },
  honey: {
    name: "Honey Amber",
    milestone: "15 Days",
    colors: {
      primary: "#D99B26",
      primaryDark: "#A36F10",
      primaryContrast: "#4A3305", 
      background: "#FFFDF6",
      backgroundSecondary: "#FFF6DC",
      text: "#4A3305",
      textSecondary: "#9A793D",
      accent: "#689F38",
      warning: "#E57373",
      border: "#F3E5AB",
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 28,
      borderRadiusButton: 16,
      borderWidth: 1,
      fontFamilyRegular: Platform.OS === "ios" ? "Avenir-Medium" : "sans-serif-medium",
      fontFamilyMedium: Platform.OS === "ios" ? "Avenir-Heavy" : "sans-serif-medium",
      fontFamilyBold: Platform.OS === "ios" ? "Avenir-Black" : "sans-serif-medium",
    },
  },
  nordic: {
    name: "Nordic Winter",
    milestone: "20 Days",
    colors: {
      primary: "#7CA3B8",
      primaryDark: "#4B748C",
      primaryContrast: "#FFFFFF",
      background: "#F2F7FA",
      backgroundSecondary: "#E1ECF2",
      text: "#1D2D35",
      textSecondary: "#657E8C",
      accent: "#5E8C7A",
      warning: "#D07A7A",
      border: "#D2E3EB",
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 20,
      borderRadiusButton: 12,
      borderWidth: 1,
      fontFamilyRegular: Platform.OS === "ios" ? "Arial" : "sans-serif-condensed",
      fontFamilyMedium: Platform.OS === "ios" ? "Arial-BoldMT" : "sans-serif-condensed",
      fontFamilyBold: Platform.OS === "ios" ? "Arial-BoldMT" : "sans-serif-condensed",
    },
  },
  retro: {
    name: "Retro Arcade",
    milestone: "25 Days",
    colors: {
      primary: "#9B30FF",
      primaryDark: "#68228B",
      primaryContrast: "#FFFFFF",
      background: "#0D001A",
      backgroundSecondary: "#1F0033",
      text: "#FFFFFF",
      textSecondary: "#B380FF",
      accent: "#EEEE00",
      warning: "#FF3030",
      border: "#FF00FF",
      statusBar: "light",
      cardBg: "#1F0033",
      borderRadiusCard: 8,
      borderRadiusButton: 8,
      borderWidth: 2,
      fontFamilyRegular: Platform.OS === "ios" ? "Courier" : "monospace",
      fontFamilyMedium: Platform.OS === "ios" ? "Courier" : "monospace",
      fontFamilyBold: Platform.OS === "ios" ? "Courier-Bold" : "monospace",
    },
  },
  mario: {
    name: "Super Mario",
    milestone: "30 Days",
    colors: {
      primary: "#E52521",
      primaryDark: "#B31010",
      primaryContrast: "#FFFFFF",
      background: "#F8F9FA",
      backgroundSecondary: "#E1F5FE",
      text: "#212121",
      textSecondary: "#757575",
      accent: "#43A047",
      warning: "#E52521",
      border: "#000000",
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 0,
      borderRadiusButton: 0,
      borderWidth: 4,
      fontFamilyRegular: Platform.OS === "ios" ? "Courier" : "monospace",
      fontFamilyMedium: Platform.OS === "ios" ? "Courier" : "monospace",
      fontFamilyBold: Platform.OS === "ios" ? "Courier-Bold" : "monospace",
    },
  },
};

interface ThemeContextProps {
  currentTheme: ThemeSlug;
  theme: ColorPalette;
  themeInfo: { name: string; milestone: string };
  setTheme: (themeSlug: ThemeSlug) => Promise<void>;
  unlockedThemes: ThemeSlug[];
  currentStreak: number;
  updateStreakAndEvaluateThemes: (newStreak: number) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const ASYNC_STORAGE_THEME_KEY = "@bloom_current_theme";
const ASYNC_STORAGE_STREAK_KEY = "@bloom_current_streak";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<ThemeSlug>("lavender");
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [unlockedThemes, setUnlockedThemes] = useState<ThemeSlug[]>(["lavender"]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(ASYNC_STORAGE_THEME_KEY);
        const storedStreak = await AsyncStorage.getItem(ASYNC_STORAGE_STREAK_KEY);
        
        const streak = storedStreak ? parseInt(storedStreak, 10) : 0;
        setCurrentStreak(streak);
        
        const unlocked: ThemeSlug[] = ["lavender"];
        if (streak >= 5) unlocked.push("sakura");
        if (streak >= 10) unlocked.push("minimal");
        if (streak >= 15) unlocked.push("honey");
        if (streak >= 20) unlocked.push("nordic");
        if (streak >= 25) unlocked.push("retro");
        if (streak >= 30) unlocked.push("mario");
        
        setUnlockedThemes(unlocked);

        if (storedTheme && unlocked.includes(storedTheme as ThemeSlug)) {
          setCurrentThemeState(storedTheme as ThemeSlug);
        } else {
          setCurrentThemeState("lavender");
        }
      } catch (e) {
        console.error("Failed to load theme settings", e);
      }
    };
    loadSettings();
  }, []);

  const setTheme = async (themeSlug: ThemeSlug) => {
    if (unlockedThemes.includes(themeSlug)) {
      try {
        await AsyncStorage.setItem(ASYNC_STORAGE_THEME_KEY, themeSlug);
        setCurrentThemeState(themeSlug);
      } catch (e) {
        console.error("Failed to save theme settings", e);
      }
    } else {
      console.warn(`Theme ${themeSlug} is locked! Required streak milestone not met.`);
    }
  };

  const updateStreakAndEvaluateThemes = async (newStreak: number) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_STREAK_KEY, newStreak.toString());
      setCurrentStreak(newStreak);

      const unlocked: ThemeSlug[] = ["lavender"];
      if (newStreak >= 5) unlocked.push("sakura");
      if (newStreak >= 10) unlocked.push("minimal");
      if (newStreak >= 15) unlocked.push("honey");
      if (newStreak >= 20) unlocked.push("nordic");
      if (newStreak >= 25) unlocked.push("retro");
      if (newStreak >= 30) unlocked.push("mario");

      setUnlockedThemes(unlocked);

      if (!unlocked.includes(currentTheme)) {
        await setTheme("lavender");
      }
    } catch (e) {
      console.error("Failed to update streak / themes", e);
    }
  };

  const activeTheme = THEMES[currentTheme];

  if (typeof globalThis !== "undefined") {
    (globalThis as any).activeFontFamilyRegular = activeTheme.colors.fontFamilyRegular;
    (globalThis as any).activeFontFamilyMedium = activeTheme.colors.fontFamilyMedium;
    (globalThis as any).activeFontFamilyBold = activeTheme.colors.fontFamilyBold;
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        theme: activeTheme.colors,
        themeInfo: { name: activeTheme.name, milestone: activeTheme.milestone },
        setTheme,
        unlockedThemes,
        currentStreak,
        updateStreakAndEvaluateThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

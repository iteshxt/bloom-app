import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeSlug = "lavender" | "sakura" | "minimal" | "honey" | "nordic" | "retro" | "mario";

export interface ColorPalette {
  primary: string;
  primaryDark: string;
  primaryContrast: string; // Text color to show on top of primary color backgrounds
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  accent: string;       // Typically Green (Completed)
  warning: string;      // Typically Coral/Red (Warnings/Deletes)
  border: string;       // Thin dividers
  statusBar: "light" | "dark";
  cardBg: string;
}

export const THEMES: Record<ThemeSlug, { name: string; milestone: string; colors: ColorPalette }> = {
  lavender: {
    name: "Default Lavender",
    milestone: "0 Days",
    colors: {
      primary: "#A78BFA", // Vibrant pastel purple
      primaryDark: "#7C3AED", // Deeper purple accent
      primaryContrast: "#FFFFFF",
      background: "#F8F6FC", // Soft lavender cream background
      backgroundSecondary: "#F1ECF9", // Slightly deeper lavender tint for containers
      text: "#3F2D6B", // Rich dark purple text
      textSecondary: "#8E7CAE", // Secondary pastel purple-grey text
      accent: "#4B7E4F", // Sage Green
      warning: "#F29F8F", // Peach Coral
      border: "#E5DCF5", // Soft lavender-tinted borders
      statusBar: "dark",
      cardBg: "#FFFFFF",
    },
  },
  sakura: {
    name: "Sakura",
    milestone: "7 Days",
    colors: {
      primary: "#E8A7A1",
      primaryDark: "#D48C84",
      primaryContrast: "#4F2626", // Cozy dark red-brown for optimal text contrast on pink
      background: "#FFF8F8",
      backgroundSecondary: "#FFEBEB",
      text: "#4F2626",
      textSecondary: "#A87070",
      accent: "#8BBA93",
      warning: "#E67E7E",
      border: "#FAD0D0",
      statusBar: "dark",
      cardBg: "#FFFFFF",
    },
  },
  minimal: {
    name: "Minimal",
    milestone: "14 Days",
    colors: {
      primary: "#E5E5E5",
      primaryDark: "#888888",
      primaryContrast: "#121212", // Dark charcoal text on light gray active button/card
      background: "#121212",
      backgroundSecondary: "#252525", // Lighter gray so containers stand out from cardBg
      text: "#F5F5F5",
      textSecondary: "#A0A0A0",
      accent: "#888888",
      warning: "#FF5E5E",
      border: "#333333", // Slightly lighter border for visibility
      statusBar: "light",
      cardBg: "#1E1E1E",
    },
  },
  honey: {
    name: "Honey Amber",
    milestone: "30 Days",
    colors: {
      primary: "#D99B26",
      primaryDark: "#A36F10",
      primaryContrast: "#4A3305", // Dark brown for readability on amber
      background: "#FFFDF6",
      backgroundSecondary: "#FFF6DC",
      text: "#4A3305",
      textSecondary: "#9A793D",
      accent: "#689F38",
      warning: "#E57373",
      border: "#F3E5AB",
      statusBar: "dark",
      cardBg: "#FFFFFF",
    },
  },
  nordic: {
    name: "Nordic Winter",
    milestone: "60 Days",
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
    },
  },
  retro: {
    name: "Retro Arcade",
    milestone: "100 Days",
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
    },
  },
  mario: {
    name: "Super Mario",
    milestone: "180 Days",
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

  // Load initial settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(ASYNC_STORAGE_THEME_KEY);
        const storedStreak = await AsyncStorage.getItem(ASYNC_STORAGE_STREAK_KEY);
        
        const streak = storedStreak ? parseInt(storedStreak, 10) : 0;
        setCurrentStreak(streak);
        
        // Evaluate unlocked themes based on streak
        const unlocked: ThemeSlug[] = ["lavender"];
        if (streak >= 7) unlocked.push("sakura");
        if (streak >= 14) unlocked.push("minimal");
        if (streak >= 30) unlocked.push("honey");
        if (streak >= 60) unlocked.push("nordic");
        if (streak >= 100) unlocked.push("retro");
        if (streak >= 180) unlocked.push("mario");
        
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
      if (newStreak >= 7) unlocked.push("sakura");
      if (newStreak >= 14) unlocked.push("minimal");
      if (newStreak >= 30) unlocked.push("honey");
      if (newStreak >= 60) unlocked.push("nordic");
      if (newStreak >= 100) unlocked.push("retro");
      if (newStreak >= 180) unlocked.push("mario");

      setUnlockedThemes(unlocked);

      // If the currently selected theme became locked again (e.g. streak reset), reset to lavender
      if (!unlocked.includes(currentTheme)) {
        await setTheme("lavender");
      }
    } catch (e) {
      console.error("Failed to update streak / themes", e);
    }
  };

  const activeTheme = THEMES[currentTheme];

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

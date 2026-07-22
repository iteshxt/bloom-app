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
  watermarkIcon: string;
  shadowOpacity: number;
  shadowRadius: number;
  animationTension: number;
  animationFriction: number;
}

export const THEMES: Record<ThemeSlug, { name: string; milestone: string; colors: ColorPalette }> = {
  lavender: {
    name: "Vanilla Plum",
    milestone: "0 Days",
    colors: {
      primary: "#834063", // Rich, darker plum
      primaryDark: "#6C3050", 
      primaryContrast: "#FFFFFF",
      background: "#FAF8F3", // Lighter off-white cream base
      backgroundSecondary: "#FFF6D1", // Softer, lighter vanilla cream accents
      text: "#20181B", // Proper deep dark charcoal with a tiny hint of warm plum
      textSecondary: "#63585D", // Neutral muted warm slate
      accent: "#9BBFA0", // Soft green
      warning: "#E57373", 
      border: "rgba(131, 64, 99, 0.12)", // Extremely subtle plum border
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 24,
      borderRadiusButton: 16,
      borderWidth: 1.2,
      fontFamilyRegular: "Outfit_400Regular",
      fontFamilyMedium: "Outfit_500Medium",
      fontFamilyBold: Platform.OS === "ios" ? "Palatino-Bold" : "serif",
      watermarkIcon: "flower",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      animationTension: 15,
      animationFriction: 6,
    },
  },
  sakura: {
    name: "Midnight Orchid",
    milestone: "5 Days",
    colors: {
      primary: "#88708E", // Dusky Lilac
      primaryDark: "#312A44", // Midnight Orchid
      primaryContrast: "#FFFFFF", 
      background: "#FAF8FC", // Lighter lavender-cream base
      backgroundSecondary: "#D7C5D8", // Plum Blossom accents
      text: "#312A44", // Midnight Orchid dark text
      textSecondary: "#6D5E7A", // Muted slate orchid
      accent: "#BAAAC8", // Iris Mist
      warning: "#DAD4DF", // Silver Wisteria
      border: "rgba(136, 112, 142, 0.15)",
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 18,
      borderRadiusButton: 12,
      borderWidth: 1.0,
      fontFamilyRegular: "Outfit_400Regular",
      fontFamilyMedium: "Outfit_500Medium",
      fontFamilyBold: Platform.OS === "ios" ? "Baskerville-Bold" : "serif",
      watermarkIcon: "rose",
      shadowOpacity: 0.04,
      shadowRadius: 8,
      animationTension: 12,
      animationFriction: 7,
    },
  },
  minimal: {
    name: "Berry Punch",
    milestone: "10 Days",
    colors: {
      primary: "#CC4964", // Berry Punch
      primaryDark: "#AB364F",
      primaryContrast: "#FAFCD0", // Lemon Chiffon text on primary
      background: "#FCFDEB", // Extremely light cream/yellow base
      backgroundSecondary: "#FAFCD0", // Lemon Chiffon accents
      text: "#211A1B", // Deep dark warm charcoal neutral
      textSecondary: "#615759", // Muted slate gray with subtle warm hint
      accent: "#8BBBA7", // Soft green
      warning: "#D96B6B",
      border: "rgba(204, 73, 100, 0.12)",
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 20,
      borderRadiusButton: 10,
      borderWidth: 0,
      fontFamilyRegular: Platform.OS === "ios" ? "Avenir" : "sans-serif",
      fontFamilyMedium: Platform.OS === "ios" ? "Avenir-Medium" : "sans-serif-medium",
      fontFamilyBold: Platform.OS === "ios" ? "Avenir-Heavy" : "sans-serif-medium",
      watermarkIcon: "heart",
      shadowOpacity: 0.06,
      shadowRadius: 16,
      animationTension: 22,
      animationFriction: 8,
    },
  },
  honey: {
    name: "Matcha Honey",
    milestone: "15 Days",
    colors: {
      primary: "#9CA764", // Matcha Cream
      primaryDark: "#7E874D",
      primaryContrast: "#F1E8C7", // Milky Honey text on primary
      background: "#FAF8F0", // Extremely light cream base
      backgroundSecondary: "#F1E8C7", // Milky Honey accents
      text: "#24261C", // Deep dark forest charcoal neutral
      textSecondary: "#626654", // Muted sage slate
      accent: "#AC7B64", // Terracotta warm accent
      warning: "#D96B6B",
      border: "rgba(156, 167, 100, 0.12)",
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 32,
      borderRadiusButton: 20,
      borderWidth: 1.5,
      fontFamilyRegular: Platform.OS === "ios" ? "GillSans" : "sans-serif",
      fontFamilyMedium: Platform.OS === "ios" ? "GillSans-SemiBold" : "sans-serif-medium",
      fontFamilyBold: Platform.OS === "ios" ? "GillSans-Bold" : "sans-serif-medium",
      watermarkIcon: "leaf",
      shadowOpacity: 0.05,
      shadowRadius: 12,
      animationTension: 10,
      animationFriction: 5,
    },
  },
  nordic: {
    name: "Terracotta Rose",
    milestone: "20 Days",
    colors: {
      primary: "#A76D5E", // Dusty Rose
      primaryDark: "#846044", // Terracotta Brown
      primaryContrast: "#FFFFFF",
      background: "#FAF7F2", // Lighter warm cream base
      backgroundSecondary: "#DFCCB1", // Warm Beige accents
      text: "#302319", // Deep dark terracotta charcoal neutral
      textSecondary: "#6B5C51", // Muted slate taupe neutral
      accent: "#98A086", // Sage Green
      warning: "#C4A071", // Golden Tan
      border: "rgba(167, 109, 94, 0.12)",
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 12,
      borderRadiusButton: 6,
      borderWidth: 2.0,
      fontFamilyRegular: Platform.OS === "ios" ? "AmericanTypewriter" : "serif",
      fontFamilyMedium: Platform.OS === "ios" ? "AmericanTypewriter-Semibold" : "serif",
      fontFamilyBold: Platform.OS === "ios" ? "AmericanTypewriter-Bold" : "serif",
      watermarkIcon: "rose",
      shadowOpacity: 0.02,
      shadowRadius: 6,
      animationTension: 14,
      animationFriction: 6,
    },
  },
  retro: {
    name: "Cool Cerulean",
    milestone: "25 Days",
    colors: {
      primary: "#3B75A6", // Rich Cerulean Blue
      primaryDark: "#1C2B48", // Midnight Blue
      primaryContrast: "#FFFFFF",
      background: "#F4F7F9", // Lighter platinum/blue base
      backgroundSecondary: "#E8ECEF", // Platinum accents
      text: "#1C2B48", // Midnight Blue text
      textSecondary: "#3E526B", // Darker slate gray for legibility
      accent: "#7CA6CD", // Curated Medium Slate Blue
      warning: "#E06D6D", // Highly visible soft red
      border: "rgba(59, 117, 166, 0.18)",
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 8,
      borderRadiusButton: 4,
      borderWidth: 1.0,
      fontFamilyRegular: "Outfit_400Regular",
      fontFamilyMedium: "Outfit_500Medium",
      fontFamilyBold: Platform.OS === "ios" ? "Georgia-Bold" : "serif",
      watermarkIcon: "cloud",
      shadowOpacity: 0.04,
      shadowRadius: 4,
      animationTension: 18,
      animationFriction: 8,
    },
  },
  mario: {
    name: "Deep Crimson",
    milestone: "30 Days",
    colors: {
      primary: "#912B48", // Deep Crimson
      primaryDark: "#610027", // Deep Maroon
      primaryContrast: "#FFFFFF",
      background: "#FFF7F8", // Lighter pastel pink base
      backgroundSecondary: "#FCD0D9", // Soft Pastel Pink accents
      text: "#610027", // Deep Maroon dark text
      textSecondary: "#A36070", // Muted rose slate
      accent: "#B45A69", // Dusty Pink
      warning: "#D96B6B",
      border: "rgba(145, 43, 72, 0.15)",
      statusBar: "dark",
      cardBg: "#FFFFFF",
      borderRadiusCard: 4,
      borderRadiusButton: 2,
      borderWidth: 2.5,
      fontFamilyRegular: Platform.OS === "ios" ? "Futura" : "sans-serif",
      fontFamilyMedium: Platform.OS === "ios" ? "Futura-Medium" : "sans-serif-medium",
      fontFamilyBold: Platform.OS === "ios" ? "Futura-CondensedExtraBold" : "sans-serif-medium",
      watermarkIcon: "star",
      shadowOpacity: 0,
      shadowRadius: 0,
      animationTension: 40,
      animationFriction: 4,
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
  isThemeLoading: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const ASYNC_STORAGE_THEME_KEY = "@bloom_current_theme";
const ASYNC_STORAGE_STREAK_KEY = "@bloom_current_streak";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<ThemeSlug>("lavender");
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [unlockedThemes, setUnlockedThemes] = useState<ThemeSlug[]>(["lavender"]);
  const [isThemeLoading, setIsThemeLoading] = useState<boolean>(true);

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
      } finally {
        setIsThemeLoading(false);
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
        isThemeLoading,
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

import React, { createContext, useState, useContext, useRef, useCallback } from 'react';
import { Text, Platform } from 'react-native';
import { useTheme } from './ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

interface ToastContextProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, currentTheme } = useTheme();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getFontFamily = (weight: "Regular" | "Medium" | "Bold") => {
    const isRetro = currentTheme === "retro" || currentTheme === "mario";
    if (isRetro) {
      return Platform.OS === "ios" ? "Courier-Bold" : "monospace";
    }
    return `Outfit_${weight === "Regular" ? "400Regular" : weight === "Medium" ? "500Medium" : "700Bold"}`;
  };

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setToastMessage(message);
    setToastType(type);
    
    timeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const getBackgroundColor = () => {
    switch (toastType) {
      case 'error': return '#2C2C2E';
      case 'success': return (currentTheme === 'retro' || currentTheme === 'mario') ? theme.cardBg : '#1C1C1E';
      default: return '#1C1C1E';
    }
  };

  const getIconColor = () => {
    switch (toastType) {
      case 'error': return '#EF4444'; // Red
      case 'success': return '#10B981'; // Green
      case 'warning': return '#F59E0B'; // Yellow
      case 'info': return '#3B82F6'; // Blue
      default: return '#3B82F6';
    }
  };

  const getIconName = () => {
    switch (toastType) {
      case 'error': return 'alert-circle';
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'info': return 'information-circle';
      default: return 'information-circle';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(200)}
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? 60 : 40,
            alignSelf: 'center',
            backgroundColor: getBackgroundColor(),
            borderRadius: 100, // Sleek capsule shape
            paddingVertical: 12,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 12,
            zIndex: 99999,
            minWidth: 200,
            maxWidth: '90%'
          }}
        >
          <Ionicons name={getIconName()} size={20} color={getIconColor()} style={{ marginRight: 12 }} />
          <Text style={{
            color: '#FFFFFF',
            fontFamily: getFontFamily('Medium'),
            fontSize: 14,
            flexShrink: 1
          }}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

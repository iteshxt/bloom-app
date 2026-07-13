import "./global.css";
import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/Auth/LoginScreen';
import PartnerInviteScreen from './src/screens/Auth/PartnerInviteScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import { StatusBar } from 'expo-status-bar';

function AppContent() {
  const { user, partnerProfile, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text className="text-secondary mt-4 font-medium">Loading Bloom...</Text>
        <StatusBar style="dark" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <HomeScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

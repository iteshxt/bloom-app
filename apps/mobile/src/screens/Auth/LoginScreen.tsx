import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

const taglines = [
  'Grow together.',
  'Better, together.',
  'Small steps. Every day.',
  'Stay in sync.',
  'Keep growing.',
];

export default function LoginScreen() {
  const { mockLogin, loading } = useAuth();
  const [tagline] = useState(() => taglines[Math.floor(Math.random() * taglines.length)]);

  if (loading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text className="text-secondary mt-4 font-medium">Blossoming...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface px-6 justify-between py-16">
      <StatusBar style="dark" />
      
      {/* Top Section - Brand Greeting */}
      <View className="flex-1 justify-center items-center">
        <View className="w-20 h-20 bg-primary-container items-center justify-center rounded-3xl mb-6 shadow-sm">
          {/* Simple organic plant leaf symbol (using basic text for now) */}
          <Text className="text-4xl text-primary-onContainer">🌿</Text>
        </View>
        <Text className="text-primary font-bold text-4xl tracking-tight">Bloom</Text>
        <Text className="text-secondary text-base mt-2 italic font-light">{tagline}</Text>
      </View>

      {/* Bottom Section - Login Controls */}
      <View className="space-y-6">
        {/* Placeholder Google Sign In Button */}
        <TouchableOpacity 
          className="w-full bg-surface-variant flex-row items-center justify-center py-4 rounded-full border border-outline/20 active:opacity-90"
          onPress={() => alert('Real Google Sign-In setup instructions will follow Firebase setup! Please use the developer toggle below for now.')}
        >
          <Text className="text-4xl mr-3">💎</Text>
          <Text className="text-surface-on font-semibold text-base">Sign in with Google</Text>
        </TouchableOpacity>

        {/* Developer Mock Toggle */}
        <View className="bg-secondary-container/30 p-5 rounded-3xl mt-6 border border-secondary/10">
          <Text className="text-secondary-onContainer font-bold text-sm tracking-wider uppercase mb-1">
            Developer Sandbox
          </Text>
          <Text className="text-secondary text-xs mb-4">
            Simulate two connected users to test realtime synchronization.
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity 
              className="flex-1 bg-primary py-3 rounded-2xl items-center active:opacity-90"
              onPress={() => mockLogin('A')}
            >
              <Text className="text-primary-on font-semibold text-sm">User A</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-1 bg-tertiary py-3 rounded-2xl items-center active:opacity-90"
              onPress={() => mockLogin('B')}
            >
              <Text className="text-tertiary-on font-semibold text-sm">User B</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

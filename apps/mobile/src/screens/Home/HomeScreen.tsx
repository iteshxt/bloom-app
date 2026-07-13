import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

export default function HomeScreen() {
  const { profile, partnerProfile, refreshProfile, signOut } = useAuth();

  const handleBreakLink = async () => {
    try {
      const { error } = await supabase
        .from('partner_links')
        .delete()
        .or(`user_one_id.eq.${profile?.id},user_two_id.eq.${profile?.id}`);

      if (error) throw error;
      alert('Partner link severed for testing!');
      await refreshProfile();
    } catch (e) {
      console.error('Error severing link:', e);
      alert('Failed to break link.');
    }
  };

  return (
    <View className="flex-1 bg-surface px-6 py-16 justify-between">
      {/* Top Greeting */}
      <View className="flex-1 justify-center space-y-6">
        <Text className="text-primary font-bold text-3xl">Home Dashboard</Text>
        
        {/* User Card */}
        <View className="bg-primary-container p-5 rounded-3xl border border-primary/10">
          <Text className="text-primary-onContainer text-xs font-semibold uppercase tracking-wider mb-2">
            Your Status
          </Text>
          <Text className="text-primary font-bold text-xl">{profile?.display_name}</Text>
          <Text className="text-secondary text-sm mt-1">Streaks: {profile?.theme_slug === 'bloom' ? '0 days' : 'Active'}</Text>
        </View>

        {/* Partner Card */}
        <View className="bg-tertiary-container p-5 rounded-3xl border border-tertiary/10">
          <Text className="text-tertiary-onContainer text-xs font-semibold uppercase tracking-wider mb-2">
            Partner Status
          </Text>
          <Text className="text-tertiary font-bold text-xl">{partnerProfile?.display_name || 'Loading...'}</Text>
          <Text className="text-secondary text-sm mt-1">Status: Connected & Active</Text>
        </View>

        {/* Sever link button for testing */}
        <TouchableOpacity 
          className="w-full bg-error-container py-3 rounded-2xl items-center border border-error/10"
          onPress={handleBreakLink}
        >
          <Text className="text-error font-semibold text-sm">Sever Partner Link (Developer Test)</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity 
        className="w-full py-4 rounded-full items-center justify-center border border-outline/20"
        onPress={signOut}
      >
        <Text className="text-outline font-semibold text-base">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

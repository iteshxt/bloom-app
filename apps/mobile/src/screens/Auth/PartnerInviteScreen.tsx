import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Clipboard } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

export default function PartnerInviteScreen() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [partnerIdInput, setPartnerIdInput] = useState('');
  const [linking, setLinking] = useState(false);

  const copyToClipboard = () => {
    if (profile?.id) {
      Clipboard.setString(profile.id);
      alert('Your Invite Code copied to clipboard!');
    }
  };

  const handleConnect = async () => {
    if (!partnerIdInput.trim()) {
      alert('Please enter a partner invite code.');
      return;
    }

    if (partnerIdInput.trim() === profile?.id) {
      alert('You cannot link with yourself!');
      return;
    }

    setLinking(true);
    try {
      // Check if partner profile exists
      const { data: partnerProfile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', partnerIdInput.trim())
        .maybeSingle();

      if (profileErr || !partnerProfile) {
        alert('Partner not found. Check if the code is correct.');
        setLinking(false);
        return;
      }

      // Check if a link already exists
      const { data: existingLink, error: linkQueryErr } = await supabase
        .from('partner_links')
        .select('*')
        .or(`user_one_id.eq.${profile?.id},user_two_id.eq.${profile?.id}`)
        .maybeSingle();

      if (existingLink) {
        alert('You already have a link setup (pending or active).');
        setLinking(false);
        return;
      }

      // Establish link (auto-active for easy sandbox testing)
      const { error: insertErr } = await supabase
        .from('partner_links')
        .insert({
          user_one_id: profile?.id,
          user_two_id: partnerProfile.id,
          status: 'active', // Links immediately
        });

      if (insertErr) throw insertErr;

      alert(`Connected successfully with ${partnerProfile.display_name}!`);
      await refreshProfile(); // Refresh context
    } catch (e: any) {
      console.error('Error linking partners:', e);
      alert(e.message || 'Linking failed.');
    } finally {
      setLinking(false);
    }
  };

  return (
    <View className="flex-1 bg-surface px-6 py-16 justify-between">
      {/* Top Details */}
      <View className="flex-1 justify-center space-y-6">
        <Text className="text-primary font-bold text-3xl mb-2">Connect Your Partner</Text>
        <Text className="text-secondary text-sm leading-relaxed mb-6">
          Bloom is designed for exactly two people. Copy your code and send it to your partner, or paste their code below to sync up.
        </Text>

        {/* User Code Box */}
        <View className="bg-surface-variant p-5 rounded-3xl border border-outline/10">
          <Text className="text-surface-onVariant text-xs font-semibold uppercase tracking-wider mb-2">
            Your Invite Code
          </Text>
          <Text className="text-surface-on text-xs font-mono select-all bg-surface/50 p-3 rounded-xl mb-3">
            {profile?.id}
          </Text>
          <TouchableOpacity 
            className="w-full bg-primary/10 py-3 rounded-2xl items-center"
            onPress={copyToClipboard}
          >
            <Text className="text-primary font-semibold text-sm">Copy Code</Text>
          </TouchableOpacity>
        </View>

        {/* Input Code Box */}
        <View className="space-y-3 mt-4">
          <Text className="text-surface-onVariant text-xs font-semibold uppercase tracking-wider">
            Enter Partner's Code
          </Text>
          <TextInput
            className="w-full bg-surface-variant text-surface-on px-4 py-4 rounded-2xl font-mono text-sm border border-outline/10"
            placeholder="Paste code here"
            placeholderTextColor="#79747E"
            value={partnerIdInput}
            onChangeText={setPartnerIdInput}
          />
          <TouchableOpacity 
            className="w-full bg-primary py-4 rounded-full items-center justify-center active:opacity-90 mt-2"
            onPress={handleConnect}
            disabled={linking}
          >
            {linking ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-primary-on font-semibold text-base">Connect Partner</Text>
            )}
          </TouchableOpacity>
        </View>
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

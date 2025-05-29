import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {  Feather } from "@expo/vector-icons";

type Props = {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
};

export default function MenuItem({ icon, label, onPress }: Props) {
  return (
    <TouchableOpacity 
      className="flex-row justify-between py-4 border-b border-gray-100"
      onPress={onPress}
    >
      <View className="flex-row">
        <View className="w-8 items-center">{icon}</View> 
        <Text className="text-base font-medium">{label}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#777" />
    </TouchableOpacity>
  );
}
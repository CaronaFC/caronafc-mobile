// src/components/travel/PickerOption.tsx
import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface PickerOptionProps {
  label: string;
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
}

const PickerOption: React.FC<PickerOptionProps> = ({
  label,
  options,
  value,
  onValueChange,
  placeholder,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <View className="border border-gray-300 rounded-lg overflow-hidden">
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onValueChange(itemValue)}
        >
          <Picker.Item label={placeholder} value="" />
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default PickerOption;

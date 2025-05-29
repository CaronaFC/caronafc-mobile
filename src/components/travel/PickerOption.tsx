import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

type Props = {};

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
}) => (
  <View className="mb-4">
    <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
    <View className="border border-gray-300 rounded-lg">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="p-2"
      >
        <TouchableOpacity
          onPress={() => onValueChange("")}
          className={`px-3 py-2 rounded-full mr-2 ${
            !value ? "bg-blue-100 border border-blue-300" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-sm ${!value ? "text-blue-700" : "text-gray-600"}`}
          >
            {placeholder}
          </Text>
        </TouchableOpacity>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onValueChange(option)}
            className={`px-3 py-2 rounded-full mr-2 ${
              value === option
                ? "bg-blue-100 border border-blue-300"
                : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-sm ${
                value === option ? "text-blue-700" : "text-gray-600"
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </View>
);

export default PickerOption;

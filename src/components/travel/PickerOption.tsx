// src/components/travel/PickerOption.tsx
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          style={styles.picker}
          dropdownIconColor="#00FF87"
        >
          <Picker.Item
            label={placeholder}
            value=""
            style={styles.pickerItem}
            color={Platform.OS === 'android' ? '#666666' : undefined}
          />
          {options.map((option) => (
            <Picker.Item
              key={option}
              label={option}
              value={option}
              style={styles.pickerItem}
              color={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#AAAAAA',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  pickerItem: {
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF',
  },
});

export default PickerOption;

import { View, Text, Platform, StyleProp, ViewStyle, StyleSheet } from "react-native";
import React, { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "@ui-kitten/components";

type Props = {
  label?: string;
  value: Date;
  onChange: (value: Date) => void;
  accessoryLeft?: () => React.ReactElement;
  styles?: StyleProp<ViewStyle>;
  disabled?: boolean;
  mode?: "time" | "date" | "datetime"; // <-- nova prop opcional
};
const TimePickerInput = ({
  label,
  value,
  onChange,
  accessoryLeft,
  styles: customStyles,
  disabled,
  mode = "time", // padrão: time
}: Props) => {
  const [show, setShow] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value;
    setShow(Platform.OS === "ios");
    onChange(currentDate);
  };

  return (
    <View style={customStyles}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Button
        onPress={() => setShow(true)}
        appearance="ghost"
        style={styles.button}
        accessoryLeft={accessoryLeft}
        disabled={disabled}
      >
        {() => (
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>
              {value
                ? mode === "time"
                  ? value.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : mode === "date"
                  ? value.toLocaleDateString()
                  : value.toLocaleString()
                : "Nenhum valor"}
            </Text>
          </View>
        )}
      </Button>
      {show && (
        <RNDateTimePicker
          value={value || new Date()}
          mode={mode === "datetime" ? "datetime" : mode}
          is24Hour={true}
          display="default"
          onChange={handleChange}
          themeVariant="dark"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  button: {
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default TimePickerInput;

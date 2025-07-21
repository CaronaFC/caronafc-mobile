import { View, Text, Platform, StyleProp, ViewStyle } from "react-native";
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
  styles,
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
    <View style={styles}>
      {label && <Text className="label-input mb-2">{label}</Text>}
      <Button
        onPress={() => setShow(true)}
        appearance="ghost"
        style={{ borderWidth: 0, backgroundColor: "#F2F3F3" }}
        accessoryLeft={accessoryLeft}
        className="flex-row items-center justify-center"
        disabled={disabled}
      >
        <View className="flex-row items-center">
          <Text style={{ color: "black" }}>
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
      </Button>
      {show && (
        <RNDateTimePicker
          value={value || new Date()}
          mode={mode === "datetime" ? "datetime" : mode}
          is24Hour={true}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default TimePickerInput;

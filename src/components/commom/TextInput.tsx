import { Input } from "@ui-kitten/components";
import { Text} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  label?: string;
  value: string;
  setValue: (text: string) => void;
  styles?: StyleProp<ViewStyle>;
  placeholder?: string;
  type?: "text" | "password";
};

export default function TextInput({
  label,
  value,
  setValue,
  styles,
  placeholder = "",
  type = "text",
}: Props) {
  const isPassword = type === "password";
  const [secure, setSecure] = useState(isPassword);
  const toggleSecureEntry = () => setSecure(!secure);
  const renderIcon = () => (
    <TouchableOpacity onPress={toggleSecureEntry}>
      <Feather name={secure ? "eye-off" : "eye"} size={20} color="#8F9BB3" />
    </TouchableOpacity>
  );
  return (
    <Input
      label={() => (
        <Text className="label-input mb-2">
          {label}
        </Text>
      )}
      placeholder={placeholder}
      value={value}
      onChangeText={setValue}
      className="text-input"
      style={[
        {
          backgroundColor: "#F2F3F3",
        },
        styles,
      ]}
      secureTextEntry={isPassword ? secure : false}
      accessoryRight={isPassword ? renderIcon : undefined}
    />
  );
}

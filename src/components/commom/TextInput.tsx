import { Input } from "@ui-kitten/components";
import { Text, TextInputProps } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  label?: string;
  value: string;
  disabled?: boolean;
  iconLeft?: React.ReactElement;
  setValue: (text: string) => void;
  styles?: StyleProp<ViewStyle>;
  placeholder?: string;
  type?: "text" | "password";
  keyboardType?: "default" | "email-address" | "numeric" | "decimal-pad"|"number-pad" | "phone-pad";
  showError?: true | false;
  autoCapitalize?: TextInputProps['autoCapitalize'];
};

export default function TextInput({
  label,
  value,
  setValue,
  styles,
  showError,
  placeholder = "",
  type = "text",
  keyboardType = "default",
  disabled = false,
  autoCapitalize = "sentences",
  iconLeft,
}: Props) {
  const isPassword = type === "password";
  const [secure, setSecure] = useState(isPassword);
  const toggleSecureEntry = () => setSecure(!secure);
  const renderIcon = () => (
    <TouchableOpacity onPress={toggleSecureEntry}>
      <Feather name={secure ? "eye-off" : "eye"} size={20} color="#00FF87" />
    </TouchableOpacity>
  );

  return (
    <Input
      label={() => (
        <Text className="text-text-secondary text-sm mb-2 font-medium">
          {label}
        </Text>
      )}
      placeholder={placeholder}
      placeholderTextColor="#666666"
      accessoryLeft={iconLeft ? () => iconLeft : undefined}
      disabled={disabled}
      value={value}
      onChangeText={setValue}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      textStyle={{ color: '#FFFFFF' }}
      style={[
        {
          backgroundColor: "#1A1A1A",
          borderColor: showError ? "#FF4444" : "#2A2A2A",
          borderWidth: 1,
          borderRadius: 12,
        },
        styles,
      ]}
      secureTextEntry={isPassword ? secure : false}
      accessoryRight={isPassword ? renderIcon : undefined}
      caption={showError ? "Campo obrigatório" : ""}
      status={showError ? "danger" : "basic"}
    />
  );
}

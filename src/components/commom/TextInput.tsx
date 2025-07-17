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
      accessoryLeft={iconLeft ? () => iconLeft : undefined}
      disabled={disabled}
      value={value}
      onChangeText={setValue}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      className="text-input"
      style={[
        {
          backgroundColor: "#F2F3F3",
        },
        styles,
      ]}
      secureTextEntry={isPassword ? secure : false}
      accessoryRight={isPassword ? renderIcon : undefined}
      caption={showError ? "Campo obrigatório" : ""}
      status={showError ? "danger" : "default"}
    />
  );
}

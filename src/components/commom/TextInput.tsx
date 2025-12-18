import { Feather } from "@expo/vector-icons";
import { Input } from "@ui-kitten/components";
import React, { useState } from "react";
import { Text, TextInputProps } from "react-native";
import { mask } from "react-native-mask-text";

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
  keyboardType?: "default" | "email-address" | "numeric" | "decimal-pad" | "number-pad" | "phone-pad";
  showError?: true | false;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  mask?: string;
  errorMessage?: string;
  // Novas propriedades adicionadas:
  multiline?: boolean;
  numberOfLines?: number;
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
  mask: maskPattern,
  errorMessage = "Campo obrigatório",
  // Recebendo as novas propriedades
  multiline = false,
  numberOfLines = 1,
}: Props) {
  const isPassword = type === "password";
  const [secure, setSecure] = useState(isPassword);
  const toggleSecureEntry = () => setSecure(!secure);
  const renderIcon = () => (
    <TouchableOpacity onPress={toggleSecureEntry}>
      <Feather name={secure ? "eye-off" : "eye"} size={20} color="#00FF87" />
    </TouchableOpacity>
  );

  const handleChange = (text: string) => {
    if (maskPattern) {
      const raw = text.replace(/\D/g, "");
      setValue(raw);
      return;
    }
    setValue(text);
  };

  const displayValue = maskPattern
    ? mask(value, maskPattern)
    : value;

  return (
    <Input
      label={() => (
        // Renderiza label apenas se existir
        label ? (
          <Text className="text-text-secondary text-sm mb-2 font-medium">
            {label}
          </Text>
        ) : <></>
      )}
      placeholder={placeholder}
      placeholderTextColor="#666666"
      accessoryLeft={iconLeft ? () => iconLeft : undefined}
      disabled={disabled}
      value={displayValue}
      onChangeText={handleChange}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      // Repassando propriedades de multiline
      multiline={multiline}
      textStyle={{ 
        color: '#FFFFFF', 
        minHeight: multiline ? 60 : undefined, // Garante altura mínima se for multiline
        textAlignVertical: multiline ? 'top' : 'center' // Começa o texto do topo
      }}
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
      caption={showError ? errorMessage : ""}
      status={showError ? "danger" : "basic"}
    />
  );
}
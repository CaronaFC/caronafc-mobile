import React from "react";
import { Button, ButtonProps, Text as KittenText } from "@ui-kitten/components";
import { StyleSheet, TextStyle, ViewStyle, Text } from "react-native";

type StylePropType = ViewStyle | TextStyle;

type Props = {
  btnText: string;
  btnColor?: "primary" | "secondary" | "dark" | "light";
  onPress?: () => void;
  style?: StylePropType;
  leftIcon?: ButtonProps["accessoryLeft"];
  className?: string;
  disabled?: boolean;
};

export default function DefaultButton({
  btnText,
  btnColor = "primary",
  onPress,
  style,
  leftIcon,
  className,
  disabled = false,
}: Props) {
  const getButtonStyle = () => {
    switch (btnColor) {
      case "primary":
        return styles.primaryButton;
      case "secondary":
        return styles.secondaryButton;
      case "dark":
        return styles.darkButton;
      case "light":
        return styles.lightButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    if (disabled) return [styles.buttonText, styles.disabledText];
    if (btnColor === "primary") return [styles.buttonText, styles.darkText];
    return [styles.buttonText, styles.lightText];
  };

  return (
    <Button
      className={className}
      onPress={onPress}
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      appearance="filled"
      status="control"
      accessoryLeft={leftIcon}
      disabled={disabled}
    >
      {() => <Text style={getTextStyle()}>{btnText}</Text>}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 0,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: "#00FF87",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: "#00FF87",
  },
  secondaryButton: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#00FF87",
  },
  darkButton: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  lightButton: {
    backgroundColor: "#262626",
  },
  disabledButton: {
    backgroundColor: "#333333",
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
  },
  darkText: {
    color: "#0D0D0D",
  },
  lightText: {
    color: "#FFFFFF",
  },
  disabledText: {
    color: "#666666",
  },
});

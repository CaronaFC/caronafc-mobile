import React from "react";
import { Button, Layout, ButtonProps } from "@ui-kitten/components";
import { StyleSheet, ViewStyle } from "react-native";

type Props = {
  btnText: string;
  btnColor?: "dark" | "light";
  onPress?: () => void;
  style?: ViewStyle;
  leftIcon?: ButtonProps["accessoryLeft"];
};

export default function DefaultButton({
  btnText,
  btnColor = "dark",
  onPress,
  style,
  leftIcon,
}: Props) {
  const isDark = btnColor === "dark";

  return (
    <Button
      onPress={onPress}
      style={[
        styles.button,
        isDark ? styles.darkButton : styles.lightButton,
        style,
      ]}
      appearance="filled"
      status={isDark ? "primary" : "basic"}
      accessoryLeft={leftIcon}
    >
      {btnText}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 0,
    borderRadius: 7,
  },
  darkButton: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
  },
  lightButton: {
    backgroundColor: "#F2F3F3",
    color: "#000000",
  },
});

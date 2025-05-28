import { View, Text, ViewStyle } from "react-native";
import React from "react";
import { Button } from "@ui-kitten/components";

type Props = {
  btnText: string;
  btnColor?: "dark" | "light";
  onPress?: () => void;
  style?: ViewStyle;
};
export const SecundaryButton = ({
  btnText,
  btnColor,
  onPress,
  style,
}: Props) => {
  return <Button onPress={onPress}>{btnText}</Button>;
};

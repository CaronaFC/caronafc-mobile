import React from "react";

import { View } from "react-native";
import { Text } from "react-native-paper";
import { RootStackParamList } from "../navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ route }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          color: "black",
          fontSize: 28,
          marginBottom: 10,
          fontWeight: "bold",
        }}
      >
        Home CaronaFC
      </Text>
      <Text
        style={{
          color: "black",
          fontSize: 28,
          marginBottom: 10,
          fontWeight: "bold",
        }}
      >
        Olá, {route.params.user.name}
      </Text>
    </View>
  );
}

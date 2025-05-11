import React from "react";

import { View, Text } from "react-native";
import { RootStackParamList } from "../navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ route }: Props) {
  return (
    <View
      className="flex-1 items-center justify-center bg-gradient-to-br from-green-500 to-gray-900"
    >
      <Text
        className="text-2xl font-bold mb-4 text-neutral-50"
      >
        Home CaronaFC
      </Text>
      <Text
        className="text-4xl font-bold mb-4 text-neutral-50"
      >
        Olá, {route.params.user.name}
      </Text>
    </View>
  );
}

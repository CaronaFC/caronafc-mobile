import React from "react";

import { View, Text } from "react-native";
import CardTravel from "src/components/travel/CardTravel";

type Props = {};

export default function HomeScreen({}: Props) {
  return (
    <View>
      <CardTravel />
    </View>
  );
}

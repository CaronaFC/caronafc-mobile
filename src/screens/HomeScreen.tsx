import React from "react";

import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CardTravel from "src/components/travel/CardTravel";

type Props = {};

export default function HomeScreen({}: Props) {
  const data = [1, 2, 3, 4];
  return (
    <View className="p-4">
      <View></View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => <CardTravel />}
        contentContainerStyle={{ gap: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

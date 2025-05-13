import React from "react";

import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-primaryWhite">
      <View>
        <View></View>
        <View>
          <View>
            <Text>Enter your mobile</Text>
          </View>
        </View>
      </View>
      <Text className="text-2xl font-bold mb-4 text-neutral-50">
        Home CaronaFC
      </Text>
    </View>
  );
}

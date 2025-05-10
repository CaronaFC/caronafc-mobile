import React from "react";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Login: undefined;
  Home: {
    user: {
      name: string;
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

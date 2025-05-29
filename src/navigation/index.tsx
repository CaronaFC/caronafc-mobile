import React from "react";

import LoginScreen from "../screens/LoginScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "src/screens/RegisterScreen";
import HomeScreen from "src/screens/HomeScreen";
import CreateTravelScreen from "src/screens/CreateTravelScreen";
import MyTravelRequestsScreen from "src/screens/MyTravelRequestsScreen";
import ProfileScreen from "src/screens/ProfileScreen";
import TabNavigator from "./TabNavigator";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  CreateTravel: undefined;
  MyTravelRequests: undefined;
  Profile: undefined;
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
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

import React from "react";

import LoginScreen from "../screens/LoginScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import TabNavigator from "./TabNavigator";
import VehicleCreationScreen from "../screens/VehicleCreationScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  CreateTravel: undefined;
  MyTravelRequests: undefined;
  Profile: undefined;
  VehicleCreation: undefined;
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

      <Stack.Screen
        name="VehicleCreation"
        component={VehicleCreationScreen}
        options={{
          title: "Cadastro de Veículo",
        }}
      />
    </Stack.Navigator>
  );
}

import React from "react";

import LoginScreen from "../screens/LoginScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import TabNavigator from "./TabNavigator";
import VehicleCreationScreen from "../screens/VehicleCreationScreen";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

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

  const { isLoading, userToken } = useAuth()
  if (isLoading) {
    return (

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }
  return (
    <Stack.Navigator>
      {userToken == null ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen
            name="VehicleCreation"
            component={VehicleCreationScreen}
            options={{ title: "Cadastro de Veículo", headerShown: true }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

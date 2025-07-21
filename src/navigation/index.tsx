import React from "react";

import LoginScreen from "../screens/LoginScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPassword from "../screens/ResetPassword";
import TabNavigator from "./TabNavigator";
import VehicleCreationScreen from "../screens/VehicleCreationScreen";
import VehicleScreen from "../screens/VehicleScreen";
import TravelRequestsScreen from "../screens/TravelRequests"
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { TouchableOpacity, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  CreateTravel: undefined;
  MyTravelRequests: undefined;
  MyTravelsScreen: undefined;
  Profile: undefined;
  VehicleCreation: undefined;
  Vehicle: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string } | undefined;
  TravelRequests: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isLoading, userToken } = useAuth();
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
  return (
    <Stack.Navigator>
      {userToken == null ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ title: "Resetar senha", headerShown: true }}
          />
        </>
      ) : (
        <>
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
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Vehicle"
            component={VehicleScreen}
            options={({ navigation }) => ({
              title: "Veículos",
              headerTitleAlign: "left",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("VehicleCreation")}
                  className="flex-row items-center gap-2"
                >
                  <Text className="text-lg">Adicionar Veículo</Text>
                  <FontAwesome5 name="plus" size={16} />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="TravelRequests"
            component={TravelRequestsScreen}
            options={{ title: "Solicitações de Viagem" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

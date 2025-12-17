import React from "react";

import LoginScreen from "../screens/LoginScreen";

import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import TravelDetailScreen from "../components/commom/TravelDetailScreen";
import { useAuth } from "../context/AuthContext";
import ForgotPassword from "../screens/ForgotPassword";
import HistoryTravelsScreen from "../screens/HistoryTravelsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ResetPassword from "../screens/ResetPassword";
import TravelProgressScreen from "../screens/TravelProgressScreen";
import TravelRequestsScreen from "../screens/TravelRequests";
import UpdateUserScreen from "../screens/UpdateUserScreen";
import VehicleCreationScreen from "../screens/VehicleCreationScreen";
import VehicleScreen from "../screens/VehicleScreen";
import TabNavigator from "./TabNavigator";

const renderLeftArrow = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 16, paddingRight: 8 }}
    >
      <FontAwesome5 name="arrow-left" size={20} />
    </TouchableOpacity>
  );
};

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
  TravelRequests: { id: number; travel: string };
  TravelDetail: { id: number };
  TravelProgress: { id: number };
  UpdateUser: {
    usuario?: {
      id: number;
      nome_completo: string;
      email: string;
      numero: string;
      imagem?: string | null;
    };
  };
  History: undefined;
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
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Cadastro" , headerShown:true,headerLeft: renderLeftArrow,}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              title: "Recuperar Senha",
              headerShown: true,
              headerLeft: renderLeftArrow,
            }}
          />
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
              headerLeft: renderLeftArrow,
            }}
          />
          <Stack.Screen
            name="TravelDetail"
            component={TravelDetailScreen}
            options={{
              title: "Viagem",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Vehicle"
            component={VehicleScreen}
            options={({ navigation }) => ({
              title: "Veículos",
              headerLeft: renderLeftArrow,
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
            options={{
              title: "Solicitações de Viagem",
              headerLeft: renderLeftArrow,
            }}
          />
          <Stack.Screen
            name="TravelProgress"
            component={TravelProgressScreen}
            options={{ title: "Acompanhamento" }}
          />
          <Stack.Screen
            name="UpdateUser"
            component={UpdateUserScreen}
            options={{ title: "Usuário" }}
          />
          <Stack.Screen
            name="History"
            component={HistoryTravelsScreen}
            options={{
              title: "Histórico de caronas",
              headerLeft: renderLeftArrow,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

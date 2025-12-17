import React from "react";

import LoginScreen from "../screens/LoginScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPassword from "../screens/ResetPassword";
import TabNavigator from "./TabNavigator";
import VehicleCreationScreen from "../screens/VehicleCreationScreen";
import VehicleScreen from "../screens/VehicleScreen";
import TravelRequestsScreen from "../screens/TravelRequests";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { TouchableOpacity, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import TravelDetailScreen from "../components/commom/TravelDetailScreen";
import TravelProgressScreen from "../screens/TravelProgressScreen";
import UpdateUserScreen from "../screens/UpdateUserScreen";
import { useNavigation } from "@react-navigation/native";
import HistoryTravelsScreen from "../screens/HistoryTravelsScreen";

const renderLeftArrow = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 16, paddingRight: 8 }}
    >
      <FontAwesome5 name="arrow-left" size={20} color="#FFFFFF" />
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
              headerStyle: { backgroundColor: '#0D0D0D' },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: { color: '#FFFFFF' },
              headerLeft: renderLeftArrow,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("VehicleCreation")}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Text style={{ fontSize: 16, color: '#00FF87', fontWeight: '600' }}>Adicionar Veículo</Text>
                  <FontAwesome5 name="plus" size={16} color="#00FF87" />
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
              headerStyle: { backgroundColor: '#0D0D0D' },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: { color: '#FFFFFF' },
              headerLeft: renderLeftArrow,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

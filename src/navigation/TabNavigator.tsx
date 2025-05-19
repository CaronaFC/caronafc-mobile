import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import BottomTabBar from "../components/commom/BottomTabBar";
import LoginScreen from "src/screens/LoginScreen";
import RegisterScreen from "src/screens/RegisterScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "src/screens/HomeScreen";
import CreateTravelScreen from "src/screens/CreateTravelScreen";
import MyTravelRequestsScreen from "src/screens/MyTravelRequestsScreen";
import ProfileScreen from "src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const renderLeftArrow = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 16 }}
    >
      <FontAwesome5 name="arrow-left" size={20} />
    </TouchableOpacity>
  );
};
const TabNavigator: React.FC = () => (
  <Tab.Navigator tabBar={(props: any) => <BottomTabBar {...props} />}>
    <Tab.Screen
      name={"Login"}
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      options={{
        title: "Registrar",
        headerLeft: renderLeftArrow,
        headerTitleStyle: { marginLeft: 10 },
      }}
      name={"Register"}
      component={RegisterScreen}
    />
    <Tab.Screen
      options={{
        title: "Home",
        headerLeft: renderLeftArrow,
        headerTitleStyle: { marginLeft: 10 },
      }}
      name={"Home"}
      component={HomeScreen}
    />
    <Tab.Screen
      options={{
        title: "Criar Viagem",
        headerLeft: renderLeftArrow,
        headerTitleStyle: { marginLeft: 10 },
      }}
      name={"CreateTravel"}
      component={CreateTravelScreen}
    />
    <Tab.Screen
      options={{
        title: "Minhas Solicitações",
        headerLeft: renderLeftArrow,
        headerTitleStyle: { marginLeft: 10 },
      }}
      name={"MyTravelRequests"}
      component={MyTravelRequestsScreen}
    />
    <Tab.Screen
      options={{
        title: "Meu Perfil",
        headerLeft: renderLeftArrow,
        headerTitleStyle: { marginLeft: 10 },
      }}
      name={"Profile"}
      component={ProfileScreen}
    />
  </Tab.Navigator>
);

export default TabNavigator;

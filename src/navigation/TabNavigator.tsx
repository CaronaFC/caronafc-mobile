import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import BottomTabBar from "../components/commom/BottomTabBar";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import CreateTravelScreen from "../screens/CreateTravelScreen";
import MyTravelRequestsScreen from "../screens/MyTravelRequestsScreen";
import MyTravelsScreen from "../screens/MyTravelsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

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

const TabNavigator: React.FC = () => (
  <Tab.Navigator tabBar={(props: any) => <BottomTabBar {...props} />}>
    <Tab.Screen
      options={{ title: "Viagens" }}
      name={"Home"}
      component={HomeScreen}
    />
    <Tab.Screen
      name={"CreateTravel"}
      component={CreateTravelScreen}
      options={{ title: "Criar Viagem", headerLeft: renderLeftArrow }}
    />
    <Tab.Screen
      name={"MyTravelRequests"}
      component={MyTravelRequestsScreen}
      options={{ title: "Minhas solicitações" }}
    />
    <Tab.Screen name={"MyTravels"} component={MyTravelsScreen} />

    <Tab.Screen name={"Profile"} component={ProfileScreen} />
  </Tab.Navigator>
);

export default TabNavigator;

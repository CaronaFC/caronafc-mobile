import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import BottomTabBar from "../components/commom/BottomTabBar";
import LoginScreen from "src/screens/LoginScreen";
import RegisterScreen from "src/screens/RegisterScreen";
import { FontAwesome5 } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const renderLeftArrow = () => (
  <FontAwesome5 name="arrow-left" size={20} style={{ marginLeft: 10 }} />
);
const TabNavigator: React.FC = () => (
  <Tab.Navigator tabBar={(props: any) => <BottomTabBar {...props} />}>
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
      name={"Login"}
      component={LoginScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

export default TabNavigator;

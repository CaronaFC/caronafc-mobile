import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import React from "react";
import BottomTabBar from "../components/commom/BottomTabBar";
import { View } from "react-native-reanimated/lib/typescript/Animated";

const Tab = createBottomTabNavigator();
const TabNavigator: React.FC = () => (
  <Tab.Navigator tabBar={(props: any) => <BottomTabBar {...props} />}>
    <Tab.Screen
      name={"Login"}
      component={HomeScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

export default TabNavigator;

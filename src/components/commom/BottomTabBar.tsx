// TabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import HomeScreen from "../../screens/HomeScreen";
import { View } from "react-native";

const { Navigator, Screen } = createBottomTabNavigator();

type BottomTabBarProps = {
  navigation: any;
  state: any;
};

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => (
  <>
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
      style={{
        backgroundColor: "#F8F8F8",
        display: "none",
      }}
      appearance="noIndicator"
    >
      <BottomNavigationTab />
    </BottomNavigation>
    <View
      style={{
        alignSelf: "center",
        width: 150, // Largura do traço
        height: 7, // Altura do traço
        backgroundColor: "#0A0A3C", // Cor do traço
        borderRadius: 10, // Borda arredondada
        marginVertical: 10,
      }}
    />
  </>
);
export default BottomTabBar;

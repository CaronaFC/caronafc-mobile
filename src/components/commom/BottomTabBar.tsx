// TabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
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
  </>
);
export default BottomTabBar;

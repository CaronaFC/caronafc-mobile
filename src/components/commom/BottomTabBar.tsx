// TabNavigator.tsx
import React from "react";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import { TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BottomTabBarProps = {
  navigation: any;
  state: any;
};

const HomeIcon = () => <FontAwesome5 name="home" fill="#000000" size={20} />;

const ProfileIcon = () => (
  <FontAwesome5 name="user-alt" fill="#000000" size={20} />
);

const CreateTravelIcon = () => (
  <FontAwesome5 name="plus" fill="#000000" size={20} />
);

const MyTravelRequestsIcon = () => (
  <FontAwesome5 name="clipboard-list" fill="#000000" size={20} />
);

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => {
  const hiddenRoutes = ["Login", "Register"];
  const currentRoute = state.routeNames[state.index];
  const tabRouteNames = ["Home", "CreateTravel", "MyTravelRequests", "Profile"];
  if (hiddenRoutes.includes(currentRoute)) {
    return null;
  }

  const insets = useSafeAreaInsets();

  return (
    <View style={{ 
        paddingBottom: insets.bottom
    }}>
    <BottomNavigation
      selectedIndex={tabRouteNames.indexOf(currentRoute)}
      indicatorStyle={{ backgroundColor: "#000000" }}
      onSelect={(index) => navigation.navigate(tabRouteNames[index])}
    >
      {/*ATTENTION!: the tab names are in the same order as in the Tab.Navigator */}
      {/* Respeitem a ordem */}
      <BottomNavigationTab icon={HomeIcon} />
      <BottomNavigationTab icon={CreateTravelIcon} />
      <BottomNavigationTab icon={MyTravelRequestsIcon} />
      <BottomNavigationTab icon={ProfileIcon} />
    </BottomNavigation>
    </View>
  );
};
export default BottomTabBar;

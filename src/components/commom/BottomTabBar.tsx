import React from "react";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import { Text, View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BottomTabBarProps = {
  navigation: any;
  state: any;
};

const createIcon = (name: string, isSelected: boolean) => () => (
  <FontAwesome5
    name={name}
    size={20}
    color={isSelected ? "#00FF87" : "#666666"}
  />
);

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => {
  const hiddenRoutes = ["Login", "Registro"];
  const currentRoute = state.routeNames[state.index];
  const tabRouteNames = ["Home", "CreateTravel", "MyTravelRequests", "MyTravels", "Profile"];

  if (hiddenRoutes.includes(currentRoute)) {
    return null;
  }

  const selectedIndex = tabRouteNames.indexOf(currentRoute);
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: "Home", icon: "home", label: "Home" },
    { name: "CreateTravel", icon: "plus", label: "Criar" },
    { name: "MyTravelRequests", icon: "clipboard-list", label: "Pedidos" },
    { name: "MyTravels", icon: "car", label: "Viagens" },
    { name: "Profile", icon: "user-alt", label: "Perfil" },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BottomNavigation
        selectedIndex={selectedIndex}
        indicatorStyle={styles.indicator}
        style={styles.navigation}
        onSelect={(index) => navigation.navigate(tabRouteNames[index])}
      >
        {tabs.map((tab, index) => (
          <BottomNavigationTab
            key={tab.name}
            title={() => (
              <Text style={[
                styles.tabLabel,
                selectedIndex === index && styles.tabLabelActive
              ]}>
                {tab.label}
              </Text>
            )}
            icon={createIcon(tab.icon, selectedIndex === index)}
            style={styles.tab}
          />
        ))}
      </BottomNavigation>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0D0D',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  navigation: {
    backgroundColor: '#0D0D0D',
  },
  indicator: {
    backgroundColor: '#00FF87',
    height: 3,
  },
  tab: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#00FF87',
    fontWeight: '600',
  },
});

export default BottomTabBar;

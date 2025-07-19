// TabNavigator.tsx
import React from "react";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import { Text, TouchableOpacity, View } from "react-native";
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

const MyTravelsIcon = () => (
  <FontAwesome5 name="car" fill="#000000" size={20} />
);

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => {
  const hiddenRoutes = ["Login", "Register"];
  const currentRoute = state.routeNames[state.index];
  const tabRouteNames = ["Home", "CreateTravel", "MyTravelRequests", "MyTravels", "Profile"];
  if (hiddenRoutes.includes(currentRoute)) {
    return null;
  }

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <BottomNavigation
        selectedIndex={tabRouteNames.indexOf(currentRoute)}
        indicatorStyle={{ backgroundColor: "#000000" }}
        onSelect={(index) => navigation.navigate(tabRouteNames[index])}
      >
        <BottomNavigationTab
          title={() => <Text className="text-sm">Home</Text>}
          icon={HomeIcon}
        />
        <BottomNavigationTab
          title={() => <Text className="text-sm">Criar Viagem</Text>}
          icon={CreateTravelIcon}
        />
        <BottomNavigationTab
          title={() => <Text className="text-sm ">Solicitações</Text>}
          icon={MyTravelRequestsIcon}
        />
        <BottomNavigationTab
          title={() => <Text className="text-sm">Viagens</Text>}
          icon={MyTravelsIcon}
        />
        <BottomNavigationTab
          title={() => <Text className="text-sm">Meu Perfil</Text>}
          icon={ProfileIcon}
        />
      </BottomNavigation>
    </View>
  );
};

export default BottomTabBar;

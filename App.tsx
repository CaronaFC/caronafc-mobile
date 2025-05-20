import "react-native-gesture-handler";
import "./src/styles/global.css";

import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./src/navigation/TabNavigator";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";

export default function App() {
  return (
    <SafeAreaProvider>
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </ApplicationProvider>
    </SafeAreaProvider>
  );
}

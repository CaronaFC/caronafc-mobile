import "react-native-gesture-handler";
import "./src/styles/global.css";

import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigator from "./src/navigation";

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<AuthProvider>
					<ApplicationProvider {...eva} theme={eva.light}>
						<NavigationContainer>
							<RootNavigator />
						</NavigationContainer>
					</ApplicationProvider>
				</AuthProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

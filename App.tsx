import 'react-native-reanimated';
import "react-native-gesture-handler";
import "./src/styles/global.css";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigator from "./src/navigation";
import { navigationRef } from './src/navigation/navigationService';
import { MotoristaLocationProvider } from "./src/context/TravelContext";

const CaronaFCTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		primary: '#00FF87',
		background: '#0D0D0D',
		card: '#141414',
		text: '#FFFFFF',
		border: '#2A2A2A',
		notification: '#00FF87',
	},
};

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
			<StatusBar style="light" backgroundColor="#0D0D0D" />
			<SafeAreaProvider>
				<MotoristaLocationProvider>
					<AuthProvider>
						<ApplicationProvider {...eva} theme={eva.dark}>
							<NavigationContainer ref={navigationRef} theme={CaronaFCTheme}>
								<RootNavigator />
							</NavigationContainer>
						</ApplicationProvider>
					</AuthProvider>
				</MotoristaLocationProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

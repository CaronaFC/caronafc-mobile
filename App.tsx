import 'react-native-gesture-handler';

import React from 'react';
import RootNavigator from './src/navigation';

import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import "./src/styles/global.css"

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
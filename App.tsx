import 'react-native-gesture-handler';
import './src/styles/global.css';

import React from 'react';
import RootNavigator from './src/navigation';

import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
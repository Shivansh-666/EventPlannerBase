import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';

import TabNavigator from './TabNavigator';
import {useSelector} from 'react-redux';
import {RootState} from '../Redux/store';

type RootParamList = {
  Splash: undefined;
  Root: undefined;
  MainNavigator: undefined;
  TabNavigator: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();

function RootNavigator() {
  const RememberMe = useSelector((state: RootState) => state.user.rememberMe);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        initialRouteName={RememberMe ? 'TabNavigator' : 'Root'}>
        <Stack.Screen name="Root" component={AuthNavigator} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;

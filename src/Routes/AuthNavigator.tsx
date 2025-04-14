import React from 'react';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import RegistrationScreen from '../Screens/Authentication/RegistrationScreen';
import Login from '../Screens/Authentication/Login';

type AuthParamList = {
  Login: undefined;
  Register: undefined;
};

export type WelcomeProps = NativeStackScreenProps<AuthParamList, 'Login'>;
export type RetailLoginProps = NativeStackScreenProps<
  AuthParamList,
  'Register'
>;

const Stack = createNativeStackNavigator<AuthParamList>();

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;

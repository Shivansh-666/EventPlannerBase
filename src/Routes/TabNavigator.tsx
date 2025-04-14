import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-paper'; // Use Icon from react-native-paper
import EventListScreen from '../Screens/Dashboard/EventListScreen';
import Settings from '../Screens/Dashboard/Settings';

type TabParamList = {
  EventListScreen: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="EventListScreen"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'gray', // Customize tab bar background color
          borderTopWidth: 0, // Remove tab bar border
          elevation: 4, // Add shadow for Android
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';

          // Assign icons based on route names
          if (route.name === 'EventListScreen') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'bell' : 'bell-outline'; // Notification icon
          }

          return <Icon source={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red', // Active icon color
        tabBarInactiveTintColor: 'white', // Inactive icon color
      })}>
      <Tab.Screen
        name="EventListScreen"
        component={EventListScreen}
        options={{title: 'Events'}}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{title: 'ForMe'}}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;

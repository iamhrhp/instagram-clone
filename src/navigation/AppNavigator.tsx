import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReelsScreen from '../screens/ReelsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessageScreen from '../screens/MessageScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Reels" component={ReelsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Message" component={MessageScreen} />
      </Stack.Navigator>
    </NavigationContainer>


  );
};

export default AppNavigator;

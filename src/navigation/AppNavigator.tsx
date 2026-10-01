import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, SearchNormal1, VideoPlay, Send2, ProfileCircle } from 'iconsax-react-native';

import ReelsScreen from '../screens/ReelsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessageScreen from '../screens/MessageScreen';
import MessagesListScreen from '../screens/MessagesListScreen';
import MessageRequestsScreen from '../screens/MessageRequestsScreen';
import HomeScreen from '../screens/HomeScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DummyScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#000', fontSize: 20 }}>{name} Screen</Text>
  </View>
);

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#FFF', borderTopColor: '#EEE', elevation: 0, shadowOpacity: 0 },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#000',
        tabBarShowLabel: false,
        tabBarIcon: ({ color, focused }) => {
          const variant = focused ? 'Bold' : 'Linear';
          switch (route.name) {
            case 'Home': return <Home size={26} color={color} variant={variant} />;
            case 'Video': return <VideoPlay size={26} color={color} variant={variant} />;
            case 'Send': return <Send2 size={26} color={color} variant={variant} />;
            case 'Search': return <SearchNormal1 size={26} color={color} variant={variant} />;
            case 'ProfileTab': return <ProfileCircle size={26} color={color} variant={variant} />;
            default: return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Video" component={ReelsScreen} />
      <Tab.Screen name="Send" component={MessagesListScreen} />
      <Tab.Screen name="Search" children={() => <DummyScreen name="Search" />} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Message" component={MessageScreen} />
        <Stack.Screen name="MessageRequests" component={MessageRequestsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/components/pages/LoginScreen';
import Principal from './src/components/pages/Principal';
import QuizScreen from './src/components/pages/QuizScreen';
import RoadmapScreen from './src/components/pages/RoadmapScreen';
import ProfileTab from './src/components/pages/ProfileTab';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { ThemeProvider } from './src/contexts/ThemeContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#090e1d', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#0f172a' },
        drawerActiveTintColor: '#818cf8',
        drawerInactiveTintColor: '#64748b',
      }}
    >
      <Drawer.Screen
        name="DashboardRoot"
        component={Principal}
        options={{ title: 'Início', headerTitle: '' }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#090e1d' }
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={MainDrawer} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Roadmap" component={RoadmapScreen} />
          <Stack.Screen name="Profile" component={ProfileTab} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Button, View, Image, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { startLocationUpdatesAsync } from "expo-location";

// import LoginScreen from "../screens/LoginScreen";
import Screen from "./app/components/Screen";
import AuthNavigator from "./app/navigation/AuthNavigator";
import NavigationTheme from "./app/navigation/NavigationTheme";
import AppNavigator, { AppNavigatorUser } from "./app/navigation/AppNavigator";
import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";

const Stack = createNativeStackNavigator();
const StackNavigatorUser = () => (
  <Stack.Navigator initialRouteName="WelcomeScreen">
    <Stack.Screen
      options={{ headerShown: false }}
      name="WelcomeScreen"
      component={WelcomeScreen}
    />
    <Stack.Screen
      options={{ headerShown: false }}
      name="LoginScreen"
      component={LoginScreen}
    />

    <Stack.Screen
      options={{ headerShown: false }}
      name="RegisterScreen"
      component={RegisterScreen}
    />
    <Stack.Screen
      options={{ headerShown: false }}
      name="AppNavigator"
      component={AppNavigator}
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer theme={NavigationTheme}>
      <StackNavigatorUser />
      {/* <ChatScreen /> */}
      {/* <RegisterScreen /> */}
      {/* <AppNavigator /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 11,
  },
});

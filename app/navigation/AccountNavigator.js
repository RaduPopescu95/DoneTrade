import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import UserListingsScreen from "../screens/UserListingsScreen";

const Stack = createNativeStackNavigator();
const screenOption = {
  headerShown: false,
};

const AccountNavigator = () => (
  <Stack.Navigator screenOptions={screenOption}>
    {/* <Stack.Screen name="Feed" component={FeedNavigator} /> */}
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen
      name="Messages"
      component={MessagesScreen}
      // options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MyListings"
      component={UserListingsScreen}
      // options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AccountNavigator;

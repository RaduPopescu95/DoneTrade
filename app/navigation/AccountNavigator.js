import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import UserListingsScreen from "../screens/UserListingsScreen";
import UserListingDetails from "../screens/UserListingDetails";
import UsersListingNavigator from "./UsersListingsNavigator";
import UpdateListingScreen from "../screens/UpdateListingScreen";

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
      component={UsersListingNavigator}
      // options={{ headerShown: false }}
    />
    <Stack.Screen
      name="UserListingsDetails"
      component={UserListingDetails}
      // options={{ headerShown: false }}
    />
    <Stack.Screen
      name="UpdateListingScreen"
      component={UpdateListingScreen}
      // options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AccountNavigator;

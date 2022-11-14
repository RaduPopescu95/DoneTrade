import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserListingsScreen from "../screens/UserListingsScreen";
import UserListingDetails from "../screens/UserListingDetails";

const Stack = createNativeStackNavigator();
const screenOption = {
  headerShown: false,
};

const UsersListingNavigator = () => (
  <Stack.Navigator screenOptions={screenOption}>
    <Stack.Screen
      name="UsersListings"
      component={UserListingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="UserListingDetails"
      component={UserListingDetails}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default UsersListingNavigator;

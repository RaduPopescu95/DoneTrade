import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import UserListingsScreen from "../screens/UserListingsScreen";
import UserListingDetails from "../screens/UserListingDetails";
import UsersListingNavigator from "./UsersListingsNavigator";
import UpdateListingScreen from "../screens/UpdateListingScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ProfileEditor from "../components/forms/ProfileEditor";
import EditPasswordForm from "../components/forms/EditPasswordForm";

const Stack = createNativeStackNavigator();
const screenOption = {
  headerShown: false,
};

const AccountNavigator = () => (
  // <Stack.Navigator screenOptions={screenOption}>
  <Stack.Navigator>
    {/* <Stack.Screen name="Feed" component={FeedNavigator} /> */}
    <Stack.Screen
      name="Account"
      component={AccountScreen}
      options={screenOption}
    />
    <Stack.Screen
      name="Messages"
      component={MessagesScreen}
      options={screenOption}
    />
    <Stack.Screen
      name="MyListings"
      component={UsersListingNavigator}
      options={screenOption}
    />
    <Stack.Screen
      name="UserListingsDetails"
      component={UserListingDetails}
      options={screenOption}
    />
    <Stack.Screen
      name="UpdateListingScreen"
      component={UpdateListingScreen}
      options={screenOption}
    />
    <Stack.Screen
      name="EditProfileScreen"
      component={EditProfileScreen}
      options={screenOption}
    />
    <Stack.Screen
      name="EditProfileElement"
      component={ProfileEditor}
      options={{ headerShown: true }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={EditPasswordForm}
      options={{ headerShown: true }}
    />
  </Stack.Navigator>
);

export default AccountNavigator;

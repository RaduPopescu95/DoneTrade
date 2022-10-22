import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

import AccountScreen from "../screens/AccountScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import ListingEditScreen from "../screens/ListingEditScreen";
import ListingsScreen from "../screens/ListingsScreen";
import AccountNavigator from "./AccountNavigator";
import FeedNavigator from "./FeedNavigator";
// import NewListingIcon from "./NewListingIcon";
import LoginScreen from "../screens/LoginScreen";
import { authentication } from "../../firebase";
import { useState } from "react/cjs/react.development";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import colors from "../config/colors";
import { Colors } from "react-native/Libraries/NewAppScreen";

const Tab = createBottomTabNavigator();
const auth = authentication;
const unsubscribe = auth.onAuthStateChanged((user) => {
  if (user) {
    navigation.replace("AppNavigator");
    console.log(user);
  }
});

const AppNavigator = () => {
  const [signedIn, setSignedIn] = useState(false);

  // const registerForPushNotifications = async () => {
  //   try {
  //     const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //     if (!permission.granted) return;

  //     const token = await Notifications.getExpoPushTokenAsync();
  //     console.log(token);
  //   } catch (err) {
  //     console.log("Error NOTIFICATION FOR TOKEN...", err);
  //   }
  // };

  useEffect(() => {
    console.log("App navigator USE EFFECT.....");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
      } else setSignedIn(false);
    });
    // registerForPushNotifications();
  }, []);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Feed"
        component={FeedNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={35} />
          ),
        }}
      />

      {signedIn && (
        <Tab.Screen
          name="ListingsEdit"
          component={ListingEditScreen}
          options={({ navigation }) => ({
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="plus-circle"
                color={color}
                size={35}
              />
            ),
          })}
        />
      )}
      <Tab.Screen
        name="AccountScreen"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={35} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;

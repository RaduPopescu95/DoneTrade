import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListingEditScreen from "../screens/ListingEditScreen";
import AccountNavigator from "./AccountNavigator";
import FeedNavigator from "./FeedNavigator";
import { authentication } from "../../firebase";
import { useState } from "react/cjs/react.development";

const Tab = createBottomTabNavigator();
const auth = authentication;

const AppNavigator = () => {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    console.log("App navigator USE EFFECT.....");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
      } else setSignedIn(false);
    });
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

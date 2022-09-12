import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function AuthNavigation() {
 const auth = authentication;
const unsubscribe = auth.onAuthStateChanged((user) =>
  useGestureHandlerRef(user)
);
const uidExists = auth
  .getUser(uid)
  .then(() => true)
  .catch(() => false);
  return (
    <View>
      <Text>AuthNavigation</Text>
    </View>
  )
}

const styles = StyleSheet.create({})
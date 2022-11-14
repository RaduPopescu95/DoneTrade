import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../config/colors";

export default function MenuList({ item, handlePress }) {
  return (
    <View>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: item.color }]}
        onPress={handlePress}
      >
        <MaterialCommunityIcons
          name={item.icon.name}
          color={colors.primary}
          size={50.5}
        />
      </TouchableOpacity>

      <View style={styles.cardHeader}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={[styles.title, { color: item.titleColor }]}>
            {item.title}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerMenu: {
    flex: 1,
    marginTop: 65,
    backgroundColor: "#fff",
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: "#fff",
  },
  listContainer: {
    alignItems: "center",
  },
  header: {
    backgroundColor: colors.secondary,
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130,
  },
  name: {
    fontSize: 33,
    color: colors.primary,
    fontWeight: "600",
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  bodyContentWithoutFlex: {
    alignItems: "center",
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600",
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  /******** card **************/
  card: {
    shadowColor: "#474747",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
    marginVertical: 20,
    marginHorizontal: 40,
    backgroundColor: "#e2e2e2",
    width: 90,
    height: 90,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    height: 50,
    width: 50,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    flex: 1,
    alignSelf: "center",
    fontWeight: "bold",
  },
});

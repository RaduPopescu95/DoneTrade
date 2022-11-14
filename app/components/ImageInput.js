import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import colors from "../config/colors";

export default function ImageInput({ imgUri, onChangeImage }) {
  const handlePress = () => {
    if (!imgUri) selectImage();
    else
      Alert.alert("Delete", "Are you sure you want to delete this image?", [
        {
          text: "Yes",
          onPress: () => onChangeImage(null),
        },
        {
          text: "No",
        },
      ]);
  };

  const requestPermision = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library");
  };

  const selectImage = async () => {
    try {
      console.log("trying");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.cancelled) {
        console.log(result.uri, "TESTING HERE");
        onChangeImage(result.uri);
      }

      console.log("Success !!!!!!", result.uri);
    } catch (error) {
      console.log("EROOOOOORsssRRR", error);
    }
  };

  useEffect(() => {
    requestPermision();
    console.log(imgUri);
  }, []);
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {!imgUri && (
          <MaterialCommunityIcons
            name="camera"
            size={40}
            color={colors.medium}
          />
        )}
        {imgUri && <Image source={{ uri: imgUri }} style={styles.img} />}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    borderRadius: 15,
    height: 100,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
});

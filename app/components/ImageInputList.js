import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import ImageInput from "./ImageInput";
import ScrollViewCommands from "react-native/Libraries/Components/ScrollView/ScrollViewCommands";

export default function ImageInputList({
  imageUris = [],
  onRemoveImage,
  onAddImage,
}) {
  const scrollView = useRef();

  useEffect(() => {
    console.log("asdasdasdasdasd", imageUris);
  }, [imageUris]);
  return (
    <View>
      <ScrollView
        ref={scrollView}
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() => scrollView.current.scrollToEnd()}
      >
        <View style={styles.container}>
          {imageUris.map((uri) => (
            <View style={styles.image}>
              <ImageInput
                imgUri={uri}
                key={uri}
                onChangeImage={() => onRemoveImage(uri)}
              />
            </View>
          ))}
          <ImageInput onChangeImage={(uri) => onAddImage(uri)} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    marginRight: 10,
  },
});

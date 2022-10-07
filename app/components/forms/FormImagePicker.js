import { StyleSheet, Text, View } from "react-native";
import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import ImageInputList from "../ImageInputList";
import { ErrorMessage } from ".";

export default function FormImagePicker({ name, images }) {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  let imgUris = values[name];

  const handleAdd = (uri) => {
    console.log("urii....", uri);
    setFieldValue(name, [...imgUris, uri]);
  };

  const handleRemove = (uri) => {
    setFieldValue(
      name,
      imgUris.filter((imgUri) => imgUri !== uri)
    );
  };

  useEffect(() => {
    // if (images) {
    //   for (let i = 0; i < images.length; i++) {
    //     // console.log(`img...${i}...`, images[i]);
    //     handleAdd(images[i]);
    //   }
    // }
    console.log(`imguriss..${imgUris.length}`, imgUris);
    console.log(`name...`, name);
    console.log(`images...`, images);
  }, []);

  return (
    <>
      <ImageInputList
        imageUris={imgUris}
        images={images}
        onAddImage={handleAdd}
        onRemoveImage={handleRemove}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

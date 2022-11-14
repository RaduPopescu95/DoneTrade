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

  useEffect(() => {}, []);

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

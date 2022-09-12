import { StyleSheet, Text, View } from "react-native";
import { useFormikContext } from "formik";
import React from "react";
import ImageInputList from "../ImageInputList";
import { ErrorMessage } from ".";

export default function FormImagePicker({ name }) {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  const imgUris = values[name];

  const handleAdd = (uri) => {
    setFieldValue(name, [...imgUris, uri]);
  };

  const handleRemove = (uri) => {
    setFieldValue(
      name,
      imgUris.filter((imgUri) => imgUri !== uri)
    );
  };

  return (
    <>
      <ImageInputList
        imageUris={imgUris}
        onAddImage={handleAdd}
        onRemoveImage={handleRemove}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

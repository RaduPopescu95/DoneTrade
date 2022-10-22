import React from "react";
import { useFormikContext } from "formik";

import TextInput from "../TextInput";
import ErrorMessage from "./ErrorMessage";

function AppFormField({
  name,
  width,
  bgColorContactSeller,
  defaultValue,
  value,
  changeVal,
  ...otherProps
}) {
  const { setFieldTouched, handleChange, errors, touched, values } =
    useFormikContext();

  const handleChangeText = () => {
    handleChange(name);
    handleChange(value);
  };

  return (
    <>
      <TextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        width={width}
        bgColorContactSeller={bgColorContactSeller}
        defaultValue={defaultValue}
        name={name}
        value={
          name === "title"
            ? values.title
            : name === "description"
            ? values.description
            : name === "price"
            ? values.price
            : name === "firstName"
            ? values.firstName
            : name === "lastName"
            ? values.lastName
            : name === "email"
            ? values.email
            : name === "phoneNumber"
            ? values.phoneNumber
            : name === "password"
            ? values.password
            : name === "confirmPassword"
            ? values.confirmPassword
            : "none"
        }
        changeVal={changeVal}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormField;

import React, { FunctionComponent } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import RegularText from "../Texts/RegularText";

import { colors } from "../../colors";

import { ButtonProps } from "./types";
const { accent, primary, white } = colors;

const ButtonView = styled.TouchableOpacity`
  background-color: ${primary};
  width: 100%;
  height: 60px;
  border-radius: 8px;
  padding: 15px;
  justify-content: center;
  align-items: center;
`;

const FormButton: FunctionComponent<ButtonProps> = ({
  isLoading,
  ...props
}) => {
  return (
    <ButtonView
      onPress={props.onPress}
      style={props.style}
      testID={props.testID}
    >
      <RegularText
        style={[{ color: white, fontWeight: "bold" }, props.textStyle]}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={white} />
        ) : (
          props.children
        )}
      </RegularText>
    </ButtonView>
  );
};

export default FormButton;

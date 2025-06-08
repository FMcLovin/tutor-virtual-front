import React, { FunctionComponent } from "react";
import styled from "styled-components/native";
import RegularText from "../Texts/RegularText";

import { colors } from "../../colors";

import { ButtonProps } from "./types";
const { black, primary, white } = colors;

const ButtonView = styled.TouchableOpacity`
  background-color: ${primary};
  width: 100%;
  height: 60px;
  border-radius: 8px;
  padding: 15px;
  justify-content: center;
  align-items: center;
`;

const RegularButton: FunctionComponent<ButtonProps> = (props) => {
  return (
    <ButtonView onPress={props.onPress} style={props.style}>
      <RegularText style={[{ color: white }, props.textStyle]}>
        {props.children}
      </RegularText>
    </ButtonView>
  );
};

export default RegularButton;

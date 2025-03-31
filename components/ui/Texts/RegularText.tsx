import React, { FunctionComponent } from "react";
import styled from "styled-components/native";

import { colors } from "../../colors";

import { TextProps } from "./types";
const { black } = colors;

const StyledText = styled.Text`
  font-size: 15px;
  color: ${black};
  text-align: left;
`;

const RegularText: FunctionComponent<TextProps> = (props) => {
  return (
    <StyledText className={props.className} style={props.style}>
      {props.children}
    </StyledText>
  );
};

export default RegularText;

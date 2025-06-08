import React, { FunctionComponent } from "react";
import styled from "styled-components/native";

import { colors } from "../../colors";

import { TextProps } from "./types";
const { black } = colors;

const StyledText = styled.Text`
  font-size: 30px;
  color: ${black};
  text-align: left;
`;

const BigText: FunctionComponent<TextProps> = (props) => {
  return (
    <StyledText className={props.className} style={props.style}>
      {props.children}
    </StyledText>
  );
};

export default BigText;

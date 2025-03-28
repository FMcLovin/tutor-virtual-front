import React, { FunctionComponent } from "react";
import styled from "styled-components/native";

import { colors } from "../../colors";

import { TextProps } from "./types";
const { danger } = colors;

const StyledText = styled.Text`
  font-size: 12px;
  color: ${danger};
  text-align: left;
`;

const ErrorText: FunctionComponent<TextProps> = (props) => {
  return <StyledText style={props.style}>{props.children}</StyledText>;
};

export default ErrorText;

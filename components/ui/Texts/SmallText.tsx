import React, { FunctionComponent } from "react";
import styled from "styled-components/native";

import { colors } from "../../colors";

import { TextProps } from "./types";
const { black } = colors;

const StyledText = styled.Text`
  font-size: 13px;
  color: ${black};
  text-align: left;
`;

const SmallText: FunctionComponent<TextProps> = (props) => {
  return <StyledText style={props.style}>{props.children}</StyledText>;
};

export default SmallText;

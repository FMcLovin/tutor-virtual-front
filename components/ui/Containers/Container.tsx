import React, { FunctionComponent } from "react";
import styled from "styled-components/native";

import { colors } from "../../colors";
import { ContainerProps } from "./types";

const { background } = colors;

const StyledView = styled.View`
  flex: 1;
  padding-horizontal: 20px;
  background-color: ${background};
`;

const Container: FunctionComponent<ContainerProps> = (props) => {
  return (
    <StyledView className={props.className} style={props.style}>
      {props.children}
    </StyledView>
  );
};

export default Container;

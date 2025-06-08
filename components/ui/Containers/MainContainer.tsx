import React, { FunctionComponent } from "react";
import styled from "styled-components/native";

import { colors } from "../../colors";
import { ContainerProps } from "./types";

const { background } = colors;

const StyledView = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: 10px;
  background-color: ${background};
`;

const MainContainer: FunctionComponent<ContainerProps> = (props) => {
  return (
    <StyledView className={props.className} style={props.style}>
      {props.children}
    </StyledView>
  );
};

export default MainContainer;

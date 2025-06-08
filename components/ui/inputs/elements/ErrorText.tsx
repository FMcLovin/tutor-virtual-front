import React, { forwardRef } from "react";
import styled from "styled-components/native";
import { colors } from "../../../colors";

const { danger } = colors;

const ErrorTextBase = styled.Text`
  font-size: 12px;
  color: ${danger};
  margin-top: 5px;
`;

interface ErrorTextProps {
  children: React.ReactNode;
}

const ErrorText = forwardRef<Text, ErrorTextProps>(
  ({ children, ...props }, ref) => (
    <ErrorTextBase ref={ref} {...props}>
      {children}
    </ErrorTextBase>
  ),
);

ErrorText.displayName = "ErrorText";

export default ErrorText;

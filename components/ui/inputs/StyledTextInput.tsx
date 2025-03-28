import React, { useState, FunctionComponent } from "react";
import styled from "styled-components/native";

import { colors } from "../../colors";

import { InputProps } from "./types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SmallText from "../Texts/SmallText";
import ErrorText from "../Texts/ErrorText";

const { primary, border, danger, black, gray, background } = colors;

const InputWrapper = styled.View`
  width: 100%;
  margin-vertical: 5px;
  margin-bottom: 10px;
`;

const LeftIcon = styled.View`
  position: absolute;
  top: 30px;
  left: 10px;
  z-index: 1;
  padding-right: 10px;
`;

const InputField = styled.TextInput<{ errorText: string }>`
  background-color: ${background};
  height: 40px;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${(props: InputProps) =>
    props.errorText.length > 0 ? danger : border};
  padding: 5px;
  padding-left: 40px;
  padding-right: 40px;
  font-size: 16px;
  margin-vertical: 3px;
  color: ${black};
`;

const RightIcon = styled.TouchableOpacity`
  position: absolute;
  top: 30px;
  right: 10px;
  z-index: 1;
`;

const StyledTextInput: FunctionComponent<InputProps> = ({
  icon,
  label,
  isPassword,
  errorText,
  ...props
}) => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <InputWrapper>
      <LeftIcon>
        <MaterialCommunityIcons name={icon} size={20} color={primary} />
      </LeftIcon>
      <SmallText>{label}</SmallText>
      <InputField
        {...props}
        placeholderTextColor={gray}
        style={[props.style]}
        secureTextEntry={isPassword && hidePassword}
        errorText={errorText}
      />

      {isPassword ? (
        <RightIcon
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
        >
          <MaterialCommunityIcons
            name={hidePassword ? "eye-off" : "eye"}
            size={20}
            color={black}
          />
        </RightIcon>
      ) : null}

      {errorText.length > 0 ? <ErrorText>{errorText}</ErrorText> : null}
    </InputWrapper>
  );
};
export default StyledTextInput;

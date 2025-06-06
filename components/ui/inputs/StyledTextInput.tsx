import React, { useState, FunctionComponent } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import styled from "styled-components/native";

import { colors } from "../../colors";

import { InputProps } from "./types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SmallText from "../Texts/SmallText";
import ErrorText from "./elements/ErrorText";

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

const ErrorIcon = styled.View`
  position: absolute;
  top: 30px;
  right: 10px;
  z-index: 1;
`;

const AnimatedErrorText = Animated.createAnimatedComponent(ErrorText);

const StyledTextInput: FunctionComponent<InputProps> = ({
  icon,
  label,
  isPassword,
  errorText,
  ...props
}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const hasError = (): boolean => {
    return errorText.length > 0;
  };

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

      {isPassword && !hasError() ? (
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

      {hasError() ? (
        <ErrorIcon>
          <MaterialCommunityIcons
            name="alert-circle"
            size={20}
            color={danger}
          />
        </ErrorIcon>
      ) : null}

      {hasError() ? (
        <AnimatedErrorText
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          {errorText}
        </AnimatedErrorText>
      ) : null}
    </InputWrapper>
  );
};
export default StyledTextInput;

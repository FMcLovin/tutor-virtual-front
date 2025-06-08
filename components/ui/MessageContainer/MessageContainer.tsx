import React, { FunctionComponent } from "react";
import styled from "styled-components/native";

import { MessageProps } from "./types";
import { Message } from "../../../models/Message";
import SmallText from "../Texts/SmallText";
import ExtraSmallText from "../Texts/ExtraSmallText";

const MessageParent = styled.View`
  width: 100%;
`;

// Definimos el tipo de las props de MessageChild
const MessageChild = styled.View<{ sender: string }>`
  width: auto;
  padding: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  max-width: fit-content;
  align-self: ${(props: Message) =>
    props.sender === "user" ? "flex-end" : "flex-start"};
  background-color: ${(props: Message) =>
    props.sender === "user" ? "#bbf7d0" : "#bfdbfe"};
  border-radius: ${(props: Message) =>
    props.sender === "user"
      ? "0.5rem 0rem 0.5rem 0.5rem"
      : "0rem 0.5rem 0.5rem 0.5rem"};
`;

const MessageContainer: FunctionComponent<MessageProps> = (props) => {
  const { sender } = props.message; // Accedemos a sender desde props.message
  return (
    <MessageParent
      className={props.className}
      style={props.style}
      index={props.index}
    >
      <MessageChild sender={sender} index={props.index}>
        <SmallText>{props.children}</SmallText>
        <ExtraSmallText className="text-gray-500 mt-1">
          {props.date}
        </ExtraSmallText>
      </MessageChild>
    </MessageParent>
  );
};

export default MessageContainer;

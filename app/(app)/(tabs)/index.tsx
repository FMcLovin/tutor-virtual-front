import React, { useRef } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import Container from "../../../components/ui/Containers/Container";
import { styled } from "nativewind";
import useChat from "../../../hooks/useChat";
import MessageContainer from "../../../components/ui/MessageContainer/MessageContainer";

export default function Chat() {
  const {
    messages,
    chatID,
    isSendingMessage,
    sendMessage,
    scrollViewRef,
    handleScroll,
    setInputText,
    inputText,
  } = useChat();

  const StyledPressable = styled(Pressable);

  return (
    <Container>
      {/* Contenedor del chat */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {messages.map((message, index) => (
          <MessageContainer
            key={message._id}
            message={message}
            index={index}
            date={new Date(message.timestamp).toLocaleString()}
          >
            {message.content}
          </MessageContainer>
        ))}
      </ScrollView>

      {isSendingMessage && (
        <View className="w-3/4 self-center fixed">
          <View className="p-3 rounded-lg my-2 w-auto max-w-fit bg-blue-200 self-center">
            <Text className="text-base">Tu tutorUV está escribiendo...</Text>
          </View>
        </View>
      )}
      {/* Input para escribir el mensaje */}
      <View className="flex-row py-3 border-t border-gray-300">
        <TextInput
          testID="message-data"
          className="flex-1 p-3 border border-gray-400 rounded-lg mr-2"
          placeholder="Escribe tu mensaje..."
          value={inputText}
          onChangeText={setInputText}
        />
        <StyledPressable
          onPress={sendMessage}
          className="p-3 rounded-lg bg-primary active:opacity-70"
          disabled={isSendingMessage}
        >
          <Text
            testID="button-send"
            className="text-white text-center font-bold"
          >
            Enviar
          </Text>
        </StyledPressable>
      </View>
    </Container>
  );
}

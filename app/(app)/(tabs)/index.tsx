import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { Screen } from "../../../components/Screen";
import { useSession } from "../../ctx";
import { styled } from "nativewind";

export default function App() {
  const { signOut, session } = useSession();
  const [messages, setMessages] = useState([
    { text: "Hola, ¿cómo puedo ayudarte hoy?", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");
  const StyledPressable = styled(Pressable);

  // Función para enviar un mensaje
  const sendMessage = () => {
    if (inputText.trim() === "") return;

    // Agregar el mensaje del usuario a la lista de mensajes
    const userMessage = { text: inputText, sender: "user" };
    setMessages([...messages, userMessage]);

    // Limpiar el input
    setInputText("");

    // Simular respuesta del bot o conectar a tu API de IA
    setTimeout(() => {
      const botResponse = {
        text: "Esta es una respuesta de la IA a tu mensaje: " + inputText,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000); // Simula un retraso en la respuesta
  };
  return (
    <Screen>
      {/* Contenedor del chat */}
      <ScrollView className="flex-1">
        {messages.map((message, index) => (
          <View
            key={index}
            className={`p-3 rounded-lg my-1 ${
              message.sender === "user"
                ? "bg-green-200 self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            <Text className="text-base">{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input para escribir el mensaje */}
      <View className="flex-row pt-3 border-t border-gray-300">
        <TextInput
          className="flex-1 p-3 border border-gray-400 rounded-lg mr-2"
          placeholder="Escribe tu mensaje..."
          value={inputText}
          onChangeText={setInputText}
        />
        <StyledPressable
          onPress={sendMessage}
          className="p-3 rounded-lg bg-primary active:opacity-70"
        >
          <Text className="text-white text-center font-bold">Enviar</Text>
        </StyledPressable>
      </View>
    </Screen>
  );
}

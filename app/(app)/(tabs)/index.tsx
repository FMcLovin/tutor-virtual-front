import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { Screen } from "../../../components/Screen";
import { useSession } from "../../ctx";
import { styled } from "nativewind";
import { get, post } from "../../../services";
import { GET_CHAT_BY_USER_ID, CREATE_CHAT, GET_CHAT } from "@env";

export default function App() {
  const { session } = useSession();
  const [messages, setMessages] = useState([
    {
      text: `Hola ${session?.user.username}, ¿cómo puedo ayudarte hoy?`,
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const StyledPressable = styled(Pressable);

  useEffect(() => {
    fetchChatByUserId();
  }, []);

  /**
   * fetchChatByUserId
   * @returns Promise containing user chat or null
   */
  const fetchChatByUserId = async () => {
    return await get(
      `${GET_CHAT_BY_USER_ID}${session?.user._id}`,
      session?.token,
    )
      .then((response) => {
        console.log("index.tsx: fetchChatByUserId", response);
        fetchChatDetails(response.chat_id);
      })
      .catch((error) => {
        if (error.error === "Chat not found") {
          console.log(error.error);
          createChat();
        }
      });
  };

  /**
   * Get Chat details
   * @param chatId chat's id
   * @returns Promise containing chat data
   */
  const fetchChatDetails = async (chatId: string) => {
    return await get(`${GET_CHAT}${chatId}`, session?.token)
      .then((chatDetails) => {
        console.log("fetchChatDetails:", chatDetails);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * Creates new chat
   * @returns Promise containing the new chat
   */
  const createChat = async () => {
    return await post(
      CREATE_CHAT,
      { userId: session?.user.userid },
      session?.token,
    )
      .then((newChat) => {
        console.log("createChat: ", newChat);
      })
      .catch((error) => {
        throw new Error("Error al crear un nuevo chat.");
      });
  };

  /**
   * sendMessage
   * Envía un mensaje a la API y actualiza los mensajes
   */
  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const userMessage = { text: inputText, sender: "user" };
    setMessages([...messages, userMessage]);
    setInputText("");

    setTimeout(() => {
      const botResponse = {
        text: `Esta es una respuesta de la IA a tu mensaje: ${inputText}`,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
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

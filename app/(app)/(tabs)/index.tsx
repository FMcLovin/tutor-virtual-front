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
import { get, post, put } from "../../../services";
import { GET_CHAT_BY_USER_ID, CREATE_CHAT, GET_CHAT } from "@env";

export default function App() {
  const { session } = useSession();
  const [messages, setMessages] = useState<
    { content: string; sender: string; timestamp: string }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const StyledPressable = styled(Pressable);
  const [chatID, setChatID] = useState("");

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
        setChatID(response.chat_id);
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

        // Extrae los mensajes del chat y actualiza el estado
        const chatMessages = chatDetails?.conversation?.messages || [];

        // Actualiza los mensajes con la nueva función
        initChatMessages(chatMessages);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: `Hola ${session?.user.username}, ¿cómo puedo ayudarte hoy?`,
            sender: "bot",
            timestamp: new Date().toString(),
          },
        ]);
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
        setChatID(newChat._id);
        const chatMessages = newChat?.conversation?.messages || [];
        initChatMessages(chatMessages);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: `Hola ${session?.user.username}, ¿cómo puedo ayudarte hoy?`,
            sender: "bot",
            timestamp: new Date().toString(),
          },
        ]);
      })
      .catch((error) => {
        throw new Error("Error al crear un nuevo chat.");
      });
  };

  /**
   * initChatMessages
   * Actualiza los mensajes del chat en el estado
   * @param chatMessages los mensajes que se desean añadir
   */
  const initChatMessages = (
    chatMessages: { content: string; sender: string; timestamp: string }[],
  ) => {
    console.log("initChatMessages: ", chatMessages);
    if (chatMessages.length > 0) {
      setMessages((prevMessages) => [...prevMessages, ...chatMessages]);
    }
  };

  /**
   * sendMessage
   * Envía un mensaje a la API y actualiza los mensajes
   */
  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const userMessage = {
      content: inputText,
      sender: "user",
      timestamp: new Date().toString(),
    };
    setMessages([...messages, userMessage]);
    setInputText("");

    put(`${GET_CHAT}${chatID}`, { content: inputText }, session?.token)
      .then((chatDetails) => {
        console.log("sendMessage:", chatDetails);

        // Extrae los mensajes del chat y actualiza el estado
        //const chatMessages = chatDetails?.conversation?.messages || [];
        const chatMessages = {
          content: "Aquí va la respuesta de la IA",
          sender: "ia",
          timestamp: new Date().toString(),
        };
        // Actualiza los mensajes con la nueva función
        updateChatMessages(chatMessages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * updateChatMessages
   * Actualiza los mensajes del chat en el estado
   * @param chatMessages los mensajes que se desean añadir
   */
  const updateChatMessages = (chatMessage: {
    content: string;
    sender: string;
    timestamp: string;
  }) => {
    console.log("updateChatMessages: ", chatMessage);
    setMessages((prevMessages) => [...prevMessages, chatMessage]);
  };

  return (
    <Screen>
      {/* Contenedor del chat */}
      <ScrollView className="flex-1">
        {messages.map((message, index) => (
          <View
            key={index}
            className={`w-3/4 ${
              message.sender === "user" ? "self-end" : "self-start"
            }`}
          >
            <View
              key={index}
              className={`p-3 rounded-lg my-2 w-auto max-w-fit ${
                message.sender === "user"
                  ? "bg-green-200 self-end"
                  : "bg-blue-200 self-start"
              }`}
            >
              <Text className="text-base">{message.content}</Text>
              <Text className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleString()}{" "}
                {/* Puedes ajustar el formato de la fecha aquí */}
              </Text>
            </View>
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

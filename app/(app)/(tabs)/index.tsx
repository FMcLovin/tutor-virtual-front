import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { Screen } from "../../../components/Screen";
import { useSession } from "../../ctx";
import { styled } from "nativewind";
import { get, post, put } from "../../../services";
import { GET_CHAT_BY_USER_ID, CREATE_CHAT, GET_CHAT } from "@env";
import { toast } from "react-toastify";

export default function App() {
  const { session } = useSession();
  const [messages, setMessages] = useState<
    { _id: string; content: string; sender: string; timestamp: string }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const StyledPressable = styled(Pressable);
  const [chatID, setChatID] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const [isSendingMessage, setSendingMessage] = useState(false);
  const [mustMoveScroll, setMoveScroll] = useState(true);

  useEffect(() => {
    fetchChatByUserId();
  }, []);

  useEffect(() => {
    if (mustMoveScroll) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, mustMoveScroll]);

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
        setChatID(response[0].chat_id);
        fetchChatDetails(response[0].chat_id);
      })
      .catch((error) => {
        if (error.error === "Chats not found") {
          createChat();
        }
      });
  };

  /**
   * Get Chat details
   * @param chatId chat's id
   * @returns Promise containing chat data
   */
  const fetchChatDetails = async (chatId: string, messageId?: string) => {
    const url = messageId
      ? `${GET_CHAT}${chatId}/messages/${messageId}`
      : `${GET_CHAT}${chatId}`;
    return await get(url, session?.token)
      .then((chatDetails) => {
        const chatMessages = chatDetails || [];
        if (messageId) {
          prependChatMessages(chatMessages); // Agrega los mensajes al inicio
          setMoveScroll(false);
        } else {
          initChatMessages(chatMessages); // Inicializa los mensajes
          setMoveScroll(true);
        }
      })
      .catch((error) => {
        toast.error("Ha ocurrido un error obteniendo los mensajes");
      });
  };

  /**
   * Creates new chat
   * @returns Promise containing the new chat
   */
  const createChat = async () => {
    return await post(
      CREATE_CHAT,
      { user_id: session?.user._id },
      session?.token,
    )
      .then((newChat) => {
        setChatID(newChat._id);
        const chatMessages = newChat || [];
        initChatMessages(chatMessages);
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
    chatMessages: {
      _id: string;
      content: string;
      sender: string;
      timestamp: string;
    }[],
  ) => {
    if (chatMessages.length > 0) {
      setMessages((prevMessages) => [...prevMessages, ...chatMessages]);
    } else {
      setMessages(chatMessages);
    }
  };

  /**
   * sendMessage
   * Envía un mensaje a la API y actualiza los mensajes
   */
  const sendMessage = () => {
    setSendingMessage(true);
    setInputText("");
    if (inputText.trim() === "") return;
    put(`${GET_CHAT}${chatID}`, { content: inputText }, session?.token)
      .then((chatDetails) => {
        setMoveScroll(true);
        updateChatMessages(chatDetails.message);
        updateChatMessages(chatDetails.iaResponse);
        setSendingMessage(false);
      })
      .catch((error) => {
        toast.error("Ha ocurrido un error envíando el mensaje");
        setSendingMessage(false);
      });
  };

  /**
   * updateChatMessages
   * Actualiza los mensajes del chat en el estado
   * @param chatMessages los mensajes que se desean añadir
   */
  const updateChatMessages = (chatMessage: {
    _id: string;
    content: string;
    sender: string;
    timestamp: string;
  }) => {
    setMessages((prevMessages) => [...prevMessages, chatMessage]);
  };

  /**
   * prependChatMessages
   * Añade mensajes al inicio del estado actual
   * @param newMessages nuevos mensajes a añadir
   */
  const prependChatMessages = (
    newMessages: {
      _id: string;
      content: string;
      sender: string;
      timestamp: string;
    }[],
  ) => {
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  };

  /**
   * handleScroll
   * @param param0 nativeEvent
   */
  const handleScroll = ({ nativeEvent }: any) => {
    if (nativeEvent.contentOffset.y <= 0) {
      // Obtener el ID del mensaje más antiguo
      const oldestMessageId = messages[0]?._id;
      if (oldestMessageId) {
        fetchChatDetails(chatID, oldestMessageId);
      }
    }
  };

  return (
    <View className="flex-1 px-6 bg-background">
      {/* Contenedor del chat */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
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
          <Text className="text-white text-center font-bold">Enviar</Text>
        </StyledPressable>
      </View>
    </View>
  );
}

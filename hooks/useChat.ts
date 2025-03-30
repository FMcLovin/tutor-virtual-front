import { useState, useEffect, useRef } from "react";
import { get, post, put } from "../services";
import { GET_CHAT_BY_USER_ID, CREATE_CHAT, GET_CHAT } from "@env";
import useAlert from "./useAlert";
import { Message } from "../models/Message";
import { useSession } from "../auth/ctx";
import { ScrollView } from "react-native";

const useChat = () => {
  const { session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatID, setChatID] = useState("");
  const [isSendingMessage, setSendingMessage] = useState(false);
  const [mustMoveScroll, setMoveScroll] = useState(true);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const showAlert = useAlert();

  useEffect(() => {
    fetchChatByUserId();
  }, []);

  useEffect(() => {
    if (mustMoveScroll) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, mustMoveScroll]);

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

  const fetchChatDetails = async (chatId: string, messageId?: string) => {
    const url = messageId
      ? `${GET_CHAT}${chatId}/messages/${messageId}`
      : `${GET_CHAT}${chatId}`;
    return await get(url, session?.token)
      .then((chatDetails) => {
        const chatMessages = chatDetails || [];
        if (messageId) {
          prependChatMessages(chatMessages);
          setMoveScroll(false);
        } else {
          initChatMessages(chatMessages);
          setMoveScroll(true);
        }
      })
      .catch(() => {
        showAlert("Ha ocurrido un error obteniendo los mensajes");
      });
  };

  const createChat = async () => {
    return await post(
      CREATE_CHAT,
      { user_id: session?.user._id },
      session?.token,
    )
      .then((newChat) => {
        setChatID(newChat._id);
        initChatMessages(newChat);
      })
      .catch(() => {
        throw new Error("Error al crear un nuevo chat.");
      });
  };

  const initChatMessages = (chatMessages: Message[]) => {
    if (chatMessages.length > 0) {
      setMessages((prevMessages) => [...prevMessages, ...chatMessages]);
    } else {
      setMessages(chatMessages);
    }
  };

  const sendMessage = () => {
    setSendingMessage(true);
    if (inputText.trim() === "") return;
    put(`${GET_CHAT}${chatID}`, { content: inputText }, session?.token)
      .then((chatDetails) => {
        setMoveScroll(true);
        updateChatMessages(chatDetails.message);
        updateChatMessages(chatDetails.iaResponse);
        setSendingMessage(false);
      })
      .catch(() => {
        showAlert("Ha ocurrido un error enviando el mensaje");
        setSendingMessage(false);
      });
  };

  const updateChatMessages = (chatMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, chatMessage]);
  };

  const prependChatMessages = (newMessages: Message[]) => {
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  };

  const handleScroll = ({ nativeEvent }: any) => {
    if (nativeEvent.contentOffset.y <= 0) {
      const oldestMessageId = messages[0]?._id;
      if (oldestMessageId) {
        fetchChatDetails(chatID, oldestMessageId);
      }
    }
  };

  return {
    messages,
    chatID,
    isSendingMessage,
    sendMessage,
    scrollViewRef,
    handleScroll,
    setInputText,
    inputText,
  };
};

export default useChat;

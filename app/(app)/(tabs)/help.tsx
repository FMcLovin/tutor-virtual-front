import React, { useState, useEffect } from "react";
import {
  Text,
  ActivityIndicator,
  Pressable,
  View,
  FlatList,
  TextInput,
} from "react-native";
import { styled } from "nativewind";
import { Screen } from "../../../components/Screen";
import { get, post } from "../../../services";
import { SUPPORT_ROUTE } from "@env";
import { useSession } from "../../ctx";
import { RefreshIcon } from "../../../components/icons/Icons";

import { toast } from "react-toastify";
import Modal from "react-native-modal";

export default function App() {
  const StyledPressable = styled(Pressable);
  const { session } = useSession();
  const [tickets, setTickets] = useState<
    {
      _id: string;
      user_id: string;
      issue: string;
      status: string;
      feedback: string;
      created_at: string;
      updated_at: string;
    }[]
  >([]);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingAction, setLoadingAction] = useState(false);
  const statusColors: Record<string, string> = {
    open: "text-danger",
    in_progress: "text-warning",
    closed: "text-success",
  };
  const statusBadge: Record<string, string> = {
    open: "Pendiente de revisión",
    in_progress: "En revisión",
    closed: "Cerrado",
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [issue, setIssue] = useState("");

  useEffect(() => {
    fetchUserTickets();
  }, []);

  /**
   * fetchUserTickets
   */
  const fetchUserTickets = () => {
    console.log("fetchUserTickets", "fetchUserTickets");
    setLoading(true);
    get(`${SUPPORT_ROUTE}/user/${session?.user._id}`, session?.token)
      .then((response) => {
        console.log("fetchUserTickets", response);
        setLoading(false);
        const tickets = response || [];
        if (tickets.length > 0) {
          setTickets(tickets);
        }
      })
      .catch((error) => {
        console.log("fetchUserTickets", error.error);
        toast.error("Ha ocurrido un error obteniendo tus tickets");
        setLoading(false);
      });
  };

  /**
   * getStatusColor
   * @param status ticket's string status
   * @returns color's string
   */
  const getStatusColor = (status: string): string => statusColors[status];

  /**
   * getStatusBadge
   * @param status ticket's string status
   * @returns status badge string
   */
  const getStatusBadge = (status: string): string => statusBadge[status];

  /**
   * createTicket
   */
  const createTicket = () => {
    setLoadingAction(true);
    let ticketData = {
      user_id: session?.user._id,
      issue: issue,
    };
    post(SUPPORT_ROUTE, ticketData, session?.token)
      .then((response) => {
        console.log("createTicket", response);
        setTickets([...tickets, response]);
        setLoadingAction(false);
        closeModal();
      })
      .catch((error) => {
        console.log("createTicket", error);
        toast.error("Ha ocurrido un error, vuelve a intentarlo");
        setLoadingAction(false);
        closeModal();
      });
  };

  /**
   * cancelAction
   */
  const closeModal = () => {
    setModalVisible(false);
    clearForm();
  };

  /**
   * clearForm
   */
  const clearForm = () => {
    setIssue("");
  };

  if (isLoading)
    return (
      <Screen>
        <ActivityIndicator className="flex-1" size="large" color="#020617" />
      </Screen>
    );

  return (
    <Screen>
      <Modal isVisible={isModalVisible}>
        <View className="flex justify-center items-center">
          <View className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg z-50">
            <View className="flex flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold text-gray-800">
                Crear nuevo ticket
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-600">
                Por favor, descríbe cual fue el problema que tuviste usando el
                APP:
              </Text>
            </View>

            <View className="mb-4">
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full"
                placeholder="Problema"
                value={issue}
                onChangeText={setIssue}
                keyboardType="email-address"
                autoCapitalize="none"
                maxLength={300}
              />
            </View>

            <View className="flex flex-row justify-between items-center mb-4">
              <Pressable
                onPress={closeModal}
                className="bg-danger py-2 px-4 rounded-lg hover:bg-red-900"
                disabled={isLoadingAction}
              >
                <Text className="text-center font-bold text-white">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={createTicket}
                className="bg-success py-2 px-4 rounded-lg hover:bg-green-900"
                disabled={isLoadingAction}
              >
                <Text className="text-center font-bold text-white">Enviar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={tickets}
        keyExtractor={(ticket) => ticket._id}
        renderItem={({ item, index }) => (
          <View className="flex flex-row justify-between items-center py-5">
            <View className="flex-1 min-w-0 gap-x-4">
              <Text className="text-sm font-semibold leading-6">
                {item.issue}
              </Text>
              <Text
                className={`mt-1 truncate text-xs leading-5 ${getStatusColor(item.status)}`}
              >
                {getStatusBadge(item.status)}
              </Text>

              <Text className="text-xs text-gray-500">{item.feedback}</Text>
            </View>

            <View className="flex-shrink-0 flex sm:flex-row sm:items-end pl-1">
              <Text>
                {new Date(item.created_at).toLocaleString("es-MX", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
      />

      <StyledPressable
        className="absolute bottom-6 right-6 bg-primary p-4 rounded-full shadow-lg"
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ userSelect: "none" }} className="text-white font-bold">
          Crear ticket
        </Text>
      </StyledPressable>

      <StyledPressable
        className="absolute bottom-6 left-6 bg-accent p-4 rounded-full shadow-lg"
        onPress={fetchUserTickets}
      >
        <RefreshIcon className="text-center" size={15} color={"white"} />
      </StyledPressable>
    </Screen>
  );
}

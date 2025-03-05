import React, { useState, useEffect } from "react";
import {
  Text,
  ActivityIndicator,
  Pressable,
  View,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { get, put } from "../../../services";
import { SUPPORT_ROUTE } from "@env";
import { useSession } from "../../../auth/ctx";
import { toast } from "react-toastify";
import Modal from "react-native-modal";

import { styled } from "nativewind";
import { Picker } from "@react-native-picker/picker";
import { RefreshIcon } from "../../../components/icons/Icons";
import BadgeComponent from "../../../components/ui/Badge";
import { Screen } from "../../../components/Screen";

export default function Support() {
  const { session } = useSession();
  const router = useRouter();
  type Color = "green" | "red" | "yellow";
  const green: Color = "green";
  const red: Color = "red";
  const yellow: Color = "yellow";
  const statusColors: Record<string, Color> = {
    open: green,
    in_progress: yellow,
    closed: red,
  };
  const statusBadge: Record<string, string> = {
    open: "Abierto",
    in_progress: "En progreso",
    closed: "Cerrado",
  };
  const StyledPressable = styled(Pressable);
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
  const [selectedTicket, setSelectedTicket] = useState(-1);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isLoadingAction, setLoadingAction] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("open");

  useEffect(() => {
    checkUserRole();
  }, []);

  /**
   * checkUserRole
   */
  const checkUserRole = () => {
    console.log(session?.user.role_id);
    if (session?.user.role_id === "admin_role") {
      fetchTickets();
    } else {
      router.push(`/`);
    }
  };

  /**
   * fetchTickets
   */
  const fetchTickets = () => {
    console.log("fetchTickets", "fetchTickets");
    setLoading(true);
    get(SUPPORT_ROUTE, session?.token)
      .then((response) => {
        console.log("fetchTickets", response);
        setLoading(false);
        const tickets = response || [];
        if (tickets.length > 0) {
          setTickets(tickets);
        }
      })
      .catch((error) => {
        console.log("fetchTickets", error.error);
        toast.error("Ha ocurrido un error obteniendo tickets");
        setLoading(false);
      });
  };

  /**
   * changeStatus
   */
  const changeStatus = () => {
    const ticketID = tickets[selectedTicket]._id;
    let ticketData = {
      status: status,
      feedback: feedback,
    };
    setLoadingAction(true);
    put(`${SUPPORT_ROUTE}/${ticketID}`, ticketData, session?.token)
      .then(() => {
        setLoadingAction(false);
        tickets[selectedTicket].status = status;
        tickets[selectedTicket].feedback = feedback;
        toast.success("Ticket actualizado");
        closeModal();
      })
      .catch((error) => {
        console.log("changeStatus", error);
        setLoadingAction(false);
        toast.error("Ha ocurrido un error, vuelve a intentarlo");
        closeModal();
      });
  };

  /**
   * openModal
   */
  const openModal = (item: any, index: number) => {
    console.log("openModal", item, index);
    setSelectedTicket(index);
    setStatus(item.status);
    setFeedback(item.feedback);
    setModalVisible(true);
  };

  /**
   * cancelAction
   */
  const closeModal = () => {
    setFeedback("");
    setModalVisible(false);
  };

  /**
   * getStatusColor
   * @param status ticket's string status
   * @returns color's string
   */
  const getStatusColor = (status: string): Color => statusColors[status];

  /**
   * getStatusBadge
   * @param status ticket's string status
   * @returns status badge string
   */
  const getStatusBadge = (status: string): string => statusBadge[status];

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
                Atender ticket
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-md text-black">Problema:</Text>
              <Text className="text-sm text-gray-600">
                {selectedTicket > -1 && tickets[selectedTicket].issue}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-md text-black">Retroalimentación:</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mt-2"
                placeholder="Sigue los siguientes pasos para..."
                multiline
                numberOfLines={4}
                maxLength={300}
                value={feedback}
                onChangeText={setFeedback}
              />
            </View>

            <View className="mb-4">
              <Text className="text-md text-black">Estado:</Text>
              <Picker
                selectedValue={status}
                style={styles.picker}
                onValueChange={(itemValue) => setStatus(itemValue)}
              >
                <Picker.Item label="Abierto" value="open" />
                <Picker.Item label="En progreso" value="in_progress" />
                <Picker.Item label="Cerrado" value="closed" />
              </Picker>
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
                onPress={changeStatus}
                className="bg-success py-2 px-4 rounded-lg hover:bg-green-900"
                disabled={isLoadingAction}
              >
                <Text className="text-center font-bold text-white">Enviar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Text className="text-left text-md text-black">
        Selecciona un ticket generado para poder atenderlo.
      </Text>
      <FlatList
        data={tickets}
        keyExtractor={(ticket) => ticket._id}
        renderItem={({ item, index }) => (
          <StyledPressable
            onPress={() => {
              openModal(item, index);
            }}
            className="active:opacity-70 active:border-white/50"
          >
            <View className="flex flex-row justify-between items-center py-5">
              <View className="flex-1 items-start">
                <Text className="text-sm font-semibold leading-6">
                  {item.issue.slice(0, 50)}...
                </Text>
                <BadgeComponent
                  label={getStatusBadge(item.status)}
                  color={getStatusColor(item.status)}
                />
              </View>

              <View className="flex-1 items-end">
                <Text className="text-xs">
                  {new Date(item.created_at).toLocaleString("es-MX", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
              </View>
            </View>
          </StyledPressable>
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
      />

      <StyledPressable
        className="absolute bottom-6 left-6 bg-accent p-4 rounded-full shadow-lg"
        onPress={fetchTickets}
      >
        <RefreshIcon className="text-center" size={15} color={"white"} />
      </StyledPressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  picker: {
    minWidth: "100%",
    color: "#333",
    flex: 1,
    padding: 0,
    margin: 0,
    borderColor: "white",
  },
});

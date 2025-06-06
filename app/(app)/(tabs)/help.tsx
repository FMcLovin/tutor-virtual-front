import React from "react";
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
import { RefreshIcon } from "../../../components/icons/Icons";
import Modal from "react-native-modal";
import useTickets from "../../../hooks/useTickets";

export default function Help() {
  const StyledPressable = styled(Pressable);
  const {
    tickets,
    isLoading,
    isLoadingAction,
    isModalVisible,
    issue,
    setIssue,
    fetchUserTickets,
    createTicket,
    closeModal,
    setModalVisible,
  } = useTickets();

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

  const getStatusColor = (status: string) =>
    statusColors[status] || "text-gray-500";
  const getStatusBadge = (status: string) =>
    statusBadge[status] || "Desconocido";

  if (isLoading)
    return (
      <Screen>
        <ActivityIndicator className="flex-1" size="large" color="#020617" />
      </Screen>
    );

  return (
    <Screen>
      {/* Modal para crear reporte */}
      <Modal isVisible={isModalVisible}>
        <View className="flex justify-center items-center">
          <View className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg z-50">
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              Crear nuevo reporte
            </Text>

            <Text className="text-sm text-gray-600 mb-4">
              Por favor, descríbe cuál fue el problema que tuviste usando la
              app:
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full"
              placeholder="Problema"
              value={issue}
              onChangeText={setIssue}
              keyboardType="default"
              autoCapitalize="sentences"
              maxLength={300}
            />

            <View className="flex flex-row justify-between items-center">
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

      {/* Lista de reportes */}
      <FlatList
        data={tickets}
        keyExtractor={(ticket) => ticket._id}
        renderItem={({ item }) => (
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
            <Text className="text-xs text-gray-500">
              {new Date(item.created_at).toLocaleString("es-MX", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
      />

      {/* Botón para reportar un fallo */}
      <StyledPressable
        className="absolute bottom-6 right-6 bg-primary p-4 rounded-full shadow-lg"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-bold">Reportar fallo</Text>
      </StyledPressable>

      {/* Botón para refrescar lista de reportes */}
      <StyledPressable
        testID="refresh-button"
        className="absolute bottom-6 left-6 bg-accent p-4 rounded-full shadow-lg"
        onPress={fetchUserTickets}
      >
        <RefreshIcon className="text-center" size={15} color={"white"} />
      </StyledPressable>
    </Screen>
  );
}

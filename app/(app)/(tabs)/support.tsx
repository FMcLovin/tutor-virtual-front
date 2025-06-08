import React from "react";
import {
  Text,
  ActivityIndicator,
  Pressable,
  View,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { styled } from "nativewind";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import BadgeComponent from "../../../components/ui/Badge";
import { Screen } from "../../../components/Screen";
import { RefreshIcon } from "../../../components/icons/Icons";
import { useSupport } from "../../../hooks/useSupport";

export default function Support() {
  const {
    tickets,
    isLoading,
    isLoadingAction,
    selectedTicket,
    feedback,
    status,
    setFeedback,
    setStatus,
    fetchTickets,
    changeStatus,
    openModal,
    closeModal,
  } = useSupport();

  const StyledPressable = styled(Pressable);

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator
          testID="refresh-button"
          className="flex-1"
          size="large"
          color="#020617"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Modal isVisible={selectedTicket !== null}>
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
                {selectedTicket !== null && tickets[selectedTicket].issue}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-md text-black">Retroalimentación:</Text>
              <TextInput
                testID="feedback-input"
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
                testID="picker-status"
                selectedValue={status}
                style={styles.picker}
                onValueChange={setStatus}
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
                testID="send-button"
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
            onPress={() => openModal(index)}
            className="active:opacity-70 active:border-white/50"
            testID={`ticket-press-${index}`}
          >
            <View className="flex flex-row justify-between items-center py-5">
              <View className="flex-1 items-start">
                <Text className="text-sm font-semibold leading-6">
                  {item.issue.slice(0, 50)}...
                </Text>
                <BadgeComponent
                  label={item.status}
                  color={item.status === "open" ? "green" : "red"}
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
        testID="refresh-button"
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

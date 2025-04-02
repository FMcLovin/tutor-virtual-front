import React from "react";
import { styled } from "nativewind";
import {
  Text,
  ActivityIndicator,
  Pressable,
  View,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";

import MainContainer from "../../../components/ui/Containers/MainContainer";
import { Eye, TrashIcon, Pen } from "../../../components/icons/Icons";
import ModalBody from "../../../components/ui/ModalBody";

import useManager from "../../../hooks/useManager";

export default function Manager() {
  const {
    content,
    pendingDelete,
    isLoading,
    deleteModal,
    setDeleteModal,
    createContent,
    editContent,
    openDeleteModal,
    deleteContent,
    openContent,
  } = useManager();

  const StyledPressable = styled(Pressable);

  if (isLoading) {
    return (
      <MainContainer>
        <ActivityIndicator className="flex-1" size="large" color="#020617" />
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Modal isVisible={deleteModal}>
        <ModalBody
          title="Alerta"
          body={`¿De verdad quieres eliminar el contenido: "${content[pendingDelete?.index]?.question}"?`}
          successText="Cancelar"
          cancelText="Eliminar"
          successAction={() => setDeleteModal(false)}
          cancelAction={() =>
            deleteContent(pendingDelete?.contendID, pendingDelete?.index)
          }
        />
      </Modal>

      <FlatList
        data={content}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View className="flex flex-col sm:flex-row justify-between sm:items-center p-5 w-full">
            <View className="w-full sm:w-3/4 flex flex-col">
              <Text className="text-sm font-semibold leading-6 text-gray-900">
                {item.question}
              </Text>
              <Text className="mt-1 truncate text-xs leading-5 text-gray-500">
                {item.answer.slice(0, 100)}...
              </Text>
            </View>

            <View className="flex flex-row sm:flex-row w-auto gap-2 mt-3 sm:mt-0">
              <StyledPressable
                onPress={() => openDeleteModal(item, index)}
                className="p-3 mr-1 mb-1 rounded-lg bg-danger active:opacity-70"
              >
                <TrashIcon className="text-center" size={15} color={"white"} />
              </StyledPressable>

              <StyledPressable
                onPress={() => editContent(item._id)}
                className="p-3 mr-1 mb-1 rounded-lg bg-warning active:opacity-70"
              >
                <Pen className="text-center" size={15} color={"white"} />
              </StyledPressable>

              <StyledPressable
                onPress={() => openContent(item._id)}
                className="p-3 mb-1 rounded-lg bg-primary active:opacity-70"
              >
                <Eye className="text-center" size={15} color={"white"} />
              </StyledPressable>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
      />

      <Pressable
        className="absolute bottom-6 right-6 bg-primary p-4 rounded-full shadow-lg"
        onPress={createContent}
      >
        <Text style={{ userSelect: "none" }} className="text-white font-bold">
          Crear contenido
        </Text>
      </Pressable>
    </MainContainer>
  );
}

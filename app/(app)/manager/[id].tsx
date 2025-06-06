import React, { useState } from "react";
import { useSession } from "../../../auth/ctx";
import { styled } from "nativewind";
import {
  Text,
  Pressable,
  ActivityIndicator,
  View,
  ScrollView,
  TextInput,
} from "react-native";
import { Screen } from "../../../components/Screen";
import { useLocalSearchParams } from "expo-router";
import { CancelIcon, Pen, CheckIcon } from "../../../components/icons/Icons";
import { useContent } from "../../../hooks/useContent";

export default function App() {
  const { session } = useSession();
  const { id, isEditing } = useLocalSearchParams<{
    id: string;
    isEditing: string;
  }>();

  const [editing, setEditing] = useState(isEditing === "true");
  const StyledPressable = styled(Pressable);

  const {
    content,
    authorName,
    editorName,
    isLoading,
    editingContent,
    setEditingContent,
    updateContent,
  } = useContent(id, session?.token);

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator className="flex-1" size="large" color="#020617" />
      </Screen>
    );
  }

  if (content != null && editingContent != null) {
    return (
      <View className="flex-1 p-6 bg-background">
        <ScrollView className="flex-1 bg-background h-full">
          <View className="w-full flex flex-row px-4 sm:px-0">
            <View className="w-3/4">
              <Text className="text-base font-semibold leading-7 text-gray-900">
                {editing ? "Editar contenido" : "Información del contenido"}
              </Text>
              <Text className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                {editing
                  ? "Modifica los campos para actualizar la respuesta del chat"
                  : "Puedes modificar para controlar la respuesta del chat"}
              </Text>
            </View>
            <View className="w-3/12 ml-auto flex flex-row">
              {editing ? (
                <>
                  <StyledPressable
                    onPress={updateContent}
                    className="w-10 h-10 p-2 flex items-center justify-center mr-1 rounded-lg bg-success active:opacity-70"
                  >
                    <CheckIcon
                      className="text-center"
                      size={20}
                      color={"white"}
                    />
                  </StyledPressable>

                  <StyledPressable
                    onPress={() => setEditing(false)}
                    className="w-10 h-10 p-2 flex items-center justify-center mr-1 rounded-lg bg-red-500 active:opacity-70"
                  >
                    <CancelIcon
                      className="text-center"
                      size={20}
                      color={"white"}
                    />
                  </StyledPressable>
                </>
              ) : (
                <StyledPressable
                  onPress={() => setEditing(true)}
                  className="w-10 h-10 p-2 flex items-center justify-center mr-1 rounded-lg bg-warning active:opacity-70"
                >
                  <Pen className="text-center" size={20} color={"white"} />
                </StyledPressable>
              )}
            </View>
          </View>

          <View className="mt-6 border-t border-gray-100">
            <View className="divide-y divide-gray-100">
              <View className="px-4 py-6">
                <Text className="text-sm font-medium leading-6 text-gray-900">
                  Pregunta
                </Text>
                {editing ? (
                  <TextInput
                    className="mt-1 border border-gray-200 rounded-lg px-2 py-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                    value={editingContent.question}
                    onChangeText={(text) =>
                      setEditingContent({ ...editingContent, question: text })
                    }
                  />
                ) : (
                  <Text className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {content.question}
                  </Text>
                )}
              </View>

              {/* Respuesta */}
              <View className="px-4 py-6">
                <Text className="text-sm font-medium leading-6 text-gray-900">
                  Respuesta
                </Text>
                {editing ? (
                  <TextInput
                    className="mt-1 border border-gray-200 rounded-lg px-2 py-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                    value={editingContent.answer}
                    onChangeText={(text) =>
                      setEditingContent({ ...editingContent, answer: text })
                    }
                  />
                ) : (
                  <Text className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {content.answer}
                  </Text>
                )}
              </View>

              <View className="px-4 py-6">
                <Text className="text-sm font-medium leading-6 text-gray-900">
                  Autor
                </Text>
                <Text className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {authorName}
                </Text>
              </View>

              <View className="px-4 py-6">
                <Text className="text-sm font-medium leading-6 text-gray-900">
                  Actualizado por:
                </Text>
                <Text className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {editorName}
                </Text>
              </View>

              <View className="px-4 py-6">
                <Text className="text-sm font-medium leading-6 text-gray-900">
                  Fecha de creación
                </Text>
                <Text className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {new Date(content.created_at).toLocaleString()}
                </Text>
              </View>

              <View className="px-4 py-6">
                <Text className="text-sm font-medium leading-6 text-gray-900">
                  Última actualización
                </Text>
                <Text className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {new Date(content.updated_at).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}

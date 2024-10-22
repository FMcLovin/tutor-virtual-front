import React, { useState, useEffect } from "react";
import { useSession } from "../../ctx";
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
import { get, put } from "../../../services";
import { GET_CONTENT, GET_USER } from "@env";
import { useLocalSearchParams } from "expo-router";
import { CancelIcon, Pen, CheckIcon } from "../../../components/icons/Icons";

export default function App() {
  const { session } = useSession();
  const { id, isEditing } = useLocalSearchParams();
  const [content, setContent] = useState<{
    _id: string;
    question: string;
    answer: string;
    created_by: string;
    category: string;
    created_at: string;
    updated_at: string;
  }>();
  const [isLoading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState(content);
  const [authorName, setAuthorName] = useState<string>("");
  const [editorName, setEditorName] = useState<string>("");

  const StyledPressable = styled(Pressable);
  const [editing, setEditing] = useState(isEditing === "true");

  useEffect(() => {
    fetchContent();
  }, []);

  /**
   * fetchContent
   * Obtiene la inforación del contenido
   */
  const fetchContent = async () => {
    try {
      setLoading(true);
      const contentResponse = await get(`${GET_CONTENT}${id}`, session?.token);

      setContent(contentResponse);
      setEditingContent(contentResponse);

      setAuthorName(await fetchUserData(contentResponse.created_by));
      setEditorName(await fetchUserData(contentResponse.created_by));

      setLoading(false);
    } catch (error) {
      console.log("fetchContent", error);
      setLoading(false);
    }
  };

  /**
   * fetchUserData
   * Obtiene los datos del usuario, según su ID
   * @param userID Id del usuario
   * @returns email del usuario
   */
  const fetchUserData = async (userID: string) => {
    try {
      const userResponse = await get(`${GET_USER}${userID}`, session?.token);
      return userResponse.email;
    } catch (error) {
      console.log("fetchUserData", error);
      return "No se encontró al usuario";
    }
  };

  /**
   * updateContent
   * Actualiza el contenido
   */
  const updateContent = () => {
    put(`${GET_CONTENT}${id}`, editingContent, session?.token)
      .then((contentDetails) => {
        console.log("updateContent:", contentDetails);
        setContent(contentDetails);
        setEditingContent(contentDetails);
        setEditing(false);
        alert("Contenido editado");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (isLoading)
    return (
      <Screen>
        <ActivityIndicator className="flex-1" size="large" color="#020617" />
      </Screen>
    );

  if (content != null && editingContent != null)
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
              {/* Botones solo visibles en modo edición */}
              {editing ? (
                <>
                  <StyledPressable
                    onPress={() => {
                      updateContent();
                    }}
                    className="w-10 h-10 p-2 flex items-center justify-center mr-1 rounded-lg bg-success active:opacity-70"
                  >
                    <CheckIcon
                      className="text-center"
                      size={20}
                      color={"white"}
                    />
                  </StyledPressable>

                  <StyledPressable
                    onPress={() => {
                      setEditing(false);
                    }}
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
                  onPress={() => {
                    setEditing(true);
                  }}
                  className="w-10 h-10 p-2 flex items-center justify-center mr-1 rounded-lg bg-warning active:opacity-70"
                >
                  <Pen className="text-center" size={20} color={"white"} />
                </StyledPressable>
              )}
            </View>
          </View>

          <View className="mt-6 border-t border-gray-100">
            <View className="divide-y divide-gray-100">
              {/* Título - Pregunta destacada */}
              <View className="px-4 py-6">
                <Text className="text-sm font-medium leading-6 text-gray-900">
                  Pregunta
                </Text>
                {editing ? (
                  <TextInput
                    className="mt-1 border border-gray-200 rounded-lg px-2 py-1 text-sm leading-6 text-gray-700  sm:col-span-2 sm:mt-0"
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
                    className="mt-1 border border-gray-200 rounded-lg px-2 py-1 text-sm leading-6 text-gray-700  sm:col-span-2 sm:mt-0"
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

              {/* Información adicional */}
              <View className="px-4 py-6">
                <Text className="text-sm font-medium leading-6 text-gray-900">
                  Categoría
                </Text>
                <Text className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {content.category}
                </Text>
              </View>

              {/* Creado por */}
              <View className="px-4 py-6">
                <Text className="text-sm font-medium leading-6 text-gray-900">
                  Autor
                </Text>
                <Text className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {authorName}
                </Text>
              </View>

              {/* Creado por */}
              <View className="px-4 py-6">
                <Text className="text-sm font-medium leading-6 text-gray-900">
                  Actualizado por:
                </Text>
                <Text className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {editorName}
                </Text>
              </View>

              {/* Fechas */}
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

import React from "react";
import { styled } from "nativewind";
import {
  Text,
  Pressable,
  ActivityIndicator,
  View,
  ScrollView,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Screen } from "../../../components/Screen";
import { useCreateContent } from "../../../hooks/useCreateContent";

export default function App() {
  const {
    question,
    setQuestion,
    questionError,
    asnwer,
    setAnswer,
    asnwerError,
    isLoading,
    validateData,
    cancelAction,
  } = useCreateContent();
  const StyledPressable = styled(Pressable);

  if (isLoading)
    return (
      <Screen>
        <ActivityIndicator
          testID="ActivityIndicator"
          className="flex-1"
          size="large"
          color="#020617"
        />
      </Screen>
    );

  return (
    <View className="flex-1 p-6 bg-background">
      <ScrollView className="flex-1 bg-background h-full">
        <View className="w-full flex flex-row px-4 sm:px-0">
          <View className="w-3/4">
            <Text className="text-base font-semibold leading-7 text-gray-900">
              Creación de contenido
            </Text>
            <Text className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Ingresa los campos necesarios para crear nuevo contenido.
            </Text>
          </View>
          <View className="w-3/12 ml-auto flex flex-row">
            {/* Botones solo visibles en modo edición */}
            <StyledPressable
              testID="validate-button"
              onPress={() => {
                validateData();
              }}
              className="w-10 h-10 p-2 flex items-center justify-center mr-1 rounded-lg bg-success active:opacity-70"
            >
              <MaterialCommunityIcons
                className="text-center"
                name="check"
                size={25}
                color={"white"}
              />
            </StyledPressable>

            <StyledPressable
              testID="cancel-button"
              onPress={() => {
                cancelAction();
              }}
              className="w-10 h-10 p-2 flex items-center justify-center mr-1 rounded-lg bg-red-500 active:opacity-70"
            >
              <MaterialCommunityIcons
                className="text-center"
                name="close"
                size={25}
                color={"white"}
              />
            </StyledPressable>
          </View>
        </View>

        <View className="mt-6 border-t border-gray-100">
          <View className="divide-y divide-gray-100">
            {/* Título - Pregunta destacada */}
            <View className="px-4 py-6">
              <Text className="text-sm font-medium leading-6 text-gray-900">
                Pregunta
              </Text>
              <TextInput
                testID="question-input"
                className="mt-1 border border-gray-200 rounded-lg px-2 py-1 text-sm leading-6 text-gray-700  sm:col-span-2 sm:mt-0"
                value={question}
                onChangeText={setQuestion}
              />
              {questionError ? (
                <Text className="text-red-500 mb-1">{questionError}</Text>
              ) : null}
            </View>

            {/* Respuesta */}
            <View className="px-4 py-6">
              <Text className="text-sm font-medium leading-6 text-gray-900">
                Respuesta
              </Text>
              <TextInput
                testID="answer-input"
                className="mt-1 border border-gray-200 rounded-lg px-2 py-1 text-sm leading-6 text-gray-700  sm:col-span-2 sm:mt-0"
                value={asnwer}
                onChangeText={setAnswer}
              />
              {asnwerError ? (
                <Text className="text-red-500 mb-1">{asnwerError}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

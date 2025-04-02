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
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { post } from "../../../services";
import { GET_CONTENT } from "@env";
import { CancelIcon, CheckIcon } from "../../../components/icons/Icons";
import { Screen } from "../../../components/Screen";

export default function App() {
  const { session } = useSession();
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");

  const [asnwer, setAnswer] = useState("");
  const [asnwerError, setAnswerError] = useState("");

  const [category, setCategory] = useState("tutoria");
  const [categoryError, setCategoryError] = useState("");

  const [isLoading, setLoading] = useState(false);

  const StyledPressable = styled(Pressable);

  /**
   * cancelAction
   * Cancela la creación del contenido
   */
  const cancelAction = () => {
    router.push("manager/");
  };

  /**
   * validateData
   * @returns error
   */
  const validateData = () => {
    if (!question) {
      setQuestionError("Por favor, ingresa una respuesta");
      return;
    }
    if (!asnwer) {
      setAnswerError("Por favor, ingresa una pregunta");
      return;
    }
    if (!category) {
      setCategoryError("Por favor, selecciona una categoría");
      return;
    }
    createContent();
  };

  /**
   * createContent
   * Crea nuevo contenido
   */
  const createContent = () => {
    setLoading(true);
    let data = {
      created_by: session?.user._id,
      updated_by: session?.user._id,
      question: question,
      answer: asnwer,
      category: category,
    };
    post(GET_CONTENT, data, session?.token)
      .then((response) => {
        console.log("createContent", response);
        setLoading(false);
        alert("Contenido creado");
        cancelAction();
      })
      .catch((error) => {
        console.log("createContent", error.error);
        setLoading(false);
        alert("Ha ocurrido un error, vuelve a intentarlo más tarde");
      });
  };

  if (isLoading)
    return (
      <Screen>
        <ActivityIndicator className="flex-1" size="large" color="#020617" />
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
              onPress={() => {
                validateData();
              }}
              className="w-10 h-10 p-2 flex items-center justify-center mr-1 rounded-lg bg-success active:opacity-70"
            >
              <CheckIcon className="text-center" size={20} color={"white"} />
            </StyledPressable>

            <StyledPressable
              onPress={() => {
                cancelAction();
              }}
              className="w-10 h-10 p-2 flex items-center justify-center mr-1 rounded-lg bg-red-500 active:opacity-70"
            >
              <CancelIcon className="text-center" size={20} color={"white"} />
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
                className="mt-1 border border-gray-200 rounded-lg px-2 py-1 text-sm leading-6 text-gray-700  sm:col-span-2 sm:mt-0"
                value={asnwer}
                onChangeText={setAnswer}
              />
              {asnwerError ? (
                <Text className="text-red-500 mb-1">{asnwerError}</Text>
              ) : null}
            </View>

            {/* Información adicional */}
            <View className="px-4 py-6">
              <Text className="text-sm font-medium leading-6 text-gray-900">
                Categoría
              </Text>
              <View className="mt-1 w-1/3 border border-gray-200 rounded-lg px-2 py-1 text-sm leading-6 text-gray-700  sm:col-span-2 sm:mt-0">
                <Picker
                  selectedValue={category}
                  style={styles.picker}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                >
                  <Picker.Item label="Tutoria" value="tutoria" />
                  <Picker.Item label="Inscripción" value="inscripcion" />
                  <Picker.Item label="Movilidad" value="movilidad" />
                  <Picker.Item label="Traslado" value="traslado" />
                </Picker>
              </View>
              {categoryError ? (
                <Text className="text-red-500 mb-1">{categoryError}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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

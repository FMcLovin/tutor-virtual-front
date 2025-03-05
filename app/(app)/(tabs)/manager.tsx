import React, { useState, useEffect } from "react";
import { useSession } from "../../../auth/ctx";
import { styled } from "nativewind";
import {
  Text,
  ActivityIndicator,
  Pressable,
  View,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { get, del, post } from "../../../services";
import { GET_CONTENT, TEST_CONTENT } from "@env";

import { Screen } from "../../../components/Screen";
import { Eye, TrashIcon, Pen, PlayIcon } from "../../../components/icons/Icons";
import ModalBody from "../../../components/ui/ModalBody";

import Modal from "react-native-modal";
import useAlert from "../../../hooks/useAlert";

export default function Manager() {
  const { session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<
    {
      _id: string;
      question: string;
      answer: string;
      created_by: string;
      category: string;
      created_at: string;
      updated_at: string;
    }[]
  >([]);
  const [testedContent, setTestedContent] = useState<{
    _id: string;
    question: string;
    answer: string;
    created_by: string;
    category: string;
    created_at: string;
    updated_at: string;
  }>();
  const [pendingDelete, setPendingDelete] = useState<{
    contendID: string;
    index: number;
  }>({
    contendID: "",
    index: 0,
  });
  const [isLoading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [serverAnswer, setServerAnswer] = useState("");
  const showAlert = useAlert();

  const StyledPressable = styled(Pressable);

  useEffect(() => {
    checkUserRole();
  }, []);

  /**
   * checkUserRole
   */
  const checkUserRole = () => {
    console.log(session?.user.role_id);
    if (session?.user.role_id === "admin_role") {
      fetchContent();
    } else {
      router.push(`/`);
    }
  };

  /**
   * fetchContent
   * Obtiene el contenido creado
   */
  const fetchContent = () => {
    setLoading(true);
    get(GET_CONTENT, session?.token)
      .then((response) => {
        console.log("fetchContent", response);
        setLoading(false);
        const content = response || [];
        if (content.length > 0) {
          setContent((prevContent) => [...prevContent, ...content]);
        }
      })
      .catch((error) => {
        console.log("fetchContent", error.error);
        showAlert("Ha ocurrido un error obteniendo el contenido");
        setLoading(false);
      });
  };

  /**
   * createContent
   * redirecciona a la pantalla de creación de contenido
   */
  const createContent = () => {
    console.log("createContent", "Create content pressed!");
    router.push("manager/create");
  };

  /**
   * editContent
   * @param contentID content string ID
   */
  const editContent = (contentID: string) => {
    console.log("editContent", "Edit content pressed!", contentID);
    router.push(`manager/${contentID}?isEditing=true`);
  };

  /**
   * toggleDeleteModal
   * @param contentID content string ID
   * @param index index
   */
  const openDeleteModal = (content: any, index: number) => {
    setPendingDelete({
      contendID: content._id,
      index: index,
    });
    setDeleteModal(true);
  };

  /**
   * deleteContent
   * @param contentID content string ID
   * @param index index
   */
  const deleteContent = (contentID: string, index: number) => {
    console.log("deleteContent", "Delete content pressed!", contentID, index);
    del(`${GET_CONTENT}${contentID}`, session?.token)
      .then(() => {
        showAlert("Se ha eliminado el contenido");
        setContent((prevContent) => prevContent.filter((_, i) => i !== index));
      })
      .catch((error) => {
        console.log(error);
        showAlert("Ha ocurrido un error eliminando el contenido");
      });
    setDeleteModal(false);
  };

  /**
   * openContent
   * @param contentID content string ID
   */
  const openContent = (contentID: string) => {
    console.log("openContent", "Open content pressed!", contentID);
    router.push(`manager/${contentID}`);
  };

  /**
   * testContent
   * @param contentID content string ID
   * @param index content index
   */
  const testContent = (contentID: string, index: number) => {
    setLoadingAction(true);
    setTestedContent(content[index]);
    console.log("testContent", "Test content pressed!", testedContent);
    let testContent = {
      question: content[index].question,
      answer: content[index].answer,
    };
    console.log("testContent", testContent);

    post(TEST_CONTENT, testContent, session?.token)
      .then((response) => {
        console.log("testContent", response);
        setServerAnswer(response.message);
        setLoadingAction(false);
        toggleModal();
      })
      .catch((error) => {
        console.log("testContent", error.error);
        setLoadingAction(false);
        showAlert("Ha ocurrido un error, vuelve a intentarlo");
      });
  };

  /**
   * toggleModal
   */
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  /**
   * wrongAnswer
   */
  const wrongAnswer = () => {
    if (testedContent != null) {
      toggleModal();
      editContent(testedContent?._id);
    } else {
      showAlert("Ha ocurrido un error, vuelve a intentarlo");
    }
  };

  /**
   * correctAnswer
   */
  const correctAnswer = () => {
    toggleModal();
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
        <ModalBody
          title="Respuesta de la IA"
          body={`La pregunta fue: ${testedContent?.answer}, y la respuesta es: ${serverAnswer}`}
          successText="Correcto"
          cancelText="Corregir"
          successAction={correctAnswer}
          cancelAction={wrongAnswer}
        />
      </Modal>

      <Modal isVisible={deleteModal}>
        <ModalBody
          title="Alerta"
          body={`¿De verdad quieres eliminar el contenido: "${content[pendingDelete?.index].question}"?`}
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
          <View
            className={`flex flex-row justify-between items-center py-5 ${
              loadingAction ? "opacity-50" : "opacity-100"
            }`}
          >
            <View className="flex-1 min-w-0 gap-x-4">
              <Text
                className={`text-sm font-semibold leading-6 ${
                  loadingAction ? "text-gray-400" : "text-gray-900"
                }`}
              >
                {item.question}
              </Text>
              <Text
                className={`mt-1 truncate text-xs leading-5 ${
                  loadingAction ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {item.answer.slice(0, 100)}...
              </Text>
            </View>

            <View className="flex-shrink-0 flex sm:flex-row sm:items-end pl-1">
              <StyledPressable
                onPress={() => {
                  openDeleteModal(item, index);
                }}
                disabled={loadingAction}
                className="p-3 mr-1 mb-1 rounded-lg bg-danger active:opacity-70"
              >
                <TrashIcon className="text-center" size={15} color={"white"} />
              </StyledPressable>

              <StyledPressable
                onPress={() => {
                  editContent(item._id);
                }}
                disabled={loadingAction}
                className="p-3 mr-1 mb-1 rounded-lg bg-warning active:opacity-70"
              >
                <Pen className="text-center" size={15} color={"white"} />
              </StyledPressable>

              <StyledPressable
                onPress={() => {
                  testContent(item._id, index);
                }}
                disabled={loadingAction}
                className="p-3 mr-1 mb-1 rounded-lg bg-info active:opacity-70"
              >
                <PlayIcon className="text-center" size={15} color={"white"} />
              </StyledPressable>

              <StyledPressable
                onPress={() => {
                  openContent(item._id);
                }}
                disabled={loadingAction}
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
    </Screen>
  );
}

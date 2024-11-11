import React, { useState, useEffect } from "react";
import { useSession } from "../../ctx";
import { styled } from "nativewind";
import {
  Text,
  ActivityIndicator,
  Pressable,
  View,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../../components/Screen";
import { get, del, post } from "../../../services";
import { GET_CONTENT, TEST_CONTENT } from "@env";

import { Eye, TrashIcon, Pen, PlayIcon } from "../../../components/icons/Icons";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
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
  const [isLoading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const StyledPressable = styled(Pressable);

  useEffect(() => {
    fetchContent();
  }, []);

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
   * deleteContent
   * @param contentID content string ID
   */
  const deleteContent = (contentID: string, index: number) => {
    console.log("deleteContent", "Delete content pressed!", contentID, index);
    del(`${GET_CONTENT}${contentID}`, session?.token)
      .then((chatDetails) => {
        console.log("sendMessage:", chatDetails);
        setContent((prevContent) => prevContent.filter((_, i) => i !== index));
      })
      .catch((error) => {
        console.log(error);
        alert("Ha ocurrido un error eliminando el contenido");
      });
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
    console.log("testContent", "Test content pressed!", contentID, index);
    let testContent = {
      question: content[index].question,
      answer: content[index].answer,
    };
    console.log("testContent", testContent);

    post(TEST_CONTENT, testContent, session?.token)
      .then((response) => {
        console.log("testContent", response);
        setLoadingAction(false);
        toast.success("This is a success message!");
      })
      .catch((error) => {
        console.log("testContent", error.error);
        setLoadingAction(false);
        toast.error("Ha ocurrido un error, vuelve a intentarlo");
      });
  };

  if (isLoading)
    return (
      <Screen>
        <ActivityIndicator className="flex-1" size="large" color="#020617" />
      </Screen>
    );

  return (
    <Screen>
      <ToastContainer position="bottom-center" style={{ bottom: "80px" }} />
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
                  deleteContent(item._id, index);
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

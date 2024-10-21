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
import { get } from "../../../services";
import { GET_CONTENT } from "@env";

import { Eye, TrashIcon, Pen } from "../../../components/icons/Icons";

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

  const StyledPressable = styled(Pressable);

  useEffect(() => {
    fetchContent();
  }, []);

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
  const deleteContent = (contentID: string) => {
    console.log("deleteContent", "Delete content pressed!", contentID);
  };

  /**
   * openContent
   * @param contentID content string ID
   */
  const openContent = (contentID: string) => {
    console.log("openContent", "Open content pressed!", contentID);
    router.push(`manager/${contentID}`);
  };

  if (isLoading)
    return (
      <Screen>
        <ActivityIndicator className="flex-1" size="large" color="#020617" />
      </Screen>
    );

  return (
    <Screen>
      <FlatList
        data={content}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="flex flex-row justify-between items-center py-5">
            <View className="flex-1 min-w-0 gap-x-4">
              <Text className="text-sm font-semibold leading-6 text-gray-900">
                {item.question}
              </Text>
              <Text className="mt-1 truncate text-xs leading-5 text-gray-500">
                {item.answer.slice(0, 100)}...
              </Text>
            </View>

            <View className="flex-shrink-0 flex sm:flex-row sm:items-end pl-1">
              <StyledPressable
                onPress={() => {
                  deleteContent(item._id);
                }}
                className="p-3 mr-1 mb-1 rounded-lg bg-danger active:opacity-70"
              >
                <TrashIcon className="text-center" size={15} color={"white"} />
              </StyledPressable>

              <StyledPressable
                onPress={() => {
                  editContent(item._id);
                }}
                className="p-3 mr-1 mb-1 rounded-lg bg-warning active:opacity-70"
              >
                <Pen className="text-center" size={15} color={"white"} />
              </StyledPressable>

              <StyledPressable
                onPress={() => {
                  openContent(item._id);
                }}
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

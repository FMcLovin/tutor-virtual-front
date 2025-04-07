import { useState, useEffect } from "react";
import { get, put } from "../services";
import { GET_CONTENT, GET_USER } from "@env";
import useAlert from "./useAlert";
import { Content } from "../models/Content";

/**
 * Hook para manejar la carga y actualización del contenido
 */
export const useContent = (id: string, sessionToken?: string) => {
  const [content, setContent] = useState<Content>();
  const [editingContent, setEditingContent] = useState<Content>();
  const [authorName, setAuthorName] = useState("");
  const [editorName, setEditorName] = useState("");
  const [isLoading, setLoading] = useState(true);
  const showAlert = useAlert();

  useEffect(() => {
    fetchContent();
  }, []);

  /**
   *
   */
  const fetchContent = async () => {
    try {
      setLoading(true);
      const contentResponse = await get(`${GET_CONTENT}${id}`, sessionToken);
      setContent(contentResponse);
      setEditingContent(contentResponse);

      const author = await fetchUserData(contentResponse.created_by);
      const editor = await fetchUserData(contentResponse.created_by); // Cambia según lógica

      setAuthorName(author);
      setEditorName(editor);

      setLoading(false);
    } catch (error) {
      showAlert("Ha ocurrido un error, vuelve a intentarlo");
      console.log("fetchContent", error);
      setLoading(false);
    }
  };

  /**
   *
   * @param userID User ID
   * @returns String user email
   */
  const fetchUserData = async (userID: string) => {
    try {
      const userResponse = await get(`${GET_USER}${userID}`, sessionToken);
      return userResponse.email;
    } catch (error) {
      console.log("fetchUserData", error);
      return "No se encontró al usuario";
    }
  };

  /**
   *
   */
  const updateContent = async () => {
    try {
      const updatedContent = await put(
        `${GET_CONTENT}${id}`,
        editingContent,
        sessionToken,
      );
      setContent(updatedContent);
      setEditingContent(updatedContent);
      showAlert("Contenido editado");
    } catch (error) {
      console.log(error);
      showAlert("Ha ocurrido un error, vuelve a intentarlo");
    }
  };

  return {
    content,
    authorName,
    editorName,
    isLoading,
    editingContent,
    setEditingContent,
    updateContent,
  };
};

import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useSession } from "../auth/ctx";
import { get, del, exportDataset, importDataset } from "../services";
import { GET_CONTENT } from "@env";
import useAlert from "./useAlert";
import { Content } from "../models/Content";
import { PendingDelete } from "../models/PendingDelete";
import * as DocumentPicker from "expo-document-picker";
import { readFileAsBase64 } from "../utils/utils";

export default function useManager() {
  const { session } = useSession();
  const router = useRouter();
  const showAlert = useAlert();

  const [content, setContent] = useState<Content[]>([]);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>({
    contendID: "",
    index: 0,
  });
  const [isLoading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  /**
   *
   */
  const checkUserRole = () => {
    if (session?.user.role_id === "admin_role") {
      fetchContent();
    } else {
      router.push(`/`);
    }
  };

  /**
   *
   */
  const fetchContent = () => {
    setLoading(true);
    get(GET_CONTENT, session?.token)
      .then((response) => {
        setLoading(false);
        const fetchedContent = response || [];
        if (fetchedContent.length > 0) {
          setContent(fetchedContent);
        }
      })
      .catch(() => {
        showAlert("Ha ocurrido un error obteniendo el contenido");
        setLoading(false);
      });
  };

  /**
   *
   */
  const createContent = () => {
    router.push("manager/create");
  };

  /**
   *
   * @param contentID Content's String ID
   */
  const editContent = (contentID: string) => {
    router.push(`manager/${contentID}?isEditing=true`);
  };

  /**
   *
   * @param content Content object
   * @param index COntent's index in list
   */
  const openDeleteModal = (content: Content, index: number) => {
    setPendingDelete({ contendID: content._id, index });
    setDeleteModal(true);
  };

  /**
   *
   * @param contentID Content's String ID
   * @param index Content's index in list
   */
  const deleteContent = (contentID: string, index: number) => {
    del(`${GET_CONTENT}${contentID}`, session?.token)
      .then(() => {
        showAlert("Se ha eliminado el contenido");
        setContent((prevContent) => prevContent.filter((_, i) => i !== index));
      })
      .catch(() => {
        showAlert("Ha ocurrido un error eliminando el contenido");
      });
    setDeleteModal(false);
  };

  const openContent = (contentID: string) => {
    router.push(`manager/${contentID}`);
  };

  /**
   *
   */
  const importData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      if (file && file.uri) {
        const base64 = await readFileAsBase64(file.uri);

        await importDataset(
          {
            userId: session?.user._id,
            fileBase64: base64,
          },
          session?.token,
        );

        showAlert("El dataset se importó correctamente");
        fetchContent();
      }
    } catch (err) {
      console.error("❌ Error importando dataset:", err);
      showAlert("Ocurrió un error al importar el dataset");
    }
  };

  /**
   *
   */
  const exportData = async () => {
    try {
      const response = await exportDataset(session?.token);
      const base64File = response.fileBase64;
      downloadBase64File(base64File, "dataset.json");
      fetchContent();
    } catch (err) {
      console.error("Error exportando dataset:", err);
      showAlert("Ocurrió un error al exportar el dataset");
    }
  };

  const downloadBase64File = (base64: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = `data:application/json;base64,${base64}`;
    link.download = fileName;
    link.click();
  };

  return {
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
    importData,
    exportData,
  };
}

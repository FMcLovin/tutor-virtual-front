import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useSession } from "../auth/ctx";
import { get, del, exportDataset, importDataset } from "../services";
import { GET_CONTENT } from "@env";
import useAlert from "./useAlert";
import { Content } from "../models/Content";
import { PendingDelete } from "../models/PendingDelete";

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

  const checkUserRole = () => {
    if (session?.user.role_id === "admin_role") {
      fetchContent();
    } else {
      router.push(`/`);
    }
  };

  const fetchContent = () => {
    setLoading(true);
    get(GET_CONTENT, session?.token)
      .then((response) => {
        setLoading(false);
        const fetchedContent = response || [];
        if (fetchedContent.length > 0) {
          setContent((prevContent) => [...prevContent, ...fetchedContent]);
        }
      })
      .catch(() => {
        showAlert("Ha ocurrido un error obteniendo el contenido");
        setLoading(false);
      });
  };

  const createContent = () => {
    router.push("manager/create");
  };

  const editContent = (contentID: string) => {
    router.push(`manager/${contentID}?isEditing=true`);
  };

  const openDeleteModal = (content: Content, index: number) => {
    setPendingDelete({ contendID: content._id, index });
    setDeleteModal(true);
  };

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

  const importData = async () => {
    try {
      const response = await importDataset(
        {
          userId: session?.user._id,
          fileBase64:
            "eyJjb252ZXJzYXRpb24iOltbeyJodW1hbiI6IkhvbGEifSx7ImdwdCI6IkhvbGEgdXN1YXJpbyJ9XV19", // tu base64
        },
        session?.token,
      );
      console.log("Dataset importado:", response);
    } catch (err) {
      console.error("Error importando dataset:", err);
    }
  };

  const exportData = async () => {
    try {
      const response = await exportDataset(session?.token);
      const base64File = response.fileBase64;
      downloadBase64File(base64File, "dataset.json");
      console.log("Archivo exportado en base64:", base64File);
    } catch (err) {
      console.error("Error exportando dataset:", err);
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

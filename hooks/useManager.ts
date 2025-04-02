import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useSession } from "../auth/ctx";
import { get, del } from "../services";
import { GET_CONTENT } from "@env";
import useAlert from "./useAlert";

interface Content {
  _id: string;
  question: string;
  answer: string;
  created_by: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface PendingDelete {
  contendID: string;
  index: number;
}

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
  };
}

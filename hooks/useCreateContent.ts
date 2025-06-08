import { useState } from "react";
import { useRouter } from "expo-router";
import { useSession } from "../auth/ctx";
import { post } from "../services";
import { GET_CONTENT } from "@env";

interface CreateContentHook {
  question: string;
  setQuestion: (value: string) => void;
  questionError: string;
  asnwer: string;
  setAnswer: (value: string) => void;
  asnwerError: string;
  isLoading: boolean;
  validateData: () => void;
  cancelAction: () => void;
}

export function useCreateContent(): CreateContentHook {
  const { session } = useSession();
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");

  const [asnwer, setAnswer] = useState("");
  const [asnwerError, setAnswerError] = useState("");

  const [isLoading, setLoading] = useState(false);

  /**
   * Redirige a la vista de administración
   */
  const cancelAction = () => {
    router.push("manager/");
  };

  /**
   * Valida los datos antes de enviarlos
   */
  const validateData = () => {
    let hasError = false;

    if (!question) {
      setQuestionError("Por favor, ingresa una pregunta");
      hasError = true;
    } else {
      setQuestionError("");
    }

    if (!asnwer) {
      setAnswerError("Por favor, ingresa una respuesta");
      hasError = true;
    } else {
      setAnswerError("");
    }

    if (!hasError) {
      createContent();
    }
  };

  /**
   * Envía los datos para crear contenido
   */
  const createContent = () => {
    setLoading(true);

    const data = {
      created_by: session?.user._id,
      updated_by: session?.user._id,
      question,
      answer: asnwer,
    };

    post(GET_CONTENT, data, session?.token)
      .then(() => {
        setLoading(false);
        alert("Contenido creado");
        cancelAction();
      })
      .catch((error) => {
        console.log("Error en createContent:", error.error);
        setLoading(false);
        alert("Ha ocurrido un error, vuelve a intentarlo más tarde");
      });
  };

  return {
    question,
    setQuestion,
    questionError,
    asnwer,
    setAnswer,
    asnwerError,
    isLoading,
    validateData,
    cancelAction,
  };
}

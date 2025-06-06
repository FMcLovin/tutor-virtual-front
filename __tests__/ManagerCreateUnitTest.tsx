import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import ManagerCreateScreen from "../app/(app)/manager/create";

// ✅ MOCK de useRouter (porque useCreateContent lo usa)
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Variables para parametrizar el mock dinámico
let mockIsLoading = false;
let mockQuestionError = "";
let mockAnswerError = "";

// Mocks de useCreateContent
const mockSetQuestion = jest.fn();
const mockSetAnswer = jest.fn();
const mockValidateData = jest.fn();
const mockCancelAction = jest.fn();

jest.mock("../hooks/useCreateContent", () => ({
  useCreateContent: () => ({
    question: "¿Qué es TutorUV?",
    setQuestion: mockSetQuestion,
    questionError: mockQuestionError,
    asnwer: "Es un programa de tutorías.",
    setAnswer: mockSetAnswer,
    asnwerError: mockAnswerError,
    isLoading: mockIsLoading,
    validateData: mockValidateData,
    cancelAction: mockCancelAction,
  }),
}));

describe("Pantalla Manager Create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Resetear variables mock para cada test
    mockIsLoading = false;
    mockQuestionError = "";
    mockAnswerError = "";
  });

  it("renderiza los campos de pregunta y respuesta", () => {
    const { getByDisplayValue } = render(<ManagerCreateScreen />);
    expect(getByDisplayValue("¿Qué es TutorUV?")).toBeTruthy();
    expect(getByDisplayValue("Es un programa de tutorías.")).toBeTruthy();
  });

  it("escribe en el campo de pregunta", () => {
    const { getByDisplayValue } = render(<ManagerCreateScreen />);
    const questionInput = getByDisplayValue("¿Qué es TutorUV?");
    fireEvent.changeText(questionInput, "Nueva pregunta");
    expect(mockSetQuestion).toHaveBeenCalledWith("Nueva pregunta");
  });

  it("escribe en el campo de respuesta", () => {
    const { getByDisplayValue } = render(<ManagerCreateScreen />);
    const answerInput = getByDisplayValue("Es un programa de tutorías.");
    fireEvent.changeText(answerInput, "Nueva respuesta");
    expect(mockSetAnswer).toHaveBeenCalledWith("Nueva respuesta");
  });

  it("llama a validateData al presionar el botón de check", () => {
    const { getByTestId } = render(<ManagerCreateScreen />);
    fireEvent.press(getByTestId("validate-button"));
    expect(mockValidateData).toHaveBeenCalled();
  });

  it("llama a cancelAction al presionar el botón de close", () => {
    const { getByTestId } = render(<ManagerCreateScreen />);
    fireEvent.press(getByTestId("cancel-button"));
    expect(mockCancelAction).toHaveBeenCalled();
  });

  it("muestra el loader si isLoading es true", () => {
    // Cambiamos la variable antes de render
    mockIsLoading = true;
    const { getByTestId } = render(<ManagerCreateScreen />);
    expect(getByTestId("ActivityIndicator")).toBeTruthy();
  });

  it("muestra errores si hay questionError y asnwerError", () => {
    // Cambiamos las variables antes de render
    mockQuestionError = "Error en pregunta";
    mockAnswerError = "Error en respuesta";
    const { getByText } = render(<ManagerCreateScreen />);
    expect(getByText("Error en pregunta")).toBeTruthy();
    expect(getByText("Error en respuesta")).toBeTruthy();
  });
});

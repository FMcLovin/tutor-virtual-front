// __tests__/ManagerCreate.integration.test.tsx

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ManagerCreateScreen from "../app/(app)/manager/create";
import * as useCreateContentHook from "../hooks/useCreateContent";

// Mocks
const mockSetQuestion = jest.fn();
const mockSetAnswer = jest.fn();
const mockValidateData = jest.fn();
const mockCancelAction = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  jest.spyOn(useCreateContentHook, "useCreateContent").mockReturnValue({
    question: "¿Qué es TutorUV?",
    setQuestion: mockSetQuestion,
    questionError: "",
    asnwer: "Es un programa de tutorías.",
    setAnswer: mockSetAnswer,
    asnwerError: "",
    isLoading: false,
    validateData: mockValidateData,
    cancelAction: mockCancelAction,
  });
});

describe("Integración - ManagerCreate", () => {
  it("renderiza correctamente el formulario", () => {
    const { getByText, getByDisplayValue } = render(<ManagerCreateScreen />);

    expect(getByText("Creación de contenido")).toBeTruthy();
    expect(getByText("Pregunta")).toBeTruthy();
    expect(getByText("Respuesta")).toBeTruthy();
    expect(getByDisplayValue("¿Qué es TutorUV?")).toBeTruthy();
    expect(getByDisplayValue("Es un programa de tutorías.")).toBeTruthy();
  });

  it("actualiza pregunta y respuesta", () => {
    const { getByDisplayValue } = render(<ManagerCreateScreen />);

    fireEvent.changeText(
      getByDisplayValue("¿Qué es TutorUV?"),
      "Nueva pregunta",
    );
    expect(mockSetQuestion).toHaveBeenCalledWith("Nueva pregunta");

    fireEvent.changeText(
      getByDisplayValue("Es un programa de tutorías."),
      "Nueva respuesta",
    );
    expect(mockSetAnswer).toHaveBeenCalledWith("Nueva respuesta");
  });

  it("llama a validateData al presionar el botón check", () => {
    const { getByTestId } = render(<ManagerCreateScreen />);
    fireEvent.press(getByTestId("validate-button"));
    expect(mockValidateData).toHaveBeenCalled();
  });

  it("llama a cancelAction al presionar el botón cancelar", () => {
    const { getByTestId } = render(<ManagerCreateScreen />);
    fireEvent.press(getByTestId("cancel-button"));
    expect(mockCancelAction).toHaveBeenCalled();
  });

  it("muestra el loader si isLoading es true", () => {
    jest.spyOn(useCreateContentHook, "useCreateContent").mockReturnValue({
      question: "",
      setQuestion: mockSetQuestion,
      questionError: "",
      asnwer: "",
      setAnswer: mockSetAnswer,
      asnwerError: "",
      isLoading: true,
      validateData: mockValidateData,
      cancelAction: mockCancelAction,
    });

    const { getByTestId } = render(<ManagerCreateScreen />);
    expect(getByTestId("ActivityIndicator")).toBeTruthy();
  });

  it("muestra errores si hay questionError y asnwerError", () => {
    jest.spyOn(useCreateContentHook, "useCreateContent").mockReturnValue({
      question: "",
      setQuestion: mockSetQuestion,
      questionError: "Error en pregunta",
      asnwer: "",
      setAnswer: mockSetAnswer,
      asnwerError: "Error en respuesta",
      isLoading: false,
      validateData: mockValidateData,
      cancelAction: mockCancelAction,
    });

    const { getByText } = render(<ManagerCreateScreen />);
    expect(getByText("Error en pregunta")).toBeTruthy();
    expect(getByText("Error en respuesta")).toBeTruthy();
  });
});

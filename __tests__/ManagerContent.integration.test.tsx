// __tests__/ManagerContent.integration.test.tsx

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ManagerContentScreen from "../app/(app)/manager/[id]";
import * as useContentHook from "../hooks/useContent";

// Mocks para navegación (useLocalSearchParams)
jest.mock("expo-router", () => {
  const actual = jest.requireActual("expo-router");
  return {
    ...actual,
    useLocalSearchParams: jest
      .fn()
      .mockReturnValue({ id: "1", isEditing: "true" }),
  };
});

const mockSetEditingContent = jest.fn();
const mockUpdateContent = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  jest.spyOn(useContentHook, "useContent").mockReturnValue({
    content: {
      _id: "1",
      question: "¿Qué es TutorUV?",
      answer: "Es un programa de tutorías.",
      created_at: new Date("2024-06-01T00:00:00Z").toISOString(),
      updated_at: new Date("2024-06-02T00:00:00Z").toISOString(),
      created_by: "user_1",
      updated_by: "user_2",
      category: "",
    },
    authorName: "autor@uv.mx",
    editorName: "editor@uv.mx",
    isLoading: false,
    editingContent: {
      _id: "1",
      question: "¿Qué es TutorUV?",
      answer: "Es un programa de tutorías.",
      created_at: new Date("2024-06-01T00:00:00Z").toISOString(),
      updated_at: new Date("2024-06-02T00:00:00Z").toISOString(),
      created_by: "user_1",
      updated_by: "user_2",
      category: "",
    },
    setEditingContent: mockSetEditingContent,
    updateContent: mockUpdateContent,
  });
});

describe("Integración - Manager [id]", () => {
  it("renderiza correctamente la pantalla", () => {
    const { getByText, getByDisplayValue } = render(<ManagerContentScreen />);

    expect(getByText("Editar contenido")).toBeTruthy();
    expect(
      getByText("Modifica los campos para actualizar la respuesta del chat"),
    ).toBeTruthy();

    expect(getByDisplayValue("¿Qué es TutorUV?")).toBeTruthy();
    expect(getByDisplayValue("Es un programa de tutorías.")).toBeTruthy();

    expect(getByText("autor@uv.mx")).toBeTruthy();
    expect(getByText("editor@uv.mx")).toBeTruthy();
  });

  it("actualiza pregunta y respuesta", () => {
    const { getByDisplayValue } = render(<ManagerContentScreen />);

    fireEvent.changeText(
      getByDisplayValue("¿Qué es TutorUV?"),
      "Nueva pregunta",
    );
    expect(mockSetEditingContent).toHaveBeenCalledWith(
      expect.objectContaining({ question: "Nueva pregunta" }),
    );

    fireEvent.changeText(
      getByDisplayValue("Es un programa de tutorías."),
      "Nueva respuesta",
    );
    expect(mockSetEditingContent).toHaveBeenCalledWith(
      expect.objectContaining({ answer: "Nueva respuesta" }),
    );
  });

  it("llama a updateContent al presionar check", () => {
    const { getByTestId } = render(<ManagerContentScreen />);
    fireEvent.press(getByTestId("check-button"));
    expect(mockUpdateContent).toHaveBeenCalled();
  });

  it("cierra modo edición al presionar cancel", () => {
    const { getByTestId } = render(<ManagerContentScreen />);
    fireEvent.press(getByTestId("cancel-button"));
  });

  it("muestra loader si isLoading es true", () => {
    jest.spyOn(useContentHook, "useContent").mockReturnValue({
      content: undefined,
      authorName: "",
      editorName: "",
      isLoading: true,
      editingContent: undefined,
      setEditingContent: mockSetEditingContent,
      updateContent: mockUpdateContent,
    });

    const { getByTestId } = render(<ManagerContentScreen />);
    expect(getByTestId("ActivityIndicator")).toBeTruthy();
  });
});

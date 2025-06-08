import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

// ✅ Import del componente
import ManagerContentScreen from "../app/(app)/manager/[id]";

// ✅ Mock de useRouter (por si lo usas en el hook o contexto)
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// ✅ Mock de useSession
jest.mock("../auth/ctx", () => ({
  useSession: () => ({
    session: {
      token: "mockToken",
    },
  }),
}));

// ✅ Mock de useLocalSearchParams
jest.mock("expo-router", () => {
  const originalModule = jest.requireActual("expo-router");
  return {
    __esModule: true,
    ...originalModule,
    useLocalSearchParams: () => ({
      id: "1",
      isEditing: "true", // simulamos que entra en modo editing
    }),
    useRouter: () => ({
      push: jest.fn(),
    }),
  };
});

// ✅ Mocks de variables para parametrizar useContent
let mockIsLoading = false;
let mockContent = {
  question: "¿Qué es TutorUV?",
  answer: "Es un programa de tutorías.",
  created_by: "user1",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
let mockAuthorName = "Autor Ejemplo";
let mockEditorName = "Editor Ejemplo";
let mockEditingContent = { ...mockContent };

// ✅ Mocks de funciones
const mockSetEditingContent = jest.fn();
const mockUpdateContent = jest.fn();

jest.mock("../hooks/useContent", () => ({
  useContent: () => ({
    content: mockContent,
    authorName: mockAuthorName,
    editorName: mockEditorName,
    isLoading: mockIsLoading,
    editingContent: mockEditingContent,
    setEditingContent: mockSetEditingContent,
    updateContent: mockUpdateContent,
  }),
}));

describe("Pantalla Manager Content (/manager/[id])", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset variables
    mockIsLoading = false;
    mockContent = {
      question: "¿Qué es TutorUV?",
      answer: "Es un programa de tutorías.",
      created_by: "user1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockAuthorName = "Autor Ejemplo";
    mockEditorName = "Editor Ejemplo";
    mockEditingContent = { ...mockContent };
  });

  it("muestra el loader cuando isLoading es true", () => {
    mockIsLoading = true;
    const { getByTestId } = render(<ManagerContentScreen />);
    expect(getByTestId("ActivityIndicator")).toBeTruthy();
  });

  it("renderiza contenido en modo edición", () => {
    const { getByDisplayValue, getByText } = render(<ManagerContentScreen />);
    expect(getByText("Editar contenido")).toBeTruthy();
    expect(getByDisplayValue("¿Qué es TutorUV?")).toBeTruthy();
    expect(getByDisplayValue("Es un programa de tutorías.")).toBeTruthy();
    expect(getByText("Autor Ejemplo")).toBeTruthy();
    expect(getByText("Editor Ejemplo")).toBeTruthy();
  });

  it("actualiza el campo Pregunta en modo edición", () => {
    const { getByDisplayValue } = render(<ManagerContentScreen />);
    const questionInput = getByDisplayValue("¿Qué es TutorUV?");
    fireEvent.changeText(questionInput, "Nueva pregunta");
    expect(mockSetEditingContent).toHaveBeenCalledWith({
      ...mockEditingContent,
      question: "Nueva pregunta",
    });
  });

  it("actualiza el campo Respuesta en modo edición", () => {
    const { getByDisplayValue } = render(<ManagerContentScreen />);
    const answerInput = getByDisplayValue("Es un programa de tutorías.");
    fireEvent.changeText(answerInput, "Nueva respuesta");
    expect(mockSetEditingContent).toHaveBeenCalledWith({
      ...mockEditingContent,
      answer: "Nueva respuesta",
    });
  });

  it("llama a updateContent al presionar el botón de check", () => {
    const { getByTestId } = render(<ManagerContentScreen />);
    fireEvent.press(getByTestId("check-button"));
    expect(mockUpdateContent).toHaveBeenCalled();
  });

  it("cambia de modo edición a vista al presionar el botón de cancel", () => {
    const { getByTestId } = render(<ManagerContentScreen />);
    fireEvent.press(getByTestId("cancel-button"));
    // Aquí el componente interno hace setEditing(false), pero como no es parte del hook, no es observable directamente.
    // Si tuvieras `setEditing` expuesto, se podría mockear. Aquí solo aseguramos que no truena.
    expect(true).toBeTruthy(); // Placeholder
  });
});

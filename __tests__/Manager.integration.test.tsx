// __tests__/Manager.integration.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Manager from "../app/(app)/(tabs)/manager";

const mockCreateContent = jest.fn();
const mockEditContent = jest.fn();
const mockOpenContent = jest.fn();
const mockOpenDeleteModal = jest.fn();
const mockImportData = jest.fn();
const mockExportData = jest.fn();
const mockSetDeleteModal = jest.fn();

jest.mock("../hooks/useManager", () => ({
  __esModule: true,
  default: () => ({
    content: [
      {
        _id: "1",
        question: "¿Qué es TutorUV?",
        answer: "Es un programa de tutorías.",
      },
    ],
    pendingDelete: { contendID: "1", index: 0 },
    isLoading: false,
    deleteModal: false,
    setDeleteModal: mockSetDeleteModal,
    createContent: mockCreateContent,
    editContent: mockEditContent,
    openDeleteModal: mockOpenDeleteModal,
    deleteContent: jest.fn(),
    openContent: mockOpenContent,
    importData: mockImportData,
    exportData: mockExportData,
  }),
}));

describe("Integración - Manager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el contenido correctamente", () => {
    const { getByText } = render(<Manager />);
    expect(getByText("¿Qué es TutorUV?")).toBeTruthy();
    expect(getByText(/Es un programa de tutorías/)).toBeTruthy(); // ← aquí la corrección
  });

  it("llama a createContent al presionar el botón Crear contenido", () => {
    const { getByText } = render(<Manager />);
    fireEvent.press(getByText("Crear contenido"));
    expect(mockCreateContent).toHaveBeenCalled();
  });

  it("llama a importData al presionar Importar dataset", () => {
    const { getByText } = render(<Manager />);
    fireEvent.press(getByText("Importar dataset"));
    expect(mockImportData).toHaveBeenCalled();
  });

  it("llama a exportData al presionar Exportar dataset", () => {
    const { getByText } = render(<Manager />);
    fireEvent.press(getByText("Exportar dataset"));
    expect(mockExportData).toHaveBeenCalled();
  });

  it("llama a editContent cuando se presiona el ícono de editar", () => {
    const { getByTestId } = render(<Manager />);
    fireEvent.press(getByTestId("edit-button-1"));
    expect(mockEditContent).toHaveBeenCalledWith("1");
  });

  it("llama a openContent cuando se presiona el ícono de ver", () => {
    const { getByTestId } = render(<Manager />);
    fireEvent.press(getByTestId("view-button-1"));
    expect(mockOpenContent).toHaveBeenCalledWith("1");
  });

  it("llama a openDeleteModal al presionar el ícono de eliminar", () => {
    const { getByTestId } = render(<Manager />);
    fireEvent.press(getByTestId("delete-button-1"));
    expect(mockOpenDeleteModal).toHaveBeenCalledWith(
      {
        _id: "1",
        question: "¿Qué es TutorUV?",
        answer: "Es un programa de tutorías.",
      },
      0,
    );
  });
});
